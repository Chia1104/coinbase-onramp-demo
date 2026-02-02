type Variables = {
  kv: import("@repo/kv").Keyv;
  clientIP: string;
};

type HonoContext<
  TBindings = undefined,
  TVariables extends object = Variables,
> = {
  Bindings: TBindings;
  Variables: TVariables;
};
