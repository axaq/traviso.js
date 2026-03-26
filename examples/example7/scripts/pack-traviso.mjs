import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exampleDir = resolve(__dirname, '..');
const rootDir = resolve(exampleDir, '../..');
const cacheDir = '/tmp/traviso-example7-npm-cache';
const stableTarballPath = join(exampleDir, 'traviso.tgz');

for (const fileName of readdirSync(exampleDir)) {
    if (/^traviso\.js-.*\.tgz$/.test(fileName)) {
        rmSync(join(exampleDir, fileName), { force: true });
    }
}

if (existsSync(stableTarballPath)) {
    rmSync(stableTarballPath, { force: true });
}

const packedTarballName = execFileSync(
    'npm',
    ['pack', rootDir, '--pack-destination', exampleDir, '--cache', cacheDir],
    {
        cwd: exampleDir,
        encoding: 'utf8',
    }
).trim();

renameSync(join(exampleDir, packedTarballName), stableTarballPath);
