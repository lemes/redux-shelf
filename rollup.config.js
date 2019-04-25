import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import analyze from 'rollup-plugin-analyzer'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        name: 'redux-shelf',
        file: pkg.module,
        format: 'es',
      }
    ],
    external: ['normalizr'],
    plugins: [
      resolve(),
      commonjs(),
      babel({ exclude: ['node_modues/**'] }),
      analyze(),
    ],
  },
]
