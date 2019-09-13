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

const buildCss = (theme) => async () => {
  const dist = argv.dist || './dist';
  await new Promise(resolve => {
    gulp.src(`definitions/**/{${settings.components[theme].join(',')}}.less`)
      .pipe(less({
        globalVars: {
          CURRENT_THEME: theme,
        }
      }))
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

const buildAssets = (theme) => async () => {
  const dist = argv.dist || './dist';
  await new Promise(resolve => {
    gulp.src(`themes/${theme}/assets/**/*.*`)
      .pipe(rename((path) => {
        path.dirname = path.dirname.split('/').pop();
        return path;
      }))
      .pipe(gulp.dest(path.join(dist, 'assets/')))
      .on('end', resolve);
  });
};

const watchEhdaa = async () => {
  gulp.watch('themes/ehdaa/**/*.(overrides|variables)', buildCss('ehdaa'));
};

const watchCoffeeman = async () => {
  gulp.watch('themes/coffeeman/**/*.(overrides|variables)', buildCss('coffeeman'));
};

// exports.default = gulp.series(buildCss, buildAssets);
// exports.buildCss = buildCss;

exports.buildEhdaa = gulp.series(buildCss('ehdaa'), buildAssets('ehdaa'));
exports.buildCoffeeman = gulp.series(buildCss('coffeeman'), buildAssets('coffeeman'));


exports.watchEhdaa = watchEhdaa;
exports.watchCoffeeman = watchCoffeeman;
