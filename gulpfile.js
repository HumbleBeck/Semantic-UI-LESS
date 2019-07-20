const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const rtl = require('postcss-rtl');
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const argv = require('yargs').argv;
const path = require('path');

const settings = require('./semantic.json');

const buildCss = async () => {
  const dist = argv.dist || './dist';
  await new Promise(resolve => {
    gulp.src(`definitions/**/{${settings.components.join(',')}}.less`)
      .pipe(less())
      .pipe(concat('main.min.css'))
      .pipe(replace('../../themes/default/', './'))
      .pipe(postcss([
        autoprefixer(),
        rtl(),
        cssnano({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
          }]
        })
      ]))
      .pipe(gulp.dest(dist))
      .on('end', resolve);
  });
};

const buildAssets = async () => {
  const dist = argv.dist || './dist';
  await new Promise(resolve => {
    gulp.src('*/assets/**/*.*')
      .pipe(rename((path) => {
        path.dirname = path.dirname.split('/').pop();
        return path;
      }))
      .pipe(gulp.dest(path.join(dist, 'assets/')))
      .on('end', resolve);
  });
};

const watchCss = async () => {
  gulp.watch('_site/**/*.(overrides|variables)', buildCss);
};

exports.default = gulp.series(buildCss, buildAssets);
exports.buildCss = buildCss;
exports.watch = watchCss;
