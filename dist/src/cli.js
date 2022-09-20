"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const promises_1 = require("fs/promises");
const listr_1 = __importDefault(require("listr"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const _reactgenrc_json_1 = __importDefault(require("../.reactgenrc.json"));
const package_json_1 = __importDefault(require("../package.json"));
const detectConfigFile_1 = __importDefault(require("./detectConfigFile"));
const detectRootDir_1 = __importDefault(require("./detectRootDir"));
const detectTypeScript_1 = __importDefault(require("./detectTypeScript"));
const folderExists_1 = __importDefault(require("./folderExists"));
const generate_1 = __importDefault(require("./generate"));
const handleNamePrefix_1 = __importDefault(require("./handleNamePrefix"));
const validateName_1 = __importDefault(require("./validateName"));
commander_1.program
    .name('rg')
    .description(`${chalk_1.default.cyan('React Generator')}\n${chalk_1.default.gray(package_json_1.default.description)}`)
    .version(package_json_1.default.version)
    .usage('command [options]')
    .option('-o, --out <path>', 'path to add the generated files')
    .addHelpCommand(false)
    .showHelpAfterError();
commander_1.program
    .command('component')
    .alias('c')
    .description(`generate a ${chalk_1.default.cyan('component')}`)
    .argument('name', `example: ${chalk_1.default.cyan('Hello')}`)
    .argument('[props...]', `example: ${chalk_1.default.cyan('prop1 prop2')}`)
    .action((name, props, options) => {
    command('component', name, Object.assign(Object.assign({}, options), { props }));
});
commander_1.program
    .command('hook')
    .alias('h')
    .description(`generate a ${chalk_1.default.cyan('hook')}`)
    .argument('name', `example: ${chalk_1.default.cyan('useHello')}`)
    .action((name, options) => {
    command('hook', name, options);
});
commander_1.program.parse();
function command(type, fullName, options) {
    const tasks = new listr_1.default([
        {
            title: 'Preparing generator',
            task: ctx => {
                ctx.type = type;
                (0, validateName_1.default)(type, fullName);
            }
        },
        {
            title: 'Detecting environment',
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                // Read options file
                ctx.config = Object.assign(Object.assign({}, _reactgenrc_json_1.default), ((yield (0, detectConfigFile_1.default)()) || {}));
                // Handle prefixed names like atom/Hello
                const { prefix, name } = (0, handleNamePrefix_1.default)(fullName);
                ctx.name = name;
                // Prepend the prefix in the path
                const pathProp = {
                    component: 'componentsPath',
                    hook: 'hooksPath'
                }[type];
                ctx.path = path_1.default.relative(process.cwd(), path_1.default.join(yield (0, detectRootDir_1.default)(), options.out || ctx.config[pathProp], ...prefix, ctx.name));
                // Check whether entity exists to avoid data loss
                const exists = yield (0, folderExists_1.default)(ctx.path);
                if (exists) {
                    throw new Error(`A folder already exists at ${chalk_1.default.cyan(ctx.path)}.`);
                }
                // Detect typescript if "auto" is set
                const hasTypeScript = ctx.config.typescript === 'auto'
                    ? yield (0, detectTypeScript_1.default)()
                    : ctx.config.typescript;
                // Fill context
                ctx.params = {
                    defaultExport: ctx.config.defaultExport,
                    typescript: hasTypeScript,
                    withStyles: ctx.config.withStyles,
                    withTests: ctx.config.withTests,
                    props: options.props || []
                };
            })
        },
        {
            title: 'Rendering templates',
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.files = yield (0, generate_1.default)(type, ctx.name, ctx.params);
            })
        },
        {
            title: 'Generating files',
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield (0, mkdirp_1.default)(ctx.path);
                }
                catch (err) {
                    throw new Error(`Could not create folder ${ctx.path}.`);
                }
                try {
                    for (const file in ctx.files) {
                        yield (0, promises_1.writeFile)(path_1.default.join(ctx.path, file), ctx.files[file]);
                    }
                }
                catch (err) {
                    throw new Error(`Could not create one or more files in ${chalk_1.default.cyan(ctx.path)} folder.`);
                }
            })
        },
        {
            title: 'Applying formatter',
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield new Promise((resolve, reject) => {
                        (0, child_process_1.exec)(ctx.config.formatCmd, {
                            cwd: ctx.path
                        }, (err, stdout, stderr) => {
                            if (err) {
                                reject(stderr);
                            }
                            else {
                                resolve(stdout);
                            }
                        });
                    });
                }
                catch (err) {
                    throw new Error('Could not format generated files.');
                }
            })
        }
    ]);
    tasks
        .run()
        .then(ctx => console.log(`\nThe ${ctx.type} ${chalk_1.default.cyan(ctx.name)} has been generated.`))
        .catch(err => console.log(`\n${chalk_1.default.red('Error:')} ${err.message}`));
}
exports.command = command;
