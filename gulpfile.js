const { src, dest, watch, parallel } = require('gulp'); //funciones que nos da gulp
/* SECTION css */
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
/* section minizar css */
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
/* !section fin - minizar css */

/* !SECTION fin css */

/* SECTION Imagenes */
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp').default; //funcion que se encarga de convertir imagenes en webp se debe poner .default ya que su funcion en node_modules-->index.js tiene "export default function gulpWebp(options) { "
const avif = require('gulp-avif');
/* !SECTION Imagenes */

/* SECTION funcion que transforma .scss a css */
function css(done) {
  src('src/scss/**/*.scss') //Identifica el archivo .scss a compilar
    /* prettier-ignore-start */
    .pipe(sourcemaps.init()) //inicializa el mapa de sourcemaps
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError)) //Compilar el archivo .scss
    .pipe(postcss([autoprefixer(), cssnano()])) //minificar el css
    .pipe(sourcemaps.write('.')) //almacena el mapa de sourcemaps en el mismo directorio que el archivo css
    .pipe(dest('./public/build/css')); //almacenarla en el disco duro
  /* prettier-ignore-end */
  done(); // callback
}
/* !SECTION fin - funcion que transforma .scss a css */

/* SECTION Imagenes */
function imagenes(done) {
  /* section opciones */
  const opciones = {
    optimizationLevel: 3,
  };
  /* !section fin - opciones */
  src('src/img/**/*.{png,jpg,svg}')
    /* prettier-ignore-start */
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('./public/build/img'));
  /* prettier-ignore-end */
  done();
}
/* !SECTION fin - Imagenes */

/* SECTION javaScript */
const terser = require('gulp-terser-js');
/* !SECTION fin - javaScript */

/* SECTION versionWebp  */
//REGISTRAR  o crear nueva tarea
function versionWebp(done) {
  /* section opciones de calidad que se pasaran a .pipe(webp()) */
  const opciones = {
    quality: 50,
  };
  /* !section fin - opciones de calidad que se pasaran a .pipe(webp()) */
  src('src/img/**/*.{png,jpg}') //{jpg,png}formatos a buscar
    /* prettier-ignore-start */
    .pipe(webp(opciones)) //convierte las imagenes en webp en memoria
    .pipe(dest('./public/build/img')); // almacena las imagenes en el disco duro generado por .pipe(webp(opciones))
  /* prettier-ignore-end */
  done();
}
/* !SECTION fin - versionWebp  */

/* SECTION versionAvif  */
//REGISTRAR  o crear nueva tarea
function versionAvif(done) {
  /* section opciones de calidad que se pasaran a .pipe(webp()) */
  const opciones = {
    quality: 50,
  };
  /* !section fin - opciones de calidad que se pasaran a .pipe(webp()) */
  src('src/img/**/*.{png,jpg}') //{jpg,png}formatos a buscar
    /* prettier-ignore-start */
    .pipe(avif(opciones)) //convierte las imagenes en webp en memoria
    .pipe(dest('./public/build/img')); // almacena las imagenes en el disco duro generado por .pipe(webp(opciones))
  /* prettier-ignore-end */
  done();
}
/* !SECTION fin - versionAvif  */

/* SECTION  javascript */
function javascript(done) {
  src('src/js/**/*.js')
    /* prettier-ignore-start */
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(terser()) //minificar el js
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./public/build/js'));
  /* prettier-ignore-end */
  done();
}
/* !SECTION fin - javascript */

function dev(done) {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', javascript);
  done();
}

/* SECTION  ejecutar varias tareas al mismo tiempo */
// hay 2 opciones series o parallel
//series una tarea se ejecuta despues de la otra en forma secuencial
//parallel todas las funciones se ejecutan al mismo tiempo
/* section2 hacer disponibles las funciones creadas */
// Exportar las funciones para que estén disponibles al ejecutar gulp
exports.css = css; // Exporta la función css
exports.js = javascript; // Exporta la función css
exports.imagenes = imagenes; // Exporta la función imagenes
exports.versionWebp = versionWebp; // Exporta la función versionWebp
exports.versionAvif = versionAvif; // Exporta la función versionAvif
exports.dev = parallel(css, imagenes, versionWebp, versionAvif, javascript, dev); // Exporta la función dev que ejecuta versionWebp y dev en paralelo dev a la misma ves trae a la funcion  css
// Exporta la función dev que ejecuta versionWebp y dev en paralelo dev a la misma ves trae a la funcion  css
/* !section2 fin - hacer disponibles las funciones creadas */
/* !SECTION fin - ejecutar varias tareas al mismo tiempo */
// Nueva tarea que solo procesa CSS y JavaScript
exports.devv = parallel(css, javascript, dev);
exports.build = parallel(css, javascript, imagenes,versionWebp, versionAvif);
