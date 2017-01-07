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
            bonus: 0, //Default piece, 1 are inverter, 2 are multi-side
            available: true
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

                            if (tile.possible([j, i])) anypossible++;
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
                    if (tile.possible([j, i])) list.push(this.get([j, i]));
                }
            }
            return list;
        }
    }, {
        key: "possible",
        value: function possible(tile, lto) {
            if (!tile) return false;

            var tilei = this.get(lto);
            if (!tilei.available) return false;

            var atile = tilei.tile;
            var piece = tile.possibleMove(lto);

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
            //return 3; //Debug

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
                    var f = this.get([j, i]);
                    if (!f.tile && f.available) {
                        notOccupied.push(this.fields[i][j]);
                    }
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
        key: "tilesByDirection",
        value: function tilesByDirection(diff) {
            var tiles = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.tiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var tile = _step4.value;

                    if (tile.responsive(diff)) tiles.push(tile);
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

            return tiles;
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
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = this.ontileremove[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var f = _step5.value;
                                f(tile);
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
                loc: [loc[0], loc[1]],
                available: false
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
        key: "isAvailable",
        value: function isAvailable(lto) {
            return this.get(lto).available;
        }
    }, {
        key: "move",
        value: function move(loc, lto) {
            var tile = this.getTile(loc);
            if (loc[0] == lto[0] && loc[1] == lto[1]) return this; //Same location
            if (this.inside(loc) && this.inside(lto) && this.isAvailable(lto) && tile && !tile.data.moved && tile.possible(lto)) {
                var ref = this.get(loc);
                ref.tileID = -1;
                ref.tile = null;

                tile.data.moved = true;
                tile.data.prev[0] = tile.data.loc[0];
                tile.data.prev[1] = tile.data.loc[1];
                tile.data.loc[0] = lto[0];
                tile.data.loc[1] = lto[1];

                var old = this.fields[lto[1]][lto[0]];
                if (old && old.tile) {
                    old.tile.onabsorb();
                    tile.onhit();
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = this.ontileabsorption[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var f = _step6.value;
                            f(old.tile, tile);
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

                this.clear(lto, tile).put(lto, tile);
                tile.onmove();
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.ontilemove[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var _f = _step7.value;
                        _f(tile);
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
                            var _iteratorNormalCompletion8 = true;
                            var _didIteratorError8 = false;
                            var _iteratorError8 = undefined;

                            try {
                                for (var _iterator8 = this.ontileremove[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                    var f = _step8.value;
                                    f(tile, bytile);
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
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this.ontileadd[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var f = _step9.value;
                        f(tile);
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

var iconset = ["icons/WhitePawn.svg", "icons/WhiteKnight.svg", "icons/WhiteBishop.svg", "icons/WhiteRook.svg", "icons/WhiteQueen.svg", "icons/WhiteKing.svg"];

var iconsetBlack = ["icons/BlackPawn.svg", "icons/BlackKnight.svg", "icons/BlackBishop.svg", "icons/BlackRook.svg", "icons/BlackQueen.svg", "icons/BlackKing.svg"];

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

            var fillsizew = params.tile.width * (0.5 - 0.125);
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
                    if (_selected && _selected.tile && _selected.tile.loc[0] != -1 && _selected != _this2.selected && (!_this2.selected.tile || !_this2.selected.tile.possible(object.loc))) {
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

var _tile3 = require("./tile");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

Array.prototype.set = function (array) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    for (var i = 0; i < array.length; i++) {
        this[offset + i] = array[i];
    }
};

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
            //let c = this.data.absorbed ? 1 : 2;
            var c = 1;
            for (var i = 0; i < c; i++) {
                //if(Math.random() < 0.3333) this.field.generateTile();
                //if(Math.random() < 1.0) this.field.generateTile();
                if (Math.random() < 0.6666) _this.field.generateTile();
            }
            _this.data.absorbed = false;

            while (!_this.field.anyPossible()) {
                //2048
                //while(!this.field.anyPossible() || !(this.field.checkAny(2, 2, -1) || this.field.checkAny(4, 2, -1))) { //Classic
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
                (function () {
                    _this.saveState();
                    //this.field.move(selected.loc, tileinfo.loc);

                    var diff = [tileinfo.loc[0] - selected.loc[0], tileinfo.loc[1] - selected.loc[1]];
                    var dv = gcd(diff[0], diff[1]);
                    var dir = [diff[0] / dv, diff[1] / dv];
                    var mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));

                    // 2048 alike
                    diff[0] = dir[0] * _this.field.width;
                    diff[1] = dir[1] * _this.field.height;

                    var tileList = [selected.tile];
                    //let tileList = this.field.tiles.concat([]); // 2048 alike moving (grouping)
                    //let tileList = this.field.tilesByDirection(diff);

                    tileList.sort(function (tile, op) {
                        var shiftingX = Math.sign(-dir[0] * (tile.loc[0] - op.loc[0]));
                        return Math.sign(shiftingX);
                    });

                    tileList.sort(function (tile, op) {
                        var shiftingY = Math.sign(-dir[1] * (tile.loc[1] - op.loc[1]));
                        return Math.sign(shiftingY);
                    });

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = tileList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _tile = _step.value;

                            _tile.setQueue([diff[0], diff[1]]);
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

                    for (var i = 0; i <= mx; i++) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = tileList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var tile = _step2.value;

                                tile.move(tile.leastQueue());
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

                    var movedcnt = 0;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = tileList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _tile2 = _step3.value;

                            if (_tile2.moved) movedcnt++;
                            _tile2.queue[0] = 0;
                            _tile2.queue[1] = 0;
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

                    if (movedcnt > 0) aftermove();
                })();
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
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.field.tiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var tile = _step4.value;

                    state.tiles.push({
                        loc: tile.data.loc.concat([]),
                        queue: tile.data.queue.concat([]),
                        piece: tile.data.piece,
                        side: tile.data.side,
                        value: tile.data.value,
                        prev: tile.data.prev.concat([]),
                        bonus: tile.data.bonus,
                        moved: tile.data.moved
                    });
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

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = state.tiles[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var tdat = _step5.value;

                    var tile = new _tile3.Tile();
                    tile.data.queue.set(tdat.queue);
                    tile.data.piece = tdat.piece;
                    tile.data.value = tdat.value;
                    tile.data.side = tdat.side;
                    tile.data.loc.set(tdat.loc);
                    tile.data.prev.set(tdat.prev);
                    tile.data.bonus = tdat.bonus;
                    tile.data.moved = tdat.moved;
                    tile.attach(this.field, tdat.loc);
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
            side: 0, //White = 0, Black = 1
            queue: [0, 0],
            moved: false
        };
        this.id = tcounter++;
    }

    _createClass(Tile, [{
        key: "onhit",
        value: function onhit() {
            return this;
        }
    }, {
        key: "onabsorb",
        value: function onabsorb() {
            return this;
        }
    }, {
        key: "onmove",
        value: function onmove() {
            this.data.queue[0] -= this.loc[0] - this.prev[0];
            this.data.queue[1] -= this.loc[1] - this.prev[1];
            return this;
        }
    }, {
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
        key: "setQueue",
        value: function setQueue(diff) {
            this.data.moved = false;
            this.data.queue[0] = diff[0];
            this.data.queue[1] = diff[1];
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
        key: "responsive",
        value: function responsive(dir) {
            var mloc = this.data.loc;
            var least = this.least(dir);
            if (least[0] != mloc[0] || least[1] != mloc[1]) return true;
            return false;
        }
    }, {
        key: "leastQueue",
        value: function leastQueue() {
            return this.least(this.queue);
        }
    }, {
        key: "least",
        value: function least(diff) {
            var _this = this;

            var mloc = this.data.loc;
            if (diff[0] == 0 && diff[1] == 0) return [mloc[0], mloc[1]];

            var mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
            var mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
            var asp = Math.max(Math.abs(diff[0] / diff[1]), Math.abs(diff[1] / diff[0]));

            var dv = gcd(diff[0], diff[1]);
            var dir = [diff[0] / dv, diff[1] / dv];

            var trace = function trace() {
                var least = [mloc[0], mloc[1]];
                for (var o = 1; o <= mx; o++) {
                    var off = [Math.floor(dir[0] * o), Math.floor(dir[1] * o)];

                    var cloc = [mloc[0] + off[0], mloc[1] + off[1]];

                    if (!_this.field.inside(cloc) || !_this.possible(cloc)) return least;

                    least[0] = cloc[0];
                    least[1] = cloc[1];

                    if (_this.field.get(cloc).tile) {
                        return least;
                    }
                }
                return least;
            };

            if (this.data.piece == 0) {
                //PAWN
                var ydir = this.data.side == 0 ? -1 : 1;
                if (dir[1] == ydir) {
                    var cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                    if (this.possible(cloc)) return cloc;
                }
            } else if (this.data.piece == 1) {
                //Knight
                if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 2 || Math.abs(dir[0]) == 2 && Math.abs(dir[1]) == 1) {
                    var _cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                    if (this.possible(_cloc)) return _cloc;
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
                if (Math.abs(dir[0]) <= 1 && Math.abs(dir[1]) <= 1) {
                    var _cloc2 = [mloc[0] + dir[0], mloc[1] + dir[1]];
                    if (this.possible(_cloc2)) return _cloc2;
                }
            }

            return [mloc[0], mloc[1]];
        }
    }, {
        key: "possible",
        value: function possible(loc) {
            return this.field.possible(this, loc);
        }
    }, {
        key: "possibleMove",
        value: function possibleMove(loc) {
            var _this2 = this;

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
                    if (!_this2.field.inside(cloc)) return false;
                    if (_this2.field.get(cloc).tile) return false;
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
        key: "diff",
        get: function get() {
            return [this.data.loc[0] - this.data.prev[0], this.data.loc[1] - this.data.prev[1]];
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
    }, {
        key: "prev",
        get: function get() {
            return this.data.prev;
        }
    }, {
        key: "moved",
        get: function get() {
            return this.data.moved;
        }
    }, {
        key: "queue",
        get: function get() {
            return this.data.queue;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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bUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDSCxTOzBCQUVTLEMsRUFBRTtBQUNSLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLENBQWxCO0FBQ0g7Ozs0QkFFUztBQUNOLG1CQUFPLENBQUMsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLENBQWYsQ0FBcEIsRUFBdUMsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLENBQWYsQ0FBMUQsQ0FBUDtBQUNIOzs7NEJBdURRO0FBQ0wsbUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBakI7QUFDSCxTOzBCQUVPLEMsRUFBRTtBQUNOLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0g7Ozs0QkF4RFM7QUFDTixtQkFBTyxLQUFLLElBQUwsQ0FBVSxJQUFqQjtBQUNIOzs7NEJBMkNVO0FBQ1AsbUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDSDs7OzRCQVdVO0FBQ1AsbUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDSDs7Ozs7O1FBNk9HLEksR0FBQSxJOzs7QUN4WVI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsQ0FBQyxZQUFVO0FBQ1AsUUFBSSxVQUFVLHNCQUFkO0FBQ0EsUUFBSSxXQUFXLDhCQUFmO0FBQ0EsUUFBSSxRQUFRLGtCQUFaOztBQUVBLGFBQVMsV0FBVCxDQUFxQixLQUFyQjtBQUNBLFlBQVEsUUFBUixDQUFpQixFQUFDLGtCQUFELEVBQVcsWUFBWCxFQUFqQjtBQUNBLFlBQVEsU0FBUixHQVBPLENBT2M7QUFDeEIsQ0FSRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3ID0gNCwgaCA9IDQpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IHcsIGhlaWdodDogaFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLnRpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8gPSB7XHJcbiAgICAgICAgICAgIHRpbGVJRDogLTEsXHJcbiAgICAgICAgICAgIHRpbGU6IG51bGwsXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBib251czogMCwgLy9EZWZhdWx0IHBpZWNlLCAxIGFyZSBpbnZlcnRlciwgMiBhcmUgbXVsdGktc2lkZVxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub250aWxlcmVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhZGQgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFic29ycHRpb24gPSBbXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHdpZHRoKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tBbnkodmFsdWUsIGNvdW50ID0gMSwgc2lkZSA9IC0xKXtcclxuICAgICAgICBsZXQgY291bnRlZCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlID09IHZhbHVlICYmIChzaWRlIDwgMCB8fCB0aWxlLmRhdGEuc2lkZSA9PSBzaWRlKSAmJiB0aWxlLmRhdGEuYm9udXMgPT0gMCkgY291bnRlZCsrOy8vcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGlmKGNvdW50ZWQgPj0gY291bnQpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFueVBvc3NpYmxlKCl7XHJcbiAgICAgICAgbGV0IGFueXBvc3NpYmxlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aWxlLnBvc3NpYmxlKFtqLCBpXSkpIGFueXBvc3NpYmxlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZVBvc3NpYmxlTGlzdCh0aWxlKXtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGxpc3Q7IC8vZW1wdHlcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aWxlLnBvc3NpYmxlKFtqLCBpXSkpIGxpc3QucHVzaCh0aGlzLmdldChbaiwgaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcG9zc2libGUodGlsZSwgbHRvKXtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVpID0gdGhpcy5nZXQobHRvKTtcclxuICAgICAgICBpZiAoIXRpbGVpLmF2YWlsYWJsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYXRpbGUgPSB0aWxlaS50aWxlO1xyXG4gICAgICAgIGxldCBwaWVjZSA9IHRpbGUucG9zc2libGVNb3ZlKGx0byk7XHJcblxyXG4gICAgICAgIGlmICghYXRpbGUpIHJldHVybiBwaWVjZTtcclxuICAgICAgICBsZXQgcG9zc2libGVzID0gcGllY2U7XHJcblxyXG4gICAgICAgIGlmKHRpbGUuZGF0YS5ib251cyA9PSAwKXtcclxuICAgICAgICAgICAgbGV0IG9wcG9uZW50ID0gYXRpbGUuZGF0YS5zaWRlICE9IHRpbGUuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICBsZXQgb3duZXIgPSAhb3Bwb25lbnQ7IC8vQWxzbyBwb3NzaWJsZSBvd25lclxyXG4gICAgICAgICAgICBsZXQgYm90aCA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCBub2JvZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzYW1lID0gYXRpbGUudmFsdWUgPT0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGhpZ3RlclRoYW5PcCA9IHRpbGUudmFsdWUgPCBhdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGxvd2VyVGhhbk9wID0gYXRpbGUudmFsdWUgPCB0aWxlLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHdpdGhjb252ZXJ0ZXIgPSBhdGlsZS5kYXRhLmJvbnVzICE9IDA7XHJcbiAgICAgICAgICAgIGxldCB0d29BbmRPbmUgPSB0aWxlLnZhbHVlID09IDIgJiYgYXRpbGUudmFsdWUgPT0gMSB8fCBhdGlsZS52YWx1ZSA9PSAyICYmIHRpbGUudmFsdWUgPT0gMTtcclxuICAgICAgICAgICAgbGV0IGV4Y2VwdFR3byA9ICEodGlsZS52YWx1ZSA9PSAyICYmIHRpbGUudmFsdWUgPT0gYXRpbGUudmFsdWUpO1xyXG4gICAgICAgICAgICBsZXQgZXhjZXB0T25lID0gISh0aWxlLnZhbHVlID09IDEgJiYgdGlsZS52YWx1ZSA9PSBhdGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL1NldHRpbmdzIHdpdGggcG9zc2libGUgb3Bwb3NpdGlvbnNcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0aHJlZXNMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBleGNlcHRUd28gJiYgYm90aCB8fCBcclxuICAgICAgICAgICAgICAgIHR3b0FuZE9uZSAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG5vYm9keSB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG5vYm9keVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNoZXNzTGlrZSA9IChcclxuICAgICAgICAgICAgICAgIHNhbWUgJiYgb3Bwb25lbnQgfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgb3Bwb25lbnQgfHwgXHJcbiAgICAgICAgICAgICAgICBsb3dlclRoYW5PcCAmJiBvcHBvbmVudFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNsYXNzaWNMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG5vYm9keSB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG5vYm9keVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcG9zc2libGVzID0gcG9zc2libGVzICYmIGNsYXNzaWNMaWtlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zc2libGVzICYmIGF0aWxlLmRhdGEuYm9udXMgPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuUGllY2UoZXhjZXB0UGF3bil7XHJcbiAgICAgICAgLy9yZXR1cm4gMzsgLy9EZWJ1Z1xyXG5cclxuICAgICAgICBsZXQgcGF3bnIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGlmIChwYXduciA8IDAuNCAmJiAhZXhjZXB0UGF3bikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBybmQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGlmKHJuZCA+PSAwLjAgJiYgcm5kIDwgMC4zKXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjMgJiYgcm5kIDwgMC42KXtcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjYgJiYgcm5kIDwgMC44KXtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjggJiYgcm5kIDwgMC45KXtcclxuICAgICAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlVGlsZSgpe1xyXG4gICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9Db3VudCBub3Qgb2NjdXBpZWRcclxuICAgICAgICBsZXQgbm90T2NjdXBpZWQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZiA9IHRoaXMuZ2V0KFtqLCBpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWYudGlsZSAmJiBmLmF2YWlsYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdE9jY3VwaWVkLnB1c2godGhpcy5maWVsZHNbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihub3RPY2N1cGllZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4yID8gNCA6IDI7XHJcbiAgICAgICAgICAgIC8vdGlsZS5kYXRhLnZhbHVlID0gTWF0aC5yYW5kb20oKSA8IDAuMiA/IDIgOiAxO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuYm9udXMgPSAwO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgIGxldCBiY2hlY2sgPSB0aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMSk7XHJcbiAgICAgICAgICAgIGxldCB3Y2hlY2sgPSB0aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChiY2hlY2sgJiYgd2NoZWNrIHx8ICFiY2hlY2sgJiYgIXdjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgaWYgKCFiY2hlY2spe1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmICghd2NoZWNrKXtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVzQnlEaXJlY3Rpb24oZGlmZil7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZS5yZXNwb25zaXZlKGRpZmYpKSB0aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKDAsIHRoaXMudGlsZXMubGVuZ3RoKTtcclxuICAgICAgICAvL3RoaXMuZmllbGRzLnNwbGljZSgwLCB0aGlzLmZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV0pIHRoaXMuZmllbGRzW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZHNbaV1bal0gPyB0aGlzLmZpZWxkc1tpXVtqXS50aWxlIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUpeyAvL2lmIGhhdmVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlKGxvYykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV0sIFxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluc2lkZShsb2Mpe1xyXG4gICAgICAgIHJldHVybiBsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdXQobG9jLCB0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpc0F2YWlsYWJsZShsdG8pe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChsdG8pLmF2YWlsYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZ2V0VGlsZShsb2MpO1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSAmJiB0aGlzLmluc2lkZShsdG8pICYmIHRoaXMuaXNBdmFpbGFibGUobHRvKSAmJiB0aWxlICYmICF0aWxlLmRhdGEubW92ZWQgJiYgdGlsZS5wb3NzaWJsZShsdG8pKXtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZ2V0KGxvYyk7XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdGlsZS5kYXRhLm1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldlsxXSA9IHRpbGUuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICBsZXQgb2xkID0gdGhpcy5maWVsZHNbbHRvWzFdXVtsdG9bMF1dO1xyXG4gICAgICAgICAgICBpZiAob2xkICYmIG9sZC50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBvbGQudGlsZS5vbmFic29yYigpO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5vbmhpdCgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFic29ycHRpb24pIGYob2xkLnRpbGUsIHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKGx0bywgdGlsZSkucHV0KGx0bywgdGlsZSk7XHJcbiAgICAgICAgICAgIHRpbGUub25tb3ZlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIobG9jLCBieXRpbGUgPSBudWxsKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCJpY29ucy9XaGl0ZVBhd24uc3ZnXCIsXHJcbiAgICBcImljb25zL1doaXRlS25pZ2h0LnN2Z1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUJpc2hvcC5zdmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVSb29rLnN2Z1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVF1ZWVuLnN2Z1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtpbmcuc3ZnXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcImljb25zL0JsYWNrUGF3bi5zdmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLbmlnaHQuc3ZnXCIsXHJcbiAgICBcImljb25zL0JsYWNrQmlzaG9wLnN2Z1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1Jvb2suc3ZnXCIsXHJcbiAgICBcImljb25zL0JsYWNrUXVlZW4uc3ZnXCIsXHJcbiAgICBcImljb25zL0JsYWNrS2luZy5zdmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnN2Z2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50V2lkdGgpLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUuZGF0YS5ib251cyA9PSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMTkyLCAxOTIsIDE5MilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMCwgMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlIDwgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDMyLCAzMiwgMzIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxICYmIHRpbGUudmFsdWUgPCAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDEyOClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCk7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5hcmVhID0gcmVjdDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlRGVjb3JhdGlvbigpe1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCAgKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC53aWR0aCA9IHR3O1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQuaGVpZ2h0ID0gdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlY29yYXRpb25MYXllciA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF07XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdCgwLCAwLCB0dywgdGgsIDAsIDApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjQwLCAyMjQsIDE5MilcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vRGVjb3JhdGl2ZSBjaGVzcyBmaWVsZFxyXG4gICAgICAgIHRoaXMuY2hlc3NmaWVsZCA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlc3NmaWVsZFt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvcmRlciA9IDA7Ly90aGlzLnBhcmFtcy5ib3JkZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gcy5ncm91cCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICAgICAgICAgIGxldCByZWN0ID0gZi5yZWN0KFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZmlsbFwiOiB4ICUgMiAhPSB5ICUgMiA/IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCIgOiBcInJnYmEoMCwgMCwgMCwgMC4xKVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGYudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF0tYm9yZGVyLzJ9LCAke3Bvc1sxXS1ib3JkZXIvMn0pYCk7XHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJlY3QgPSBkZWNvcmF0aW9uTGF5ZXIub2JqZWN0LnJlY3QoXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgLXRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aC8yLCBcclxuICAgICAgICAgICAgICAgIHR3ICsgdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGggKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsIFxyXG4gICAgICAgICAgICAgICAgNSwgXHJcbiAgICAgICAgICAgICAgICA1XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiLFxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBcInJnYigxMjgsIDY0LCAzMilcIixcclxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tcG9zaXRpb24oKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzTGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHNjZW5lID0gdGhpcy5zbmFwLmdyb3VwKCk7XHJcbiAgICAgICAgc2NlbmUudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGh9LCAke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0pYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdID0geyAvL0RlY29yYXRpb25cclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1szXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLnRpbGUud2lkdGggID0gKHRoaXMucGFyYW1zLmdyaWQud2lkdGggIC0gdGhpcy5wYXJhbXMuYm9yZGVyICogKHdpZHRoICsgMSkgIC0gdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoKjIpIC8gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgPSAodGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAoaGVpZ2h0ICsgMSkgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyBoZWlnaHQ7XHJcblxyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XVt4XSA9IHRoaXMuY3JlYXRlU2VtaVZpc2libGUoW3gsIHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlVGlsZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZURlY29yYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVPdmVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWN0b3J5KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVHYW1lT3Zlcigpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjU1LCAyMjQsIDIyNCwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiR2FtZSBPdmVyXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgKyA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiAtIDEwNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RvcmVTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIlVuZG9cIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY3JlYXRlVmljdG9yeSgpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzVdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjI0LCAyMjQsIDI1NiwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiWW91IHdvbiEgWW91IGdvdCBcIiArIHRoaXMubWFuYWdlci5kYXRhLmNvbmRpdGlvblZhbHVlICsgXCIhXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgKyA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDEyOCwgMTI4LCAyNTUsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJDb250aW51ZS4uLlwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuID0gc2NyZWVuO1xyXG4gICAgICAgIHNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93VmljdG9yeSgpe1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJ9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlVmljdG9yeSgpe1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9LCA1MDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93R2FtZW92ZXIoKXtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDEwMDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlR2FtZW92ZXIoKXtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9LCA1MDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0T2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5ncmFwaGljc1RpbGVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmdyYXBoaWNzVGlsZXNbaV0udGlsZSA9PSB0aWxlKSByZXR1cm4gdGhpcy5ncmFwaGljc1RpbGVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2hhbmdlU3R5bGVPYmplY3Qob2JqLCBuZWVkdXAgPSBmYWxzZSl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBvYmoudGlsZTtcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKHRpbGUubG9jKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBvYmouZWxlbWVudDtcclxuICAgICAgICAvL2dyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWApO1xyXG5cclxuICAgICAgICBpZiAobmVlZHVwKSBncm91cC50b0Zyb250KCk7XHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYFxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLnBvcyA9IHBvcztcclxuXHJcbiAgICAgICAgbGV0IHN0eWxlID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IF9zdHlsZSBvZiB0aGlzLnBhcmFtcy50aWxlLnN0eWxlcykge1xyXG4gICAgICAgICAgICBpZihfc3R5bGUuY29uZGl0aW9uLmNhbGwob2JqLnRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZSA9IF9zdHlsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmoudGV4dC5hdHRyKHtcInRleHRcIjogYCR7dGlsZS52YWx1ZX1gfSk7XHJcbiAgICAgICAgb2JqLmljb24uYXR0cih7XCJ4bGluazpocmVmXCI6IG9iai50aWxlLmRhdGEuc2lkZSA9PSAwID8gaWNvbnNldFtvYmoudGlsZS5kYXRhLnBpZWNlXSA6IGljb25zZXRCbGFja1tvYmoudGlsZS5kYXRhLnBpZWNlXX0pO1xyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiB0aGlzLnBhcmFtcy50aWxlLndpZHRoICogMC4xNSwgLy9cIjE2cHhcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIiwgXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCJibGFja1wiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFzdHlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgb2JqLnJlY3RhbmdsZS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogc3R5bGUuZmlsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdHlsZS5mb250KSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIHN0eWxlLmZvbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTdHlsZSh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmopO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgaWYgKG9iamVjdCkgb2JqZWN0LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dNb3ZlZCh0aWxlKXtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSl7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLndpZHRoICArIGJvcmRlcikgKiB4LFxyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKSAqIHlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFZpc3VhbGl6ZXIobG9jKXtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICFsb2MgfHwgXHJcbiAgICAgICAgICAgICEobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5maWVsZC5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpXHJcbiAgICAgICAgKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXN1YWxpemF0aW9uW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgdGlsZTogdGlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKHRpbGUubG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdLm9iamVjdDtcclxuICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCxcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZmlsbHNpemV3ID0gcGFyYW1zLnRpbGUud2lkdGggICogKDAuNSAtIDAuMTI1KTtcclxuICAgICAgICBsZXQgZmlsbHNpemVoID0gZmlsbHNpemV3Oy8vcGFyYW1zLnRpbGUuaGVpZ2h0ICogKDEuMCAtIDAuMik7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIGZpbGxzaXpldywgXHJcbiAgICAgICAgICAgIGZpbGxzaXplaCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoICAtIGZpbGxzaXpldyAqIDIsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQgLSBmaWxsc2l6ZWggKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBzLnRleHQocGFyYW1zLnRpbGUud2lkdGggLyAyLCBwYXJhbXMudGlsZS5oZWlnaHQgLyAyICsgcGFyYW1zLnRpbGUuaGVpZ2h0ICogMC4zNSwgXCJURVNUXCIpO1xyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCwgaWNvbiwgdGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgwLjAxLCAwLjAxKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICBgKTtcclxuICAgICAgICBncm91cC5hdHRyKHtcIm9wYWNpdHlcIjogXCIwXCJ9KTtcclxuXHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgc2NhbGUoMS4wLCAxLjApIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QucG9zID0gcG9zO1xyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0Lmljb24gPSBpY29uO1xyXG4gICAgICAgIG9iamVjdC50ZXh0ID0gdGV4dDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG5cclxuICAgICAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke29iamVjdC5wb3NbMF19LCAke29iamVjdC5wb3NbMV19KSBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0SW50ZXJhY3Rpb25MYXllcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2hvd2VkKCl7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBmb3IgKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2aXMgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIoW3gsIHldKTtcclxuICAgICAgICAgICAgICAgIHZpcy5hcmVhLmF0dHIoe2ZpbGw6IFwidHJhbnNwYXJlbnRcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dTZWxlY3RlZCgpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmlucHV0LnNlbGVjdGVkLnRpbGU7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGUubG9jKTtcclxuICAgICAgICBpZiAob2JqZWN0KXtcclxuICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgyNTUsIDAsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93UG9zc2libGUodGlsZWluZm9saXN0KXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZWluZm8gb2YgdGlsZWluZm9saXN0KXtcclxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlaW5mby50aWxlO1xyXG4gICAgICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIGlmKG9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDAsIDI1NSwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjZWl2ZVRpbGVzKCl7XHJcbiAgICAgICAgdGhpcy5jbGVhclRpbGVzKCk7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gdGhpcy5tYW5hZ2VyLnRpbGVzO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlcyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXJUaWxlcygpe1xyXG4gICAgICAgIGZvciAobGV0IHRpbGUgb2YgdGhpcy5ncmFwaGljc1RpbGVzKXtcclxuICAgICAgICAgICAgaWYgKHRpbGUpIHRpbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXNoVGlsZSh0aWxlKXtcclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5wdXNoKHRoaXMuY3JlYXRlT2JqZWN0KHRpbGUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2NvcmUoKXtcclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQuaW5uZXJIVE1MID0gdGhpcy5tYW5hZ2VyLmRhdGEuc2NvcmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMucHVzaFRpbGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoSW5wdXQoaW5wdXQpeyAvL01heSByZXF1aXJlZCBmb3Igc2VuZCBvYmplY3RzIGFuZCBtb3VzZSBldmVudHNcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoR3JhcGhpY3ModGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IHtHcmFwaGljc0VuZ2luZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcbmNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucG9ydCA9IHtcclxuICAgICAgICAgICAgb25tb3ZlOiBbXSxcclxuICAgICAgICAgICAgb25zdGFydDogW10sXHJcbiAgICAgICAgICAgIG9uc2VsZWN0OiBbXSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1bmRvXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc3RhcnRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51bmRvYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RvcmVTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRoaXMuc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlR2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICBpZighdGhpcy5jbGlja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGhpcy5zZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgc3ZnZWxlbWVudCA9IGdyYXBoaWMuc3ZnZWw7XHJcbiAgICAgICAgc3ZnZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5jbGlja2VkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHBvcyA9IGdyYXBoaWMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihvYmplY3QubG9jKTtcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5ncmFwaGljLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IGFyZWEgPSBpbnRlcmFjdGl2ZS5vYmplY3QucmVjdChwb3NbMF0gLSBib3JkZXIvMiwgcG9zWzFdIC0gYm9yZGVyLzIsIHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyLCBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gZmllbGQuZ2V0KG9iamVjdC5sb2MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkICYmIHNlbGVjdGVkLnRpbGUgJiYgc2VsZWN0ZWQudGlsZS5sb2NbMF0gIT0gLTEgJiYgc2VsZWN0ZWQgIT0gdGhpcy5zZWxlY3RlZCAmJiAoIXRoaXMuc2VsZWN0ZWQudGlsZSB8fCAhdGhpcy5zZWxlY3RlZC50aWxlLnBvc3NpYmxlKG9iamVjdC5sb2MpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25tb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcywgc2VsZWN0ZWQsIGZpZWxkLmdldChvYmplY3QubG9jKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IG9iamVjdC5hcmVhID0gYXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBhcmVhLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEludGVyYWN0aW9uTWFwKCl7XHJcbiAgICAgICAgbGV0IG1hcCA9IHtcclxuICAgICAgICAgICAgdGlsZW1hcDogW10sIFxyXG4gICAgICAgICAgICBncmlkbWFwOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZC5kYXRhLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBtYXAudGlsZW1hcFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPGZpZWxkLmRhdGEud2lkdGg7aisrKXtcclxuICAgICAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldW2pdID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvbk9iamVjdChmaWVsZC5nZXQoW2osIGldKSwgaiwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtJbnB1dH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZFwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuZnVuY3Rpb24gZ2NkKGEsYikge1xyXG4gICAgaWYgKGEgPCAwKSBhID0gLWE7XHJcbiAgICBpZiAoYiA8IDApIGIgPSAtYjtcclxuICAgIGlmIChiID4gYSkge3ZhciB0ZW1wID0gYTsgYSA9IGI7IGIgPSB0ZW1wO31cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGIgPT0gMCkgcmV0dXJuIGE7XHJcbiAgICAgICAgYSAlPSBiO1xyXG4gICAgICAgIGlmIChhID09IDApIHJldHVybiBiO1xyXG4gICAgICAgIGIgJT0gYTtcclxuICAgIH1cclxufVxyXG5cclxuQXJyYXkucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGFycmF5LCBvZmZzZXQgPSAwKXtcclxuICAgIGZvciAobGV0IGk9MDtpPGFycmF5Lmxlbmd0aDtpKyspIHtcclxuICAgICAgICB0aGlzW29mZnNldCArIGldID0gYXJyYXlbaV07XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBuZXcgRmllbGQoNCwgNCk7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB2aWN0b3J5OiBmYWxzZSwgXHJcbiAgICAgICAgICAgIHNjb3JlOiAwLFxyXG4gICAgICAgICAgICBtb3ZlY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWJzb3JiZWQ6IDAsIFxyXG4gICAgICAgICAgICBjb25kaXRpb25WYWx1ZTogMjA0OFxyXG4gICAgICAgICAgICAvL2NvbmRpdGlvblZhbHVlOiAxMjI4OCAvL1RocmVlcy1saWtlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYWZ0ZXJtb3ZlID0gKHRpbGUpPT57XHJcbiAgICAgICAgICAgIC8vbGV0IGMgPSB0aGlzLmRhdGEuYWJzb3JiZWQgPyAxIDogMjtcclxuICAgICAgICAgICAgbGV0IGMgPSAxO1xyXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPGM7aSsrKXtcclxuICAgICAgICAgICAgICAgIC8vaWYoTWF0aC5yYW5kb20oKSA8IDAuMzMzMykgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgICAgIC8vaWYoTWF0aC5yYW5kb20oKSA8IDEuMCkgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgICAgIGlmKE1hdGgucmFuZG9tKCkgPCAwLjY2NjYpIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB7IC8vMjA0OFxyXG4gICAgICAgICAgICAvL3doaWxlKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkgfHwgISh0aGlzLmZpZWxkLmNoZWNrQW55KDIsIDIsIC0xKSB8fCB0aGlzLmZpZWxkLmNoZWNrQW55KDQsIDIsIC0xKSkpIHsgLy9DbGFzc2ljXHJcbiAgICAgICAgICAgIC8vd2hpbGUoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSB8fCAhKHRoaXMuZmllbGQuY2hlY2tBbnkoMSwgMSwgLTEpIHx8IHRoaXMuZmllbGQuY2hlY2tBbnkoMiwgMSwgLTEpKSkgeyAvL1RocmVzc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYoIHRoaXMuY2hlY2tDb25kaXRpb24oKSAmJiAhdGhpcy5kYXRhLnZpY3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZWxkLnBvc3NpYmxlKHNlbGVjdGVkLnRpbGUsIHRpbGVpbmZvLmxvYykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuZmllbGQubW92ZShzZWxlY3RlZC5sb2MsIHRpbGVpbmZvLmxvYyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRpZmYgPSBbdGlsZWluZm8ubG9jWzBdIC0gc2VsZWN0ZWQubG9jWzBdLCB0aWxlaW5mby5sb2NbMV0gLSBzZWxlY3RlZC5sb2NbMV1dO1xyXG4gICAgICAgICAgICAgICAgbGV0IGR2ID0gZ2NkKGRpZmZbMF0sIGRpZmZbMV0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpciA9IFtkaWZmWzBdIC8gZHYsIGRpZmZbMV0gLyBkdl07XHJcbiAgICAgICAgICAgICAgICBsZXQgbXggPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDIwNDggYWxpa2VcclxuICAgICAgICAgICAgICAgIGRpZmZbMF0gPSBkaXJbMF0gKiB0aGlzLmZpZWxkLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZGlmZlsxXSA9IGRpclsxXSAqIHRoaXMuZmllbGQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0aWxlTGlzdCA9IFtzZWxlY3RlZC50aWxlXTtcclxuICAgICAgICAgICAgICAgIC8vbGV0IHRpbGVMaXN0ID0gdGhpcy5maWVsZC50aWxlcy5jb25jYXQoW10pOyAvLyAyMDQ4IGFsaWtlIG1vdmluZyAoZ3JvdXBpbmcpXHJcbiAgICAgICAgICAgICAgICAvL2xldCB0aWxlTGlzdCA9IHRoaXMuZmllbGQudGlsZXNCeURpcmVjdGlvbihkaWZmKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aWxlTGlzdC5zb3J0KCh0aWxlLCBvcCk9PntcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpZnRpbmdYID0gTWF0aC5zaWduKC1kaXJbMF0gKiAodGlsZS5sb2NbMF0gLSBvcC5sb2NbMF0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKHNoaWZ0aW5nWCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aWxlTGlzdC5zb3J0KCh0aWxlLCBvcCk9PntcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hpZnRpbmdZID0gTWF0aC5zaWduKC1kaXJbMV0gKiAodGlsZS5sb2NbMV0gLSBvcC5sb2NbMV0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5zaWduKHNoaWZ0aW5nWSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZUxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUuc2V0UXVldWUoW2RpZmZbMF0sIGRpZmZbMV1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTw9bXg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZUxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLm1vdmUodGlsZS5sZWFzdFF1ZXVlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW92ZWRjbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRpbGVMaXN0KXtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGlsZS5tb3ZlZCkgbW92ZWRjbnQrKztcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnF1ZXVlWzBdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnF1ZXVlWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihtb3ZlZGNudCA+IDApIGFmdGVybW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3Qoc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgbGV0IG9sZHZhbCA9IG9sZC52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGN1cnZhbCA9IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgb3Bwb25lbnQgPSB0aWxlLmRhdGEuc2lkZSAhPSBvbGQuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICBsZXQgb3duZXIgPSAhb3Bwb25lbnQ7XHJcblxyXG4gICAgICAgICAgICAvL2lmIChvcHBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgb2xkdmFsID09IGN1cnZhbCBcclxuICAgICAgICAgICAgICAgICAgICAvL3x8IG9sZHZhbCA9PSAxICYmIGN1cnZhbCA9PSAyIHx8IG9sZHZhbCA9PSAyICYmIGN1cnZhbCA9PSAxIC8vVGhyZXNzLWxpa2UgXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlICs9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgICAgIGlmIChvbGR2YWwgPCBjdXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gY3VydmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gb2xkLmRhdGEuc2lkZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS52YWx1ZSA9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy99IFxyXG5cclxuICAgICAgICAgICAgaWYodGlsZS52YWx1ZSA8IDEpIHRoaXMuZ3JhcGhpYy5zaG93R2FtZW92ZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNjb3JlICs9IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3Qob2xkKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd01vdmVkKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGlsZXMoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC50aWxlcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbiAgICBzYXZlU3RhdGUoKXtcclxuICAgICAgICBsZXQgc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHRpbGVzOiBbXSxcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZmllbGQud2lkdGgsIFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZmllbGQuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzdGF0ZS5zY29yZSA9IHRoaXMuZGF0YS5zY29yZTtcclxuICAgICAgICBzdGF0ZS52aWN0b3J5ID0gdGhpcy5kYXRhLnZpY3Rvcnk7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMuZmllbGQudGlsZXMpe1xyXG4gICAgICAgICAgICBzdGF0ZS50aWxlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGxvYzogdGlsZS5kYXRhLmxvYy5jb25jYXQoW10pLCBcclxuICAgICAgICAgICAgICAgIHF1ZXVlOiB0aWxlLmRhdGEucXVldWUuY29uY2F0KFtdKSwgXHJcbiAgICAgICAgICAgICAgICBwaWVjZTogdGlsZS5kYXRhLnBpZWNlLCBcclxuICAgICAgICAgICAgICAgIHNpZGU6IHRpbGUuZGF0YS5zaWRlLCBcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aWxlLmRhdGEudmFsdWUsXHJcbiAgICAgICAgICAgICAgICBwcmV2OiB0aWxlLmRhdGEucHJldi5jb25jYXQoW10pLCBcclxuICAgICAgICAgICAgICAgIGJvbnVzOiB0aWxlLmRhdGEuYm9udXMsIFxyXG4gICAgICAgICAgICAgICAgbW92ZWQ6IHRpbGUuZGF0YS5tb3ZlZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3RvcmVTdGF0ZShzdGF0ZSl7XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkge1xyXG4gICAgICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhdGVzW3RoaXMuc3RhdGVzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZXMucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3RhdGUpIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmRhdGEuc2NvcmUgPSBzdGF0ZS5zY29yZTtcclxuICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IHN0YXRlLnZpY3Rvcnk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgdGRhdCBvZiBzdGF0ZS50aWxlcykge1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IG5ldyBUaWxlKCk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5xdWV1ZS5zZXQodGRhdC5xdWV1ZSk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5waWVjZSA9IHRkYXQucGllY2U7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IHRkYXQudmFsdWU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gdGRhdC5zaWRlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEubG9jLnNldCh0ZGF0LmxvYyk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2LnNldCh0ZGF0LnByZXYpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuYm9udXMgPSB0ZGF0LmJvbnVzO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEubW92ZWQgPSB0ZGF0Lm1vdmVkO1xyXG4gICAgICAgICAgICB0aWxlLmF0dGFjaCh0aGlzLmZpZWxkLCB0ZGF0LmxvYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlVmljdG9yeSgpe1xyXG4gICAgICAgIGlmKCF0aGlzLmRhdGEudmljdG9yeSl7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dWaWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29uZGl0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQuY2hlY2tBbnkodGhpcy5kYXRhLmNvbmRpdGlvblZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSl7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnN0YXJ0LnB1c2godGhpcy5vbnN0YXJ0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnNlbGVjdC5wdXNoKHRoaXMub25zZWxlY3RldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9ubW92ZS5wdXNoKHRoaXMub25tb3ZlZXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWNzO1xyXG4gICAgICAgIGdyYXBoaWNzLmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy5jcmVhdGVDb21wb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYnVpbGRJbnRlcmFjdGlvbk1hcCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmdhbWVzdGFydCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLm1vdmVjb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5maWVsZC5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGVzLnNwbGljZSgwLCB0aGlzLnN0YXRlcy5sZW5ndGgpO1xyXG4gICAgICAgIGlmKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkpIHRoaXMuZ2FtZXN0YXJ0KCk7IC8vUHJldmVudCBnYW1lb3ZlclxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lcGF1c2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZW92ZXIocmVhc29uKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpbmsoZGlmZil7IC8vPz8/XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuYWdlcn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGttb3ZlbWFwID0gW1xyXG4gICAgWy0yLCAtMV0sXHJcbiAgICBbIDIsIC0xXSxcclxuICAgIFstMiwgIDFdLFxyXG4gICAgWyAyLCAgMV0sXHJcbiAgICBcclxuICAgIFstMSwgLTJdLFxyXG4gICAgWyAxLCAtMl0sXHJcbiAgICBbLTEsICAyXSxcclxuICAgIFsgMSwgIDJdXHJcbl07XHJcblxyXG5sZXQgcmRpcnMgPSBbXHJcbiAgICBbIDAsICAxXSwgLy9kb3duXHJcbiAgICBbIDAsIC0xXSwgLy91cFxyXG4gICAgWyAxLCAgMF0sIC8vbGVmdFxyXG4gICAgWy0xLCAgMF0gIC8vcmlnaHRcclxuXTtcclxuXHJcbmxldCBiZGlycyA9IFtcclxuICAgIFsgMSwgIDFdLFxyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsICAxXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcGFkaXJzID0gW1xyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBtZGlycyA9IFtcclxuICAgIFsgMCwgLTFdXHJcbl07XHJcblxyXG5cclxubGV0IHBhZGlyc05lZyA9IFtcclxuICAgIFsgMSwgMV0sXHJcbiAgICBbLTEsIDFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzTmVnID0gW1xyXG4gICAgWyAwLCAxXVxyXG5dO1xyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gZ2NkKGEsYikge1xyXG4gICAgaWYgKGEgPCAwKSBhID0gLWE7XHJcbiAgICBpZiAoYiA8IDApIGIgPSAtYjtcclxuICAgIGlmIChiID4gYSkge3ZhciB0ZW1wID0gYTsgYSA9IGI7IGIgPSB0ZW1wO31cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGIgPT0gMCkgcmV0dXJuIGE7XHJcbiAgICAgICAgYSAlPSBiO1xyXG4gICAgICAgIGlmIChhID09IDApIHJldHVybiBiO1xyXG4gICAgICAgIGIgJT0gYTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVGlsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsdWU6IDIsIFxyXG4gICAgICAgICAgICBwaWVjZTogMCwgXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIC8veCwgeVxyXG4gICAgICAgICAgICBwcmV2OiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIHNpZGU6IDAsIC8vV2hpdGUgPSAwLCBCbGFjayA9IDFcclxuICAgICAgICAgICAgcXVldWU6IFswLCAwXSwgXHJcbiAgICAgICAgICAgIG1vdmVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pZCA9IHRjb3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB2YWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS52YWx1ZSA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRpZmYoKXtcclxuICAgICAgICByZXR1cm4gW3RoaXMuZGF0YS5sb2NbMF0gLSB0aGlzLmRhdGEucHJldlswXSwgdGhpcy5kYXRhLmxvY1sxXSAtIHRoaXMuZGF0YS5wcmV2WzFdXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sb2M7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXYoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnByZXY7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxvYyh2KXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBvbmhpdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG9uYWJzb3JiKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgb25tb3ZlKCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnF1ZXVlWzBdIC09IHRoaXMubG9jWzBdIC0gdGhpcy5wcmV2WzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5xdWV1ZVsxXSAtPSB0aGlzLmxvY1sxXSAtIHRoaXMucHJldlsxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2goZmllbGQsIHgsIHkpe1xyXG4gICAgICAgIGZpZWxkLmF0dGFjaCh0aGlzLCB4LCB5KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KHJlbGF0aXZlID0gWzAsIDBdKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgcmV0dXJuIHRoaXMuZmllbGQuZ2V0KFtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1swXSArIHJlbGF0aXZlWzBdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzFdICsgcmVsYXRpdmVbMV1cclxuICAgICAgICBdKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZShsdG8pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLm1vdmUodGhpcy5kYXRhLmxvYywgbHRvKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHV0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQucHV0KHRoaXMuZGF0YS5sb2MsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgbW92ZWQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm1vdmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGxvYyhhKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0gYVswXTtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0gYVsxXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHF1ZXVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5xdWV1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRRdWV1ZShkaWZmKXtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMF0gPSBkaWZmWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5xdWV1ZVsxXSA9IGRpZmZbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2FjaGVMb2MoKXtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlswXSA9IHRoaXMuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMV0gPSB0aGlzLmRhdGEubG9jWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRGaWVsZChmaWVsZCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRMb2MoW3gsIHldKXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzBdID0geDtcclxuICAgICAgICB0aGlzLmRhdGEubG9jWzFdID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVwbGFjZUlmTmVlZHMoKXtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA+PSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0LTEgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxvY1sxXSA8PSAwICYmIHRoaXMuZGF0YS5zaWRlID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG5cclxuXHJcbiAgICByZXNwb25zaXZlKGRpcil7XHJcbiAgICAgICAgbGV0IG1sb2MgPSB0aGlzLmRhdGEubG9jO1xyXG4gICAgICAgIGxldCBsZWFzdCA9IHRoaXMubGVhc3QoZGlyKTtcclxuICAgICAgICBpZiAobGVhc3RbMF0gIT0gbWxvY1swXSB8fCBsZWFzdFsxXSAhPSBtbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGVhc3RRdWV1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlYXN0KHRoaXMucXVldWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxlYXN0KGRpZmYpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBpZiAoZGlmZlswXSA9PSAwICYmIGRpZmZbMV0gPT0gMCkgcmV0dXJuIFttbG9jWzBdLCBtbG9jWzFdXTtcclxuXHJcbiAgICAgICAgbGV0IG14ID0gTWF0aC5tYXgoTWF0aC5hYnMoZGlmZlswXSksIE1hdGguYWJzKGRpZmZbMV0pKTtcclxuICAgICAgICBsZXQgbW4gPSBNYXRoLm1pbihNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBhc3AgPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdIC8gZGlmZlsxXSksIE1hdGguYWJzKGRpZmZbMV0gLyBkaWZmWzBdKSk7XHJcblxyXG4gICAgICAgIGxldCBkdiA9IGdjZChkaWZmWzBdLCBkaWZmWzFdKTtcclxuICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuXHJcbiAgICAgICAgbGV0IHRyYWNlID0gKCk9PntcclxuICAgICAgICAgICAgbGV0IGxlYXN0ID0gW21sb2NbMF0sIG1sb2NbMV1dO1xyXG4gICAgICAgICAgICBmb3IobGV0IG89MTtvPD1teDtvKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZiA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclswXSAqIG8pLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclsxXSAqIG8pXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMF0gKyBvZmZbMF0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMV0gKyBvZmZbMV1cclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmluc2lkZShjbG9jKSB8fCAhdGhpcy5wb3NzaWJsZShjbG9jKSkgcmV0dXJuIGxlYXN0O1xyXG5cclxuICAgICAgICAgICAgICAgIGxlYXN0WzBdID0gY2xvY1swXTtcclxuICAgICAgICAgICAgICAgIGxlYXN0WzFdID0gY2xvY1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWVsZC5nZXQoY2xvYykudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZWFzdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbGVhc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCB5ZGlyID0gdGhpcy5kYXRhLnNpZGUgPT0gMCA/IC0xIDogMTtcclxuICAgICAgICAgICAgaWYgKGRpclsxXSA9PSB5ZGlyKXtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW21sb2NbMF0gKyBkaXJbMF0sIG1sb2NbMV0gKyBkaXJbMV1dO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZShjbG9jKSkgcmV0dXJuIGNsb2M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMSkgeyAvL0tuaWdodFxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAyIHx8XHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDIgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbbWxvY1swXSArIGRpclswXSwgbWxvY1sxXSArIGRpclsxXV07XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gY2xvYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAzKSB7IC8vUm9va1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDAgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAwICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMSB8fCBcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDBcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA1KSB7IC8vS2luZ1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlyWzBdKSA8PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbbWxvY1swXSArIGRpclswXSwgbWxvY1sxXSArIGRpclsxXV07XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gY2xvYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFttbG9jWzBdLCBtbG9jWzFdXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHBvc3NpYmxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQucG9zc2libGUodGhpcywgbG9jKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3NzaWJsZU1vdmUobG9jKXtcclxuICAgICAgICBsZXQgbWxvYyA9IHRoaXMuZGF0YS5sb2M7XHJcbiAgICAgICAgaWYgKG1sb2NbMF0gPT0gbG9jWzBdICYmIG1sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBkaWZmID0gW1xyXG4gICAgICAgICAgICBsb2NbMF0gLSBtbG9jWzBdLFxyXG4gICAgICAgICAgICBsb2NbMV0gLSBtbG9jWzFdLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IG14ID0gTWF0aC5tYXgoTWF0aC5hYnMoZGlmZlswXSksIE1hdGguYWJzKGRpZmZbMV0pKTtcclxuICAgICAgICBsZXQgbW4gPSBNYXRoLm1pbihNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBhc3AgPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdIC8gZGlmZlsxXSksIE1hdGguYWJzKGRpZmZbMV0gLyBkaWZmWzBdKSk7XHJcblxyXG4gICAgICAgIGxldCBkdiA9IGdjZChkaWZmWzBdLCBkaWZmWzFdKTtcclxuICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZmllbGQuZ2V0KGxvYyk7XHJcblxyXG4gICAgICAgIGxldCB0cmFjZSA9ICgpPT57XHJcbiAgICAgICAgICAgIGZvcihsZXQgbz0xO288bXg7bysrKXtcclxuICAgICAgICAgICAgICAgIGxldCBvZmYgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJbMF0gKiBvKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJbMV0gKiBvKVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMF0gKyBvZmZbMF0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG1sb2NbMV0gKyBvZmZbMV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuaW5zaWRlKGNsb2MpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWVsZC5nZXQoY2xvYykudGlsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKSB7IC8vUEFXTlxyXG4gICAgICAgICAgICBsZXQgeWRpciA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIGlmICh0aWxlLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhkaWZmWzBdKSA9PSAxICYmIGRpZmZbMV0gPT0geWRpcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhkaWZmWzBdKSA9PSAwICYmIGRpZmZbMV0gPT0geWRpcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAxKSB7IC8vS25pZ2h0XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpZmZbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlmZlsxXSkgPT0gMiB8fFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlmZlswXSkgPT0gMiAmJiBNYXRoLmFicyhkaWZmWzFdKSA9PSAxXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMikgeyAvL0Jpc2hvcFxyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMykgeyAvL1Jvb2tcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAwICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMSB8fCBcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDBcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA0KSB7IC8vUXVlZW5cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMSB8fCBcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMCAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEgfHwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAwXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNSkgeyAvL0tpbmdcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZbMF0pIDw9IDEgJiYgTWF0aC5hYnMoZGlmZlsxXSkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGlsZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgeyBHcmFwaGljc0VuZ2luZSB9IGZyb20gXCIuL2luY2x1ZGUvZ3JhcGhpY3NcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL2luY2x1ZGUvbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2luY2x1ZGUvaW5wdXRcIjtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgbGV0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xyXG4gICAgbGV0IGdyYXBoaWNzID0gbmV3IEdyYXBoaWNzRW5naW5lKCk7XHJcbiAgICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoKTtcclxuXHJcbiAgICBncmFwaGljcy5hdHRhY2hJbnB1dChpbnB1dCk7XHJcbiAgICBtYW5hZ2VyLmluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KTtcclxuICAgIG1hbmFnZXIuZ2FtZXN0YXJ0KCk7IC8vZGVidWdcclxufSkoKTsiXX0=
