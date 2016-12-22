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
            var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var counted = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tile = _step.value;

                    if (tile.value == value) counted++; //return true;
                    if (counted >= count) return true;
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
            var piece = tile.possible(lto);

            if (!atile) return piece;
            var possibles = piece;

            var opponent = atile.data.side != tile.data.side;
            var owner = !opponent; //Also possible owner
            var both = true;
            var nobody = false;

            var same = atile.value == tile.value;
            var higterThanOp = tile.value * 2 == atile.value;
            var lowerThanOp = atile.value * 2 == tile.value;

            //Settings with possible oppositions
            possibles = possibles && (same && both || higterThanOp && nobody || lowerThanOp && nobody) && piece;

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
            } else if (rnd >= 0.8 && rnd < 0.85) {
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
                tile.data.value = Math.random() < 0.1 ? 4 : 2;
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
                        return tile.value < 2;
                    },
                    fill: "rgb(32, 32, 32)",
                    font: "rgb(255, 255, 255)"
                }, {
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

            {
                var buttonGroup = screen.group();
                buttonGroup.transform("translate(" + (tw / 2 + 5) + ", " + (th / 2 + 20) + ")");
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
            }

            {
                var _buttonGroup = screen.group();
                _buttonGroup.transform("translate(" + (tw / 2 - 105) + ", " + (th / 2 + 20) + ")");
                _buttonGroup.click(function () {
                    _this2.manager.restoreState();
                    _this2.hideGameover();
                });

                var _button = _buttonGroup.rect(0, 0, 100, 30);
                _button.attr({
                    "fill": "rgba(224, 192, 192, 0.8)"
                });

                var _buttonText = _buttonGroup.text(50, 20, "Undo");
                _buttonText.attr({
                    "font-size": "15",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS"
                });
            }

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
                var _buttonGroup2 = screen.group();
                _buttonGroup2.transform("translate(" + (tw / 2 - 105) + ", " + (th / 2 + 20) + ")");
                _buttonGroup2.click(function () {
                    _this3.hideVictory();
                });

                var _button2 = _buttonGroup2.rect(0, 0, 100, 30);
                _button2.attr({
                    "fill": "rgba(128, 128, 255, 0.8)"
                });

                var _buttonText2 = _buttonGroup2.text(50, 20, "Continue...");
                _buttonText2.attr({
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

        this.clicked = false;
        this.restartbutton = document.querySelector("#restart");
        this.undobutton = document.querySelector("#undo");

        this.restartbutton.addEventListener("click", function () {
            _this.manager.restart();
            _this.graphic.hideGameover();
            _this.graphic.hideVictory();
        });
        this.undobutton.addEventListener("click", function () {
            _this.selected = null;
            _this.manager.restoreState();

            _this.graphic.clearShowed();
            if (_this.selected) {
                _this.graphic.showPossible(_this.field.tilePossibleList(_this.selected.tile));
                _this.graphic.showSelected(_this.selected.tile);
            }

            _this.graphic.hideGameover();
            _this.graphic.hideVictory();
        });

        document.addEventListener("click", function () {
            if (!_this.clicked) {
                _this.selected = null;
                _this.graphic.clearShowed();
                if (_this.selected) {
                    _this.graphic.showPossible(_this.field.tilePossibleList(_this.selected.tile));
                    _this.graphic.showSelected(_this.selected.tile);
                }
            }
            _this.clicked = false;
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

            var svgelement = graphic.svgel;
            svgelement.addEventListener("click", function () {
                _this2.clicked = true;
            });

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
            if (_this.field.possible(selected.tile, tileinfo.loc)) {
                _this.saveState();
                _this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);
        };

        this.field.ontileabsorption.push(function (old, tile) {
            var oldval = old.value;
            var curval = tile.value;

            var opponent = tile.data.side != old.data.side;
            var owner = !opponent;

            if (opponent) {
                if (oldval == curval) {
                    tile.value = curval * 2.0;
                } else if (oldval < curval) {
                    tile.value = oldval;
                } else {
                    tile.value = oldval;
                }
            }

            if (owner) {
                tile.data.side = tile.data.side == 0 ? 1 : 0;

                if (oldval == curval) {
                    tile.value = curval * 2.0;
                } else if (oldval < curval) {
                    tile.value = oldval;
                } else {
                    tile.value = oldval;
                }
            }

            if (tile.value <= 1) _this.graphic.showGameover();

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
            var c = Math.max(Math.ceil(Math.sqrt(_this.field.data.width / 4 * (_this.field.data.height / 4))), 1);
            for (var i = 0; i < c; i++) {
                if (!_this.data.absorbed) {
                    _this.field.generateTile();
                } else {
                    while (!(_this.field.checkAny(2, 2) || _this.field.checkAny(4, 2))) {
                        if (!_this.field.generateTile()) break;
                    }
                }
            }
            _this.data.absorbed = false;

            while (!_this.field.anyPossible()) {
                if (!_this.field.generateTile()) break;
            }
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
            if (!this.field.anyPossible()) this.gamestart(); //Prevent gameover
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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InNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IodyA9IDQsIGggPSA0KXtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3LCBoZWlnaHQ6IGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy50aWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvID0ge1xyXG4gICAgICAgICAgICB0aWxlSUQ6IC0xLFxyXG4gICAgICAgICAgICB0aWxlOiBudWxsLFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9udGlsZXJlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWRkID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhYnNvcnB0aW9uID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB3aWR0aCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQW55KHZhbHVlLCBjb3VudCA9IDEpe1xyXG4gICAgICAgIGxldCBjb3VudGVkID0gMDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPT0gdmFsdWUpIGNvdW50ZWQrKzsvL3JldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBpZihjb3VudGVkID49IGNvdW50KSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhbnlQb3NzaWJsZSgpe1xyXG4gICAgICAgIGxldCBhbnlwb3NzaWJsZSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBhbnlwb3NzaWJsZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVQb3NzaWJsZUxpc3QodGlsZSl7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBsaXN0OyAvL2VtcHR5XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBsaXN0LnB1c2godGhpcy5nZXQoW2osIGldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHBvc3NpYmxlKHRpbGUsIGx0byl7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB0aWxlaSA9IHRoaXMuZ2V0KGx0byk7XHJcbiAgICAgICAgbGV0IGF0aWxlID0gdGlsZWkudGlsZTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aWxlLnBvc3NpYmxlKGx0byk7XHJcblxyXG4gICAgICAgIGlmICghYXRpbGUpIHJldHVybiBwaWVjZTtcclxuICAgICAgICBsZXQgcG9zc2libGVzID0gcGllY2U7XHJcblxyXG4gICAgICAgIGxldCBvcHBvbmVudCA9IGF0aWxlLmRhdGEuc2lkZSAhPSB0aWxlLmRhdGEuc2lkZTtcclxuICAgICAgICBsZXQgb3duZXIgPSAhb3Bwb25lbnQ7IC8vQWxzbyBwb3NzaWJsZSBvd25lclxyXG4gICAgICAgIGxldCBib3RoID0gdHJ1ZTtcclxuICAgICAgICBsZXQgbm9ib2R5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBzYW1lID0gYXRpbGUudmFsdWUgPT0gdGlsZS52YWx1ZTtcclxuICAgICAgICBsZXQgaGlndGVyVGhhbk9wID0gdGlsZS52YWx1ZSAqIDIgPT0gYXRpbGUudmFsdWU7XHJcbiAgICAgICAgbGV0IGxvd2VyVGhhbk9wID0gYXRpbGUudmFsdWUgKiAyID09IHRpbGUudmFsdWU7XHJcblxyXG4gICAgICAgIC8vU2V0dGluZ3Mgd2l0aCBwb3NzaWJsZSBvcHBvc2l0aW9uc1xyXG4gICAgICAgIHBvc3NpYmxlcyA9IHBvc3NpYmxlcyAmJiBcclxuICAgICAgICAoXHJcbiAgICAgICAgICAgIHNhbWUgJiYgYm90aCB8fCBcclxuICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG5vYm9keSB8fCBcclxuICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgbm9ib2R5XHJcbiAgICAgICAgKSAmJiBwaWVjZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuUGllY2UoZXhjZXB0UGF3bil7XHJcbiAgICAgICAgbGV0IHBhd25yID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZiAocGF3bnIgPCAwLjQgJiYgIWV4Y2VwdFBhd24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZihybmQgPj0gMC4wICYmIHJuZCA8IDAuMyl7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC4zICYmIHJuZCA8IDAuNil7XHJcbiAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC42ICYmIHJuZCA8IDAuOCl7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC44ICYmIHJuZCA8IDAuODUpe1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV1bal0udGlsZSkgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZihub3RPY2N1cGllZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4xID8gNCA6IDI7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgdGlsZS5hdHRhY2godGhpcywgbm90T2NjdXBpZWRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm90T2NjdXBpZWQubGVuZ3RoKV0ubG9jKTsgLy9wcmVmZXIgZ2VuZXJhdGUgc2luZ2xlXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vTm90IHBvc3NpYmxlIHRvIGdlbmVyYXRlIG5ldyB0aWxlc1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKDAsIHRoaXMudGlsZXMubGVuZ3RoKTtcclxuICAgICAgICAvL3RoaXMuZmllbGRzLnNwbGljZSgwLCB0aGlzLmZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV0pIHRoaXMuZmllbGRzW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZHNbaV1bal0gPyB0aGlzLmZpZWxkc1tpXVtqXS50aWxlIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUpeyAvL2lmIGhhdmVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07IC8vcmV0dXJuIHJlZmVyZW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8sIHtcclxuICAgICAgICAgICAgbG9jOiBbbG9jWzBdLCBsb2NbMV1dXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dChsb2MsIHRpbGUpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBpZiAobG9jWzBdID09IGx0b1swXSAmJiBsb2NbMV0gPT0gbHRvWzFdKSByZXR1cm4gdGhpczsgLy9TYW1lIGxvY2F0aW9uXHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzBdID0gdGlsZS5kYXRhLmxvY1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzFdID0gdGlsZS5kYXRhLmxvY1sxXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEubG9jWzFdID0gbHRvWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBvbGQgPSB0aGlzLmZpZWxkc1tsdG9bMV1dW2x0b1swXV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWJzb3JwdGlvbikgZihvbGQudGlsZSwgdGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIobHRvLCB0aWxlKS5wdXQobHRvLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhcihsb2MsIGJ5dGlsZSA9IG51bGwpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCJpY29ucy9XaGl0ZVBhd24ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS25pZ2h0LnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUJpc2hvcC5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVSb29rLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVF1ZWVuLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtpbmcucG5nXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcImljb25zL0JsYWNrUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1Jvb2sucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrS2luZy5wbmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnN2Z2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50V2lkdGgpLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPCAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMzIsIDMyLCAzMilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCk7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5hcmVhID0gcmVjdDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlRGVjb3JhdGlvbigpe1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCAgKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC53aWR0aCA9IHR3O1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQuaGVpZ2h0ID0gdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlY29yYXRpb25MYXllciA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF07XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdCgwLCAwLCB0dywgdGgsIDAsIDApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjQwLCAyMjQsIDE5MilcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vRGVjb3JhdGl2ZSBjaGVzcyBmaWVsZFxyXG4gICAgICAgIHRoaXMuY2hlc3NmaWVsZCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3NmaWVsZFt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvcmRlciA9IDA7Ly90aGlzLnBhcmFtcy5ib3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gcy5ncm91cCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICAgICAgICAgIGxldCByZWN0ID0gZi5yZWN0KFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZmlsbFwiOiB4ICUgMiAhPSB5ICUgMiA/IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCIgOiBcInJnYmEoMCwgMCwgMCwgMC4xKVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGYudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF0tYm9yZGVyLzJ9LCAke3Bvc1sxXS1ib3JkZXIvMn0pYCk7XHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJlY3QgPSBkZWNvcmF0aW9uTGF5ZXIub2JqZWN0LnJlY3QoXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgLXRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aC8yLCBcclxuICAgICAgICAgICAgICAgIHR3ICsgdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGggKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsIFxyXG4gICAgICAgICAgICAgICAgNSwgXHJcbiAgICAgICAgICAgICAgICA1XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBcInJnYigxMjgsIDY0LCAzMilcIixcclxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tcG9zaXRpb24oKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzTGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHNjZW5lID0gdGhpcy5zbmFwLmdyb3VwKCk7XHJcbiAgICAgICAgc2NlbmUudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGh9LCAke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0pYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdID0geyAvL0RlY29yYXRpb25cclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1szXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLnRpbGUud2lkdGggID0gKHRoaXMucGFyYW1zLmdyaWQud2lkdGggIC0gdGhpcy5wYXJhbXMuYm9yZGVyICogKHdpZHRoICsgMSkgIC0gdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoKjIpIC8gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgPSAodGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAoaGVpZ2h0ICsgMSkgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyBoZWlnaHQ7XHJcblxyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XVt4XSA9IHRoaXMuY3JlYXRlU2VtaVZpc2libGUoW3gsIHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlVGlsZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZURlY29yYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVPdmVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWN0b3J5KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVHYW1lT3Zlcigpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjU1LCAyMjQsIDIyNCwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiR2FtZSBPdmVyXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgKyA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiAtIDEwNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RvcmVTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIlVuZG9cIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY3JlYXRlVmljdG9yeSgpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzVdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjI0LCAyMjQsIDI1NiwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiWW91IHdvbiEgWW91IGdvdCBcIiArIHRoaXMubWFuYWdlci5kYXRhLmNvbmRpdGlvblZhbHVlICsgXCIhXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgKyA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDEyOCwgMTI4LCAyNTUsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJDb250aW51ZS4uLlwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuID0gc2NyZWVuO1xyXG4gICAgICAgIHNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93VmljdG9yeSgpe1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJ9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlVmljdG9yeSgpe1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9LCA1MDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93R2FtZW92ZXIoKXtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDEwMDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlR2FtZW92ZXIoKXtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9LCA1MDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0T2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5ncmFwaGljc1RpbGVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmdyYXBoaWNzVGlsZXNbaV0udGlsZSA9PSB0aWxlKSByZXR1cm4gdGhpcy5ncmFwaGljc1RpbGVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2hhbmdlU3R5bGVPYmplY3Qob2JqLCBuZWVkdXAgPSBmYWxzZSl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBvYmoudGlsZTtcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKHRpbGUubG9jKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBvYmouZWxlbWVudDtcclxuICAgICAgICAvL2dyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWApO1xyXG5cclxuICAgICAgICBpZiAobmVlZHVwKSBncm91cC50b0Zyb250KCk7XHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYFxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLnBvcyA9IHBvcztcclxuXHJcbiAgICAgICAgbGV0IHN0eWxlID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IF9zdHlsZSBvZiB0aGlzLnBhcmFtcy50aWxlLnN0eWxlcykge1xyXG4gICAgICAgICAgICBpZihfc3R5bGUuY29uZGl0aW9uLmNhbGwob2JqLnRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZSA9IF9zdHlsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmoudGV4dC5hdHRyKHtcInRleHRcIjogYCR7dGlsZS52YWx1ZX1gfSk7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZvbnQpIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgc3R5bGUuZm9udCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqLmljb24uYXR0cih7XCJ4bGluazpocmVmXCI6IG9iai50aWxlLmRhdGEuc2lkZSA9PSAwID8gaWNvbnNldFtvYmoudGlsZS5kYXRhLnBpZWNlXSA6IGljb25zZXRCbGFja1tvYmoudGlsZS5kYXRhLnBpZWNlXX0pO1xyXG5cclxuICAgICAgICBvYmoudGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogdGhpcy5wYXJhbXMudGlsZS53aWR0aCAqIDAuMTUsIC8vXCIxNnB4XCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCIsIFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiYmxhY2tcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBvYmoucmVjdGFuZ2xlLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBzdHlsZS5maWxsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVN0eWxlKHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICBpZiAob2JqZWN0KSBvYmplY3QucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd01vdmVkKHRpbGUpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKXtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUud2lkdGggICsgYm9yZGVyKSAqIHgsXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpICogeVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VmlzdWFsaXplcihsb2Mpe1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWxvYyB8fCBcclxuICAgICAgICAgICAgIShsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmZpZWxkLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5maWVsZC5kYXRhLmhlaWdodClcclxuICAgICAgICApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc3VhbGl6YXRpb25bbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aWxlOiB0aWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBmaWxsc2l6ZXcgPSBwYXJhbXMudGlsZS53aWR0aCAgKiAoMC41IC0gMC4yKTtcclxuICAgICAgICBsZXQgZmlsbHNpemVoID0gZmlsbHNpemV3Oy8vcGFyYW1zLnRpbGUuaGVpZ2h0ICogKDEuMCAtIDAuMik7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIGZpbGxzaXpldywgXHJcbiAgICAgICAgICAgIGZpbGxzaXplaCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICAtIGZpbGxzaXpldyAqIDIsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgLSBmaWxsc2l6ZWggKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBzLnRleHQocGFyYW1zLnRpbGUud2lkdGggLyAyLCBwYXJhbXMudGlsZS5oZWlnaHQgLyAyICsgcGFyYW1zLnRpbGUuaGVpZ2h0ICogMC4zNSwgXCJURVNUXCIpO1xyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCwgaWNvbiwgdGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgwLjAxLCAwLjAxKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICBgKTtcclxuICAgICAgICBncm91cC5hdHRyKHtcIm9wYWNpdHlcIjogXCIwXCJ9KTtcclxuXHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgc2NhbGUoMS4wLCAxLjApIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QucG9zID0gcG9zO1xyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0Lmljb24gPSBpY29uO1xyXG4gICAgICAgIG9iamVjdC50ZXh0ID0gdGV4dDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG5cclxuICAgICAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke29iamVjdC5wb3NbMF19LCAke29iamVjdC5wb3NbMV19KSBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0SW50ZXJhY3Rpb25MYXllcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2hvd2VkKCl7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBmb3IgKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2aXMgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIoW3gsIHldKTtcclxuICAgICAgICAgICAgICAgIHZpcy5hcmVhLmF0dHIoe2ZpbGw6IFwidHJhbnNwYXJlbnRcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dTZWxlY3RlZCgpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmlucHV0LnNlbGVjdGVkLnRpbGU7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGUubG9jKTtcclxuICAgICAgICBpZiAob2JqZWN0KXtcclxuICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgyNTUsIDAsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93UG9zc2libGUodGlsZWluZm9saXN0KXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZWluZm8gb2YgdGlsZWluZm9saXN0KXtcclxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlaW5mby50aWxlO1xyXG4gICAgICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIGlmKG9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDAsIDI1NSwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjZWl2ZVRpbGVzKCl7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbGVzKCk7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gdGhpcy5tYW5hZ2VyLnRpbGVzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlcyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXJUaWxlcygpe1xyXG4gICAgICAgIGZvciAobGV0IHRpbGUgb2YgdGhpcy5ncmFwaGljc1RpbGVzKXtcclxuICAgICAgICAgICAgaWYgKHRpbGUpIHRpbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXNoVGlsZSh0aWxlKXtcclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2NvcmUoKXtcclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQuaW5uZXJIVE1MID0gdGhpcy5tYW5hZ2VyLmRhdGEuc2NvcmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoSW5wdXQoaW5wdXQpeyAvL01heSByZXF1aXJlZCBmb3Igc2VuZCBvYmplY3RzIGFuZCBtb3VzZSBldmVudHNcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoR3JhcGhpY3ModGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHtHcmFwaGljc0VuZ2luZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbmNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucG9ydCA9IHtcclxuICAgICAgICAgICAgb25tb3ZlOiBbXSxcclxuICAgICAgICAgICAgb25zdGFydDogW10sXHJcbiAgICAgICAgICAgIG9uc2VsZWN0OiBbXSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1bmRvXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RvcmVTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRoaXMuc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICBpZighdGhpcy5jbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgc3ZnZWxlbWVudCA9IGdyYXBoaWMuc3ZnZWw7XHJcbiAgICAgICAgc3ZnZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5jbGlja2VkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHBvcyA9IGdyYXBoaWMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihvYmplY3QubG9jKTtcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5ncmFwaGljLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IGFyZWEgPSBpbnRlcmFjdGl2ZS5vYmplY3QucmVjdChwb3NbMF0gLSBib3JkZXIvMiwgcG9zWzFdIC0gYm9yZGVyLzIsIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICYmIHNlbGVjdGVkLnRpbGUgJiYgc2VsZWN0ZWQudGlsZS5sb2NbMF0gIT0gLTEgJiYgc2VsZWN0ZWQgIT0gdGhpcy5zZWxlY3RlZCAmJiAhZmllbGQucG9zc2libGUodGhpcy5zZWxlY3RlZC50aWxlLCBvYmplY3QubG9jKSAmJiAhKG9iamVjdC5sb2NbMF0gPT0gdGhpcy5zZWxlY3RlZC5sb2NbMF0gJiYgb2JqZWN0LmxvY1sxXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1sxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9ubW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMsIHNlbGVjdGVkLCBmaWVsZC5nZXQob2JqZWN0LmxvYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSBvYmplY3QuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRJbnRlcmFjdGlvbk1hcCgpe1xyXG4gICAgICAgIGxldCBtYXAgPSB7XHJcbiAgICAgICAgICAgIHRpbGVtYXA6IFtdLCBcclxuICAgICAgICAgICAgZ3JpZG1hcDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZmllbGQuZGF0YS5oZWlnaHQ7aSsrKXtcclxuICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajxmaWVsZC5kYXRhLndpZHRoO2orKyl7XHJcbiAgICAgICAgICAgICAgICBtYXAudGlsZW1hcFtpXVtqXSA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QoZmllbGQuZ2V0KFtqLCBpXSksIGosIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7SW5wdXR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vZmllbGRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIE1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBuZXcgRmllbGQoNCwgNCk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB2aWN0b3J5OiBmYWxzZSwgXHJcbiAgICAgICAgICAgIHNjb3JlOiAwLFxyXG4gICAgICAgICAgICBtb3ZlY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWJzb3JiZWQ6IDAsIFxyXG4gICAgICAgICAgICBjb25kaXRpb25WYWx1ZTogMjA0OFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5vbnN0YXJ0ZXZlbnQgPSAoY29udHJvbGxlciwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0ZXZlbnQgPSAoY29udHJvbGxlciwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdCh0aWxlaW5mby50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGlsZWluZm8udGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9ubW92ZWV2ZW50ID0gKGNvbnRyb2xsZXIsIHNlbGVjdGVkLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5maWVsZC5wb3NzaWJsZShzZWxlY3RlZC50aWxlLCB0aWxlaW5mby5sb2MpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5tb3ZlKHNlbGVjdGVkLmxvYywgdGlsZWluZm8ubG9jKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHNlbGVjdGVkLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZChzZWxlY3RlZC50aWxlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWJzb3JwdGlvbi5wdXNoKChvbGQsIHRpbGUpPT57XHJcbiAgICAgICAgICAgIGxldCBvbGR2YWwgPSBvbGQudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBjdXJ2YWwgPSB0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IG9wcG9uZW50ID0gdGlsZS5kYXRhLnNpZGUgIT0gb2xkLmRhdGEuc2lkZTtcclxuICAgICAgICAgICAgbGV0IG93bmVyID0gIW9wcG9uZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkdmFsID09IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWwgKiAyLjA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkdmFsIDwgY3VydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS52YWx1ZSA9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS52YWx1ZSA9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0aWxlLmRhdGEuc2lkZSA9PSAwID8gMSA6IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA9PSBjdXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gY3VydmFsICogMi4wO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBvbGR2YWw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBvbGR2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPD0gMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNjb3JlICs9IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3Qob2xkKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd01vdmVkKHRpbGUpO1xyXG4gICAgICAgICAgICBsZXQgYyA9IE1hdGgubWF4KE1hdGguY2VpbChNYXRoLnNxcnQoKHRoaXMuZmllbGQuZGF0YS53aWR0aCAvIDQpICogKHRoaXMuZmllbGQuZGF0YS5oZWlnaHQgLyA0KSkpLCAxKTtcclxuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxjO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGF0YS5hYnNvcmJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKCEodGhpcy5maWVsZC5jaGVja0FueSgyLCAyKSB8fCB0aGlzLmZpZWxkLmNoZWNrQW55KDQsIDIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCkpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkpIHRoaXMuZ3JhcGhpYy5zaG93R2FtZW92ZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmNoZWNrQ29uZGl0aW9uKCkgJiYgIXRoaXMuZGF0YS52aWN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRpbGVzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQudGlsZXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcGllY2U6IHRpbGUuZGF0YS5waWVjZSwgXHJcbiAgICAgICAgICAgICAgICBzaWRlOiB0aWxlLmRhdGEuc2lkZSwgXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGlsZS5kYXRhLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgcHJldjogdGlsZS5kYXRhLnByZXZcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpO1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXN0b3JlU3RhdGUoc3RhdGUpe1xyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSB0aGlzLnN0YXRlc1t0aGlzLnN0YXRlcy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXN0YXRlKSByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWVsZC5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gc3RhdGUuc2NvcmU7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBzdGF0ZS52aWN0b3J5O1xyXG5cclxuICAgICAgICBmb3IobGV0IHRkYXQgb2Ygc3RhdGUudGlsZXMpIHtcclxuICAgICAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSB0ZGF0LnBpZWNlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSB0ZGF0LnZhbHVlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IHRkYXQuc2lkZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmxvYyA9IHRkYXQubG9jO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldiA9IHRkYXQucHJldjtcclxuICAgICAgICAgICAgdGlsZS5hdHRhY2godGhpcy5maWVsZCwgdGRhdC5sb2MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZVZpY3RvcnkoKXtcclxuICAgICAgICBpZighdGhpcy5kYXRhLnZpY3Rvcnkpe1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93VmljdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbmRpdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLmNoZWNrQW55KHRoaXMuZGF0YS5jb25kaXRpb25WYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFVzZXIoe2dyYXBoaWNzLCBpbnB1dH0pe1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zdGFydC5wdXNoKHRoaXMub25zdGFydGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25zZWxlY3QucHVzaCh0aGlzLm9uc2VsZWN0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbm1vdmUucHVzaCh0aGlzLm9ubW92ZWV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljcztcclxuICAgICAgICBncmFwaGljcy5hdHRhY2hNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMuY3JlYXRlQ29tcG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmlucHV0LmJ1aWxkSW50ZXJhY3Rpb25NYXAoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnYW1lc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmRhdGEuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5tb3ZlY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB0aGlzLnN0YXRlcy5zcGxpY2UoMCwgdGhpcy5zdGF0ZXMubGVuZ3RoKTtcclxuICAgICAgICBpZighdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdhbWVzdGFydCgpOyAvL1ByZXZlbnQgZ2FtZW92ZXJcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZXBhdXNlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVvdmVyKHJlYXNvbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaW5rKGRpZmYpeyAvLz8/P1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge01hbmFnZXJ9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBrbW92ZW1hcCA9IFtcclxuICAgIFstMiwgLTFdLFxyXG4gICAgWyAyLCAtMV0sXHJcbiAgICBbLTIsICAxXSxcclxuICAgIFsgMiwgIDFdLFxyXG4gICAgXHJcbiAgICBbLTEsIC0yXSxcclxuICAgIFsgMSwgLTJdLFxyXG4gICAgWy0xLCAgMl0sXHJcbiAgICBbIDEsICAyXVxyXG5dO1xyXG5cclxubGV0IHJkaXJzID0gW1xyXG4gICAgWyAwLCAgMV0sIC8vZG93blxyXG4gICAgWyAwLCAtMV0sIC8vdXBcclxuICAgIFsgMSwgIDBdLCAvL2xlZnRcclxuICAgIFstMSwgIDBdICAvL3JpZ2h0XHJcbl07XHJcblxyXG5sZXQgYmRpcnMgPSBbXHJcbiAgICBbIDEsICAxXSxcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAgMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBhZGlycyA9IFtcclxuICAgIFsgMSwgLTFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnMgPSBbXHJcbiAgICBbIDAsIC0xXVxyXG5dO1xyXG5cclxuXHJcbmxldCBwYWRpcnNOZWcgPSBbXHJcbiAgICBbIDEsIDFdLFxyXG4gICAgWy0xLCAxXVxyXG5dO1xyXG5cclxubGV0IHBtZGlyc05lZyA9IFtcclxuICAgIFsgMCwgMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcWRpcnMgPSByZGlycy5jb25jYXQoYmRpcnMpOyAvL21heSBub3QgbmVlZFxyXG5cclxubGV0IHRjb3VudGVyID0gMDtcclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwIC8vV2hpdGUgPSAwLCBCbGFjayA9IDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2MgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChmaWVsZCwgeCwgeSl7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoKHRoaXMsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQocmVsYXRpdmUgPSBbMCwgMF0pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSByZXR1cm4gdGhpcy5maWVsZC5nZXQoW1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzBdICsgcmVsYXRpdmVbMF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gKyByZWxhdGl2ZVsxXVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGx0byl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQubW92ZSh0aGlzLmRhdGEubG9jLCBsdG8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQoKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5wdXQodGhpcy5kYXRhLmxvYywgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGxvYyhhKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0gYVswXTtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0gYVsxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FjaGVMb2MoKXtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlswXSA9IHRoaXMuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMV0gPSB0aGlzLmRhdGEubG9jWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRGaWVsZChmaWVsZCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRMb2MoW3gsIHldKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0geDtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVwbGFjZUlmTmVlZHMoKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA+PSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0LTEgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA8PSAwICYmIHRoaXMuZGF0YS5zaWRlID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRQYXduQXR0YWNrVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuZ2V0UGF3bk1vdmVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldEtuaWdodFBvc3NpYmxlVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgYmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcmRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA0KSB7IC8vUXVlZW5cclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcWRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXROZWlnaHRib3JUaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBnZXRLbmlnaHRQb3NzaWJsZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGttb3ZlbWFwLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgbG9jID0ga21vdmVtYXBbaV07XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChsb2MpO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5laWdodGJvclRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0sIGRpclsxXV0pO1xyXG4gICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpcmVjdGlvblRpbGVzKGRpcil7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgbWF4dCA9IE1hdGgubWF4KHRoaXMuZmllbGQuZGF0YS53aWR0aCwgdGhpcy5maWVsZC5kYXRhLmhlaWdodCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7aTxtYXh0O2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChbZGlyWzBdICogaSwgZGlyWzFdICogaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICAgICAgaWYgKHRpZi50aWxlIHx8ICF0aWYpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bkF0dGFja1RpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwYWRpcnMgOiBwYWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgdGlmLnRpbGUpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UGF3bk1vdmVUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IGRpcnMgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGRpcnNbaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmICYmICF0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
