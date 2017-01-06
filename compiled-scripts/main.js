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
            loc: [-1, -1],
            bonus: 0 //Default piece, 1 are inverter, 2 are multi-side
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
            var side = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            var counted = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tile = _step.value;

                    if (tile.value == value && (side < 0 || tile.data.side == side) && tile.data.bonus == 0) counted++; //return true;
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

            if (tile.data.bonus == 0) {
                var opponent = atile.data.side != tile.data.side;
                var owner = !opponent; //Also possible owner
                var both = true;
                var nobody = false;

                var same = atile.value == tile.value;
                var higterThanOp = tile.value < atile.value;
                var lowerThanOp = atile.value < tile.value;

                var withconverter = atile.data.bonus != 0;
                var twoAndOne = tile.value == 2 && atile.value == 1 || atile.value == 2 && tile.value == 1;
                var exceptTwo = !(tile.value == 2 && tile.value == atile.value);
                var exceptOne = !(tile.value == 1 && tile.value == atile.value);

                //Settings with possible oppositions

                var threesLike = same && exceptTwo && both || twoAndOne && both || higterThanOp && nobody || lowerThanOp && nobody;

                var chessLike = same && opponent || higterThanOp && opponent || lowerThanOp && opponent;

                var classicLike = same && both || higterThanOp && nobody || lowerThanOp && nobody;

                possibles = possibles && classicLike;

                return possibles;
            } else {
                return possibles && atile.data.bonus == 0;
            }

            return false;
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
                tile.data.value = Math.random() < 0.2 ? 4 : 2;
                //tile.data.value = Math.random() < 0.2 ? 2 : 1;
                tile.data.bonus = 0;
                tile.data.side = Math.random() < 0.5 ? 1 : 0;

                var bcheck = this.checkAny(tile.data.value, 1, 1);
                var wcheck = this.checkAny(tile.data.value, 1, 0);
                if (bcheck && wcheck || !bcheck && !wcheck) {
                    tile.data.side = Math.random() < 0.5 ? 1 : 0;
                } else if (!bcheck) {
                    tile.data.side = 1;
                } else if (!wcheck) {
                    tile.data.side = 0;
                }

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
            if (this.inside(loc)) {
                return this.fields[loc[1]][loc[0]]; //return reference
            }
            return Object.assign({}, this.defaultTilemapInfo, {
                loc: [loc[0], loc[1]]
            });
        }
    }, {
        key: "inside",
        value: function inside(loc) {
            return loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height;
        }
    }, {
        key: "put",
        value: function put(loc, tile) {
            if (this.inside(loc)) {
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
            if (this.inside(loc) && this.inside(lto)) {
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
                    if (old && old.tile) {
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

            if (this.inside(loc)) {
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

var bonuses = ["icons/Inverse.png"];

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
                        return tile.data.bonus == 1;
                    },
                    fill: "rgb(192, 192, 192)",
                    font: "rgb(0, 0, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value < 1;
                    },
                    fill: "rgb(32, 32, 32)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 1 && tile.value < 2;
                    },
                    fill: "rgb(255, 224, 128)"
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
            if (style.font) {
                obj.text.attr("fill", style.font);
            } else {
                obj.text.attr("fill", "black");
            }

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
            //conditionValue: 12288 //Threes-like
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

        var aftermove = function aftermove(tile) {
            var c = _this.data.absorbed ? 1 : 2;
            for (var i = 0; i < c; i++) {
                if (Math.random() < 0.3333) _this.field.generateTile();
            }
            _this.data.absorbed = false;

            while (!_this.field.anyPossible() || !(_this.field.checkAny(2, 2, -1) || _this.field.checkAny(4, 2, -1))) {
                //Classic
                //while(!this.field.anyPossible() || !(this.field.checkAny(1, 1, -1) || this.field.checkAny(2, 1, -1))) { //Thress
                if (!_this.field.generateTile()) break;
            }
            if (!_this.field.anyPossible()) _this.graphic.showGameover();

            if (_this.checkCondition() && !_this.data.victory) {
                _this.resolveVictory();
            }
        };

        this.onmoveevent = function (controller, selected, tileinfo) {
            if (_this.field.possible(selected.tile, tileinfo.loc)) {
                _this.saveState();
                _this.field.move(selected.loc, tileinfo.loc);
                aftermove();
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

            //if (opponent) {

            if (oldval == curval
            //|| oldval == 1 && curval == 2 || oldval == 2 && curval == 1 //Thress-like 
            ) {
                    tile.value += oldval;
                } else if (oldval < curval) {
                tile.value = curval;
                tile.data.side = old.data.side;
            } else {
                tile.value = oldval;
            }
            //} 

            if (tile.value < 1) _this.graphic.showGameover();

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
                        prev: tile.data.prev,
                        bonus: tile.data.bonus
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
                    tile.data.bonus = tdat.bonus;
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

function gcd(a, b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {
        var temp = a;a = b;b = temp;
    }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

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
            var _this = this;

            var mloc = this.data.loc;
            if (mloc[0] == loc[0] && mloc[1] == loc[1]) return false;

            var diff = [loc[0] - mloc[0], loc[1] - mloc[1]];
            var mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
            var mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
            var asp = Math.max(Math.abs(diff[0] / diff[1]), Math.abs(diff[1] / diff[0]));

            var dv = gcd(diff[0], diff[1]);
            var dir = [diff[0] / dv, diff[1] / dv];
            var tile = this.field.get(loc);

            var trace = function trace() {
                for (var o = 1; o < mx; o++) {
                    var off = [Math.floor(dir[0] * o), Math.floor(dir[1] * o)];

                    var cloc = [mloc[0] + off[0], mloc[1] + off[1]];
                    if (!_this.field.inside(cloc)) break;

                    if (_this.field.get(cloc).tile) {
                        return false;
                    }
                }
                return true;
            };

            if (this.data.piece == 0) {
                //PAWN
                var ydir = this.data.side == 0 ? -1 : 1;
                if (tile.tile) {
                    return Math.abs(diff[0]) == 1 && diff[1] == ydir;
                } else {
                    return Math.abs(diff[0]) == 0 && diff[1] == ydir;
                }
            } else if (this.data.piece == 1) {
                //Knight
                if (Math.abs(diff[0]) == 1 && Math.abs(diff[1]) == 2 || Math.abs(diff[0]) == 2 && Math.abs(diff[1]) == 1) {
                    return true;
                }
            } else if (this.data.piece == 2) {
                //Bishop
                if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
                    return trace();
                }
            } else if (this.data.piece == 3) {
                //Rook
                if (Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0) {
                    return trace();
                }
            } else if (this.data.piece == 4) {
                //Queen
                if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1 || Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0) {
                    return trace();
                }
            } else if (this.data.piece == 5) {
                //King
                if (Math.abs(diff[0]) <= 1 && Math.abs(diff[1]) <= 1) {
                    return true;
                }
            }

            return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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QUlFO0FBQ0UsMkJBQU8sT0FBUDtBQUNIO0FBQ0osYUFSRCxNQVVBLElBQUksS0FBSyxJQUFMLENBQVUsS0FBVixJQUFtQixDQUF2QixFQUEwQjtBQUFFO0FBQ3hCLG9CQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBTCxDQUFULEtBQXFCLENBQXJCLElBQTBCLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBTCxDQUFULEtBQXFCLENBQW5ELEVBQXNEO0FBQ2xELDJCQUFPLElBQVA7QUFDSDtBQUNKOztBQUVELG1CQUFPLEtBQVA7QUFDSDs7OzRCQW5LVTtBQUNQLG1CQUFPLEtBQUssSUFBTCxDQUFVLEtBQWpCO0FBQ0gsUzswQkFFUyxDLEVBQUU7QUFDUixpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUFsQjtBQUNIOzs7NEJBaUNRO0FBQ0wsbUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBakI7QUFDSCxTOzBCQUVPLEMsRUFBRTtBQUNOLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0g7Ozs7OztRQXlIRyxJLEdBQUEsSTs7O0FDcFBSOztBQUNBOztBQUNBOztBQUNBOztBQUVBLENBQUMsWUFBVTtBQUNQLFFBQUksVUFBVSxzQkFBZDtBQUNBLFFBQUksV0FBVyw4QkFBZjtBQUNBLFFBQUksUUFBUSxrQkFBWjs7QUFFQSxhQUFTLFdBQVQsQ0FBcUIsS0FBckI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsRUFBQyxrQkFBRCxFQUFXLFlBQVgsRUFBakI7QUFDQSxZQUFRLFNBQVIsR0FQTyxDQU9jO0FBQ3hCLENBUkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IodyA9IDQsIGggPSA0KXtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3LCBoZWlnaHQ6IGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy50aWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvID0ge1xyXG4gICAgICAgICAgICB0aWxlSUQ6IC0xLFxyXG4gICAgICAgICAgICB0aWxlOiBudWxsLFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCBcclxuICAgICAgICAgICAgYm9udXM6IDAgLy9EZWZhdWx0IHBpZWNlLCAxIGFyZSBpbnZlcnRlciwgMiBhcmUgbXVsdGktc2lkZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbnRpbGVyZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFkZCA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWJzb3JwdGlvbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgd2lkdGgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FueSh2YWx1ZSwgY291bnQgPSAxLCBzaWRlID0gLTEpe1xyXG4gICAgICAgIGxldCBjb3VudGVkID0gMDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPT0gdmFsdWUgJiYgKHNpZGUgPCAwIHx8IHRpbGUuZGF0YS5zaWRlID09IHNpZGUpICYmIHRpbGUuZGF0YS5ib251cyA9PSAwKSBjb3VudGVkKys7Ly9yZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYoY291bnRlZCA+PSBjb3VudCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYW55UG9zc2libGUoKXtcclxuICAgICAgICBsZXQgYW55cG9zc2libGUgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUodGlsZSwgW2osIGldKSkgYW55cG9zc2libGUrKztcclxuICAgICAgICAgICAgICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aWxlUG9zc2libGVMaXN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gbGlzdDsgLy9lbXB0eVxyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUodGlsZSwgW2osIGldKSkgbGlzdC5wdXNoKHRoaXMuZ2V0KFtqLCBpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwb3NzaWJsZSh0aWxlLCBsdG8pe1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdGlsZWkgPSB0aGlzLmdldChsdG8pO1xyXG4gICAgICAgIGxldCBhdGlsZSA9IHRpbGVpLnRpbGU7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gdGlsZS5wb3NzaWJsZShsdG8pO1xyXG5cclxuICAgICAgICBpZiAoIWF0aWxlKSByZXR1cm4gcGllY2U7XHJcbiAgICAgICAgbGV0IHBvc3NpYmxlcyA9IHBpZWNlO1xyXG5cclxuICAgICAgICBpZih0aWxlLmRhdGEuYm9udXMgPT0gMCl7XHJcbiAgICAgICAgICAgIGxldCBvcHBvbmVudCA9IGF0aWxlLmRhdGEuc2lkZSAhPSB0aWxlLmRhdGEuc2lkZTtcclxuICAgICAgICAgICAgbGV0IG93bmVyID0gIW9wcG9uZW50OyAvL0Fsc28gcG9zc2libGUgb3duZXJcclxuICAgICAgICAgICAgbGV0IGJvdGggPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgbm9ib2R5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2FtZSA9IGF0aWxlLnZhbHVlID09IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBoaWd0ZXJUaGFuT3AgPSB0aWxlLnZhbHVlIDwgYXRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBsb3dlclRoYW5PcCA9IGF0aWxlLnZhbHVlIDwgdGlsZS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aXRoY29udmVydGVyID0gYXRpbGUuZGF0YS5ib251cyAhPSAwO1xyXG4gICAgICAgICAgICBsZXQgdHdvQW5kT25lID0gdGlsZS52YWx1ZSA9PSAyICYmIGF0aWxlLnZhbHVlID09IDEgfHwgYXRpbGUudmFsdWUgPT0gMiAmJiB0aWxlLnZhbHVlID09IDE7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRUd28gPSAhKHRpbGUudmFsdWUgPT0gMiAmJiB0aWxlLnZhbHVlID09IGF0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgbGV0IGV4Y2VwdE9uZSA9ICEodGlsZS52YWx1ZSA9PSAxICYmIHRpbGUudmFsdWUgPT0gYXRpbGUudmFsdWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9TZXR0aW5ncyB3aXRoIHBvc3NpYmxlIG9wcG9zaXRpb25zXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGhyZWVzTGlrZSA9IChcclxuICAgICAgICAgICAgICAgIHNhbWUgJiYgZXhjZXB0VHdvICYmIGJvdGggfHwgXHJcbiAgICAgICAgICAgICAgICB0d29BbmRPbmUgJiYgYm90aCB8fCBcclxuICAgICAgICAgICAgICAgIGhpZ3RlclRoYW5PcCAmJiBub2JvZHkgfHwgXHJcbiAgICAgICAgICAgICAgICBsb3dlclRoYW5PcCAmJiBub2JvZHlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjaGVzc0xpa2UgPSAoXHJcbiAgICAgICAgICAgICAgICBzYW1lICYmIG9wcG9uZW50IHx8IFxyXG4gICAgICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG9wcG9uZW50IHx8IFxyXG4gICAgICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgb3Bwb25lbnRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjbGFzc2ljTGlrZSA9IChcclxuICAgICAgICAgICAgICAgIHNhbWUgJiYgYm90aCB8fCBcclxuICAgICAgICAgICAgICAgIGhpZ3RlclRoYW5PcCAmJiBub2JvZHkgfHwgXHJcbiAgICAgICAgICAgICAgICBsb3dlclRoYW5PcCAmJiBub2JvZHlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHBvc3NpYmxlcyA9IHBvc3NpYmxlcyAmJiBjbGFzc2ljTGlrZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZXM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvc3NpYmxlcyAmJiBhdGlsZS5kYXRhLmJvbnVzID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbm90U2FtZSgpe1xyXG4gICAgICAgIGxldCBzYW1lcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKXtcclxuICAgICAgICAgICAgaWYgKHNhbWVzLmluZGV4T2YodGlsZS52YWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBzYW1lcy5wdXNoKHRpbGUudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdlblBpZWNlKGV4Y2VwdFBhd24pe1xyXG4gICAgICAgIGxldCBwYXduciA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYgKHBhd25yIDwgMC40ICYmICFleGNlcHRQYXduKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYocm5kID49IDAuMCAmJiBybmQgPCAwLjMpe1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuMyAmJiBybmQgPCAwLjYpe1xyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNiAmJiBybmQgPCAwLjgpe1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuOCAmJiBybmQgPCAwLjg1KXtcclxuICAgICAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlVGlsZSgpe1xyXG4gICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9Db3VudCBub3Qgb2NjdXBpZWRcclxuICAgICAgICBsZXQgbm90T2NjdXBpZWQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2ldW2pdLnRpbGUpIG5vdE9jY3VwaWVkLnB1c2godGhpcy5maWVsZHNbaV1bal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihub3RPY2N1cGllZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4yID8gNCA6IDI7XHJcbiAgICAgICAgICAgIC8vdGlsZS5kYXRhLnZhbHVlID0gTWF0aC5yYW5kb20oKSA8IDAuMiA/IDIgOiAxO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuYm9udXMgPSAwO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBiY2hlY2sgPSB0aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMSk7XHJcbiAgICAgICAgICAgIGxldCB3Y2hlY2sgPSB0aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChiY2hlY2sgJiYgd2NoZWNrIHx8ICFiY2hlY2sgJiYgIXdjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgaWYgKCFiY2hlY2spe1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmICghd2NoZWNrKXtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoMCwgdGhpcy50aWxlcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkc1tpXVtqXSA/IHRoaXMuZmllbGRzW2ldW2pdLnRpbGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYodGlsZSl7IC8vaWYgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8pOyAvL0xpbmsgd2l0aCBvYmplY3RcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJlZi5sb2MgPSBbaiwgaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkc1tpXVtqXSA9IHJlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldFRpbGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQobG9jKS50aWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dOyAvL3JldHVybiByZWZlcmVuY2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvLCB7XHJcbiAgICAgICAgICAgIGxvYzogW2xvY1swXSwgbG9jWzFdXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbnNpZGUobG9jKXtcclxuICAgICAgICByZXR1cm4gbG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0KGxvYywgdGlsZSl7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlKGxvYykpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgcmVmLnRpbGVJRCA9IHRpbGUuaWQ7XHJcbiAgICAgICAgICAgIHJlZi50aWxlID0gdGlsZTtcclxuICAgICAgICAgICAgdGlsZS5yZXBsYWNlSWZOZWVkcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZShsb2MsIGx0byl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA9PSBsdG9bMF0gJiYgbG9jWzFdID09IGx0b1sxXSkgcmV0dXJuIHRoaXM7IC8vU2FtZSBsb2NhdGlvblxyXG4gICAgICAgIGlmICh0aGlzLmluc2lkZShsb2MpICYmIHRoaXMuaW5zaWRlKGx0bykpe1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEucHJldlswXSA9IHRpbGUuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEucHJldlsxXSA9IHRpbGUuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEubG9jWzBdID0gbHRvWzBdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1sxXSA9IGx0b1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2xkID0gdGhpcy5maWVsZHNbbHRvWzFdXVtsdG9bMF1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZCAmJiBvbGQudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhYnNvcnB0aW9uKSBmKG9sZC50aWxlLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhcihsdG8sIHRpbGUpLnB1dChsdG8sIHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyKGxvYywgYnl0aWxlID0gbnVsbCl7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlKGxvYykpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgaWYgKHJlZi50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHJlZi50aWxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZHggPSB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUuc2V0TG9jKFstMSwgLTFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZXJlbW92ZSkgZih0aWxlLCBieXRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoKHRpbGUsIGxvYz1bMCwgMF0pe1xyXG4gICAgICAgIGlmKHRpbGUgJiYgdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVzLnB1c2godGlsZSk7XHJcbiAgICAgICAgICAgIHRpbGUuc2V0RmllbGQodGhpcykuc2V0TG9jKGxvYykucHV0KCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhZGQpIGYodGlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0ZpZWxkfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQgaWNvbnNldCA9IFtcclxuICAgIFwiaWNvbnMvV2hpdGVQYXduLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtuaWdodC5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVCaXNob3AucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlUm9vay5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVRdWVlbi5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLaW5nLnBuZ1wiXHJcbl07XHJcblxyXG5sZXQgaWNvbnNldEJsYWNrID0gW1xyXG4gICAgXCJpY29ucy9CbGFja1Bhd24ucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrS25pZ2h0LnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0Jpc2hvcC5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tSb29rLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1F1ZWVuLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tpbmcucG5nXCJcclxuXTtcclxuXHJcbmxldCBib251c2VzID0gW1xyXG4gICAgXCJpY29ucy9JbnZlcnNlLnBuZ1wiXHJcbl07XHJcblxyXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcclxuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcbiAgICBlbHByb3RvLnRvRnJvbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG4gICAgZWxwcm90by50b0JhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRUbyh0aGlzLnBhcGVyKTtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuY2xhc3MgR3JhcGhpY3NFbmdpbmUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzdmduYW1lID0gXCIjc3ZnXCIpe1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb24gPSBbXTtcclxuICAgICAgICB0aGlzLnNuYXAgPSBTbmFwKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc3ZnZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHtcclxuICAgICAgICAgICAgYm9yZGVyOiA0LFxyXG4gICAgICAgICAgICBkZWNvcmF0aW9uV2lkdGg6IDEwLCBcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHBhcnNlRmxvYXQodGhpcy5zdmdlbC5jbGllbnRXaWR0aCksIFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50SGVpZ2h0KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aWxlOiB7XHJcbiAgICAgICAgICAgICAgICAvL3dpZHRoOiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgLy9oZWlnaHQ6IDEyOCwgXHJcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS5kYXRhLmJvbnVzID09IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigxOTIsIDE5MiwgMTkyKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigwLCAwLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPCAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMzIsIDMyLCAzMilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEgJiYgdGlsZS52YWx1ZSA8IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMiAmJiB0aWxlLnZhbHVlIDwgNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMTkyLCAxMjgpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA0ICYmIHRpbGUudmFsdWUgPCA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDk2KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gOCAmJiB0aWxlLnZhbHVlIDwgMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDk2LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDE2ICYmIHRpbGUudmFsdWUgPCAzMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMzIgJiYgdGlsZS52YWx1ZSA8IDY0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDY0ICYmIHRpbGUudmFsdWUgPCAxMjg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDAsIDApXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTI4ICYmIHRpbGUudmFsdWUgPCAyNTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDI1NiAmJiB0aWxlLnZhbHVlIDwgNTEyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxOTIsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA1MTIgJiYgdGlsZS52YWx1ZSA8IDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEwMjQgJiYgdGlsZS52YWx1ZSA8IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIzMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbWlWaXNpYmxlKGxvYyl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgbG9jOiBsb2NcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKGxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1syXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNDAsIDIyNCwgMTkyKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgLy9EZWNvcmF0aXZlIGNoZXNzIGZpZWxkXHJcbiAgICAgICAgdGhpcy5jaGVzc2ZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2ZpZWxkW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9yZGVyID0gMDsvL3RoaXMucGFyYW1zLmJvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBzLmdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmLnJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcixcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxsXCI6IHggJSAyICE9IHkgJSAyID8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIiA6IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZi50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXS1ib3JkZXIvMn0sICR7cG9zWzFdLWJvcmRlci8yfSlgKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdChcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgdHcgKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aCArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCwgXHJcbiAgICAgICAgICAgICAgICA1LCBcclxuICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21wb3NpdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMuc3BsaWNlKDAsIHRoaXMuZ3JhcGhpY3NMYXllcnMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNuYXAuZ3JvdXAoKTtcclxuICAgICAgICBzY2VuZS50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0sICR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSlgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s1XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS53aWR0aCAgPSAodGhpcy5wYXJhbXMuZ3JpZC53aWR0aCAgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAod2lkdGggKyAxKSAgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyB3aWR0aDtcclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLmhlaWdodCA9ICh0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCAtIHRoaXMucGFyYW1zLmJvcmRlciAqIChoZWlnaHQgKyAxKSAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIGhlaWdodDtcclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZU92ZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZpY3RvcnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZUdhbWVPdmVyKCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyNTUsIDIyNCwgMjI0LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiVW5kb1wiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IHRoaXMucGFyYW1zLnRpbGUud2lkdGggKiAwLjE1LCAvL1wiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBvYmoucmVjdGFuZ2xlLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBzdHlsZS5maWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZvbnQpIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgc3R5bGUuZm9udCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVN0eWxlKHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICBpZiAob2JqZWN0KSBvYmplY3QucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd01vdmVkKHRpbGUpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKXtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUud2lkdGggICsgYm9yZGVyKSAqIHgsXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpICogeVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VmlzdWFsaXplcihsb2Mpe1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWxvYyB8fCBcclxuICAgICAgICAgICAgIShsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmZpZWxkLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5maWVsZC5kYXRhLmhlaWdodClcclxuICAgICAgICApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc3VhbGl6YXRpb25bbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aWxlOiB0aWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBmaWxsc2l6ZXcgPSBwYXJhbXMudGlsZS53aWR0aCAgKiAoMC41IC0gMC4yKTtcclxuICAgICAgICBsZXQgZmlsbHNpemVoID0gZmlsbHNpemV3Oy8vcGFyYW1zLnRpbGUuaGVpZ2h0ICogKDEuMCAtIDAuMik7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIGZpbGxzaXpldywgXHJcbiAgICAgICAgICAgIGZpbGxzaXplaCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICAtIGZpbGxzaXpldyAqIDIsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgLSBmaWxsc2l6ZWggKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBzLnRleHQocGFyYW1zLnRpbGUud2lkdGggLyAyLCBwYXJhbXMudGlsZS5oZWlnaHQgLyAyICsgcGFyYW1zLnRpbGUuaGVpZ2h0ICogMC4zNSwgXCJURVNUXCIpO1xyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCwgaWNvbiwgdGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgwLjAxLCAwLjAxKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICBgKTtcclxuICAgICAgICBncm91cC5hdHRyKHtcIm9wYWNpdHlcIjogXCIwXCJ9KTtcclxuXHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgc2NhbGUoMS4wLCAxLjApIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QucG9zID0gcG9zO1xyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0Lmljb24gPSBpY29uO1xyXG4gICAgICAgIG9iamVjdC50ZXh0ID0gdGV4dDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG5cclxuICAgICAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke29iamVjdC5wb3NbMF19LCAke29iamVjdC5wb3NbMV19KSBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0SW50ZXJhY3Rpb25MYXllcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2hvd2VkKCl7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBmb3IgKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2aXMgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIoW3gsIHldKTtcclxuICAgICAgICAgICAgICAgIHZpcy5hcmVhLmF0dHIoe2ZpbGw6IFwidHJhbnNwYXJlbnRcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dTZWxlY3RlZCgpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmlucHV0LnNlbGVjdGVkLnRpbGU7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGUubG9jKTtcclxuICAgICAgICBpZiAob2JqZWN0KXtcclxuICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgyNTUsIDAsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93UG9zc2libGUodGlsZWluZm9saXN0KXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZWluZm8gb2YgdGlsZWluZm9saXN0KXtcclxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlaW5mby50aWxlO1xyXG4gICAgICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIGlmKG9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDAsIDI1NSwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjZWl2ZVRpbGVzKCl7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbGVzKCk7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gdGhpcy5tYW5hZ2VyLnRpbGVzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlcyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXJUaWxlcygpe1xyXG4gICAgICAgIGZvciAobGV0IHRpbGUgb2YgdGhpcy5ncmFwaGljc1RpbGVzKXtcclxuICAgICAgICAgICAgaWYgKHRpbGUpIHRpbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXNoVGlsZSh0aWxlKXtcclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2NvcmUoKXtcclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQuaW5uZXJIVE1MID0gdGhpcy5tYW5hZ2VyLmRhdGEuc2NvcmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoSW5wdXQoaW5wdXQpeyAvL01heSByZXF1aXJlZCBmb3Igc2VuZCBvYmplY3RzIGFuZCBtb3VzZSBldmVudHNcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoR3JhcGhpY3ModGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHtHcmFwaGljc0VuZ2luZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbmNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucG9ydCA9IHtcclxuICAgICAgICAgICAgb25tb3ZlOiBbXSxcclxuICAgICAgICAgICAgb25zdGFydDogW10sXHJcbiAgICAgICAgICAgIG9uc2VsZWN0OiBbXSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1bmRvXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RvcmVTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRoaXMuc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICBpZighdGhpcy5jbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgc3ZnZWxlbWVudCA9IGdyYXBoaWMuc3ZnZWw7XHJcbiAgICAgICAgc3ZnZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5jbGlja2VkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHBvcyA9IGdyYXBoaWMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihvYmplY3QubG9jKTtcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5ncmFwaGljLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IGFyZWEgPSBpbnRlcmFjdGl2ZS5vYmplY3QucmVjdChwb3NbMF0gLSBib3JkZXIvMiwgcG9zWzFdIC0gYm9yZGVyLzIsIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICYmIHNlbGVjdGVkLnRpbGUgJiYgc2VsZWN0ZWQudGlsZS5sb2NbMF0gIT0gLTEgJiYgc2VsZWN0ZWQgIT0gdGhpcy5zZWxlY3RlZCAmJiAhZmllbGQucG9zc2libGUodGhpcy5zZWxlY3RlZC50aWxlLCBvYmplY3QubG9jKSAmJiAhKG9iamVjdC5sb2NbMF0gPT0gdGhpcy5zZWxlY3RlZC5sb2NbMF0gJiYgb2JqZWN0LmxvY1sxXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1sxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9ubW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMsIHNlbGVjdGVkLCBmaWVsZC5nZXQob2JqZWN0LmxvYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSBvYmplY3QuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRJbnRlcmFjdGlvbk1hcCgpe1xyXG4gICAgICAgIGxldCBtYXAgPSB7XHJcbiAgICAgICAgICAgIHRpbGVtYXA6IFtdLCBcclxuICAgICAgICAgICAgZ3JpZG1hcDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZmllbGQuZGF0YS5oZWlnaHQ7aSsrKXtcclxuICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajxmaWVsZC5kYXRhLndpZHRoO2orKyl7XHJcbiAgICAgICAgICAgICAgICBtYXAudGlsZW1hcFtpXVtqXSA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QoZmllbGQuZ2V0KFtqLCBpXSksIGosIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7SW5wdXR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vZmllbGRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIE1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBuZXcgRmllbGQoNCwgNCk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB2aWN0b3J5OiBmYWxzZSwgXHJcbiAgICAgICAgICAgIHNjb3JlOiAwLFxyXG4gICAgICAgICAgICBtb3ZlY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWJzb3JiZWQ6IDAsIFxyXG4gICAgICAgICAgICBjb25kaXRpb25WYWx1ZTogMjA0OFxyXG4gICAgICAgICAgICAvL2NvbmRpdGlvblZhbHVlOiAxMjI4OCAvL1RocmVlcy1saWtlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYWZ0ZXJtb3ZlID0gKHRpbGUpPT57XHJcbiAgICAgICAgICAgIGxldCBjID0gdGhpcy5kYXRhLmFic29yYmVkID8gMSA6IDI7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8YztpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA8IDAuMzMzMykgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkgfHwgISh0aGlzLmZpZWxkLmNoZWNrQW55KDIsIDIsIC0xKSB8fCB0aGlzLmZpZWxkLmNoZWNrQW55KDQsIDIsIC0xKSkpIHsgLy9DbGFzc2ljXHJcbiAgICAgICAgICAgIC8vd2hpbGUoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSB8fCAhKHRoaXMuZmllbGQuY2hlY2tBbnkoMSwgMSwgLTEpIHx8IHRoaXMuZmllbGQuY2hlY2tBbnkoMiwgMSwgLTEpKSkgeyAvL1RocmVzc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYoIHRoaXMuY2hlY2tDb25kaXRpb24oKSAmJiAhdGhpcy5kYXRhLnZpY3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZWxkLnBvc3NpYmxlKHNlbGVjdGVkLnRpbGUsIHRpbGVpbmZvLmxvYykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLm1vdmUoc2VsZWN0ZWQubG9jLCB0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXJtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBsZXQgb2xkdmFsID0gb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgY3VydmFsID0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBvcHBvbmVudCA9IHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBvbGR2YWwgPT0gY3VydmFsIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vfHwgb2xkdmFsID09IDEgJiYgY3VydmFsID09IDIgfHwgb2xkdmFsID09IDIgJiYgY3VydmFsID09IDEgLy9UaHJlc3MtbGlrZSBcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKz0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBvbGQuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL30gXHJcblxyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlIDwgMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2NvcmUgKz0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdChvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93TW92ZWQodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aWxlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnRpbGVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcGllY2U6IHRpbGUuZGF0YS5waWVjZSwgXHJcbiAgICAgICAgICAgICAgICBzaWRlOiB0aWxlLmRhdGEuc2lkZSwgXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGlsZS5kYXRhLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgcHJldjogdGlsZS5kYXRhLnByZXYsIFxyXG4gICAgICAgICAgICAgICAgYm9udXM6IHRpbGUuZGF0YS5ib251c1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3RvcmVTdGF0ZShzdGF0ZSl7XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhdGVzW3RoaXMuc3RhdGVzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZXMucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3RhdGUpIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmRhdGEuc2NvcmUgPSBzdGF0ZS5zY29yZTtcclxuICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IHN0YXRlLnZpY3Rvcnk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgdGRhdCBvZiBzdGF0ZS50aWxlcykge1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IG5ldyBUaWxlKCk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5waWVjZSA9IHRkYXQucGllY2U7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IHRkYXQudmFsdWU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gdGRhdC5zaWRlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEubG9jID0gdGRhdC5sb2M7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2ID0gdGRhdC5wcmV2O1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuYm9udXMgPSB0ZGF0LmJvbnVzO1xyXG4gICAgICAgICAgICB0aWxlLmF0dGFjaCh0aGlzLmZpZWxkLCB0ZGF0LmxvYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlVmljdG9yeSgpe1xyXG4gICAgICAgIGlmKCF0aGlzLmRhdGEudmljdG9yeSl7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dWaWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29uZGl0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQuY2hlY2tBbnkodGhpcy5kYXRhLmNvbmRpdGlvblZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSl7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnN0YXJ0LnB1c2godGhpcy5vbnN0YXJ0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnNlbGVjdC5wdXNoKHRoaXMub25zZWxlY3RldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9ubW92ZS5wdXNoKHRoaXMub25tb3ZlZXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWNzO1xyXG4gICAgICAgIGdyYXBoaWNzLmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy5jcmVhdGVDb21wb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYnVpbGRJbnRlcmFjdGlvbk1hcCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmdhbWVzdGFydCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLm1vdmVjb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5maWVsZC5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGVzLnNwbGljZSgwLCB0aGlzLnN0YXRlcy5sZW5ndGgpO1xyXG4gICAgICAgIGlmKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkpIHRoaXMuZ2FtZXN0YXJ0KCk7IC8vUHJldmVudCBnYW1lb3ZlclxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lcGF1c2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZW92ZXIocmVhc29uKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpbmsoZGlmZil7IC8vPz8/XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuYWdlcn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGttb3ZlbWFwID0gW1xyXG4gICAgWy0yLCAtMV0sXHJcbiAgICBbIDIsIC0xXSxcclxuICAgIFstMiwgIDFdLFxyXG4gICAgWyAyLCAgMV0sXHJcbiAgICBcclxuICAgIFstMSwgLTJdLFxyXG4gICAgWyAxLCAtMl0sXHJcbiAgICBbLTEsICAyXSxcclxuICAgIFsgMSwgIDJdXHJcbl07XHJcblxyXG5sZXQgcmRpcnMgPSBbXHJcbiAgICBbIDAsICAxXSwgLy9kb3duXHJcbiAgICBbIDAsIC0xXSwgLy91cFxyXG4gICAgWyAxLCAgMF0sIC8vbGVmdFxyXG4gICAgWy0xLCAgMF0gIC8vcmlnaHRcclxuXTtcclxuXHJcbmxldCBiZGlycyA9IFtcclxuICAgIFsgMSwgIDFdLFxyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsICAxXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcGFkaXJzID0gW1xyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBtZGlycyA9IFtcclxuICAgIFsgMCwgLTFdXHJcbl07XHJcblxyXG5cclxubGV0IHBhZGlyc05lZyA9IFtcclxuICAgIFsgMSwgMV0sXHJcbiAgICBbLTEsIDFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzTmVnID0gW1xyXG4gICAgWyAwLCAxXVxyXG5dO1xyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gZ2NkKGEsYikge1xyXG4gICAgaWYgKGEgPCAwKSBhID0gLWE7XHJcbiAgICBpZiAoYiA8IDApIGIgPSAtYjtcclxuICAgIGlmIChiID4gYSkge3ZhciB0ZW1wID0gYTsgYSA9IGI7IGIgPSB0ZW1wO31cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGIgPT0gMCkgcmV0dXJuIGE7XHJcbiAgICAgICAgYSAlPSBiO1xyXG4gICAgICAgIGlmIChhID09IDApIHJldHVybiBiO1xyXG4gICAgICAgIGIgJT0gYTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVGlsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsdWU6IDIsIFxyXG4gICAgICAgICAgICBwaWVjZTogMCwgXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIC8veCwgeVxyXG4gICAgICAgICAgICBwcmV2OiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIHNpZGU6IDAgLy9XaGl0ZSA9IDAsIEJsYWNrID0gMVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pZCA9IHRjb3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB2YWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS52YWx1ZSA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2Modil7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvYyA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGZpZWxkLCB4LCB5KXtcclxuICAgICAgICBmaWVsZC5hdHRhY2godGhpcywgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChyZWxhdGl2ZSA9IFswLCAwXSl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHJldHVybiB0aGlzLmZpZWxkLmdldChbXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gKyByZWxhdGl2ZVswXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSArIHJlbGF0aXZlWzFdXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobHRvKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5tb3ZlKHRoaXMuZGF0YS5sb2MsIGx0byk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLnB1dCh0aGlzLmRhdGEubG9jLCB0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgbG9jKGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSBhWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSBhWzFdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWNoZUxvYygpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzBdID0gdGhpcy5kYXRhLmxvY1swXTtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlsxXSA9IHRoaXMuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEZpZWxkKGZpZWxkKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldExvYyhbeCwgeV0pe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSB4O1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXBsYWNlSWZOZWVkcygpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdID49IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQtMSAmJiB0aGlzLmRhdGEuc2lkZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdIDw9IDAgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3NzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBpZiAobWxvY1swXSA9PSBsb2NbMF0gJiYgbWxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSBbXHJcbiAgICAgICAgICAgIGxvY1swXSAtIG1sb2NbMF0sXHJcbiAgICAgICAgICAgIGxvY1sxXSAtIG1sb2NbMV0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbXggPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBtbiA9IE1hdGgubWluKE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcbiAgICAgICAgbGV0IGFzcCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0gLyBkaWZmWzFdKSwgTWF0aC5hYnMoZGlmZlsxXSAvIGRpZmZbMF0pKTtcclxuXHJcbiAgICAgICAgbGV0IGR2ID0gZ2NkKGRpZmZbMF0sIGRpZmZbMV0pO1xyXG4gICAgICAgIGxldCBkaXIgPSBbZGlmZlswXSAvIGR2LCBkaWZmWzFdIC8gZHZdO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZC5nZXQobG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYWNlID0gKCk9PntcclxuICAgICAgICAgICAgZm9yKGxldCBvPTE7bzxteDtvKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZiA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclswXSAqIG8pLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclsxXSAqIG8pXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMF0gKyBvZmZbMF0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMV0gKyBvZmZbMV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuaW5zaWRlKGNsb2MpKSBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWVsZC5nZXQoY2xvYykudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgbGV0IHlkaXIgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gLTEgOiAxO1xyXG4gICAgICAgICAgICBpZiAodGlsZS50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoZGlmZlswXSkgPT0gMSAmJiBkaWZmWzFdID09IHlkaXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoZGlmZlswXSkgPT0gMCAmJiBkaWZmWzFdID09IHlkaXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMSkgeyAvL0tuaWdodFxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaWZmWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpZmZbMV0pID09IDIgfHxcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpZmZbMF0pID09IDIgJiYgTWF0aC5hYnMoZGlmZlsxXSkgPT0gMVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMCAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEgfHwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAwXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNCkgeyAvL1F1ZWVuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEgfHwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDAgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaWZmWzBdKSA8PSAxICYmIE1hdGguYWJzKGRpZmZbMV0pIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
