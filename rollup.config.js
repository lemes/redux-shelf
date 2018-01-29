/* global process */
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const babelcfg = babel({ exclude: 'node_modules/**' });
const config = {
  input: 'src/index.js',
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.output = { format: env };
  config.plugins.push(babelcfg);
}

if (env === 'development' || env === 'production') {
  config.output = { format: 'umd' };
  config.name = 'Redux Shelf';
  config.plugins.push(babel({ exclude: 'node_modules/**' }));
}

if (env === 'production') {
  const uglifyConfig = uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  });
  config.plugins.push(uglifyConfig);
  config.plugins.push(babelcfg);
}

export default config;
