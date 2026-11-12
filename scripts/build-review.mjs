import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../node_modules/expo/bin/cli', import.meta.url));
const result = spawnSync(
  process.execPath,
  [cli, 'export', '--platform', 'web', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: { ...process.env, EXPO_PUBLIC_TEAM_REVIEW: 'true' },
  },
);
if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
  process.exit(1);
}
process.exit(result.status ?? 1);
