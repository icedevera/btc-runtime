export function assert(condition: boolean, e: string): void {
  if (!condition) throw new Error(e);
}

export function assertEq<T>(a: T, b: T): void {
  assert(a === b, "expected " + a.toString() + " to equal " + b.toString());
}
