module.exports = (distRoot, optimize) => ({
  mode: 'production',
  optimization: {
    minimize: !!optimize,
  },
  entry: './src/index.tsx',
  output: {
    path: distRoot,
    filename: optimize ? 'buckles.min.js' : 'buckles.js',
    library: 'Buckles',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            envName: `dist-${optimize ? 'prod' : 'dev'}`,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
});
