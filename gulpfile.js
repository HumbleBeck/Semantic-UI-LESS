const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const rtl = require('postcss-rtl');
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano');
const concat = require('gulp-concat');

const settings = require('./semantic.json');

const build = (callback) => {
  gulp.src(`definitions/**/{${settings.components.join(',')}}.less`)
    .pipe(less())
    .pipe(concat('dist.min.css'))
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
    .pipe(gulp.dest('./'))
    .on('end', callback);


  // gulp.src(source.themes + '/**/assets/**/' + globs.components + '?(s).*')
  //   .pipe(gulpif(config.hasPermission, chmod(config.permission)))
  //   .pipe(gulp.dest(output.themes));

};

exports.default = build;