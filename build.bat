
call watchify --debug ./scripts/main.js -t [ babelify --sourceMapsAbsolute --presets [ env ] ] -o ./compiled-scripts/main.js
pause