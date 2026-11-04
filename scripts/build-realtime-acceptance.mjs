// Explicit local fixture build; no application route or production build changes.
import { build } from 'esbuild';
await build({ entryPoints: ['scripts/fixtures/RealtimeAcceptance.tsx'], bundle: true,
  outfile: 'build/realtime-acceptance.js', platform: 'browser', format: 'iife',
  tsconfig: 'tsconfig.json', define: { 'process.env': JSON.stringify({
    NODE_ENV: 'development', NEXT_PUBLIC_REALTIME_ENABLED: 'true',
  }), 'process.env.BACKEND_URL': 'location.origin' },
  loader: { '.svg': 'dataurl', '.png': 'dataurl' }, logLevel: 'warning',
});
console.log('Built build/realtime-acceptance.js for the loopback acceptance server.');
