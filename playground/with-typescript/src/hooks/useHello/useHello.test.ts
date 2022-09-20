import { renderHook } from "@testing-library/react-hooks";
import useHello from ".";

test("returns hello", () => {
  const { result } = renderHook(() => useHello());

  expect(result.current).toMatch(/hello/i);
});
