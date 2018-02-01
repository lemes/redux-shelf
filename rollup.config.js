import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  output: { name: 'Redux Shelf' },
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.output.format = env;
  config.plugins.push(
    babel({
      plugins: ['external-helpers'],
    })
  );
}

if (env === 'development' || env === 'production') {
  config.output.format = 'umd';
  config.plugins.push(
    babel({ exclude: 'node_modules/**', plugins: ['external-helpers'] })
  );
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
  );
}

export default config;
