/* eslint-disable prettier/prettier */
import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import del from "del";
import bro from "gulp-bro";

// sass.compiler = require("node-sass");
import "node-sass";

const paths = {
    styles: {
        src: "assets/scss/styles.scss",
        dest: "src/static/styles",
        watch: "assets/scss/**/*.scss"
    },
    js: {
        src: "assets/js/main.js",
        dest: "src/static/js",
        watch: "assets/js/**/*.js"
    }
};

const clean = () => {
    return del(["src/static"]);
}

const styles = () => {
    return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));
};

const js = () => {
    return gulp
    .src(paths.js.src)
    .pipe(bro())
    .pipe(gulp.dest(paths.js.dest));
};

export const watchFiles = () => {
    clean();
    styles();
    js();
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.js.watch, js);
};