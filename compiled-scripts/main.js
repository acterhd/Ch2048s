(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Field = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tile = require("./tile");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
    function Field() {
        var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

        _classCallCheck(this, Field);

        this.data = {
            width: w, height: h
        };
        this.fields = [];
        this.tiles = [];
        this.defaultTilemapInfo = {
            tileID: -1,
            tile: null,
            loc: [-1, -1]
        };
        this.init();

        this.ontileremove = [];
        this.ontileadd = [];
        this.ontilemove = [];
        this.ontileabsorption = [];
    }

    _createClass(Field, [{
        key: "anyPossible",
        value: function anyPossible() {
            var anypossible = 0;
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var tile = _step.value;

                            if (this.possible(tile, [j, i])) anypossible++;
                            if (anypossible > 0) return true;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
            }
            if (anypossible > 0) return true;
            return false;
        }
    }, {
        key: "tilePossibleList",
        value: function tilePossibleList(tile) {
            var list = [];
            if (!tile) return list; //empty
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    if (this.possible(tile, [j, i])) list.push(this.get([j, i]));
                }
            }
            return list;
        }
    }, {
        key: "possible",
        value: function possible(tile, lto) {
            if (!tile) return false;

            var tilei = this.get(lto);
            var atile = tilei.tile;

            var possibles = !atile || atile.value == tile.value;
            var opponent = !atile || atile.data.side != tile.data.side;
            var piece = tile.possible(lto);
            possibles = possibles && piece;
            //possibles = possibles && opponent; //Hardcore mode

            return possibles;
        }
    }, {
        key: "notSame",
        value: function notSame() {
            var sames = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.tiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tile = _step2.value;

                    if (sames.indexOf(tile.value) < 0) {
                        sames.push(tile.value);
                    } else {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return true;
        }
    }, {
        key: "genPiece",
        value: function genPiece(exceptPawn) {
            var rnd = Math.random();
            if (rnd >= 0.0 && rnd < 0.2) {
                return 1;
            } else if (rnd >= 0.2 && rnd < 0.4) {
                return 2;
            } else if (rnd >= 0.4 && rnd < 0.6) {
                return 3;
            } else if (rnd >= 0.6 && rnd < 0.7) {
                return 4;
            } else if (rnd >= 0.7 && rnd < 0.8) {
                return 5;
            }

            if (exceptPawn) {
                return 5;
            }
            return 0;
        }
    }, {
        key: "generateTile",
        value: function generateTile() {
            var tile = new _tile.Tile();

            //Count not occupied
            var notOccupied = [];
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    if (!this.fields[i][j].tile) notOccupied.push(this.fields[i][j]);
                }
            }

            if (notOccupied.length > 0) {
                tile.data.piece = this.genPiece();
                tile.data.value = Math.random() < 0.25 ? 4 : 2;
                tile.data.side = Math.random() < 0.5 ? 1 : 0;

                tile.attach(this, notOccupied[Math.floor(Math.random() * notOccupied.length)].loc); //prefer generate single

            } else {
                return false; //Not possible to generate new tiles
            }
            return true;
        }
    }, {
        key: "init",
        value: function init() {
            this.tiles.splice(0, this.tiles.length);
            //this.fields.splice(0, this.fields.length);
            for (var i = 0; i < this.data.height; i++) {
                if (!this.fields[i]) this.fields[i] = [];
                for (var j = 0; j < this.data.width; j++) {
                    var tile = this.fields[i][j] ? this.fields[i][j].tile : null;
                    if (tile) {
                        //if have
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = this.ontileremove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var f = _step3.value;
                                f(tile);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                    var ref = Object.assign({}, this.defaultTilemapInfo); //Link with object
                    ref.tileID = -1;
                    ref.tile = null;
                    ref.loc = [j, i];
                    this.fields[i][j] = ref;
                }
            }
            return this;
        }
    }, {
        key: "getTile",
        value: function getTile(loc) {
            return this.get(loc).tile;
        }
    }, {
        key: "get",
        value: function get(loc) {
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                return this.fields[loc[1]][loc[0]]; //return reference
            }
            return Object.assign({}, this.defaultTilemapInfo, {
                loc: [loc[0], loc[1]]
            });
        }
    }, {
        key: "put",
        value: function put(loc, tile) {
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                ref.tileID = tile.id;
                ref.tile = tile;
                tile.replaceIfNeeds();
            }
            return this;
        }
    }, {
        key: "move",
        value: function move(loc, lto) {
            if (loc[0] == lto[0] && loc[1] == lto[1]) return this; //Same location
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                if (ref.tile) {
                    var tile = ref.tile;
                    ref.tileID = -1;
                    ref.tile = null;
                    tile.data.prev[0] = tile.data.loc[0];
                    tile.data.prev[1] = tile.data.loc[1];
                    tile.data.loc[0] = lto[0];
                    tile.data.loc[1] = lto[1];

                    var old = this.fields[lto[1]][lto[0]];
                    if (old.tile) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = this.ontileabsorption[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var f = _step4.value;
                                f(old.tile, tile);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }

                    this.clear(lto, tile).put(lto, tile);
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = this.ontilemove[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _f = _step5.value;
                            _f(tile);
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            }
            return this;
        }
    }, {
        key: "clear",
        value: function clear(loc) {
            var bytile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                if (ref.tile) {
                    var tile = ref.tile;
                    if (tile) {
                        ref.tileID = -1;
                        ref.tile = null;
                        var idx = this.tiles.indexOf(tile);
                        if (idx >= 0) {
                            tile.setLoc([-1, -1]);
                            this.tiles.splice(idx, 1);
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = this.ontileremove[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var f = _step6.value;
                                    f(tile, bytile);
                                }
                            } catch (err) {
                                _didIteratorError6 = true;
                                _iteratorError6 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                        _iterator6.return();
                                    }
                                } finally {
                                    if (_didIteratorError6) {
                                        throw _iteratorError6;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return this;
        }
    }, {
        key: "attach",
        value: function attach(tile) {
            var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];

            if (tile && this.tiles.indexOf(tile) < 0) {
                this.tiles.push(tile);
                tile.setField(this).setLoc(loc).put();
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.ontileadd[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var f = _step7.value;
                        f(tile);
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            }
            return this;
        }
    }]);

    return Field;
}();

exports.Field = Field;

},{"./tile":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iconset = ["icons/WhitePawn.png", "icons/WhiteKnight.png", "icons/WhiteBishop.png", "icons/WhiteRook.png", "icons/WhiteQueen.png", "icons/WhiteKing.png"];

var iconsetBlack = ["icons/BlackPawn.png", "icons/BlackKnight.png", "icons/BlackBishop.png", "icons/BlackRook.png", "icons/BlackQueen.png", "icons/BlackKing.png"];

var GraphicsEngine = function () {
    function GraphicsEngine() {
        var svgname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#svg";

        _classCallCheck(this, GraphicsEngine);

        this.manager = null;
        this.field = null;
        this.input = null;

        this.graphicsLayers = [];
        this.graphicsTiles = [];
        this.visualization = [];
        this.snap = Snap(svgname);
        this.scene = null;

        this.params = {
            border: 10,
            grid: {
                width: 600,
                height: 600
            },
            tile: {
                width: 128,
                height: 128,
                styles: [{
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 2 && tile.value < 4;
                    },
                    fill: "rgb(255, 192, 128)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 4 && tile.value < 8;
                    },
                    fill: "rgb(224, 128, 96)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 8 && tile.value < 16;
                    },
                    fill: "rgb(224, 96, 64)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 16 && tile.value < 32;
                    },
                    fill: "rgb(224, 64, 64)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 32 && tile.value < 64;
                    },
                    fill: "rgb(224, 64, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 64 && tile.value < 128;
                    },
                    fill: "rgb(224, 0, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 128 && tile.value < 256;
                    },
                    fill: "rgb(224, 128, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 256 && tile.value < 512;
                    },
                    fill: "rgb(224, 192, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 512 && tile.value < 1024;
                    },
                    fill: "rgb(224, 224, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 1024 && tile.value < 2048;
                    },
                    fill: "rgb(255, 224, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 2048;
                    },
                    fill: "rgb(255, 230, 0)"
                }]
            }
        };
    }

    _createClass(GraphicsEngine, [{
        key: "createSemiVisible",
        value: function createSemiVisible(loc) {
            var _this = this;

            var object = {
                loc: loc
            };

            var params = this.params;
            var pos = this.calculateGraphicsPosition(loc);

            var s = this.graphicsLayers[2].object;
            var radius = 5;
            var rect = s.rect(0, 0, params.tile.width, params.tile.height, radius, radius);

            var group = s.group(rect);
            group.transform("translate(" + pos[0] + ", " + pos[1] + ")");

            rect.attr({
                fill: "transparent"
            });

            object.element = group;
            object.rectangle = rect;
            object.area = rect;
            object.remove = function () {
                _this.graphicsTiles.splice(_this.graphicsTiles.indexOf(object), 1);
            };
            return object;
        }
    }, {
        key: "createDecoration",
        value: function createDecoration() {
            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;
            this.params.grid.width = tw;
            this.params.grid.height = th;

            var decorationLayer = this.graphicsLayers[0];
            var rect = decorationLayer.object.rect(0, 0, tw, th, 5, 5);
            rect.attr({
                fill: "rgb(255, 224, 192)",
                stroke: "rgb(128, 64, 32)",
                "stroke-width": "8"
            });
        }
    }, {
        key: "createComposition",
        value: function createComposition() {
            this.graphicsLayers.splice(0, this.graphicsLayers.length);
            var scene = this.snap.group();
            scene.transform("translate(5, 5)");

            this.scene = scene;
            this.graphicsLayers[0] = { //Decoration
                object: scene.group()
            };
            this.graphicsLayers[1] = {
                object: scene.group()
            };
            this.graphicsLayers[2] = {
                object: scene.group()
            };
            this.graphicsLayers[3] = {
                object: scene.group()
            };
            this.graphicsLayers[4] = {
                object: scene.group()
            };

            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;
            for (var y = 0; y < height; y++) {
                this.visualization[y] = [];
                for (var x = 0; x < width; x++) {
                    this.visualization[y][x] = this.createSemiVisible([x, y]);
                }
            }

            this.receiveTiles();
            this.createDecoration();
            this.createGameOver();
            return this;
        }
    }, {
        key: "createGameOver",
        value: function createGameOver() {
            var _this2 = this;

            var screen = this.graphicsLayers[4].object;

            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;

            var bg = screen.rect(0, 0, tw, th, 5, 5);
            bg.attr({
                "fill": "rgba(255, 224, 0, 0.8)"
            });
            var got = screen.text(tw / 2, th / 2 - 30, "Game Over");
            got.attr({
                "font-size": "30",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            var buttonGroup = screen.group();
            buttonGroup.transform("translate(" + (tw / 2 - 50) + ", " + (th / 2 + 20) + ")");
            buttonGroup.click(function () {
                _this2.manager.restart();
            });

            var button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(224, 192, 0, 0.8)"
            });

            var buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            this.gameoverscren = screen;
            screen.attr({ "visibility": "hidden" });

            return this;
        }
    }, {
        key: "showGameover",
        value: function showGameover() {
            this.gameoverscren.attr({ "visibility": "visible" });
            return this;
        }
    }, {
        key: "hideGameover",
        value: function hideGameover() {
            this.gameoverscren.attr({ "visibility": "hidden" });
            return this;
        }
    }, {
        key: "selectObject",
        value: function selectObject(tile) {
            for (var i = 0; i < this.graphicsTiles.length; i++) {
                if (this.graphicsTiles[i].tile == tile) return this.graphicsTiles[i];
            }
            return null;
        }
    }, {
        key: "changeStyleObject",
        value: function changeStyleObject(obj) {
            var tile = obj.tile;
            var pos = this.calculateGraphicsPosition(tile.loc);
            var group = obj.element;
            group.transform("translate(" + pos[0] + ", " + pos[1] + ")");

            var style = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.params.tile.styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _style = _step.value;

                    if (_style.condition.call(obj.tile)) {
                        style = _style;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            obj.text.attr({ "text": "" + tile.value });
            if (style.font) {
                obj.text.attr("fill", style.font);
            } else {
                obj.text.attr("fill", "black");
            }
            obj.icon.attr({ "xlink:href": obj.tile.data.side == 0 ? iconset[obj.tile.data.piece] : iconsetBlack[obj.tile.data.piece] });

            if (!style) return this;
            obj.rectangle.attr({
                fill: style.fill
            });

            return this;
        }
    }, {
        key: "changeStyle",
        value: function changeStyle(tile) {
            var obj = this.selectObject(tile);
            this.changeStyleObject(obj);
            return this;
        }
    }, {
        key: "removeObject",
        value: function removeObject(tile) {
            var object = this.selectObject(tile);
            if (object) object.remove();
            return this;
        }
    }, {
        key: "showMoved",
        value: function showMoved(tile) {
            this.changeStyle(tile);
            return this;
        }
    }, {
        key: "calculateGraphicsPosition",
        value: function calculateGraphicsPosition(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            var params = this.params;
            var border = this.params.border;
            return [border + (params.tile.width + border) * x, border + (params.tile.height + border) * y];
        }
    }, {
        key: "selectVisualizer",
        value: function selectVisualizer(loc) {
            if (!loc || !(loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.field.data.width && loc[1] < this.field.data.height)) return null;
            return this.visualization[loc[1]][loc[0]];
        }
    }, {
        key: "createObject",
        value: function createObject(tile) {
            var _this3 = this;

            if (this.selectObject(tile)) return null;

            var object = {
                tile: tile
            };

            var params = this.params;
            var pos = this.calculateGraphicsPosition(tile.loc);

            var s = this.graphicsLayers[1].object;
            var radius = 5;
            var rect = s.rect(0, 0, params.tile.width, params.tile.height, radius, radius);

            var icon = s.image("", 32, 32, params.tile.width - 64, params.tile.height - 64);

            var text = s.text(params.tile.width / 2, 112, "TEST");
            text.attr({
                "font-size": "16px",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS",
                "color": "black"
            });

            var group = s.group(rect, icon, text);
            group.transform("translate(" + pos[0] + ", " + pos[1] + ")");

            object.element = group;
            object.rectangle = rect;
            object.icon = icon;
            object.text = text;
            object.remove = function () {
                _this3.graphicsTiles.splice(_this3.graphicsTiles.indexOf(object), 1);
                object.element.remove();
            };

            this.changeStyleObject(object);
            return object;
        }
    }, {
        key: "getInteractionLayer",
        value: function getInteractionLayer() {
            return this.graphicsLayers[3];
        }
    }, {
        key: "clearShowed",
        value: function clearShowed() {
            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var vis = this.selectVisualizer([x, y]);
                    vis.area.attr({ fill: "transparent" });
                }
            }
            return this;
        }
    }, {
        key: "showSelected",
        value: function showSelected() {
            if (!this.input.selected) return this;
            var tile = this.input.selected.tile;
            if (!tile) return this;
            var object = this.selectVisualizer(tile.loc);
            if (object) {
                object.area.attr({ "fill": "rgba(255, 0, 0, 0.2)" });
            }
            return this;
        }
    }, {
        key: "showPossible",
        value: function showPossible(tileinfolist) {
            if (!this.input.selected) return this;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = tileinfolist[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tileinfo = _step2.value;

                    var tile = tileinfo.tile;
                    var object = this.selectVisualizer(tileinfo.loc);
                    if (object) {
                        object.area.attr({ "fill": "rgba(0, 255, 0, 0.2)" });
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        }
    }, {
        key: "receiveTiles",
        value: function receiveTiles() {
            this.clearTiles();
            var tiles = this.manager.tiles;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = tiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tile = _step3.value;

                    if (!this.selectObject(tile)) {
                        this.graphicsTiles.push(this.createObject(tile));
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return this;
        }
    }, {
        key: "clearTiles",
        value: function clearTiles() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.graphicsTiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var tile = _step4.value;

                    if (tile) tile.remove();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return this;
        }
    }, {
        key: "pushTile",
        value: function pushTile(tile) {
            if (!this.selectObject(tile)) {
                this.graphicsTiles.push(this.createObject(tile));
            }
            return this;
        }
    }, {
        key: "attachManager",
        value: function attachManager(manager) {
            var _this4 = this;

            this.field = manager.field;
            this.manager = manager;

            this.field.ontileremove.push(function (tile) {
                //when tile removed
                _this4.removeObject(tile);
            });
            this.field.ontilemove.push(function (tile) {
                //when tile moved
                _this4.changeStyle(tile);
            });
            this.field.ontileadd.push(function (tile) {
                //when tile added
                _this4.pushTile(tile);
            });
            return this;
        }
    }, {
        key: "attachInput",
        value: function attachInput(input) {
            //May required for send objects and mouse events
            this.input = input;
            input.attachGraphics(this);
            return this;
        }
    }]);

    return GraphicsEngine;
}();

