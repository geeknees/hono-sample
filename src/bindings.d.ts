export type Bindings = {
  HONO_QRTLY: KVNamespace
}

declare global {
  function getMiniflareBindings(): Bindings
}
