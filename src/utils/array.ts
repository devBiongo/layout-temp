export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return arr.reduce<[T[], T[]]>(
    ([pass, fail], item) =>
      predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]],
    [[], []]
  );
}