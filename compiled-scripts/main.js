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
        key: "checkAny",
        value: function checkAny(value) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tile = _step.value;

                    if (tile.value >= value) return true;
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

            return false;
        }
    }, {
        key: "anyPossible",
        value: function anyPossible() {
            var anypossible = 0;
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.tiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var tile = _step2.value;

                            if (this.possible(tile, [j, i])) anypossible++;
                            if (anypossible > 0) return true;
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
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.tiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tile = _step3.value;

                    if (sames.indexOf(tile.value) < 0) {
                        sames.push(tile.value);
                    } else {
                        return false;
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

            return true;
        }
    }, {
        key: "genPiece",
        value: function genPiece(exceptPawn) {
            var pawnr = Math.random();
            if (pawnr < 0.4 && !exceptPawn) {
                return 0;
            }

            var rnd = Math.random();
            if (rnd >= 0.0 && rnd < 0.3) {
                return 1;
            } else if (rnd >= 0.3 && rnd < 0.6) {
                return 2;
            } else if (rnd >= 0.6 && rnd < 0.8) {
                return 3;
            } else if (rnd >= 0.8 && rnd < 0.9) {
                return 4;
            }
            return 5;
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
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = this.ontileremove[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var f = _step4.value;
                                f(tile);
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
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = this.ontileabsorption[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var f = _step5.value;
                                f(old.tile, tile);
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

                    this.clear(lto, tile).put(lto, tile);
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = this.ontilemove[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _f = _step6.value;
                            _f(tile);
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
                            var _iteratorNormalCompletion7 = true;
                            var _didIteratorError7 = false;
                            var _iteratorError7 = undefined;

                            try {
                                for (var _iterator7 = this.ontileremove[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                    var f = _step7.value;
                                    f(tile, bytile);
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
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.ontileadd[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var f = _step8.value;
                        f(tile);
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

Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype;
    elproto.toFront = function () {
        this.prependTo(this.paper);
    };
    elproto.toBack = function () {
        this.appendTo(this.paper);
    };
});

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

        this.scoreboard = document.querySelector("#score");

        this.params = {
            border: 4,
            decorationWidth: 10,
            grid: {
                width: 600,
                height: 600
            },
            tile: {
                //width: 128, 
                //height: 128, 
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
            {
                var rect = decorationLayer.object.rect(0, 0, tw, th, 0, 0);
                rect.attr({
                    fill: "rgb(240, 224, 192)"
                });
            }

            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;

            //Decorative chess field
            this.chessfield = [];
            for (var y = 0; y < height; y++) {
                this.chessfield[y] = [];
                for (var x = 0; x < width; x++) {
                    var params = this.params;
                    var pos = this.calculateGraphicsPosition([x, y]);
                    var border = 0; //this.params.border;

                    var s = this.graphicsLayers[0].object;
                    var f = s.group();

                    var radius = 5;
                    var _rect = f.rect(0, 0, params.tile.width + border, params.tile.height + border, radius, radius);
                    _rect.attr({
                        "fill": x % 2 != y % 2 ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                    });
                    f.transform("translate(" + (pos[0] - border / 2) + ", " + (pos[1] - border / 2) + ")");
                }
            }

            {
                var _rect2 = decorationLayer.object.rect(-this.params.decorationWidth / 2, -this.params.decorationWidth / 2, tw + this.params.decorationWidth, th + this.params.decorationWidth, 5, 5);
                _rect2.attr({
                    fill: "transparent",
                    stroke: "rgb(128, 64, 32)",
                    "stroke-width": this.params.decorationWidth
                });
            }
        }
    }, {
        key: "createComposition",
        value: function createComposition() {
            this.graphicsLayers.splice(0, this.graphicsLayers.length);
            var scene = this.snap.group();
            scene.transform("translate(" + this.params.decorationWidth + ", " + this.params.decorationWidth + ")");

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
            this.graphicsLayers[5] = {
                object: scene.group()
            };

            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;

            this.params.tile.width = (this.params.grid.width - this.params.border * (width + 1) - this.params.decorationWidth * 2) / width;
            this.params.tile.height = (this.params.grid.height - this.params.border * (height + 1) - this.params.decorationWidth * 2) / height;

            for (var y = 0; y < height; y++) {
                this.visualization[y] = [];
                for (var x = 0; x < width; x++) {
                    this.visualization[y][x] = this.createSemiVisible([x, y]);
                }
            }

            this.receiveTiles();
            this.createDecoration();
            this.createGameOver();
            this.createVictory();
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
                "fill": "rgba(255, 224, 224, 0.8)"
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
                _this2.hideGameover();
            });

            var button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(224, 192, 192, 0.8)"
            });

            var buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            this.gameoverscreen = screen;
            screen.attr({ "visibility": "hidden" });

            return this;
        }
    }, {
        key: "createVictory",
        value: function createVictory() {
            var _this3 = this;

            var screen = this.graphicsLayers[5].object;

            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;

            var bg = screen.rect(0, 0, tw, th, 5, 5);
            bg.attr({
                "fill": "rgba(224, 224, 256, 0.8)"
            });
            var got = screen.text(tw / 2, th / 2 - 30, "You won! You got " + this.manager.data.conditionValue + "!");
            got.attr({
                "font-size": "30",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            {
                var buttonGroup = screen.group();
                buttonGroup.transform("translate(" + (tw / 2 + 5) + ", " + (th / 2 + 20) + ")");
                buttonGroup.click(function () {
                    _this3.manager.restart();
                    _this3.hideVictory();
                });

                var button = buttonGroup.rect(0, 0, 100, 30);
                button.attr({
                    "fill": "rgba(128, 128, 255, 0.8)"
                });

                var buttonText = buttonGroup.text(50, 20, "New game");
                buttonText.attr({
                    "font-size": "15",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS"
                });
            }

            {
                var _buttonGroup = screen.group();
                _buttonGroup.transform("translate(" + (tw / 2 - 105) + ", " + (th / 2 + 20) + ")");
                _buttonGroup.click(function () {
                    _this3.hideVictory();
                });

                var _button = _buttonGroup.rect(0, 0, 100, 30);
                _button.attr({
                    "fill": "rgba(128, 128, 255, 0.8)"
                });

                var _buttonText = _buttonGroup.text(50, 20, "Continue...");
                _buttonText.attr({
                    "font-size": "15",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS"
                });
            }

            this.victoryscreen = screen;
            screen.attr({ "visibility": "hidden" });

            return this;
        }
    }, {
        key: "showVictory",
        value: function showVictory() {
            this.victoryscreen.attr({ "visibility": "visible" });
            this.victoryscreen.attr({
                "opacity": "0"
            });
            this.victoryscreen.animate({
                "opacity": "1"
            }, 1000, mina.easein, function () {});

            return this;
        }
    }, {
        key: "hideVictory",
        value: function hideVictory() {
            var _this4 = this;

            this.victoryscreen.attr({
                "opacity": "1"
            });
            this.victoryscreen.animate({
                "opacity": "0"
            }, 500, mina.easein, function () {
                _this4.victoryscreen.attr({ "visibility": "hidden" });
            });
            return this;
        }
    }, {
        key: "showGameover",
        value: function showGameover() {
            this.gameoverscreen.attr({ "visibility": "visible" });
            this.gameoverscreen.attr({
                "opacity": "0"
            });
            this.gameoverscreen.animate({
                "opacity": "1"
            }, 1000, mina.easein, function () {});
            return this;
        }
    }, {
        key: "hideGameover",
        value: function hideGameover() {
            var _this5 = this;

            this.gameoverscreen.attr({
                "opacity": "1"
            });
            this.gameoverscreen.animate({
                "opacity": "0"
            }, 500, mina.easein, function () {
                _this5.gameoverscreen.attr({ "visibility": "hidden" });
            });
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
            var needup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var tile = obj.tile;
            var pos = this.calculateGraphicsPosition(tile.loc);
            var group = obj.element;
            //group.transform(`translate(${pos[0]}, ${pos[1]})`);

            if (needup) group.toFront();
            group.animate({
                "transform": "translate(" + pos[0] + ", " + pos[1] + ")"
            }, 80, mina.easein, function () {});
            obj.pos = pos;

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

            obj.text.attr({
                "font-size": this.params.tile.width * 0.15, //"16px",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS",
                "color": "black"
            });

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
            this.changeStyle(tile, true);
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
            var _this6 = this;

            if (this.selectObject(tile)) return null;

            var object = {
                tile: tile
            };

            var params = this.params;
            var pos = this.calculateGraphicsPosition(tile.loc);

            var s = this.graphicsLayers[1].object;
            var radius = 5;
            var rect = s.rect(0, 0, params.tile.width, params.tile.height, radius, radius);

            var fillsizew = params.tile.width * (0.5 - 0.2);
            var fillsizeh = fillsizew; //params.tile.height * (1.0 - 0.2);

            var icon = s.image("", fillsizew, fillsizeh, params.tile.width - fillsizew * 2, params.tile.height - fillsizeh * 2);

            var text = s.text(params.tile.width / 2, params.tile.height / 2 + params.tile.height * 0.35, "TEST");
            var group = s.group(rect, icon, text);

            group.transform("\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n            scale(0.01, 0.01) \n            translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n        ");
            group.attr({ "opacity": "0" });

            group.animate({
                "transform": "\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n            scale(1.0, 1.0) \n            translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n            ",
                "opacity": "1"
            }, 80, mina.easein, function () {});

            object.pos = pos;
            object.element = group;
            object.rectangle = rect;
            object.icon = icon;
            object.text = text;
            object.remove = function () {
                _this6.graphicsTiles.splice(_this6.graphicsTiles.indexOf(object), 1);

                group.animate({
                    "transform": "\n                translate(" + object.pos[0] + ", " + object.pos[1] + ") \n                translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n                scale(0.01, 0.01) \n                translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n                ",
                    "opacity": "0"
                }, 80, mina.easein, function () {
                    object.element.remove();
                });
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
        key: "updateScore",
        value: function updateScore() {
            this.scoreboard.innerHTML = this.manager.data.score;
        }
    }, {
        key: "attachManager",
        value: function attachManager(manager) {
            var _this7 = this;

            this.field = manager.field;
            this.manager = manager;

            this.field.ontileremove.push(function (tile) {
                //when tile removed
                _this7.removeObject(tile);
            });
            this.field.ontilemove.push(function (tile) {
                //when tile moved
                _this7.changeStyle(tile);
            });
            this.field.ontileadd.push(function (tile) {
                //when tile added
                _this7.pushTile(tile);
            });
            this.field.ontileabsorption.push(function (old, tile) {
                _this7.updateScore();
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

        this.restartbutton.addEventListener("click", function () {
            _this.manager.restart();
        });
    }

    _createClass(Input, [{
        key: "attachManager",
        value: function attachManager(manager) {
            this.field = manager.field;
            this.manager = manager;

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
            var _this2 = this;

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
                if (!_this2.selected) {
                    var selected = field.get(object.loc);
                    if (selected) {
                        _this2.selected = selected;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _this2.port.onselect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var f = _step.value;
                                f(_this2, _this2.selected);
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
                    if (_selected && _selected.tile && _selected.tile.loc[0] != -1 && _selected != _this2.selected && !field.possible(_this2.selected.tile, object.loc) && !(object.loc[0] == _this2.selected.loc[0] && object.loc[1] == _this2.selected.loc[1])) {
                        _this2.selected = _selected;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _this2.port.onselect[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _f = _step2.value;
                                _f(_this2, _this2.selected);
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
                        var _selected2 = _this2.selected;
                        _this2.selected = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this2.port.onmove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _f2 = _step3.value;

                                _f2(_this2, _selected2, field.get(object.loc));
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
            victory: false,
            score: 0,
            movecounter: 0,
            absorbed: 0,
            conditionValue: 2048
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
            if (tile.data.side != old.data.side) {
                tile.value *= 2;
            } else {
                tile.data.side = tile.data.side == 1 ? 0 : 1;
            }
            _this.data.score += tile.value;
            _this.data.absorbed = true;
            _this.graphic.removeObject(old);
            _this.graphic.updateScore();
        });
        this.field.ontileremove.push(function (tile) {
            //when tile removed
            _this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push(function (tile) {
            //when tile moved
            _this.graphic.showMoved(tile);
            if (Math.random() <= 0.5) {
                _this.field.generateTile();
            }
            _this.data.absorbed = false;

            if (!_this.field.anyPossible()) _this.graphic.showGameover();
            if (_this.checkCondition() && !_this.data.victory) {
                _this.resolveVictory();
            }
        });
        this.field.ontileadd.push(function (tile) {
            //when tile added
            _this.graphic.pushTile(tile);
        });
    }

    _createClass(Manager, [{
        key: "resolveVictory",
        value: function resolveVictory() {
            if (!this.data.victory) {
                this.data.victory = true;
                this.graphic.showVictory();
            }
            return this;
        }
    }, {
        key: "checkCondition",
        value: function checkCondition() {
            return this.field.checkAny(this.data.conditionValue);
        }
    }, {
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
            this.data.victory = false;
            this.graphic.updateScore();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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LE1BQU0sS0FBSyxHQUFMLENBQVMsS0FBSyxDQUFMLENBQVQsQ0FBVjtBQUNBLG9CQUFJLE9BQU8sQ0FBQyxJQUFJLElBQWhCLEVBQXNCLFdBQVcsSUFBWCxDQUFnQixHQUFoQjtBQUN6QjtBQUNELG1CQUFPLFVBQVA7QUFDSDs7OzRCQTVNVTtBQUNQLG1CQUFPLEtBQUssSUFBTCxDQUFVLEtBQWpCO0FBQ0gsUzswQkFFUyxDLEVBQUU7QUFDUixpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUFsQjtBQUNIOzs7NEJBaUNRO0FBQ0wsbUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBakI7QUFDSCxTOzBCQUVPLEMsRUFBRTtBQUNOLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0g7Ozs7OztRQWlLRyxJLEdBQUEsSTs7O0FDaFJSOztBQUNBOztBQUNBOztBQUNBOztBQUVBLENBQUMsWUFBVTtBQUNQLFFBQUksVUFBVSxzQkFBZDtBQUNBLFFBQUksV0FBVyw4QkFBZjtBQUNBLFFBQUksUUFBUSxrQkFBWjs7QUFFQSxhQUFTLFdBQVQsQ0FBcUIsS0FBckI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsRUFBQyxrQkFBRCxFQUFXLFlBQVgsRUFBakI7QUFDQSxZQUFRLFNBQVIsR0FQTyxDQU9jO0FBQ3hCLENBUkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IodyA9IDQsIGggPSA0KXtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3LCBoZWlnaHQ6IGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy50aWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvID0ge1xyXG4gICAgICAgICAgICB0aWxlSUQ6IC0xLFxyXG4gICAgICAgICAgICB0aWxlOiBudWxsLFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9udGlsZXJlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWRkID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhYnNvcnB0aW9uID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoZWNrQW55KHZhbHVlKXtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPj0gdmFsdWUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFueVBvc3NpYmxlKCl7XHJcbiAgICAgICAgbGV0IGFueXBvc3NpYmxlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGFueXBvc3NpYmxlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZVBvc3NpYmxlTGlzdCh0aWxlKXtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGxpc3Q7IC8vZW1wdHlcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGxpc3QucHVzaCh0aGlzLmdldChbaiwgaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcG9zc2libGUodGlsZSwgbHRvKXtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVpID0gdGhpcy5nZXQobHRvKTtcclxuICAgICAgICBsZXQgYXRpbGUgPSB0aWxlaS50aWxlO1xyXG5cclxuICAgICAgICBsZXQgcG9zc2libGVzID0gIWF0aWxlIHx8IGF0aWxlLnZhbHVlID09IHRpbGUudmFsdWU7XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gIWF0aWxlIHx8IGF0aWxlLmRhdGEuc2lkZSAhPSB0aWxlLmRhdGEuc2lkZTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aWxlLnBvc3NpYmxlKGx0byk7XHJcbiAgICAgICAgcG9zc2libGVzID0gcG9zc2libGVzICYmIHBpZWNlO1xyXG4gICAgICAgIC8vcG9zc2libGVzID0gcG9zc2libGVzICYmIG9wcG9uZW50OyAvL0hhcmRjb3JlIG1vZGVcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuUGllY2UoZXhjZXB0UGF3bil7XHJcbiAgICAgICAgbGV0IHBhd25yID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZiAocGF3bnIgPCAwLjQgJiYgIWV4Y2VwdFBhd24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZihybmQgPj0gMC4wICYmIHJuZCA8IDAuMyl7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC4zICYmIHJuZCA8IDAuNil7XHJcbiAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC42ICYmIHJuZCA8IDAuOCl7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC44ICYmIHJuZCA8IDAuOSl7XHJcbiAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVRpbGUoKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG5ldyBUaWxlKCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vQ291bnQgbm90IG9jY3VwaWVkXHJcbiAgICAgICAgbGV0IG5vdE9jY3VwaWVkID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXVtqXS50aWxlKSBub3RPY2N1cGllZC5wdXNoKHRoaXMuZmllbGRzW2ldW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKG5vdE9jY3VwaWVkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSB0aGlzLmdlblBpZWNlKCk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IE1hdGgucmFuZG9tKCkgPCAwLjI1ID8gNCA6IDI7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgdGlsZS5hdHRhY2godGhpcywgbm90T2NjdXBpZWRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm90T2NjdXBpZWQubGVuZ3RoKV0ubG9jKTsgLy9wcmVmZXIgZ2VuZXJhdGUgc2luZ2xlXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vTm90IHBvc3NpYmxlIHRvIGdlbmVyYXRlIG5ldyB0aWxlc1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKDAsIHRoaXMudGlsZXMubGVuZ3RoKTtcclxuICAgICAgICAvL3RoaXMuZmllbGRzLnNwbGljZSgwLCB0aGlzLmZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV0pIHRoaXMuZmllbGRzW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZHNbaV1bal0gPyB0aGlzLmZpZWxkc1tpXVtqXS50aWxlIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUpeyAvL2lmIGhhdmVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07IC8vcmV0dXJuIHJlZmVyZW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8sIHtcclxuICAgICAgICAgICAgbG9jOiBbbG9jWzBdLCBsb2NbMV1dXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dChsb2MsIHRpbGUpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBpZiAobG9jWzBdID09IGx0b1swXSAmJiBsb2NbMV0gPT0gbHRvWzFdKSByZXR1cm4gdGhpczsgLy9TYW1lIGxvY2F0aW9uXHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzBdID0gdGlsZS5kYXRhLmxvY1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzFdID0gdGlsZS5kYXRhLmxvY1sxXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEubG9jWzFdID0gbHRvWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBvbGQgPSB0aGlzLmZpZWxkc1tsdG9bMV1dW2x0b1swXV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWJzb3JwdGlvbikgZihvbGQudGlsZSwgdGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIobHRvLCB0aWxlKS5wdXQobHRvLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhcihsb2MsIGJ5dGlsZSA9IG51bGwpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCJpY29ucy9XaGl0ZVBhd24ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS25pZ2h0LnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUJpc2hvcC5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVSb29rLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVF1ZWVuLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtpbmcucG5nXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcImljb25zL0JsYWNrUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1Jvb2sucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrS2luZy5wbmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA2MDAsIFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2MDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMiAmJiB0aWxlLnZhbHVlIDwgNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMTkyLCAxMjgpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA0ICYmIHRpbGUudmFsdWUgPCA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDk2KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gOCAmJiB0aWxlLnZhbHVlIDwgMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDk2LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDE2ICYmIHRpbGUudmFsdWUgPCAzMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMzIgJiYgdGlsZS52YWx1ZSA8IDY0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDY0ICYmIHRpbGUudmFsdWUgPCAxMjg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDAsIDApXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTI4ICYmIHRpbGUudmFsdWUgPCAyNTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDI1NiAmJiB0aWxlLnZhbHVlIDwgNTEyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxOTIsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA1MTIgJiYgdGlsZS52YWx1ZSA8IDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEwMjQgJiYgdGlsZS52YWx1ZSA8IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIzMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbWlWaXNpYmxlKGxvYyl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgbG9jOiBsb2NcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKGxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1syXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNDAsIDIyNCwgMTkyKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgLy9EZWNvcmF0aXZlIGNoZXNzIGZpZWxkXHJcbiAgICAgICAgdGhpcy5jaGVzc2ZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2ZpZWxkW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9yZGVyID0gMDsvL3RoaXMucGFyYW1zLmJvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBzLmdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmLnJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcixcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxsXCI6IHggJSAyICE9IHkgJSAyID8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIiA6IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZi50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXS1ib3JkZXIvMn0sICR7cG9zWzFdLWJvcmRlci8yfSlgKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdChcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgdHcgKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aCArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCwgXHJcbiAgICAgICAgICAgICAgICA1LCBcclxuICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21wb3NpdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMuc3BsaWNlKDAsIHRoaXMuZ3JhcGhpY3NMYXllcnMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNuYXAuZ3JvdXAoKTtcclxuICAgICAgICBzY2VuZS50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0sICR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSlgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s1XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS53aWR0aCAgPSAodGhpcy5wYXJhbXMuZ3JpZC53aWR0aCAgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAod2lkdGggKyAxKSAgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyB3aWR0aDtcclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLmhlaWdodCA9ICh0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCAtIHRoaXMucGFyYW1zLmJvcmRlciAqIChoZWlnaHQgKyAxKSAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIGhlaWdodDtcclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZU92ZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZpY3RvcnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZUdhbWVPdmVyKCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyNTUsIDIyNCwgMjI0LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiAtIDUwfSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuID0gc2NyZWVuO1xyXG4gICAgICAgIHNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNyZWF0ZVZpY3RvcnkoKXtcclxuICAgICAgICBsZXQgc2NyZWVuID0gdGhpcy5ncmFwaGljc0xheWVyc1s1XS5vYmplY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICsgYikgKiB3ICsgYjtcclxuICAgICAgICBsZXQgdGggPSAodGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgKyBiKSAqIGggKyBiO1xyXG5cclxuICAgICAgICBsZXQgYmcgPSBzY3JlZW4ucmVjdCgwLCAwLCB0dywgdGgsIDUsIDUpO1xyXG4gICAgICAgIGJnLmF0dHIoe1xyXG4gICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMjI0LCAyNTYsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBnb3QgPSBzY3JlZW4udGV4dCh0dyAvIDIsIHRoIC8gMiAtIDMwLCBcIllvdSB3b24hIFlvdSBnb3QgXCIgKyB0aGlzLm1hbmFnZXIuZGF0YS5jb25kaXRpb25WYWx1ZSArIFwiIVwiKTtcclxuICAgICAgICBnb3QuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMzBcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyICsgNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiAtIDEwNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDEyOCwgMTI4LCAyNTUsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiQ29udGludWUuLi5cIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1ZpY3RvcnkoKXtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDEwMDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZVZpY3RvcnkoKXtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSwgNTAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0dhbWVvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJ9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUdhbWVvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSwgNTAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE9iamVjdCh0aWxlKXtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuZ3JhcGhpY3NUaWxlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5ncmFwaGljc1RpbGVzW2ldLnRpbGUgPT0gdGlsZSkgcmV0dXJuIHRoaXMuZ3JhcGhpY3NUaWxlc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoYW5nZVN0eWxlT2JqZWN0KG9iaiwgbmVlZHVwID0gZmFsc2Upe1xyXG4gICAgICAgIGxldCB0aWxlID0gb2JqLnRpbGU7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gb2JqLmVsZW1lbnQ7XHJcbiAgICAgICAgLy9ncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgaWYgKG5lZWR1cCkgZ3JvdXAudG9Gcm9udCgpO1xyXG4gICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWBcclxuICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5wb3MgPSBwb3M7XHJcblxyXG4gICAgICAgIGxldCBzdHlsZSA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBfc3R5bGUgb2YgdGhpcy5wYXJhbXMudGlsZS5zdHlsZXMpIHtcclxuICAgICAgICAgICAgaWYoX3N0eWxlLmNvbmRpdGlvbi5jYWxsKG9iai50aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBfc3R5bGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XCJ0ZXh0XCI6IGAke3RpbGUudmFsdWV9YH0pO1xyXG4gICAgICAgIGlmIChzdHlsZS5mb250KSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIHN0eWxlLmZvbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iai5pY29uLmF0dHIoe1wieGxpbms6aHJlZlwiOiBvYmoudGlsZS5kYXRhLnNpZGUgPT0gMCA/IGljb25zZXRbb2JqLnRpbGUuZGF0YS5waWVjZV0gOiBpY29uc2V0QmxhY2tbb2JqLnRpbGUuZGF0YS5waWVjZV19KTtcclxuXHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IHRoaXMucGFyYW1zLnRpbGUud2lkdGggKiAwLjE1LCAvL1wiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFzdHlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgb2JqLnJlY3RhbmdsZS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogc3R5bGUuZmlsbFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTdHlsZSh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmopO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgaWYgKG9iamVjdCkgb2JqZWN0LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dNb3ZlZCh0aWxlKXtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSl7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLndpZHRoICArIGJvcmRlcikgKiB4LFxyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKSAqIHlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFZpc3VhbGl6ZXIobG9jKXtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICFsb2MgfHwgXHJcbiAgICAgICAgICAgICEobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5maWVsZC5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpXHJcbiAgICAgICAgKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXN1YWxpemF0aW9uW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgdGlsZTogdGlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKHRpbGUubG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdLm9iamVjdDtcclxuICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCxcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZmlsbHNpemV3ID0gcGFyYW1zLnRpbGUud2lkdGggICogKDAuNSAtIDAuMik7XHJcbiAgICAgICAgbGV0IGZpbGxzaXplaCA9IGZpbGxzaXpldzsvL3BhcmFtcy50aWxlLmhlaWdodCAqICgxLjAgLSAwLjIpO1xyXG5cclxuICAgICAgICBsZXQgaWNvbiA9IHMuaW1hZ2UoXHJcbiAgICAgICAgICAgIFwiXCIsIFxyXG4gICAgICAgICAgICBmaWxsc2l6ZXcsIFxyXG4gICAgICAgICAgICBmaWxsc2l6ZWgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCAgLSBmaWxsc2l6ZXcgKiAyLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0IC0gZmlsbHNpemVoICogMlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCB0ZXh0ID0gcy50ZXh0KHBhcmFtcy50aWxlLndpZHRoIC8gMiwgcGFyYW1zLnRpbGUuaGVpZ2h0IC8gMiArIHBhcmFtcy50aWxlLmhlaWdodCAqIDAuMzUsIFwiVEVTVFwiKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QsIGljb24sIHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgc2NhbGUoMC4wMSwgMC4wMSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgYCk7XHJcbiAgICAgICAgZ3JvdXAuYXR0cih7XCJvcGFjaXR5XCI6IFwiMFwifSk7XHJcblxyXG4gICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcclxuICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDEuMCwgMS4wKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqZWN0LnBvcyA9IHBvcztcclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5pY29uID0gaWNvbjtcclxuICAgICAgICBvYmplY3QudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgb2JqZWN0LnJlbW92ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSh0aGlzLmdyYXBoaWNzVGlsZXMuaW5kZXhPZihvYmplY3QpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXHJcbiAgICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHtvYmplY3QucG9zWzBdfSwgJHtvYmplY3QucG9zWzFdfSkgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgICAgICBzY2FsZSgwLjAxLCAwLjAxKSBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgICAgIG9iamVjdC5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEludGVyYWN0aW9uTGF5ZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaGljc0xheWVyc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNob3dlZCgpe1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgZm9yIChsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICB2aXMuYXJlYS5hdHRyKHtmaWxsOiBcInRyYW5zcGFyZW50XCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5pbnB1dC5zZWxlY3RlZC50aWxlO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlLmxvYyk7XHJcbiAgICAgICAgaWYgKG9iamVjdCl7XHJcbiAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMjU1LCAwLCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Bvc3NpYmxlKHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBmb3IobGV0IHRpbGVpbmZvIG9mIHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZWluZm8udGlsZTtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICBpZihvYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgwLCAyNTUsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2VpdmVUaWxlcygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaWxlcygpO1xyXG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMubWFuYWdlci50aWxlcztcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyVGlsZXMoKXtcclxuICAgICAgICBmb3IgKGxldCB0aWxlIG9mIHRoaXMuZ3JhcGhpY3NUaWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlKSB0aWxlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNjb3JlKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkLmlubmVySFRNTCA9IHRoaXMubWFuYWdlci5kYXRhLnNjb3JlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWJzb3JwdGlvbi5wdXNoKChvbGQsIHRpbGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaElucHV0KGlucHV0KXsgLy9NYXkgcmVxdWlyZWQgZm9yIHNlbmQgb2JqZWN0cyBhbmQgbW91c2UgZXZlbnRzXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIGlucHV0LmF0dGFjaEdyYXBoaWNzKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB7R3JhcGhpY3NFbmdpbmV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5jbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnQgPSB7XHJcbiAgICAgICAgICAgIG9ubW92ZTogW10sXHJcbiAgICAgICAgICAgIG9uc3RhcnQ6IFtdLFxyXG4gICAgICAgICAgICBvbnNlbGVjdDogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoR3JhcGhpY3MoZ3JhcGhpYyl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QodGlsZWluZm8sIHgsIHkpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aWxlaW5mbzogdGlsZWluZm8sXHJcbiAgICAgICAgICAgIGxvYzogW3gsIHldXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSBncmFwaGljLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24ob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMuZ3JhcGhpYy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCBhcmVhID0gaW50ZXJhY3RpdmUub2JqZWN0LnJlY3QocG9zWzBdIC0gYm9yZGVyLzIsIHBvc1sxXSAtIGJvcmRlci8yLCBwYXJhbXMudGlsZS53aWR0aCArIGJvcmRlciwgcGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKS5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiBzZWxlY3RlZC50aWxlICYmIHNlbGVjdGVkLnRpbGUubG9jWzBdICE9IC0xICYmIHNlbGVjdGVkICE9IHRoaXMuc2VsZWN0ZWQgJiYgIWZpZWxkLnBvc3NpYmxlKHRoaXMuc2VsZWN0ZWQudGlsZSwgb2JqZWN0LmxvYykgJiYgIShvYmplY3QubG9jWzBdID09IHRoaXMuc2VsZWN0ZWQubG9jWzBdICYmIG9iamVjdC5sb2NbMV0gPT0gdGhpcy5zZWxlY3RlZC5sb2NbMV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbm1vdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLCBzZWxlY3RlZCwgZmllbGQuZ2V0KG9iamVjdC5sb2MpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gb2JqZWN0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFyZWEuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkSW50ZXJhY3Rpb25NYXAoKXtcclxuICAgICAgICBsZXQgbWFwID0ge1xyXG4gICAgICAgICAgICB0aWxlbWFwOiBbXSwgXHJcbiAgICAgICAgICAgIGdyaWRtYXA6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGZpZWxkLmRhdGEuaGVpZ2h0O2krKyl7XHJcbiAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8ZmllbGQuZGF0YS53aWR0aDtqKyspe1xyXG4gICAgICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV1bal0gPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KGZpZWxkLmdldChbaiwgaV0pLCBqLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0lucHV0fTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkXCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5jbGFzcyBNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbmV3IEZpZWxkKDQsIDQpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmljdG9yeTogZmFsc2UsIFxyXG4gICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgbW92ZWNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFic29yYmVkOiAwLCBcclxuICAgICAgICAgICAgY29uZGl0aW9uVmFsdWU6IDIwNDhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZWxkLnBvc3NpYmxlKHNlbGVjdGVkLnRpbGUsIHRpbGVpbmZvLmxvYykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQubW92ZShzZWxlY3RlZC5sb2MsIHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy90aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBpZiAodGlsZS5kYXRhLnNpZGUgIT0gb2xkLmRhdGEuc2lkZSkge1xyXG4gICAgICAgICAgICAgICAgdGlsZS52YWx1ZSAqPSAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0aWxlLmRhdGEuc2lkZSA9PSAxID8gMCA6IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNjb3JlICs9IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3Qob2xkKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd01vdmVkKHRpbGUpO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8PSAwLjUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZighdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmNoZWNrQ29uZGl0aW9uKCkgJiYgIXRoaXMuZGF0YS52aWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRpbGVzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQudGlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZVZpY3RvcnkoKXtcclxuICAgICAgICBpZighdGhpcy5kYXRhLnZpY3Rvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93VmljdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbmRpdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLmNoZWNrQW55KHRoaXMuZGF0YS5jb25kaXRpb25WYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFVzZXIoe2dyYXBoaWNzLCBpbnB1dH0pe1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zdGFydC5wdXNoKHRoaXMub25zdGFydGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zZWxlY3QucHVzaCh0aGlzLm9uc2VsZWN0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbm1vdmUucHVzaCh0aGlzLm9ubW92ZWV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljcztcclxuICAgICAgICBncmFwaGljcy5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMuY3JlYXRlQ29tcG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmlucHV0LmJ1aWxkSW50ZXJhY3Rpb25NYXAoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnYW1lc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmRhdGEuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5tb3ZlY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gMDtcclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZXBhdXNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVvdmVyKHJlYXNvbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaW5rKGRpZmYpeyAvLz8/P1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge01hbmFnZXJ9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBrbW92ZW1hcCA9IFtcclxuICAgIFstMiwgLTFdLFxyXG4gICAgWyAyLCAtMV0sXHJcbiAgICBbLTIsICAxXSxcclxuICAgIFsgMiwgIDFdLFxyXG4gICAgXHJcbiAgICBbLTEsIC0yXSxcclxuICAgIFsgMSwgLTJdLFxyXG4gICAgWy0xLCAgMl0sXHJcbiAgICBbIDEsICAyXVxyXG5dO1xyXG5cclxubGV0IHJkaXJzID0gW1xyXG4gICAgWyAwLCAgMV0sIC8vZG93blxyXG4gICAgWyAwLCAtMV0sIC8vdXBcclxuICAgIFsgMSwgIDBdLCAvL2xlZnRcclxuICAgIFstMSwgIDBdICAvL3JpZ2h0XHJcbl07XHJcblxyXG5sZXQgYmRpcnMgPSBbXHJcbiAgICBbIDEsICAxXSxcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAgMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBhZGlycyA9IFtcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnMgPSBbXHJcbiAgICBbIDAsIC0xXVxyXG5dO1xyXG5cclxuXHJcbmxldCBwYWRpcnNOZWcgPSBbXHJcbiAgICBbIDEsIDFdLFxyXG4gICAgWy0xLCAxXVxyXG5dO1xyXG5cclxubGV0IHBtZGlyc05lZyA9IFtcclxuICAgIFsgMCwgMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcWRpcnMgPSByZGlycy5jb25jYXQoYmRpcnMpOyAvL21heSBub3QgbmVlZFxyXG5cclxubGV0IHRjb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwIC8vV2hpdGUgPSAwLCBCbGFjayA9IDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2MgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChmaWVsZCwgeCwgeSl7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoKHRoaXMsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQocmVsYXRpdmUgPSBbMCwgMF0pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSByZXR1cm4gdGhpcy5maWVsZC5nZXQoW1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzBdICsgcmVsYXRpdmVbMF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gKyByZWxhdGl2ZVsxXVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGx0byl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQubW92ZSh0aGlzLmRhdGEubG9jLCBsdG8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQoKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5wdXQodGhpcy5kYXRhLmxvYywgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGxvYyhhKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0gYVswXTtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0gYVsxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FjaGVMb2MoKXtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlswXSA9IHRoaXMuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMV0gPSB0aGlzLmRhdGEubG9jWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRGaWVsZChmaWVsZCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRMb2MoW3gsIHldKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0geDtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVwbGFjZUlmTmVlZHMoKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA+PSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0LTEgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA8PSAwICYmIHRoaXMuZGF0YS5zaWRlID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRQYXduQXR0YWNrVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuZ2V0UGF3bk1vdmVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldEtuaWdodFBvc3NpYmxlVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgYmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA0KSB7IC8vUXVlZW5cclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcWRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXROZWlnaHRib3JUaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBnZXRLbmlnaHRQb3NzaWJsZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGttb3ZlbWFwLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgbG9jID0ga21vdmVtYXBbaV07XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChsb2MpO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5laWdodGJvclRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0sIGRpclsxXV0pO1xyXG4gICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpcmVjdGlvblRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxtYXh0O2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChbZGlyWzBdICogaSwgZGlyWzFdICogaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICAgICAgaWYgKHRpZi50aWxlIHx8ICF0aWYpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bkF0dGFja1RpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwYWRpcnMgOiBwYWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgdGlmLnRpbGUpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bk1vdmVUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IGRpcnMgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGRpcnNbaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmICYmICF0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
