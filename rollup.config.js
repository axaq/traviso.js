import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';
// import { uglify } from 'rollup-plugin-uglify';
import { terser } from 'rollup-plugin-terser';
import jscc from 'rollup-plugin-jscc';

/**
 * Get the JSCC plugin for preprocessing code.
 * @param {boolean} debug Build is for debugging
 */
function preprocessPlugin() {
    return jscc({
        values: {
            // _DEBUG: debug,
            // _PROD: !debug,
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
    // typescript({
    //     tsconfig: 'tsconfig.build.json'
    // }),
    // commonjs(),
    typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
            compilerOptions: {
                // exclude: ['**/*.stories.*'],
                noEmit: true,
                declaration: true,
                emitDeclarationOnly: false,
            },
            include: ['src'],
        },
    }),
    // typescript({
    //     tsconfig: './tsconfig.json',
    //     declaration: false,
    //     noEmit: true,
    // }),
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
    // uglify({
    //     sourcemap: {
    //         filename: "out.js",
    //         url: "out.js.map"
    //     }
    // }),
    // terser(),
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
// const comments = (node, comment) => {
//     var text = comment.value;
//     var type = comment.type;
//     if (type == 'comment2') {
//         // multiline comment
//         return /@preserve|@license|@cc_on/i.test(text);
//     }
// };
const comments = (node, comment) => comment.line === 1;

export default [
    // iife, cjs, es
    {
        input: 'src/index.ts',
        external,
        output: [
            {
                // dir: 'dist',
                file: 'dist/browser/traviso.js',
                format: 'iife',
                globals,
                sourcemap: true,
                banner,
                name: 'TRAVISO',
            },
            {
                file: 'dist/cjs/traviso.js',
                format: 'cjs',
                globals,
                sourcemap: true,
                banner,
            },
            {
                // dir: 'dist',
                file: 'dist/es/traviso.js',
                format: 'es',
                globals,
                sourcemap: true,
                banner,
            },
            // minify/uglify phase
            {
                // dir: 'dist',
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
    // // minify/uglify phase
    // {
    //     input: 'src/index.ts',
    //     output: {
    //         file: 'dist/browser/traviso.min.js',
    //         format: 'iife',
    //         sourcemap: true,
    //         // globals,
    //         // banner,
    //         name: 'TRAVISO',
    //     },
    //     plugins: [
    //         peerDepsExternal(),
    //         resolve({
    //             extensions,
    //             preferBuiltins: false,
    //         }),
    //         terser({
    //             //         // output: { comments },
    //             //         // mangle: {
    //             //         //     reserved: ['TRAVISO'],
    //             //         //     toplevel: false,
    //             //         //     properties: {
    //             //         //         reserved: ['TRAVISO']
    //             //         //     },
    //             //         // },
    //             //         toplevel: true,
    //             //         mangle: false,
    //             output: {
    //                 comments: false,
    //                 // beautify: true,
    //             },
    //         }),
    //     ],
    // },
    // // ts
    // {
    //     input: 'src/index.ts',
    //     output: {
    //         dir: 'dist',
    //         // file: 'dist/index.js',
    //         // format: 'iife',
    //         sourcemap: false,
    //     },
    //     plugins: [
    //         typescript({
    //             useTsconfigDeclarationDir: true,
    //             tsconfigOverride: {
    //                 compilerOptions: {
    //                     // exclude: ['**/*.stories.*'],
    //                     noEmit: true,
    //                     declaration: true,
    //                     emitDeclarationOnly: true,
    //                 }
    //             },
    //         }),
    //     ],
    // },
];
