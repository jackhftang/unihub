const gulp = require('gulp');
const babel = require('gulp-babel');

const paths = {
  tmp: './var',
  src: './src/**/**.js',
  entry: './var/index.js',
  dist: './dist'
};

gulp.task('babel', () =>
  gulp.src(paths.src)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(paths.dist))
);

gulp.task('default', ['babel']);

gulp.task('watch', ['default'], () => {
  gulp.watch(paths.src, ['babel'])
});
