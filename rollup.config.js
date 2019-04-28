import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import cleaner from 'rollup-plugin-cleaner'
import analyze from 'rollup-plugin-analyzer'

const env = process.env.NODE_ENV
const config = {
  input: 'src/index.js',
  output: { name: 'Redux Shelf' },
  plugins: [],
}

if (env === 'es' || env === 'cjs') {
  config.output.format = env
  config.external = ['normalizer']

  config.plugins.push(cleaner({ targets: [`${env}/`] }))
  config.plugins.push(resolve())
  config.plugins.push(commonjs())
  config.plugins.push(babel({ exclude: 'node_modules/**' }))
}

if (env === 'development' || env === 'production') {
  config.output.format = 'umd'

  config.plugins.push(cleaner({ targets: ['dist/'] }))
  config.plugins.push(resolve())
  config.plugins.push(commonjs())
  config.plugins.push(babel({ exclude: 'node_modules/**' }))
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  )
  config.plugins.push(analyze())
}

export default config
