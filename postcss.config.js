/* eslint-disable import/no-extraneous-dependencies */
const atImport = require('postcss-import');
const cssvariables = require('postcss-css-variables');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [atImport(), cssvariables(), autoprefixer],
};
