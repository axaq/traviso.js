import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: './src/main.js',
    output: {
        file: './build/main.js',
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs(),
    ],
};
