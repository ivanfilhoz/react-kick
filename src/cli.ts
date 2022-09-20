import chalk from 'chalk'
import { exec } from 'child_process'
import { program } from 'commander'
import { writeFile } from 'fs/promises'
import Listr from 'listr'
import mkdirp from 'mkdirp'
import path from 'path'
import defaultConfig from '../.kickrc.json'
import packageJson from '../package.json'
import detectConfigFile from './detectConfigFile'
import detectRootDir from './detectRootDir'
import detectTypeScript from './detectTypeScript'
import eraseLines from './eraseLines'
import folderExists from './folderExists'
import generate from './generate'
import handleNamePrefix from './handleNamePrefix'
import { Config, Options, Parameters, Result, Type } from './types'
import validateName from './validateName'

type Context = {
  type: string
  name: string
  path: string
  config: Config
  params: Parameters
  files: Result
}

program
  .name('rk')
  .description(
    `${chalk.cyan('React Kick')}\n${chalk.gray(packageJson.description)}`
  )
  .version(packageJson.version)
  .usage('command [options]')
  .option('-o, --out <path>', 'path to add the generated files')
  .addHelpCommand(false)
  .showHelpAfterError()

program
  .command('component')
  .alias('c')
  .description(`generate a ${chalk.cyan('component')}`)
  .argument('name', `example: ${chalk.cyan('Hello')}`)
  .argument('[props...]', `example: ${chalk.cyan('prop1 prop2')}`)
  .action((name, props, options) => {
    command('component', name, {
      ...options,
      props
    })
  })

program
  .command('hook')
  .alias('h')
  .description(`generate a ${chalk.cyan('hook')}`)
  .argument('name', `example: ${chalk.cyan('useHello')}`)
  .action((name, options) => {
    command('hook', name, options)
  })

program.parse()

export function command (type: Type, fullName: string, options: Options) {
  const listr = new Listr<Context>([
    {
      title: 'Preparing generator',
      task: ctx => {
        ctx.type = type
        validateName(type, fullName)
      }
    },
    {
      title: 'Detecting environment',
      task: async ctx => {
        // Read options file
        ctx.config = {
          ...(defaultConfig as Config),
          ...((await detectConfigFile()) || {})
        }

        // Handle prefixed names like atom/Hello
        const { prefix, name } = handleNamePrefix(fullName)
        ctx.name = name

        // Prepend the prefix in the path
        const pathProp = {
          component: 'componentsPath',
          hook: 'hooksPath'
        }[type]

        ctx.path = path.relative(
          process.cwd(),
          path.join(
            await detectRootDir(),
            options.out || ctx.config[pathProp],
            ...prefix,
            ctx.name
          )
        )

        // Check whether entity exists to avoid data loss
        const exists = await folderExists(ctx.path)
        if (exists) {
          throw new Error(`A folder already exists at ${chalk.cyan(ctx.path)}.`)
        }

        // Detect typescript if "auto" is set
        const hasTypeScript =
          ctx.config.typescript === 'auto'
            ? await detectTypeScript()
            : ctx.config.typescript

        // Fill context
        ctx.params = {
          defaultExport: ctx.config.defaultExport,
          typescript: hasTypeScript,
          withStyles: ctx.config.withStyles,
          withTests: ctx.config.withTests,
          props: options.props || []
        }
      }
    },
    {
      title: 'Rendering templates',
      task: async ctx => {
        ctx.files = await generate(type, ctx.name, ctx.params)
      }
    },
    {
      title: 'Generating files',
      task: async ctx => {
        try {
          await mkdirp(ctx.path)
        } catch (err) {
          throw new Error(`Could not create folder ${ctx.path}.`)
        }
        try {
          for (const file in ctx.files) {
            await writeFile(path.join(ctx.path, file), ctx.files[file])
          }
        } catch (err) {
          throw new Error(
            `Could not create one or more files in ${chalk.cyan(
              ctx.path
            )} folder.`
          )
        }
      }
    },
    {
      title: 'Applying formatter',
      task: async ctx => {
        try {
          return await new Promise((resolve, reject) => {
            exec(
              ctx.config.formatCmd,
              {
                cwd: ctx.path
              },
              (err, stdout, stderr) => {
                if (err) {
                  reject(stderr)
                } else {
                  resolve(stdout)
                }
              }
            )
          })
        } catch (err) {
          throw new Error('Could not format generated files.')
        }
      }
    }
  ])

  listr
    .run()
    .then(ctx => {
      eraseLines(listr.tasks.length)
      console.log(
        `⚡️ A new ${chalk.cyan(ctx.name)} ${ctx.type} has been kicked in!`
      )
    })
    .catch(err => console.log(`\n${chalk.red('Error:')} ${err.message}`))
}
