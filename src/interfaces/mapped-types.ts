export type ReadonlyExcept<T, K extends keyof T> = Readonly<Omit<T, K>> &
  Pick<T, K>;
