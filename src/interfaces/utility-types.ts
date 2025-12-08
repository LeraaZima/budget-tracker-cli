export type Optional<T> = {
  [K in keyof T]?: T[K];
};

export type Dictionary<T = unknown> = {
  [key: string]: T;
};
