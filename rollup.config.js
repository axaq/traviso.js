import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import jscc from 'rollup-plugin-jscc';

function preprocessPlugin() {
    return jscc({
        values: {
            _VERSION: pkg.version,
        },
    });
}

const extensions = ['.ts', '.tsx'];

const globals = {
    'pixi.js': 'PIXI',
};

const external = Object.keys(globals);

const plugins = [
    preprocessPlugin(),
    peerDepsExternal(),

    resolve({
        extensions,
        preferBuiltins: false,
    }),

    typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
            compilerOptions: {
                noEmit: true,
                declaration: true,
                emitDeclarationOnly: false,
            },
            include: ['src'],
        },
    }),

    commonjs({
        exclude: 'node_modules',
        ignoreGlobal: true,
    }),

    babel({
        exclude: 'node_modules/**',
        extensions,
        comments: true,
        babelHelpers: 'bundled',
        presets: [
            '@babel/preset-env',
            // '@babel/preset-typescript'
        ],

        minified: false,
    }),
];

const compiledDate = new Date().toUTCString().replace(/GMT/g, 'UTC');

const banner = [
    `/*!`,
    ` * ${pkg.name} - v${pkg.version}`,
    ` * Copyright (c) 2021, ${pkg.author.name}`,
    ` * ${pkg.url}`,
    ` *`,
    ` * Compiled: ${compiledDate}`,
    ` *`,
    ` * ${pkg.name} is licensed under the MIT License.`,
    ` * http://www.opensource.org/licenses/mit-license`,
    ` */`,
].join('\n');

const comments = (node, comment) => comment.line === 1;

export default [
    {
        input: 'src/index.ts',
        external,
        output: [
            {
                file: pkg.iife,
                format: 'iife',
                globals,
                sourcemap: true,
                banner,
                name: 'TRAVISO',
            },
            {
                file: pkg.main,
                format: 'cjs',
                globals,
                sourcemap: true,
                banner,
            },
            {
                file: pkg.module,
                format: 'es',
                globals,
                sourcemap: true,
                banner,
            },
            {
                file: 'dist/browser/traviso.min.js',
                format: 'iife',
                globals,
                sourcemap: true,
                banner,
                name: 'TRAVISO',
                plugins: [
                    terser({
                        output: {
                            comments,
                        },
                    }),
                ],
            },
        ],
        plugins,
    },
];
