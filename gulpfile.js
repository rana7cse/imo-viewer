const gulp = require('gulp');
const min = require('gulp-minify');

gulp.task('min', () => {
  return gulp.src('./src/imoViewer.js', { allowEmpty: true })
      .pipe(min({noSource: true}))
      .pipe(gulp.dest('./dist'))
});

gulp.task('default', gulp.series(['min']));