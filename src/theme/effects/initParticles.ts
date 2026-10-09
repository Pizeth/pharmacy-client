import type { Engine } from "@tsparticles/engine";

const initialized = new WeakMap<Engine, Promise<void>>();

/** Shared, deduplicated engine setup for navigation and loading layers. */
export function initParticles(engine: Engine): Promise<void> {
  const existing = initialized.get(engine);
  if (existing) return existing;
  const pending = Promise.all([
    import("@tsparticles/slim"), import("@tsparticles/plugin-themes"),
  ]).then(async ([{ loadSlim }, { loadThemesPlugin }]) => {
    await Promise.all([loadSlim(engine), loadThemesPlugin(engine)]);
  }).catch(error => { initialized.delete(engine); throw error; });
  initialized.set(engine, pending);
  return pending;
}
