import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue';
import terser from '@rollup/plugin-terser';

const banner = `/*! imoViewer v1.2 | MIT License | Salauddin Rana */`;

// ── React ──────────────────────────────────────────────────────────────────

const reactConfig = {
  input: 'src/react/ImoViewer.jsx',
  external: ['react'],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      extensions: ['.js', '.jsx'],
    }),
    terser({ format: { comments: 'some' } }),
  ],
  output: [
    {
      file: 'dist/react/ImoViewer.js',
      format: 'esm',
      banner,
      sourcemap: false,
    },
    {
      file: 'dist/react/ImoViewer.cjs.js',
      format: 'cjs',
      exports: 'named',
      banner,
      sourcemap: false,
    },
  ],
};

// ── Vue ────────────────────────────────────────────────────────────────────

const vueConfig = {
  input: 'src/vue/ImoViewer.vue',
  external: ['vue'],
  plugins: [
    vue(),
    resolve({ extensions: ['.js', '.vue'] }),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: false }]],
      extensions: ['.js', '.vue'],
      exclude: 'node_modules/**',
    }),
    terser({ format: { comments: 'some' } }),
  ],
  output: [
    {
      file: 'dist/vue/ImoViewer.js',
      format: 'esm',
      banner,
      sourcemap: false,
    },
    {
      file: 'dist/vue/ImoViewer.cjs.js',
      format: 'cjs',
      exports: 'named',
      banner,
      sourcemap: false,
    },
  ],
};

export default [reactConfig, vueConfig];
