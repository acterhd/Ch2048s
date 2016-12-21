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
    }, {
        key: "width",
        get: function get() {
            return this.data.width;
        }
    }, {
        key: "height",
        get: function get() {
            return this.data.height;
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
        this.svgel = document.querySelector(svgname);
        this.scene = null;

        this.scoreboard = document.querySelector("#score");

        this.params = {
            border: 4,
            decorationWidth: 10,
            grid: {
                width: parseFloat(this.svgel.clientWidth),
                height: parseFloat(this.svgel.clientHeight)
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
        this.undobutton = document.querySelector("#undo");

        this.restartbutton.addEventListener("click", function () {
            _this.manager.restart();
        });
        this.undobutton.addEventListener("click", function () {
            _this.selected = null;
            _this.manager.restoreState();

            _this.graphic.clearShowed();
            _this.graphic.showPossible(_this.field.tilePossibleList(selected.tile));
            _this.graphic.showSelected(selected.tile);
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
                    var _selected = field.get(object.loc);
                    if (_selected) {
                        _this2.selected = _selected;
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
                    var _selected2 = field.get(object.loc);
                    if (_selected2 && _selected2.tile && _selected2.tile.loc[0] != -1 && _selected2 != _this2.selected && !field.possible(_this2.selected.tile, object.loc) && !(object.loc[0] == _this2.selected.loc[0] && object.loc[1] == _this2.selected.loc[1])) {
                        _this2.selected = _selected2;
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
                        var _selected3 = _this2.selected;
                        _this2.selected = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this2.port.onmove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _f2 = _step3.value;

                                _f2(_this2, _selected3, field.get(object.loc));
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
        this.states = [];

        this.onstartevent = function (controller, tileinfo) {
            _this.gamestart();
        };
        this.onselectevent = function (controller, tileinfo) {
            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
        };
        this.onmoveevent = function (controller, selected, tileinfo) {
            _this.saveState();

            if (_this.field.possible(selected.tile, tileinfo.loc)) {
                _this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);
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
            var c = Math.max(Math.sqrt(_this.field.data.width / 4 * (_this.field.data.height / 4)), 1);
            for (var i = 0; i < c; i++) {
                if (Math.random() <= 0.5) {
                    _this.field.generateTile();
                }
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
        key: "saveState",
        value: function saveState() {
            var state = {
                tiles: [],
                width: this.field.width,
                height: this.field.height
            };
            state.score = this.data.score;
            state.victory = this.data.victory;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.field.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tile = _step.value;

                    state.tiles.push({
                        loc: tile.data.loc.concat([]),
                        piece: tile.data.piece,
                        side: tile.data.side,
                        value: tile.data.value,
                        prev: tile.data.prev
                    });
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

            this.states.push(state);
            return state;
        }
    }, {
        key: "restoreState",
        value: function restoreState(state) {
            if (!state) {
                state = this.states[this.states.length - 1];
                this.states.pop();
            }
            if (!state) return this;

            this.field.init();
            this.data.score = state.score;
            this.data.victory = state.victory;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = state.tiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tdat = _step2.value;

                    var tile = new _tile.Tile();
                    tile.data.piece = tdat.piece;
                    tile.data.value = tdat.value;
                    tile.data.side = tdat.side;
                    tile.data.loc = tdat.loc;
                    tile.data.prev = tdat.prev;
                    tile.attach(this.field, tdat.loc);
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

            this.graphic.updateScore();
            return this;
        }
    }, {
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
            this.data.victory = false;
            this.field.init();
            this.field.generateTile();
            this.field.generateTile();
            this.graphic.updateScore();
            this.states.splice(0, this.states.length);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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QUFDLFlBQVU7QUFDUCxRQUFJLFVBQVUsc0JBQWQ7QUFDQSxRQUFJLFdBQVcsOEJBQWY7QUFDQSxRQUFJLFFBQVEsa0JBQVo7O0FBRUEsYUFBUyxXQUFULENBQXFCLEtBQXJCO0FBQ0EsWUFBUSxRQUFSLENBQWlCLEVBQUMsa0JBQUQsRUFBVyxZQUFYLEVBQWpCO0FBQ0EsWUFBUSxTQUFSLEdBUE8sQ0FPYztBQUN4QixDQVJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKHcgPSA0LCBoID0gNCl7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogdywgaGVpZ2h0OiBoXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbyA9IHtcclxuICAgICAgICAgICAgdGlsZUlEOiAtMSxcclxuICAgICAgICAgICAgdGlsZTogbnVsbCxcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbnRpbGVyZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFkZCA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWJzb3JwdGlvbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgd2lkdGgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FueSh2YWx1ZSl7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlID49IHZhbHVlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhbnlQb3NzaWJsZSgpe1xyXG4gICAgICAgIGxldCBhbnlwb3NzaWJsZSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBhbnlwb3NzaWJsZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVQb3NzaWJsZUxpc3QodGlsZSl7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBsaXN0OyAvL2VtcHR5XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBsaXN0LnB1c2godGhpcy5nZXQoW2osIGldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHBvc3NpYmxlKHRpbGUsIGx0byl7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB0aWxlaSA9IHRoaXMuZ2V0KGx0byk7XHJcbiAgICAgICAgbGV0IGF0aWxlID0gdGlsZWkudGlsZTtcclxuXHJcbiAgICAgICAgbGV0IHBvc3NpYmxlcyA9ICFhdGlsZSB8fCBhdGlsZS52YWx1ZSA9PSB0aWxlLnZhbHVlO1xyXG4gICAgICAgIGxldCBvcHBvbmVudCA9ICFhdGlsZSB8fCBhdGlsZS5kYXRhLnNpZGUgIT0gdGlsZS5kYXRhLnNpZGU7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gdGlsZS5wb3NzaWJsZShsdG8pO1xyXG4gICAgICAgIHBvc3NpYmxlcyA9IHBvc3NpYmxlcyAmJiBwaWVjZTtcclxuICAgICAgICAvL3Bvc3NpYmxlcyA9IHBvc3NpYmxlcyAmJiBvcHBvbmVudDsgLy9IYXJkY29yZSBtb2RlXHJcblxyXG4gICAgICAgIHJldHVybiBwb3NzaWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgbm90U2FtZSgpe1xyXG4gICAgICAgIGxldCBzYW1lcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKXtcclxuICAgICAgICAgICAgaWYgKHNhbWVzLmluZGV4T2YodGlsZS52YWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBzYW1lcy5wdXNoKHRpbGUudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdlblBpZWNlKGV4Y2VwdFBhd24pe1xyXG4gICAgICAgIGxldCBwYXduciA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYgKHBhd25yIDwgMC40ICYmICFleGNlcHRQYXduKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYocm5kID49IDAuMCAmJiBybmQgPCAwLjMpe1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuMyAmJiBybmQgPCAwLjYpe1xyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNiAmJiBybmQgPCAwLjgpe1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuOCAmJiBybmQgPCAwLjkpe1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV1bal0udGlsZSkgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZihub3RPY2N1cGllZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4yNSA/IDQgOiAyO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL05vdCBwb3NzaWJsZSB0byBnZW5lcmF0ZSBuZXcgdGlsZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLnRpbGVzLnNwbGljZSgwLCB0aGlzLnRpbGVzLmxlbmd0aCk7XHJcbiAgICAgICAgLy90aGlzLmZpZWxkcy5zcGxpY2UoMCwgdGhpcy5maWVsZHMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2ldKSB0aGlzLmZpZWxkc1tpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZmllbGRzW2ldW2pdID8gdGhpcy5maWVsZHNbaV1bal0udGlsZSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZih0aWxlKXsgLy9pZiBoYXZlXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZXJlbW92ZSkgZih0aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCByZWYgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbyk7IC8vTGluayB3aXRoIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmVmLmxvYyA9IFtqLCBpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGRzW2ldW2pdID0gcmVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZ2V0VGlsZShsb2Mpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChsb2MpLnRpbGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChsb2Mpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dOyAvL3JldHVybiByZWZlcmVuY2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvLCB7XHJcbiAgICAgICAgICAgIGxvYzogW2xvY1swXSwgbG9jWzFdXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQobG9jLCB0aWxlKXtcclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgcmVmLnRpbGVJRCA9IHRpbGUuaWQ7XHJcbiAgICAgICAgICAgIHJlZi50aWxlID0gdGlsZTtcclxuICAgICAgICAgICAgdGlsZS5yZXBsYWNlSWZOZWVkcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZShsb2MsIGx0byl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA9PSBsdG9bMF0gJiYgbG9jWzFdID09IGx0b1sxXSkgcmV0dXJuIHRoaXM7IC8vU2FtZSBsb2NhdGlvblxyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEucHJldlswXSA9IHRpbGUuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEucHJldlsxXSA9IHRpbGUuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEubG9jWzBdID0gbHRvWzBdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1sxXSA9IGx0b1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2xkID0gdGhpcy5maWVsZHNbbHRvWzFdXVtsdG9bMF1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZC50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFic29ycHRpb24pIGYob2xkLnRpbGUsIHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKGx0bywgdGlsZSkucHV0KGx0bywgdGlsZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlbW92ZSkgZih0aWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIobG9jLCBieXRpbGUgPSBudWxsKXtcclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgaWYgKHJlZi50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHJlZi50aWxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZHggPSB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUuc2V0TG9jKFstMSwgLTFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZXJlbW92ZSkgZih0aWxlLCBieXRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoKHRpbGUsIGxvYz1bMCwgMF0pe1xyXG4gICAgICAgIGlmKHRpbGUgJiYgdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVzLnB1c2godGlsZSk7XHJcbiAgICAgICAgICAgIHRpbGUuc2V0RmllbGQodGhpcykuc2V0TG9jKGxvYykucHV0KCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhZGQpIGYodGlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0ZpZWxkfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQgaWNvbnNldCA9IFtcclxuICAgIFwiaWNvbnMvV2hpdGVQYXduLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtuaWdodC5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVCaXNob3AucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlUm9vay5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVRdWVlbi5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLaW5nLnBuZ1wiXHJcbl07XHJcblxyXG5sZXQgaWNvbnNldEJsYWNrID0gW1xyXG4gICAgXCJpY29ucy9CbGFja1Bhd24ucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrS25pZ2h0LnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0Jpc2hvcC5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tSb29rLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1F1ZWVuLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tpbmcucG5nXCJcclxuXTtcclxuXHJcblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYikge1xyXG4gICAgdmFyIGVscHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcclxuICAgIGVscHJvdG8udG9Gcm9udCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByZXBlbmRUbyh0aGlzLnBhcGVyKTtcclxuICAgIH07XHJcbiAgICBlbHByb3RvLnRvQmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxufSk7XHJcblxyXG5jbGFzcyBHcmFwaGljc0VuZ2luZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHN2Z25hbWUgPSBcIiNzdmdcIil7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlzdWFsaXphdGlvbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuc25hcCA9IFNuYXAoc3ZnbmFtZSk7XHJcbiAgICAgICAgdGhpcy5zdmdlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3ZnbmFtZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuc2NvcmVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NvcmVcIik7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zID0ge1xyXG4gICAgICAgICAgICBib3JkZXI6IDQsXHJcbiAgICAgICAgICAgIGRlY29yYXRpb25XaWR0aDogMTAsIFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudFdpZHRoKSwgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHBhcnNlRmxvYXQodGhpcy5zdmdlbC5jbGllbnRIZWlnaHQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbGU6IHtcclxuICAgICAgICAgICAgICAgIC8vd2lkdGg6IDEyOCwgXHJcbiAgICAgICAgICAgICAgICAvL2hlaWdodDogMTI4LCBcclxuICAgICAgICAgICAgICAgIHN0eWxlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCk7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5hcmVhID0gcmVjdDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlRGVjb3JhdGlvbigpe1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCAgKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC53aWR0aCA9IHR3O1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQuaGVpZ2h0ID0gdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlY29yYXRpb25MYXllciA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF07XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdCgwLCAwLCB0dywgdGgsIDAsIDApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjQwLCAyMjQsIDE5MilcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vRGVjb3JhdGl2ZSBjaGVzcyBmaWVsZFxyXG4gICAgICAgIHRoaXMuY2hlc3NmaWVsZCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3NmaWVsZFt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvcmRlciA9IDA7Ly90aGlzLnBhcmFtcy5ib3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gcy5ncm91cCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICAgICAgICAgIGxldCByZWN0ID0gZi5yZWN0KFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZmlsbFwiOiB4ICUgMiAhPSB5ICUgMiA/IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCIgOiBcInJnYmEoMCwgMCwgMCwgMC4xKVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGYudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF0tYm9yZGVyLzJ9LCAke3Bvc1sxXS1ib3JkZXIvMn0pYCk7XHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJlY3QgPSBkZWNvcmF0aW9uTGF5ZXIub2JqZWN0LnJlY3QoXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgLXRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aC8yLCBcclxuICAgICAgICAgICAgICAgIHR3ICsgdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGggKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsIFxyXG4gICAgICAgICAgICAgICAgNSwgXHJcbiAgICAgICAgICAgICAgICA1XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBcInJnYigxMjgsIDY0LCAzMilcIixcclxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tcG9zaXRpb24oKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzTGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHNjZW5lID0gdGhpcy5zbmFwLmdyb3VwKCk7XHJcbiAgICAgICAgc2NlbmUudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGh9LCAke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0pYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdID0geyAvL0RlY29yYXRpb25cclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1szXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLnRpbGUud2lkdGggID0gKHRoaXMucGFyYW1zLmdyaWQud2lkdGggIC0gdGhpcy5wYXJhbXMuYm9yZGVyICogKHdpZHRoICsgMSkgIC0gdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoKjIpIC8gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgPSAodGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAoaGVpZ2h0ICsgMSkgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyBoZWlnaHQ7XHJcblxyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XVt4XSA9IHRoaXMuY3JlYXRlU2VtaVZpc2libGUoW3gsIHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlVGlsZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZURlY29yYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVPdmVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWN0b3J5KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVHYW1lT3Zlcigpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjU1LCAyMjQsIDIyNCwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiR2FtZSBPdmVyXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSA1MH0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBpZiAoc3R5bGUuZm9udCkge1xyXG4gICAgICAgICAgICBvYmoudGV4dC5hdHRyKFwiZmlsbFwiLCBzdHlsZS5mb250KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvYmoudGV4dC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiB0aGlzLnBhcmFtcy50aWxlLndpZHRoICogMC4xNSwgLy9cIjE2cHhcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIiwgXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCJibGFja1wiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghc3R5bGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIG9iai5yZWN0YW5nbGUuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IHN0eWxlLmZpbGxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU3R5bGUodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIGlmIChvYmplY3QpIG9iamVjdC5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93TW92ZWQodGlsZSl7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pe1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS53aWR0aCAgKyBib3JkZXIpICogeCxcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikgKiB5XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RWaXN1YWxpemVyKGxvYyl7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAhbG9jIHx8IFxyXG4gICAgICAgICAgICAhKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZmllbGQuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KVxyXG4gICAgICAgICkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzdWFsaXphdGlvbltsb2NbMV1dW2xvY1swXV07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpbGU6IHRpbGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1sxXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGZpbGxzaXpldyA9IHBhcmFtcy50aWxlLndpZHRoICAqICgwLjUgLSAwLjIpO1xyXG4gICAgICAgIGxldCBmaWxsc2l6ZWggPSBmaWxsc2l6ZXc7Ly9wYXJhbXMudGlsZS5oZWlnaHQgKiAoMS4wIC0gMC4yKTtcclxuXHJcbiAgICAgICAgbGV0IGljb24gPSBzLmltYWdlKFxyXG4gICAgICAgICAgICBcIlwiLCBcclxuICAgICAgICAgICAgZmlsbHNpemV3LCBcclxuICAgICAgICAgICAgZmlsbHNpemVoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggIC0gZmlsbHNpemV3ICogMiwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCAtIGZpbGxzaXplaCAqIDJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IHMudGV4dChwYXJhbXMudGlsZS53aWR0aCAvIDIsIHBhcmFtcy50aWxlLmhlaWdodCAvIDIgKyBwYXJhbXMudGlsZS5oZWlnaHQgKiAwLjM1LCBcIlRFU1RcIik7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0LCBpY29uLCB0ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgIGApO1xyXG4gICAgICAgIGdyb3VwLmF0dHIoe1wib3BhY2l0eVwiOiBcIjBcIn0pO1xyXG5cclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgxLjAsIDEuMCkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5wb3MgPSBwb3M7XHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcblxyXG4gICAgICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7b2JqZWN0LnBvc1swXX0sICR7b2JqZWN0LnBvc1sxXX0pIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICAgICAgc2NhbGUoMC4wMSwgMC4wMSkgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRJbnRlcmFjdGlvbkxheWVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhpY3NMYXllcnNbM107XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTaG93ZWQoKXtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGZvciAobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZpcyA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgdmlzLmFyZWEuYXR0cih7ZmlsbDogXCJ0cmFuc3BhcmVudFwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuaW5wdXQuc2VsZWN0ZWQudGlsZTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZS5sb2MpO1xyXG4gICAgICAgIGlmIChvYmplY3Qpe1xyXG4gICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDI1NSwgMCwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dQb3NzaWJsZSh0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlaW5mbyBvZiB0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVpbmZvLnRpbGU7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZWluZm8ubG9jKTtcclxuICAgICAgICAgICAgaWYob2JqZWN0KXtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMCwgMjU1LCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlVGlsZXMoKXtcclxuICAgICAgICB0aGlzLmNsZWFyVGlsZXMoKTtcclxuICAgICAgICBsZXQgdGlsZXMgPSB0aGlzLm1hbmFnZXIudGlsZXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRpbGVzKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhclRpbGVzKCl7XHJcbiAgICAgICAgZm9yIChsZXQgdGlsZSBvZiB0aGlzLmdyYXBoaWNzVGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZSkgdGlsZS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1c2hUaWxlKHRpbGUpe1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTY29yZSgpe1xyXG4gICAgICAgIHRoaXMuc2NvcmVib2FyZC5pbm5lckhUTUwgPSB0aGlzLm1hbmFnZXIuZGF0YS5zY29yZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hJbnB1dChpbnB1dCl7IC8vTWF5IHJlcXVpcmVkIGZvciBzZW5kIG9iamVjdHMgYW5kIG1vdXNlIGV2ZW50c1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBpbnB1dC5hdHRhY2hHcmFwaGljcyh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQge0dyYXBoaWNzRW5naW5lfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wb3J0ID0ge1xyXG4gICAgICAgICAgICBvbm1vdmU6IFtdLFxyXG4gICAgICAgICAgICBvbnN0YXJ0OiBbXSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IFtdLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcclxuICAgICAgICB0aGlzLnVuZG9idXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3VuZG9cIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVuZG9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3Qoc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgcG9zID0gZ3JhcGhpYy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKG9iamVjdC5sb2MpO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLmdyYXBoaWMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgYXJlYSA9IGludGVyYWN0aXZlLm9iamVjdC5yZWN0KHBvc1swXSAtIGJvcmRlci8yLCBwb3NbMV0gLSBib3JkZXIvMiwgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQudGlsZSAmJiBzZWxlY3RlZC50aWxlLmxvY1swXSAhPSAtMSAmJiBzZWxlY3RlZCAhPSB0aGlzLnNlbGVjdGVkICYmICFmaWVsZC5wb3NzaWJsZSh0aGlzLnNlbGVjdGVkLnRpbGUsIG9iamVjdC5sb2MpICYmICEob2JqZWN0LmxvY1swXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1swXSAmJiBvYmplY3QubG9jWzFdID09IHRoaXMuc2VsZWN0ZWQubG9jWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25tb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcywgc2VsZWN0ZWQsIGZpZWxkLmdldChvYmplY3QubG9jKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IG9iamVjdC5hcmVhID0gYXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBhcmVhLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEludGVyYWN0aW9uTWFwKCl7XHJcbiAgICAgICAgbGV0IG1hcCA9IHtcclxuICAgICAgICAgICAgdGlsZW1hcDogW10sIFxyXG4gICAgICAgICAgICBncmlkbWFwOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZC5kYXRhLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBtYXAudGlsZW1hcFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPGZpZWxkLmRhdGEud2lkdGg7aisrKXtcclxuICAgICAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldW2pdID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvbk9iamVjdChmaWVsZC5nZXQoW2osIGldKSwgaiwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtJbnB1dH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZFwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG5ldyBGaWVsZCg0LCA0KTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZpY3Rvcnk6IGZhbHNlLCBcclxuICAgICAgICAgICAgc2NvcmU6IDAsXHJcbiAgICAgICAgICAgIG1vdmVjb3VudGVyOiAwLFxyXG4gICAgICAgICAgICBhYnNvcmJlZDogMCwgXHJcbiAgICAgICAgICAgIGNvbmRpdGlvblZhbHVlOiAyMDQ4XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5maWVsZC5wb3NzaWJsZShzZWxlY3RlZC50aWxlLCB0aWxlaW5mby5sb2MpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLm1vdmUoc2VsZWN0ZWQubG9jLCB0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3Qoc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgaWYgKHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGUpIHtcclxuICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKj0gMjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gdGlsZS5kYXRhLnNpZGUgPT0gMSA/IDAgOiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zY29yZSArPSB0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KG9sZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dNb3ZlZCh0aWxlKTtcclxuICAgICAgICAgICAgbGV0IGMgPSBNYXRoLm1heChNYXRoLnNxcnQoKHRoaXMuZmllbGQuZGF0YS53aWR0aCAvIDQpICogKHRoaXMuZmllbGQuZGF0YS5oZWlnaHQgLyA0KSksIDEpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPGM7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDw9IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZighdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmNoZWNrQ29uZGl0aW9uKCkgJiYgIXRoaXMuZGF0YS52aWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRpbGVzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQudGlsZXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcGllY2U6IHRpbGUuZGF0YS5waWVjZSwgXHJcbiAgICAgICAgICAgICAgICBzaWRlOiB0aWxlLmRhdGEuc2lkZSwgXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGlsZS5kYXRhLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgcHJldjogdGlsZS5kYXRhLnByZXZcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpO1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXN0b3JlU3RhdGUoc3RhdGUpe1xyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSB0aGlzLnN0YXRlc1t0aGlzLnN0YXRlcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXN0YXRlKSByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWVsZC5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gc3RhdGUuc2NvcmU7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBzdGF0ZS52aWN0b3J5O1xyXG5cclxuICAgICAgICBmb3IobGV0IHRkYXQgb2Ygc3RhdGUudGlsZXMpIHtcclxuICAgICAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSB0ZGF0LnBpZWNlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSB0ZGF0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IHRkYXQuc2lkZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmxvYyA9IHRkYXQubG9jO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldiA9IHRkYXQucHJldjtcclxuICAgICAgICAgICAgdGlsZS5hdHRhY2godGhpcy5maWVsZCwgdGRhdC5sb2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZVZpY3RvcnkoKXtcclxuICAgICAgICBpZighdGhpcy5kYXRhLnZpY3Rvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93VmljdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbmRpdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLmNoZWNrQW55KHRoaXMuZGF0YS5jb25kaXRpb25WYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFVzZXIoe2dyYXBoaWNzLCBpbnB1dH0pe1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zdGFydC5wdXNoKHRoaXMub25zdGFydGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zZWxlY3QucHVzaCh0aGlzLm9uc2VsZWN0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbm1vdmUucHVzaCh0aGlzLm9ubW92ZWV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljcztcclxuICAgICAgICBncmFwaGljcy5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMuY3JlYXRlQ29tcG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmlucHV0LmJ1aWxkSW50ZXJhY3Rpb25NYXAoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnYW1lc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmRhdGEuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5tb3ZlY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB0aGlzLnN0YXRlcy5zcGxpY2UoMCwgdGhpcy5zdGF0ZXMubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZXBhdXNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVvdmVyKHJlYXNvbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaW5rKGRpZmYpeyAvLz8/P1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge01hbmFnZXJ9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBrbW92ZW1hcCA9IFtcclxuICAgIFstMiwgLTFdLFxyXG4gICAgWyAyLCAtMV0sXHJcbiAgICBbLTIsICAxXSxcclxuICAgIFsgMiwgIDFdLFxyXG4gICAgXHJcbiAgICBbLTEsIC0yXSxcclxuICAgIFsgMSwgLTJdLFxyXG4gICAgWy0xLCAgMl0sXHJcbiAgICBbIDEsICAyXVxyXG5dO1xyXG5cclxubGV0IHJkaXJzID0gW1xyXG4gICAgWyAwLCAgMV0sIC8vZG93blxyXG4gICAgWyAwLCAtMV0sIC8vdXBcclxuICAgIFsgMSwgIDBdLCAvL2xlZnRcclxuICAgIFstMSwgIDBdICAvL3JpZ2h0XHJcbl07XHJcblxyXG5sZXQgYmRpcnMgPSBbXHJcbiAgICBbIDEsICAxXSxcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAgMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBhZGlycyA9IFtcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnMgPSBbXHJcbiAgICBbIDAsIC0xXVxyXG5dO1xyXG5cclxuXHJcbmxldCBwYWRpcnNOZWcgPSBbXHJcbiAgICBbIDEsIDFdLFxyXG4gICAgWy0xLCAxXVxyXG5dO1xyXG5cclxubGV0IHBtZGlyc05lZyA9IFtcclxuICAgIFsgMCwgMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcWRpcnMgPSByZGlycy5jb25jYXQoYmRpcnMpOyAvL21heSBub3QgbmVlZFxyXG5cclxubGV0IHRjb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwIC8vV2hpdGUgPSAwLCBCbGFjayA9IDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2MgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChmaWVsZCwgeCwgeSl7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoKHRoaXMsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQocmVsYXRpdmUgPSBbMCwgMF0pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSByZXR1cm4gdGhpcy5maWVsZC5nZXQoW1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzBdICsgcmVsYXRpdmVbMF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gKyByZWxhdGl2ZVsxXVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGx0byl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQubW92ZSh0aGlzLmRhdGEubG9jLCBsdG8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQoKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5wdXQodGhpcy5kYXRhLmxvYywgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGxvYyhhKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0gYVswXTtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0gYVsxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FjaGVMb2MoKXtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlswXSA9IHRoaXMuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMV0gPSB0aGlzLmRhdGEubG9jWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRGaWVsZChmaWVsZCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRMb2MoW3gsIHldKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0geDtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVwbGFjZUlmTmVlZHMoKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA+PSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0LTEgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA8PSAwICYmIHRoaXMuZGF0YS5zaWRlID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRQYXduQXR0YWNrVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuZ2V0UGF3bk1vdmVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldEtuaWdodFBvc3NpYmxlVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgYmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA0KSB7IC8vUXVlZW5cclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcWRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXROZWlnaHRib3JUaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBnZXRLbmlnaHRQb3NzaWJsZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGttb3ZlbWFwLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgbG9jID0ga21vdmVtYXBbaV07XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChsb2MpO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5laWdodGJvclRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0sIGRpclsxXV0pO1xyXG4gICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpcmVjdGlvblRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxtYXh0O2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChbZGlyWzBdICogaSwgZGlyWzFdICogaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICAgICAgaWYgKHRpZi50aWxlIHx8ICF0aWYpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bkF0dGFja1RpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwYWRpcnMgOiBwYWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgdGlmLnRpbGUpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bk1vdmVUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IGRpcnMgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGRpcnNbaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmICYmICF0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