exports.GraphicsEngine = GraphicsEngine;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = function () {
    function Input() {
        var _this = this;

        _classCallCheck(this, Input);

        this.graphic = null;
        this.fields = null;
        this.input = null;
        this.interactionMap = null;
        this.selected = null;

        this.port = {
            onmove: [],
            onstart: [],
            onselect: []
        };

        this.restartbutton = document.querySelector("#restart");
        this.scoreboard = document.querySelector("#score");

        this.restartbutton.addEventListener("click", function () {
            _this.manager.restart();
        });
    }

    _createClass(Input, [{
        key: "attachManager",
        value: function attachManager(manager) {
            var _this2 = this;

            this.field = manager.field;
            this.manager = manager;
            this.field.ontileabsorption.push(function (old, tile) {
                _this2.scoreboard.innerHTML = _this2.manager.data.score;
            });
            return this;
        }
    }, {
        key: "attachGraphics",
        value: function attachGraphics(graphic) {
            this.graphic = graphic;
            return this;
        }
    }, {
        key: "createInteractionObject",
        value: function createInteractionObject(tileinfo, x, y) {
            var _this3 = this;

            var object = {

                tileinfo: tileinfo,
                loc: [x, y]
            };

            var graphic = this.graphic;
            var params = graphic.params;
            var interactive = graphic.getInteractionLayer();
            var field = this.field;

            var pos = graphic.calculateGraphicsPosition(object.loc);
            var border = this.graphic.params.border;
            var area = interactive.object.rect(pos[0] - border / 2, pos[1] - border / 2, params.tile.width + border, params.tile.height + border).click(function () {
                if (!_this3.selected) {
                    var selected = field.get(object.loc);
                    if (selected) {
                        _this3.selected = selected;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _this3.port.onselect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var f = _step.value;
                                f(_this3, _this3.selected);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                } else {
                    var _selected = field.get(object.loc);
                    if (_selected && _selected.tile && _selected.tile.loc[0] != -1 && _selected != _this3.selected && !field.possible(_this3.selected.tile, object.loc) && !(object.loc[0] == _this3.selected.loc[0] && object.loc[1] == _this3.selected.loc[1])) {
                        _this3.selected = _selected;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _this3.port.onselect[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _f = _step2.value;
                                _f(_this3, _this3.selected);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    } else {
                        var _selected2 = _this3.selected;
                        _this3.selected = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this3.port.onmove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _f2 = _step3.value;

                                _f2(_this3, _selected2, field.get(object.loc));
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                }
            });
            object.rectangle = object.area = area;

            area.attr({
                fill: "transparent"
            });

            return object;
        }
    }, {
        key: "buildInteractionMap",
        value: function buildInteractionMap() {
            var map = {
                tilemap: [],
                gridmap: null
            };

            var graphic = this.graphic;
            var params = graphic.params;
            var interactive = graphic.getInteractionLayer();
            var field = this.field;

            for (var i = 0; i < field.data.height; i++) {
                map.tilemap[i] = [];
                for (var j = 0; j < field.data.width; j++) {
                    map.tilemap[i][j] = this.createInteractionObject(field.get([j, i]), j, i);
                }
            }

            this.interactionMap = map;
            return this;
        }
    }]);

    return Input;
}();

exports.Input = Input;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Manager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _field = require("./field");

var _tile = require("./tile");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
    function Manager() {
        var _this = this;

        _classCallCheck(this, Manager);

        this.graphic = null;
        this.input = null;
        this.field = new _field.Field(4, 4);
        this.data = {
            score: 0,
            movecounter: 0,
            absorbed: 0
        };

        this.onstartevent = function (controller, tileinfo) {
            _this.gamestart();
        };
        this.onselectevent = function (controller, tileinfo) {
            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
        };
        this.onmoveevent = function (controller, selected, tileinfo) {
            if (_this.field.possible(selected.tile, tileinfo.loc)) {
                _this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);

            //this.graphic.showGameover();
        };

        this.field.ontileabsorption.push(function (old, tile) {
            _this.graphic.removeObject(old);
            _this.data.score += tile.value + old.value;
            tile.value *= 2;
            _this.data.absorbed = true;
        });
        this.field.ontileremove.push(function (tile) {
            //when tile removed
            _this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push(function (tile) {
            //when tile moved
            _this.graphic.showMoved(tile);
            if (Math.random() <= 0.5 || _this.data.movecounter++ % 2 == 0 && _this.data.absorbed) {
                _this.field.generateTile();
            }
            _this.data.absorbed = false;

            if (!_this.field.anyPossible()) _this.graphic.showGameover();
        });
        this.field.ontileadd.push(function (tile) {
            //when tile added
            _this.graphic.pushTile(tile);
        });
    }

    _createClass(Manager, [{
        key: "initUser",
        value: function initUser(_ref) {
            var graphics = _ref.graphics,
                input = _ref.input;

            this.input = input;
            this.input.port.onstart.push(this.onstartevent);
            this.input.port.onselect.push(this.onselectevent);
            this.input.port.onmove.push(this.onmoveevent);
            input.attachManager(this);

            this.graphic = graphics;
            graphics.attachManager(this);

            this.graphic.createComposition();
            this.input.buildInteractionMap();

            return this;
        }
    }, {
        key: "restart",
        value: function restart() {
            this.gamestart();
            return this;
        }
    }, {
        key: "gamestart",
        value: function gamestart() {
            this.data.score = 0;
            this.data.movecounter = 0;
            this.data.absorbed = 0;
            this.field.init();
            this.field.generateTile();
            this.field.generateTile();
            //this.graphic.receiveTiles();
            this.graphic.hideGameover();
            return this;
        }
    }, {
        key: "gamepause",
        value: function gamepause() {
            return this;
        }
    }, {
        key: "gameover",
        value: function gameover(reason) {
            return this;
        }
    }, {
        key: "think",
        value: function think(diff) {
            //???
            return this;
        }
    }, {
        key: "tiles",
        get: function get() {
            return this.field.tiles;
        }
    }]);

    return Manager;
}();

exports.Manager = Manager;

},{"./field":1,"./tile":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kmovemap = [[-2, -1], [2, -1], [-2, 1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]];

var rdirs = [[0, 1], //down
[0, -1], //up
[1, 0], //left
[-1, 0] //right
];

var bdirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

var padirs = [[1, -1], [-1, -1]];

var pmdirs = [[0, -1]];

var padirsNeg = [[1, 1], [-1, 1]];

var pmdirsNeg = [[0, 1]];

var qdirs = rdirs.concat(bdirs); //may not need

var tcounter = 0;

var Tile = function () {
    function Tile() {
        _classCallCheck(this, Tile);

        this.field = null;
        this.data = {
            value: 2,
            piece: 0,
            loc: [-1, -1], //x, y
            prev: [-1, -1],
            side: 0 //White = 0, Black = 1
        };
        this.id = tcounter++;
    }

    _createClass(Tile, [{
        key: "attach",
        value: function attach(field, x, y) {
            field.attach(this, x, y);
            return this;
        }
    }, {
        key: "get",
        value: function get() {
            var relative = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];

            if (this.field) return this.field.get([this.data.loc[0] + relative[0], this.data.loc[1] + relative[1]]);
            return null;
        }
    }, {
        key: "move",
        value: function move(lto) {
            if (this.field) this.field.move(this.data.loc, lto);
            return this;
        }
    }, {
        key: "put",
        value: function put() {
            if (this.field) this.field.put(this.data.loc, this);
            return this;
        }
    }, {
        key: "cacheLoc",
        value: function cacheLoc() {
            this.data.prev[0] = this.data.loc[0];
            this.data.prev[1] = this.data.loc[1];
            return this;
        }
    }, {
        key: "setField",
        value: function setField(field) {
            this.field = field;
            return this;
        }
    }, {
        key: "setLoc",
        value: function setLoc(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            this.data.loc[0] = x;
            this.data.loc[1] = y;
            return this;
        }
    }, {
        key: "replaceIfNeeds",
        value: function replaceIfNeeds() {
            if (this.data.piece == 0) {
                if (this.data.loc[1] >= this.field.data.height - 1 && this.data.side == 1) {
                    this.data.piece = this.field.genPiece(true);
                }
                if (this.data.loc[1] <= 0 && this.data.side == 0) {
                    this.data.piece = this.field.genPiece(true);
                }
            }
            return this;
        }
    }, {
        key: "possible",
        value: function possible(loc) {
            if (this.data.piece == 0) {
                //PAWN
                var list = this.getPawnAttackTiles();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var m = _step.value;

                        if (m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                list = this.getPawnMoveTiles();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _m = _step2.value;

                        if (_m.loc[0] == loc[0] && _m.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else if (this.data.piece == 1) {
                //Knight
                var _list = this.getKnightPossibleTiles();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = _list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _m2 = _step3.value;

                        if (_m2.loc[0] == loc[0] && _m2.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            } else if (this.data.piece == 2) {
                //Bishop
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = bdirs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var d = _step4.value;

                        if (Math.sign(loc[0] - this.loc[0]) != d[0] || Math.sign(loc[1] - this.loc[1]) != d[1]) continue;

                        var _list2 = this.getDirectionTiles(d);
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = _list2.reverse()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _m3 = _step5.value;

                                if (_m3.loc[0] == loc[0] && _m3.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else if (this.data.piece == 3) {
                //Rook
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = rdirs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _d = _step6.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d[0] || Math.sign(loc[1] - this.loc[1]) != _d[1]) continue; //Not possible direction

                        var _list3 = this.getDirectionTiles(_d);
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = _list3.reverse()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _m4 = _step7.value;

                                if (_m4.loc[0] == loc[0] && _m4.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            } else if (this.data.piece == 4) {
                //Queen
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = qdirs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var _d2 = _step8.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d2[0] || Math.sign(loc[1] - this.loc[1]) != _d2[1]) continue; //Not possible direction

                        var _list4 = this.getDirectionTiles(_d2);
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = _list4.reverse()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var _m5 = _step9.value;

                                if (_m5.loc[0] == loc[0] && _m5.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            } else if (this.data.piece == 5) {
                //King
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = qdirs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var _d3 = _step10.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d3[0] || Math.sign(loc[1] - this.loc[1]) != _d3[1]) continue; //Not possible direction

                        var _list5 = this.getNeightborTiles(_d3);
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = _list5[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var _m6 = _step11.value;

                                if (_m6.loc[0] == loc[0] && _m6.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError11 = true;
                            _iteratorError11 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                    _iterator11.return();
                                }
                            } finally {
                                if (_didIteratorError11) {
                                    throw _iteratorError11;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }
            }

            return false;
        }
    }, {
        key: "getKnightPossibleTiles",
        value: function getKnightPossibleTiles() {
            var availables = [];
            for (var i = 0; i < kmovemap.length; i++) {
                var loc = kmovemap[i];
                var tif = this.get(loc);
                if (tif) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "getNeightborTiles",
        value: function getNeightborTiles(dir) {
            var availables = [];
            var maxt = Math.max(this.field.data.width, this.field.data.height);
            var tif = this.get([dir[0], dir[1]]);
            if (tif) availables.push(tif);
            return availables;
        }
    }, {
        key: "getDirectionTiles",
        value: function getDirectionTiles(dir) {
            var availables = [];
            var maxt = Math.max(this.field.data.width, this.field.data.height);
            for (var i = 1; i < maxt; i++) {
                var tif = this.get([dir[0] * i, dir[1] * i]);
                if (tif) availables.push(tif);
                if (tif.tile || !tif) break;
            }
            return availables;
        }
    }, {
        key: "getPawnAttackTiles",
        value: function getPawnAttackTiles() {
            var availables = [];
            var dirs = this.data.side == 0 ? padirs : padirsNeg;
            for (var i = 0; i < dirs.length; i++) {
                var tif = this.get(dirs[i]);
                if (tif && tif.tile) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "getPawnMoveTiles",
        value: function getPawnMoveTiles() {
            var availables = [];
            var dirs = this.data.side == 0 ? pmdirs : pmdirsNeg;
            for (var i = 0; i < dirs.length; i++) {
                var tif = this.get(dirs[i]);
                if (tif && !tif.tile) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "value",
        get: function get() {
            return this.data.value;
        },
        set: function set(v) {
            this.data.value = v;
        }
    }, {
        key: "loc",
        get: function get() {
            return this.data.loc;
        },
        set: function set(a) {
            this.data.loc[0] = a[0];
            this.data.loc[1] = a[1];
        }
    }]);

    return Tile;
}();

exports.Tile = Tile;

},{}],6:[function(require,module,exports){
"use strict";

var _graphics = require("./include/graphics");

var _manager = require("./include/manager");

var _input = require("./include/input");

(function () {
    var manager = new _manager.Manager();
    var graphics = new _graphics.GraphicsEngine();
    var input = new _input.Input();

    graphics.attachInput(input);
    manager.initUser({ graphics: graphics, input: input });
    manager.gamestart(); //debug
})();

},{"./include/graphics":2,"./include/input":3,"./include/manager":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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TyxVQUFQO0FBQ0g7Ozs0QkE1TVU7QUFDUCxtQkFBTyxLQUFLLElBQUwsQ0FBVSxLQUFqQjtBQUNILFM7MEJBRVMsQyxFQUFFO0FBQ1IsaUJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsQ0FBbEI7QUFDSDs7OzRCQWlDUTtBQUNMLG1CQUFPLEtBQUssSUFBTCxDQUFVLEdBQWpCO0FBQ0gsUzswQkFFTyxDLEVBQUU7QUFDTixpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0EsaUJBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxDQUFkLElBQW1CLEVBQUUsQ0FBRixDQUFuQjtBQUNIOzs7Ozs7UUFpS0csSSxHQUFBLEk7OztBQ2hSUjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxDQUFDLFlBQVU7QUFDUCxRQUFJLFVBQVUsc0JBQWQ7QUFDQSxRQUFJLFdBQVcsOEJBQWY7QUFDQSxRQUFJLFFBQVEsa0JBQVo7O0FBRUEsYUFBUyxXQUFULENBQXFCLEtBQXJCO0FBQ0EsWUFBUSxRQUFSLENBQWlCLEVBQUMsa0JBQUQsRUFBVyxZQUFYLEVBQWpCO0FBQ0EsWUFBUSxTQUFSLEdBUE8sQ0FPYztBQUN4QixDQVJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKHcgPSA0LCBoID0gNCl7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogdywgaGVpZ2h0OiBoXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbyA9IHtcclxuICAgICAgICAgICAgdGlsZUlEOiAtMSxcclxuICAgICAgICAgICAgdGlsZTogbnVsbCxcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbnRpbGVyZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFkZCA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWJzb3JwdGlvbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGFueVBvc3NpYmxlKCl7XHJcbiAgICAgICAgbGV0IGFueXBvc3NpYmxlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGFueXBvc3NpYmxlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZVBvc3NpYmxlTGlzdCh0aWxlKXtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGxpc3Q7IC8vZW1wdHlcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGxpc3QucHVzaCh0aGlzLmdldChbaiwgaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcG9zc2libGUodGlsZSwgbHRvKXtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVpID0gdGhpcy5nZXQobHRvKTtcclxuICAgICAgICBsZXQgYXRpbGUgPSB0aWxlaS50aWxlO1xyXG5cclxuICAgICAgICBsZXQgcG9zc2libGVzID0gIWF0aWxlIHx8IGF0aWxlLnZhbHVlID09IHRpbGUudmFsdWU7XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gIWF0aWxlIHx8IGF0aWxlLmRhdGEuc2lkZSAhPSB0aWxlLmRhdGEuc2lkZTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aWxlLnBvc3NpYmxlKGx0byk7XHJcbiAgICAgICAgcG9zc2libGVzID0gcG9zc2libGVzICYmIHBpZWNlO1xyXG4gICAgICAgIC8vcG9zc2libGVzID0gcG9zc2libGVzICYmIG9wcG9uZW50OyAvL0hhcmRjb3JlIG1vZGVcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuUGllY2UoZXhjZXB0UGF3bil7XHJcbiAgICAgICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYocm5kID49IDAuMCAmJiBybmQgPCAwLjIpe1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuMiAmJiBybmQgPCAwLjQpe1xyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNCAmJiBybmQgPCAwLjYpe1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNiAmJiBybmQgPCAwLjcpe1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNyAmJiBybmQgPCAwLjgpe1xyXG4gICAgICAgICAgICByZXR1cm4gNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGV4Y2VwdFBhd24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIDU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlVGlsZSgpe1xyXG4gICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9Db3VudCBub3Qgb2NjdXBpZWRcclxuICAgICAgICBsZXQgbm90T2NjdXBpZWQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2ldW2pdLnRpbGUpIG5vdE9jY3VwaWVkLnB1c2godGhpcy5maWVsZHNbaV1bal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYobm90T2NjdXBpZWQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5waWVjZSA9IHRoaXMuZ2VuUGllY2UoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gTWF0aC5yYW5kb20oKSA8IDAuMjUgPyA0IDogMjtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcblxyXG4gICAgICAgICAgICB0aWxlLmF0dGFjaCh0aGlzLCBub3RPY2N1cGllZFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub3RPY2N1cGllZC5sZW5ndGgpXS5sb2MpOyAvL3ByZWZlciBnZW5lcmF0ZSBzaW5nbGVcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoMCwgdGhpcy50aWxlcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkc1tpXVtqXSA/IHRoaXMuZmllbGRzW2ldW2pdLnRpbGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYodGlsZSl7IC8vaWYgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8pOyAvL0xpbmsgd2l0aCBvYmplY3RcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJlZi5sb2MgPSBbaiwgaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkc1tpXVtqXSA9IHJlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldFRpbGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQobG9jKS50aWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQobG9jKXtcclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHV0KGxvYywgdGlsZSl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSB0aWxlLmlkO1xyXG4gICAgICAgICAgICByZWYudGlsZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIHRpbGUucmVwbGFjZUlmTmVlZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobG9jLCBsdG8pe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgaWYgKHJlZi50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHJlZi50aWxlO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMV0gPSB0aWxlLmRhdGEubG9jWzFdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1swXSA9IGx0b1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuZmllbGRzW2x0b1sxXV1bbHRvWzBdXTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGQudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhYnNvcnB0aW9uKSBmKG9sZC50aWxlLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhcihsdG8sIHRpbGUpLnB1dChsdG8sIHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyKGxvYywgYnl0aWxlID0gbnVsbCl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnNldExvYyhbLTEsIC0xXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSwgYnl0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaCh0aWxlLCBsb2M9WzAsIDBdKXtcclxuICAgICAgICBpZih0aWxlICYmIHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy50aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgICAgICB0aWxlLnNldEZpZWxkKHRoaXMpLnNldExvYyhsb2MpLnB1dCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWRkKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtGaWVsZH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGljb25zZXQgPSBbXHJcbiAgICBcImljb25zL1doaXRlUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVJvb2sucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS2luZy5wbmdcIlxyXG5dO1xyXG5cclxubGV0IGljb25zZXRCbGFjayA9IFtcclxuICAgIFwiaWNvbnMvQmxhY2tQYXduLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tuaWdodC5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tCaXNob3AucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUm9vay5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tRdWVlbi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLaW5nLnBuZ1wiXHJcbl07XHJcblxyXG5jbGFzcyBHcmFwaGljc0VuZ2luZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHN2Z25hbWUgPSBcIiNzdmdcIil7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlzdWFsaXphdGlvbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuc25hcCA9IFNuYXAoc3ZnbmFtZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBib3JkZXI6IDEwLFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNjAwLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNjAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbGU6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMiAmJiB0aWxlLnZhbHVlIDwgNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMTkyLCAxMjgpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA0ICYmIHRpbGUudmFsdWUgPCA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDk2KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gOCAmJiB0aWxlLnZhbHVlIDwgMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDk2LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDE2ICYmIHRpbGUudmFsdWUgPCAzMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMzIgJiYgdGlsZS52YWx1ZSA8IDY0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDY0ICYmIHRpbGUudmFsdWUgPCAxMjg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDAsIDApXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTI4ICYmIHRpbGUudmFsdWUgPCAyNTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDI1NiAmJiB0aWxlLnZhbHVlIDwgNTEyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxOTIsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA1MTIgJiYgdGlsZS52YWx1ZSA8IDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEwMjQgJiYgdGlsZS52YWx1ZSA8IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIzMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbWlWaXNpYmxlKGxvYyl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgbG9jOiBsb2NcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKGxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1syXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICsgYikgKiB3ICsgYjtcclxuICAgICAgICBsZXQgdGggPSAodGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgKyBiKSAqIGggKyBiO1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQud2lkdGggPSB0dztcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCA9IHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZWNvcmF0aW9uTGF5ZXIgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdO1xyXG4gICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDE5MilcIiwgXHJcbiAgICAgICAgICAgIHN0cm9rZTogXCJyZ2IoMTI4LCA2NCwgMzIpXCIsXHJcbiAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IFwiOFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tcG9zaXRpb24oKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzTGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHNjZW5lID0gdGhpcy5zbmFwLmdyb3VwKCk7XHJcbiAgICAgICAgc2NlbmUudHJhbnNmb3JtKFwidHJhbnNsYXRlKDUsIDUpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1swXSA9IHsgLy9EZWNvcmF0aW9uXHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1sxXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzJdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbM10gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s0XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XVt4XSA9IHRoaXMuY3JlYXRlU2VtaVZpc2libGUoW3gsIHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlVGlsZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZURlY29yYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVPdmVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVHYW1lT3Zlcigpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjU1LCAyMjQsIDAsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBnb3QgPSBzY3JlZW4udGV4dCh0dyAvIDIsIHRoIC8gMiAtIDMwLCBcIkdhbWUgT3ZlclwiKTtcclxuICAgICAgICBnb3QuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMzBcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gNTB9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjI0LCAxOTIsIDAsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3Jlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJ9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlR2FtZW92ZXIoKXtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmope1xyXG4gICAgICAgIGxldCB0aWxlID0gb2JqLnRpbGU7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gb2JqLmVsZW1lbnQ7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGxldCBzdHlsZSA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBfc3R5bGUgb2YgdGhpcy5wYXJhbXMudGlsZS5zdHlsZXMpIHtcclxuICAgICAgICAgICAgaWYoX3N0eWxlLmNvbmRpdGlvbi5jYWxsKG9iai50aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBfc3R5bGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XCJ0ZXh0XCI6IGAke3RpbGUudmFsdWV9YH0pO1xyXG4gICAgICAgIGlmIChzdHlsZS5mb250KSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIHN0eWxlLmZvbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iai5pY29uLmF0dHIoe1wieGxpbms6aHJlZlwiOiBvYmoudGlsZS5kYXRhLnNpZGUgPT0gMCA/IGljb25zZXRbb2JqLnRpbGUuZGF0YS5waWVjZV0gOiBpY29uc2V0QmxhY2tbb2JqLnRpbGUuZGF0YS5waWVjZV19KTtcclxuXHJcblxyXG4gICAgICAgIGlmICghc3R5bGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIG9iai5yZWN0YW5nbGUuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IHN0eWxlLmZpbGxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU3R5bGUodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIGlmIChvYmplY3QpIG9iamVjdC5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93TW92ZWQodGlsZSl7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pe1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS53aWR0aCAgKyBib3JkZXIpICogeCxcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikgKiB5XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RWaXN1YWxpemVyKGxvYyl7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAhbG9jIHx8IFxyXG4gICAgICAgICAgICAhKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZmllbGQuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KVxyXG4gICAgICAgICkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzdWFsaXphdGlvbltsb2NbMV1dW2xvY1swXV07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpbGU6IHRpbGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1sxXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGljb24gPSBzLmltYWdlKFxyXG4gICAgICAgICAgICBcIlwiLCBcclxuICAgICAgICAgICAgMzIsIFxyXG4gICAgICAgICAgICAzMiwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoIC0gNjQsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgLSA2NFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCB0ZXh0ID0gcy50ZXh0KHBhcmFtcy50aWxlLndpZHRoIC8gMiwgMTEyLCBcIlRFU1RcIik7XHJcbiAgICAgICAgdGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNnB4XCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCIsIFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiYmxhY2tcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QsIGljb24sIHRleHQpO1xyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWApO1xyXG5cclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5pY29uID0gaWNvbjtcclxuICAgICAgICBvYmplY3QudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgb2JqZWN0LnJlbW92ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSh0aGlzLmdyYXBoaWNzVGlsZXMuaW5kZXhPZihvYmplY3QpLCAxKTtcclxuICAgICAgICAgICAgb2JqZWN0LmVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEludGVyYWN0aW9uTGF5ZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaGljc0xheWVyc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNob3dlZCgpe1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgZm9yIChsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICB2aXMuYXJlYS5hdHRyKHtmaWxsOiBcInRyYW5zcGFyZW50XCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5pbnB1dC5zZWxlY3RlZC50aWxlO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlLmxvYyk7XHJcbiAgICAgICAgaWYgKG9iamVjdCl7XHJcbiAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMjU1LCAwLCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Bvc3NpYmxlKHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBmb3IobGV0IHRpbGVpbmZvIG9mIHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZWluZm8udGlsZTtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICBpZihvYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgwLCAyNTUsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2VpdmVUaWxlcygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaWxlcygpO1xyXG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMubWFuYWdlci50aWxlcztcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyVGlsZXMoKXtcclxuICAgICAgICBmb3IgKGxldCB0aWxlIG9mIHRoaXMuZ3JhcGhpY3NUaWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlKSB0aWxlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hJbnB1dChpbnB1dCl7IC8vTWF5IHJlcXVpcmVkIGZvciBzZW5kIG9iamVjdHMgYW5kIG1vdXNlIGV2ZW50c1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBpbnB1dC5hdHRhY2hHcmFwaGljcyh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQge0dyYXBoaWNzRW5naW5lfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wb3J0ID0ge1xyXG4gICAgICAgICAgICBvbm1vdmU6IFtdLFxyXG4gICAgICAgICAgICBvbnN0YXJ0OiBbXSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IFtdLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNjb3JlYm9hcmQuaW5uZXJIVE1MID0gdGhpcy5tYW5hZ2VyLmRhdGEuc2NvcmU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgcG9zID0gZ3JhcGhpYy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKG9iamVjdC5sb2MpO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLmdyYXBoaWMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgYXJlYSA9IGludGVyYWN0aXZlLm9iamVjdC5yZWN0KHBvc1swXSAtIGJvcmRlci8yLCBwb3NbMV0gLSBib3JkZXIvMiwgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQudGlsZSAmJiBzZWxlY3RlZC50aWxlLmxvY1swXSAhPSAtMSAmJiBzZWxlY3RlZCAhPSB0aGlzLnNlbGVjdGVkICYmICFmaWVsZC5wb3NzaWJsZSh0aGlzLnNlbGVjdGVkLnRpbGUsIG9iamVjdC5sb2MpICYmICEob2JqZWN0LmxvY1swXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1swXSAmJiBvYmplY3QubG9jWzFdID09IHRoaXMuc2VsZWN0ZWQubG9jWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25tb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcywgc2VsZWN0ZWQsIGZpZWxkLmdldChvYmplY3QubG9jKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IG9iamVjdC5hcmVhID0gYXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBhcmVhLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEludGVyYWN0aW9uTWFwKCl7XHJcbiAgICAgICAgbGV0IG1hcCA9IHtcclxuICAgICAgICAgICAgdGlsZW1hcDogW10sIFxyXG4gICAgICAgICAgICBncmlkbWFwOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZC5kYXRhLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBtYXAudGlsZW1hcFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPGZpZWxkLmRhdGEud2lkdGg7aisrKXtcclxuICAgICAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldW2pdID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvbk9iamVjdChmaWVsZC5nZXQoW2osIGldKSwgaiwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtJbnB1dH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZFwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG5ldyBGaWVsZCg0LCA0KTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHNjb3JlOiAwLFxyXG4gICAgICAgICAgICBtb3ZlY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWJzb3JiZWQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZWxkLnBvc3NpYmxlKHNlbGVjdGVkLnRpbGUsIHRpbGVpbmZvLmxvYykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQubW92ZShzZWxlY3RlZC5sb2MsIHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy90aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KG9sZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zY29yZSArPSB0aWxlLnZhbHVlICsgb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICB0aWxlLnZhbHVlICo9IDI7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd01vdmVkKHRpbGUpO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8PSAwLjUgfHwgKHRoaXMuZGF0YS5tb3ZlY291bnRlcisrKSAlIDIgPT0gMCAmJiB0aGlzLmRhdGEuYWJzb3JiZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZighdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aWxlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnRpbGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KXtcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc3RhcnQucHVzaCh0aGlzLm9uc3RhcnRldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc2VsZWN0LnB1c2godGhpcy5vbnNlbGVjdGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25tb3ZlLnB1c2godGhpcy5vbm1vdmVldmVudCk7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpY3M7XHJcbiAgICAgICAgZ3JhcGhpY3MuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLmNyZWF0ZUNvbXBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5idWlsZEludGVyYWN0aW9uTWFwKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5maWVsZC5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIC8vdGhpcy5ncmFwaGljLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZXBhdXNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVvdmVyKHJlYXNvbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaW5rKGRpZmYpeyAvLz8/P1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge01hbmFnZXJ9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBrbW92ZW1hcCA9IFtcclxuICAgIFstMiwgLTFdLFxyXG4gICAgWyAyLCAtMV0sXHJcbiAgICBbLTIsICAxXSxcclxuICAgIFsgMiwgIDFdLFxyXG4gICAgXHJcbiAgICBbLTEsIC0yXSxcclxuICAgIFsgMSwgLTJdLFxyXG4gICAgWy0xLCAgMl0sXHJcbiAgICBbIDEsICAyXVxyXG5dO1xyXG5cclxubGV0IHJkaXJzID0gW1xyXG4gICAgWyAwLCAgMV0sIC8vZG93blxyXG4gICAgWyAwLCAtMV0sIC8vdXBcclxuICAgIFsgMSwgIDBdLCAvL2xlZnRcclxuICAgIFstMSwgIDBdICAvL3JpZ2h0XHJcbl07XHJcblxyXG5sZXQgYmRpcnMgPSBbXHJcbiAgICBbIDEsICAxXSxcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAgMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBhZGlycyA9IFtcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnMgPSBbXHJcbiAgICBbIDAsIC0xXVxyXG5dO1xyXG5cclxuXHJcbmxldCBwYWRpcnNOZWcgPSBbXHJcbiAgICBbIDEsIDFdLFxyXG4gICAgWy0xLCAxXVxyXG5dO1xyXG5cclxubGV0IHBtZGlyc05lZyA9IFtcclxuICAgIFsgMCwgMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcWRpcnMgPSByZGlycy5jb25jYXQoYmRpcnMpOyAvL21heSBub3QgbmVlZFxyXG5cclxubGV0IHRjb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwIC8vV2hpdGUgPSAwLCBCbGFjayA9IDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2MgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChmaWVsZCwgeCwgeSl7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoKHRoaXMsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQocmVsYXRpdmUgPSBbMCwgMF0pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSByZXR1cm4gdGhpcy5maWVsZC5nZXQoW1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzBdICsgcmVsYXRpdmVbMF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gKyByZWxhdGl2ZVsxXVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGx0byl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQubW92ZSh0aGlzLmRhdGEubG9jLCBsdG8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQoKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5wdXQodGhpcy5kYXRhLmxvYywgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGxvYyhhKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0gYVswXTtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0gYVsxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FjaGVMb2MoKXtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlswXSA9IHRoaXMuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMV0gPSB0aGlzLmRhdGEubG9jWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRGaWVsZChmaWVsZCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRMb2MoW3gsIHldKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0geDtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVwbGFjZUlmTmVlZHMoKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA+PSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0LTEgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA8PSAwICYmIHRoaXMuZGF0YS5zaWRlID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRQYXduQXR0YWNrVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuZ2V0UGF3bk1vdmVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldEtuaWdodFBvc3NpYmxlVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgYmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA0KSB7IC8vUXVlZW5cclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcWRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXROZWlnaHRib3JUaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBnZXRLbmlnaHRQb3NzaWJsZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGttb3ZlbWFwLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgbG9jID0ga21vdmVtYXBbaV07XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChsb2MpO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5laWdodGJvclRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0sIGRpclsxXV0pO1xyXG4gICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpcmVjdGlvblRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxtYXh0O2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChbZGlyWzBdICogaSwgZGlyWzFdICogaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICAgICAgaWYgKHRpZi50aWxlIHx8ICF0aWYpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bkF0dGFja1RpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwYWRpcnMgOiBwYWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgdGlmLnRpbGUpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bk1vdmVUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IGRpcnMgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGRpcnNbaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmICYmICF0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
