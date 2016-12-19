
call watchify --debug ./scripts/main.js -t [ babelify --sourceMapsAbsolute --presets [ es2015 ] ] -o ./compiled-scripts/main.js
pause