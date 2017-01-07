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
            var w = params.tile.width + border;
            var h = params.tile.height + border;

            var area = interactive.object.rect(0, 0, w, h).transform("translate(" + (pos[0] - border / 2) + ", " + (pos[1] - border / 2) + ")").click(function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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QixDQVJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKHcgPSA0LCBoID0gNCl7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogdywgaGVpZ2h0OiBoXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbyA9IHtcclxuICAgICAgICAgICAgdGlsZUlEOiAtMSxcclxuICAgICAgICAgICAgdGlsZTogbnVsbCxcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIGJvbnVzOiAwLCAvL0RlZmF1bHQgcGllY2UsIDEgYXJlIGludmVydGVyLCAyIGFyZSBtdWx0aS1zaWRlXHJcbiAgICAgICAgICAgIGF2YWlsYWJsZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbnRpbGVyZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFkZCA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWJzb3JwdGlvbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgd2lkdGgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FueSh2YWx1ZSwgY291bnQgPSAxLCBzaWRlID0gLTEpe1xyXG4gICAgICAgIGxldCBjb3VudGVkID0gMDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPT0gdmFsdWUgJiYgKHNpZGUgPCAwIHx8IHRpbGUuZGF0YS5zaWRlID09IHNpZGUpICYmIHRpbGUuZGF0YS5ib251cyA9PSAwKSBjb3VudGVkKys7Ly9yZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYoY291bnRlZCA+PSBjb3VudCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYW55UG9zc2libGUoKXtcclxuICAgICAgICBsZXQgYW55cG9zc2libGUgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRpbGUucG9zc2libGUoW2osIGldKSkgYW55cG9zc2libGUrKztcclxuICAgICAgICAgICAgICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aWxlUG9zc2libGVMaXN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gbGlzdDsgLy9lbXB0eVxyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUucG9zc2libGUoW2osIGldKSkgbGlzdC5wdXNoKHRoaXMuZ2V0KFtqLCBpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwb3NzaWJsZSh0aWxlLCBsdG8pe1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdGlsZWkgPSB0aGlzLmdldChsdG8pO1xyXG4gICAgICAgIGlmICghdGlsZWkuYXZhaWxhYmxlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBhdGlsZSA9IHRpbGVpLnRpbGU7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gdGlsZS5wb3NzaWJsZU1vdmUobHRvKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdGlsZSkgcmV0dXJuIHBpZWNlO1xyXG4gICAgICAgIGxldCBwb3NzaWJsZXMgPSBwaWVjZTtcclxuXHJcbiAgICAgICAgaWYodGlsZS5kYXRhLmJvbnVzID09IDApe1xyXG4gICAgICAgICAgICBsZXQgb3Bwb25lbnQgPSBhdGlsZS5kYXRhLnNpZGUgIT0gdGlsZS5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDsgLy9BbHNvIHBvc3NpYmxlIG93bmVyXHJcbiAgICAgICAgICAgIGxldCBib3RoID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IG5vYm9keSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNhbWUgPSBhdGlsZS52YWx1ZSA9PSB0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgaGlndGVyVGhhbk9wID0gdGlsZS52YWx1ZSA8IGF0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgbG93ZXJUaGFuT3AgPSBhdGlsZS52YWx1ZSA8IHRpbGUudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgd2l0aGNvbnZlcnRlciA9IGF0aWxlLmRhdGEuYm9udXMgIT0gMDtcclxuICAgICAgICAgICAgbGV0IHR3b0FuZE9uZSA9IHRpbGUudmFsdWUgPT0gMiAmJiBhdGlsZS52YWx1ZSA9PSAxIHx8IGF0aWxlLnZhbHVlID09IDIgJiYgdGlsZS52YWx1ZSA9PSAxO1xyXG4gICAgICAgICAgICBsZXQgZXhjZXB0VHdvID0gISh0aWxlLnZhbHVlID09IDIgJiYgdGlsZS52YWx1ZSA9PSBhdGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRPbmUgPSAhKHRpbGUudmFsdWUgPT0gMSAmJiB0aWxlLnZhbHVlID09IGF0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vU2V0dGluZ3Mgd2l0aCBwb3NzaWJsZSBvcHBvc2l0aW9uc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRocmVlc0xpa2UgPSAoXHJcbiAgICAgICAgICAgICAgICBzYW1lICYmIGV4Y2VwdFR3byAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgdHdvQW5kT25lICYmIGJvdGggfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgbm9ib2R5IHx8IFxyXG4gICAgICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgbm9ib2R5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY2hlc3NMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBvcHBvbmVudCB8fCBcclxuICAgICAgICAgICAgICAgIGhpZ3RlclRoYW5PcCAmJiBvcHBvbmVudCB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG9wcG9uZW50XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY2xhc3NpY0xpa2UgPSAoXHJcbiAgICAgICAgICAgICAgICBzYW1lICYmIGJvdGggfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgbm9ib2R5IHx8IFxyXG4gICAgICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgbm9ib2R5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwb3NzaWJsZXMgPSBwb3NzaWJsZXMgJiYgY2xhc3NpY0xpa2U7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9zc2libGVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZXMgJiYgYXRpbGUuZGF0YS5ib251cyA9PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdFNhbWUoKXtcclxuICAgICAgICBsZXQgc2FtZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmIChzYW1lcy5pbmRleE9mKHRpbGUudmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgc2FtZXMucHVzaCh0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5QaWVjZShleGNlcHRQYXduKXtcclxuICAgICAgICAvL3JldHVybiAzOyAvL0RlYnVnXHJcblxyXG4gICAgICAgIGxldCBwYXduciA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYgKHBhd25yIDwgMC40ICYmICFleGNlcHRQYXduKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJuZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYocm5kID49IDAuMCAmJiBybmQgPCAwLjMpe1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuMyAmJiBybmQgPCAwLjYpe1xyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuNiAmJiBybmQgPCAwLjgpe1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuOCAmJiBybmQgPCAwLjkpe1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gdGhpcy5nZXQoW2osIGldKTtcclxuICAgICAgICAgICAgICAgIGlmICghZi50aWxlICYmIGYuYXZhaWxhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKG5vdE9jY3VwaWVkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSB0aGlzLmdlblBpZWNlKCk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IE1hdGgucmFuZG9tKCkgPCAwLjIgPyA0IDogMjtcclxuICAgICAgICAgICAgLy90aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4yID8gMiA6IDE7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IDA7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJjaGVjayA9IHRoaXMuY2hlY2tBbnkodGlsZS5kYXRhLnZhbHVlLCAxLCAxKTtcclxuICAgICAgICAgICAgbGV0IHdjaGVjayA9IHRoaXMuY2hlY2tBbnkodGlsZS5kYXRhLnZhbHVlLCAxLCAwKTtcclxuICAgICAgICAgICAgaWYgKGJjaGVjayAmJiB3Y2hlY2sgfHwgIWJjaGVjayAmJiAhd2NoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICBpZiAoIWJjaGVjayl7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgaWYgKCF3Y2hlY2spe1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgdGlsZS5hdHRhY2godGhpcywgbm90T2NjdXBpZWRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm90T2NjdXBpZWQubGVuZ3RoKV0ubG9jKTsgLy9wcmVmZXIgZ2VuZXJhdGUgc2luZ2xlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL05vdCBwb3NzaWJsZSB0byBnZW5lcmF0ZSBuZXcgdGlsZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZXNCeURpcmVjdGlvbihkaWZmKXtcclxuICAgICAgICBsZXQgdGlsZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlLnJlc3BvbnNpdmUoZGlmZikpIHRpbGVzLnB1c2godGlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aWxlcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoMCwgdGhpcy50aWxlcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkc1tpXVtqXSA/IHRoaXMuZmllbGRzW2ldW2pdLnRpbGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYodGlsZSl7IC8vaWYgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8pOyAvL0xpbmsgd2l0aCBvYmplY3RcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJlZi5sb2MgPSBbaiwgaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkc1tpXVtqXSA9IHJlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldFRpbGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQobG9jKS50aWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQobG9jKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dOyAvL3JldHVybiByZWZlcmVuY2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvLCB7XHJcbiAgICAgICAgICAgIGxvYzogW2xvY1swXSwgbG9jWzFdXSwgXHJcbiAgICAgICAgICAgIGF2YWlsYWJsZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW5zaWRlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1dChsb2MsIHRpbGUpe1xyXG4gICAgICAgIGlmICh0aGlzLmluc2lkZShsb2MpKSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSB0aWxlLmlkO1xyXG4gICAgICAgICAgICByZWYudGlsZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIHRpbGUucmVwbGFjZUlmTmVlZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlzQXZhaWxhYmxlKGx0byl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGx0bykuYXZhaWxhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmUobG9jLCBsdG8pe1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5nZXRUaWxlKGxvYyk7XHJcbiAgICAgICAgaWYgKGxvY1swXSA9PSBsdG9bMF0gJiYgbG9jWzFdID09IGx0b1sxXSkgcmV0dXJuIHRoaXM7IC8vU2FtZSBsb2NhdGlvblxyXG4gICAgICAgIGlmICh0aGlzLmluc2lkZShsb2MpICYmIHRoaXMuaW5zaWRlKGx0bykgJiYgdGhpcy5pc0F2YWlsYWJsZShsdG8pICYmIHRpbGUgJiYgIXRpbGUuZGF0YS5tb3ZlZCAmJiB0aWxlLnBvc3NpYmxlKGx0bykpe1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5nZXQobG9jKTtcclxuICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0aWxlLmRhdGEubW92ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldlswXSA9IHRpbGUuZGF0YS5sb2NbMF07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzFdID0gdGlsZS5kYXRhLmxvY1sxXTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1swXSA9IGx0b1swXTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1sxXSA9IGx0b1sxXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBvbGQgPSB0aGlzLmZpZWxkc1tsdG9bMV1dW2x0b1swXV07XHJcbiAgICAgICAgICAgIGlmIChvbGQgJiYgb2xkLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIG9sZC50aWxlLm9uYWJzb3JiKCk7XHJcbiAgICAgICAgICAgICAgICB0aWxlLm9uaGl0KCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWJzb3JwdGlvbikgZihvbGQudGlsZSwgdGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXIobHRvLCB0aWxlKS5wdXQobHRvLCB0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5vbm1vdmUoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhcihsb2MsIGJ5dGlsZSA9IG51bGwpe1xyXG4gICAgICAgIGlmICh0aGlzLmluc2lkZShsb2MpKSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnNldExvYyhbLTEsIC0xXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSwgYnl0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaCh0aWxlLCBsb2M9WzAsIDBdKXtcclxuICAgICAgICBpZih0aWxlICYmIHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy50aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgICAgICB0aWxlLnNldEZpZWxkKHRoaXMpLnNldExvYyhsb2MpLnB1dCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWRkKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtGaWVsZH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGljb25zZXQgPSBbXHJcbiAgICBcImljb25zL1doaXRlUGF3bi5zdmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLbmlnaHQuc3ZnXCIsXHJcbiAgICBcImljb25zL1doaXRlQmlzaG9wLnN2Z1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVJvb2suc3ZnXCIsXHJcbiAgICBcImljb25zL1doaXRlUXVlZW4uc3ZnXCIsXHJcbiAgICBcImljb25zL1doaXRlS2luZy5zdmdcIlxyXG5dO1xyXG5cclxubGV0IGljb25zZXRCbGFjayA9IFtcclxuICAgIFwiaWNvbnMvQmxhY2tQYXduLnN2Z1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tuaWdodC5zdmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tCaXNob3Auc3ZnXCIsXHJcbiAgICBcImljb25zL0JsYWNrUm9vay5zdmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tRdWVlbi5zdmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLaW5nLnN2Z1wiXHJcbl07XHJcblxyXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcclxuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcbiAgICBlbHByb3RvLnRvRnJvbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG4gICAgZWxwcm90by50b0JhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRUbyh0aGlzLnBhcGVyKTtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuY2xhc3MgR3JhcGhpY3NFbmdpbmUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzdmduYW1lID0gXCIjc3ZnXCIpe1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb24gPSBbXTtcclxuICAgICAgICB0aGlzLnNuYXAgPSBTbmFwKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc3ZnZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHtcclxuICAgICAgICAgICAgYm9yZGVyOiA0LFxyXG4gICAgICAgICAgICBkZWNvcmF0aW9uV2lkdGg6IDEwLCBcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHBhcnNlRmxvYXQodGhpcy5zdmdlbC5jbGllbnRXaWR0aCksIFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50SGVpZ2h0KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aWxlOiB7XHJcbiAgICAgICAgICAgICAgICAvL3dpZHRoOiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgLy9oZWlnaHQ6IDEyOCwgXHJcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS5kYXRhLmJvbnVzID09IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigxOTIsIDE5MiwgMTkyKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigwLCAwLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPCAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMzIsIDMyLCAzMilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEgJiYgdGlsZS52YWx1ZSA8IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMiAmJiB0aWxlLnZhbHVlIDwgNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMTkyLCAxMjgpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA0ICYmIHRpbGUudmFsdWUgPCA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDk2KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gOCAmJiB0aWxlLnZhbHVlIDwgMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDk2LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDE2ICYmIHRpbGUudmFsdWUgPCAzMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMzIgJiYgdGlsZS52YWx1ZSA8IDY0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDY0ICYmIHRpbGUudmFsdWUgPCAxMjg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDAsIDApXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTI4ICYmIHRpbGUudmFsdWUgPCAyNTY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDI1NiAmJiB0aWxlLnZhbHVlIDwgNTEyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxOTIsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA1MTIgJiYgdGlsZS52YWx1ZSA8IDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEwMjQgJiYgdGlsZS52YWx1ZSA8IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIwNDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIzMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbWlWaXNpYmxlKGxvYyl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgbG9jOiBsb2NcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKGxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1syXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNDAsIDIyNCwgMTkyKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgLy9EZWNvcmF0aXZlIGNoZXNzIGZpZWxkXHJcbiAgICAgICAgdGhpcy5jaGVzc2ZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2ZpZWxkW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9yZGVyID0gMDsvL3RoaXMucGFyYW1zLmJvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBzLmdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmLnJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcixcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxsXCI6IHggJSAyICE9IHkgJSAyID8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIiA6IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZi50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXS1ib3JkZXIvMn0sICR7cG9zWzFdLWJvcmRlci8yfSlgKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdChcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgdHcgKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aCArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCwgXHJcbiAgICAgICAgICAgICAgICA1LCBcclxuICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21wb3NpdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMuc3BsaWNlKDAsIHRoaXMuZ3JhcGhpY3NMYXllcnMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNuYXAuZ3JvdXAoKTtcclxuICAgICAgICBzY2VuZS50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0sICR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSlgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s1XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS53aWR0aCAgPSAodGhpcy5wYXJhbXMuZ3JpZC53aWR0aCAgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAod2lkdGggKyAxKSAgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyB3aWR0aDtcclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLmhlaWdodCA9ICh0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCAtIHRoaXMucGFyYW1zLmJvcmRlciAqIChoZWlnaHQgKyAxKSAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIGhlaWdodDtcclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZU92ZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZpY3RvcnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZUdhbWVPdmVyKCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyNTUsIDIyNCwgMjI0LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiVW5kb1wiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IHRoaXMucGFyYW1zLnRpbGUud2lkdGggKiAwLjE1LCAvL1wiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBvYmoucmVjdGFuZ2xlLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBzdHlsZS5maWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZvbnQpIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgc3R5bGUuZm9udCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVN0eWxlKHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICBpZiAob2JqZWN0KSBvYmplY3QucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd01vdmVkKHRpbGUpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKXtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUud2lkdGggICsgYm9yZGVyKSAqIHgsXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpICogeVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VmlzdWFsaXplcihsb2Mpe1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWxvYyB8fCBcclxuICAgICAgICAgICAgIShsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmZpZWxkLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5maWVsZC5kYXRhLmhlaWdodClcclxuICAgICAgICApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc3VhbGl6YXRpb25bbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aWxlOiB0aWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBmaWxsc2l6ZXcgPSBwYXJhbXMudGlsZS53aWR0aCAgKiAoMC41IC0gMC4xMjUpO1xyXG4gICAgICAgIGxldCBmaWxsc2l6ZWggPSBmaWxsc2l6ZXc7Ly9wYXJhbXMudGlsZS5oZWlnaHQgKiAoMS4wIC0gMC4yKTtcclxuXHJcbiAgICAgICAgbGV0IGljb24gPSBzLmltYWdlKFxyXG4gICAgICAgICAgICBcIlwiLCBcclxuICAgICAgICAgICAgZmlsbHNpemV3LCBcclxuICAgICAgICAgICAgZmlsbHNpemVoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggIC0gZmlsbHNpemV3ICogMiwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCAtIGZpbGxzaXplaCAqIDJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IHMudGV4dChwYXJhbXMudGlsZS53aWR0aCAvIDIsIHBhcmFtcy50aWxlLmhlaWdodCAvIDIgKyBwYXJhbXMudGlsZS5oZWlnaHQgKiAwLjM1LCBcIlRFU1RcIik7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0LCBpY29uLCB0ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgIGApO1xyXG4gICAgICAgIGdyb3VwLmF0dHIoe1wib3BhY2l0eVwiOiBcIjBcIn0pO1xyXG5cclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgxLjAsIDEuMCkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5wb3MgPSBwb3M7XHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcblxyXG4gICAgICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7b2JqZWN0LnBvc1swXX0sICR7b2JqZWN0LnBvc1sxXX0pIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICAgICAgc2NhbGUoMC4wMSwgMC4wMSkgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRJbnRlcmFjdGlvbkxheWVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhpY3NMYXllcnNbM107XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTaG93ZWQoKXtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGZvciAobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZpcyA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgdmlzLmFyZWEuYXR0cih7ZmlsbDogXCJ0cmFuc3BhcmVudFwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuaW5wdXQuc2VsZWN0ZWQudGlsZTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZS5sb2MpO1xyXG4gICAgICAgIGlmIChvYmplY3Qpe1xyXG4gICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDI1NSwgMCwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dQb3NzaWJsZSh0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlaW5mbyBvZiB0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVpbmZvLnRpbGU7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZWluZm8ubG9jKTtcclxuICAgICAgICAgICAgaWYob2JqZWN0KXtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMCwgMjU1LCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlVGlsZXMoKXtcclxuICAgICAgICB0aGlzLmNsZWFyVGlsZXMoKTtcclxuICAgICAgICBsZXQgdGlsZXMgPSB0aGlzLm1hbmFnZXIudGlsZXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRpbGVzKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhclRpbGVzKCl7XHJcbiAgICAgICAgZm9yIChsZXQgdGlsZSBvZiB0aGlzLmdyYXBoaWNzVGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZSkgdGlsZS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1c2hUaWxlKHRpbGUpe1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTY29yZSgpe1xyXG4gICAgICAgIHRoaXMuc2NvcmVib2FyZC5pbm5lckhUTUwgPSB0aGlzLm1hbmFnZXIuZGF0YS5zY29yZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hJbnB1dChpbnB1dCl7IC8vTWF5IHJlcXVpcmVkIGZvciBzZW5kIG9iamVjdHMgYW5kIG1vdXNlIGV2ZW50c1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBpbnB1dC5hdHRhY2hHcmFwaGljcyh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQge0dyYXBoaWNzRW5naW5lfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wb3J0ID0ge1xyXG4gICAgICAgICAgICBvbm1vdmU6IFtdLFxyXG4gICAgICAgICAgICBvbnN0YXJ0OiBbXSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IFtdLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcclxuICAgICAgICB0aGlzLnVuZG9idXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3VuZG9cIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVuZG9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgaWYodGhpcy5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdCh0aGlzLnNlbGVjdGVkLnRpbGUpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGhpcy5zZWxlY3RlZC50aWxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdCh0aGlzLnNlbGVjdGVkLnRpbGUpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRoaXMuc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoR3JhcGhpY3MoZ3JhcGhpYyl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QodGlsZWluZm8sIHgsIHkpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aWxlaW5mbzogdGlsZWluZm8sXHJcbiAgICAgICAgICAgIGxvYzogW3gsIHldXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcblxyXG4gICAgICAgIGxldCBzdmdlbGVtZW50ID0gZ3JhcGhpYy5zdmdlbDtcclxuICAgICAgICBzdmdlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgcG9zID0gZ3JhcGhpYy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKG9iamVjdC5sb2MpO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLmdyYXBoaWMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdyA9IHBhcmFtcy50aWxlLndpZHRoICsgYm9yZGVyO1xyXG4gICAgICAgIGxldCBoID0gcGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyO1xyXG5cclxuICAgICAgICBsZXQgYXJlYSA9IGludGVyYWN0aXZlLm9iamVjdC5yZWN0KDAsIDAsIHcsIGgpLnRyYW5zZm9ybShcclxuICAgICAgICAgICAgYHRyYW5zbGF0ZSgke3Bvc1swXSAtIGJvcmRlci8yfSwgJHtwb3NbMV0gLSBib3JkZXIvMn0pYFxyXG4gICAgICAgICkuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQudGlsZSAmJiBzZWxlY3RlZC50aWxlLmxvY1swXSAhPSAtMSAmJiBzZWxlY3RlZCAhPSB0aGlzLnNlbGVjdGVkICYmICghdGhpcy5zZWxlY3RlZC50aWxlIHx8ICF0aGlzLnNlbGVjdGVkLnRpbGUucG9zc2libGUob2JqZWN0LmxvYykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbm1vdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLCBzZWxlY3RlZCwgZmllbGQuZ2V0KG9iamVjdC5sb2MpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gb2JqZWN0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFyZWEuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkSW50ZXJhY3Rpb25NYXAoKXtcclxuICAgICAgICBsZXQgbWFwID0ge1xyXG4gICAgICAgICAgICB0aWxlbWFwOiBbXSwgXHJcbiAgICAgICAgICAgIGdyaWRtYXA6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGZpZWxkLmRhdGEuaGVpZ2h0O2krKyl7XHJcbiAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8ZmllbGQuZGF0YS53aWR0aDtqKyspe1xyXG4gICAgICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV1bal0gPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KGZpZWxkLmdldChbaiwgaV0pLCBqLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0lucHV0fTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkXCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5mdW5jdGlvbiBnY2QoYSxiKSB7XHJcbiAgICBpZiAoYSA8IDApIGEgPSAtYTtcclxuICAgIGlmIChiIDwgMCkgYiA9IC1iO1xyXG4gICAgaWYgKGIgPiBhKSB7dmFyIHRlbXAgPSBhOyBhID0gYjsgYiA9IHRlbXA7fVxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAoYiA9PSAwKSByZXR1cm4gYTtcclxuICAgICAgICBhICU9IGI7XHJcbiAgICAgICAgaWYgKGEgPT0gMCkgcmV0dXJuIGI7XHJcbiAgICAgICAgYiAlPSBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5BcnJheS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oYXJyYXksIG9mZnNldCA9IDApe1xyXG4gICAgZm9yIChsZXQgaT0wO2k8YXJyYXkubGVuZ3RoO2krKykge1xyXG4gICAgICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSBhcnJheVtpXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG5ldyBGaWVsZCg0LCA0KTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZpY3Rvcnk6IGZhbHNlLCBcclxuICAgICAgICAgICAgc2NvcmU6IDAsXHJcbiAgICAgICAgICAgIG1vdmVjb3VudGVyOiAwLFxyXG4gICAgICAgICAgICBhYnNvcmJlZDogMCwgXHJcbiAgICAgICAgICAgIGNvbmRpdGlvblZhbHVlOiAyMDQ4XHJcbiAgICAgICAgICAgIC8vY29uZGl0aW9uVmFsdWU6IDEyMjg4IC8vVGhyZWVzLWxpa2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3RhdGVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMub25zdGFydGV2ZW50ID0gKGNvbnRyb2xsZXIsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVzdGFydCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdGV2ZW50ID0gKGNvbnRyb2xsZXIsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGlsZWluZm8udGlsZSkpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRpbGVpbmZvLnRpbGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBhZnRlcm1vdmUgPSAodGlsZSk9PntcclxuICAgICAgICAgICAgLy9sZXQgYyA9IHRoaXMuZGF0YS5hYnNvcmJlZCA/IDEgOiAyO1xyXG4gICAgICAgICAgICBsZXQgYyA9IDE7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8YztpKyspe1xyXG4gICAgICAgICAgICAgICAgLy9pZihNYXRoLnJhbmRvbSgpIDwgMC4zMzMzKSB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy9pZihNYXRoLnJhbmRvbSgpIDwgMS4wKSB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA8IDAuNjY2NikgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkpIHsgLy8yMDQ4XHJcbiAgICAgICAgICAgIC8vd2hpbGUoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSB8fCAhKHRoaXMuZmllbGQuY2hlY2tBbnkoMiwgMiwgLTEpIHx8IHRoaXMuZmllbGQuY2hlY2tBbnkoNCwgMiwgLTEpKSkgeyAvL0NsYXNzaWNcclxuICAgICAgICAgICAgLy93aGlsZSghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpIHx8ICEodGhpcy5maWVsZC5jaGVja0FueSgxLCAxLCAtMSkgfHwgdGhpcy5maWVsZC5jaGVja0FueSgyLCAxLCAtMSkpKSB7IC8vVGhyZXNzXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCkpIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZiggdGhpcy5jaGVja0NvbmRpdGlvbigpICYmICF0aGlzLmRhdGEudmljdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbm1vdmVldmVudCA9IChjb250cm9sbGVyLCBzZWxlY3RlZCwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmllbGQucG9zc2libGUoc2VsZWN0ZWQudGlsZSwgdGlsZWluZm8ubG9jKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5maWVsZC5tb3ZlKHNlbGVjdGVkLmxvYywgdGlsZWluZm8ubG9jKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZGlmZiA9IFt0aWxlaW5mby5sb2NbMF0gLSBzZWxlY3RlZC5sb2NbMF0sIHRpbGVpbmZvLmxvY1sxXSAtIHNlbGVjdGVkLmxvY1sxXV07XHJcbiAgICAgICAgICAgICAgICBsZXQgZHYgPSBnY2QoZGlmZlswXSwgZGlmZlsxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICAgICAgICAgIGxldCBteCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMjA0OCBhbGlrZVxyXG4gICAgICAgICAgICAgICAgZGlmZlswXSA9IGRpclswXSAqIHRoaXMuZmllbGQud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkaWZmWzFdID0gZGlyWzFdICogdGhpcy5maWVsZC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGVMaXN0ID0gW3NlbGVjdGVkLnRpbGVdO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgdGlsZUxpc3QgPSB0aGlzLmZpZWxkLnRpbGVzLmNvbmNhdChbXSk7IC8vIDIwNDggYWxpa2UgbW92aW5nIChncm91cGluZylcclxuICAgICAgICAgICAgICAgIC8vbGV0IHRpbGVMaXN0ID0gdGhpcy5maWVsZC50aWxlc0J5RGlyZWN0aW9uKGRpZmYpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1ggPSBNYXRoLnNpZ24oLWRpclswXSAqICh0aWxlLmxvY1swXSAtIG9wLmxvY1swXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdYKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1kgPSBNYXRoLnNpZ24oLWRpclsxXSAqICh0aWxlLmxvY1sxXSAtIG9wLmxvY1sxXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdZKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRRdWV1ZShbZGlmZlswXSwgZGlmZlsxXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPD1teDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUubW92ZSh0aWxlLmxlYXN0UXVldWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb3ZlZGNudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZUxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aWxlLm1vdmVkKSBtb3ZlZGNudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKG1vdmVkY250ID4gMCkgYWZ0ZXJtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBsZXQgb2xkdmFsID0gb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgY3VydmFsID0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBvcHBvbmVudCA9IHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBvbGR2YWwgPT0gY3VydmFsIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vfHwgb2xkdmFsID09IDEgJiYgY3VydmFsID09IDIgfHwgb2xkdmFsID09IDIgJiYgY3VydmFsID09IDEgLy9UaHJlc3MtbGlrZSBcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKz0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBvbGQuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL30gXHJcblxyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlIDwgMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2NvcmUgKz0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdChvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93TW92ZWQodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aWxlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnRpbGVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcXVldWU6IHRpbGUuZGF0YS5xdWV1ZS5jb25jYXQoW10pLCBcclxuICAgICAgICAgICAgICAgIHBpZWNlOiB0aWxlLmRhdGEucGllY2UsIFxyXG4gICAgICAgICAgICAgICAgc2lkZTogdGlsZS5kYXRhLnNpZGUsIFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRpbGUuZGF0YS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIHByZXY6IHRpbGUuZGF0YS5wcmV2LmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgYm9udXM6IHRpbGUuZGF0YS5ib251cywgXHJcbiAgICAgICAgICAgICAgICBtb3ZlZDogdGlsZS5kYXRhLm1vdmVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZVN0YXRlKHN0YXRlKXtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZXNbdGhpcy5zdGF0ZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IHN0YXRlLnNjb3JlO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gc3RhdGUudmljdG9yeTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB0ZGF0IG9mIHN0YXRlLnRpbGVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnF1ZXVlLnNldCh0ZGF0LnF1ZXVlKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGRhdC5waWVjZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gdGRhdC52YWx1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0ZGF0LnNpZGU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2Muc2V0KHRkYXQubG9jKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXYuc2V0KHRkYXQucHJldik7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IHRkYXQuYm9udXM7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5tb3ZlZCA9IHRkYXQubW92ZWQ7XHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMuZmllbGQsIHRkYXQubG9jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVWaWN0b3J5KCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YS52aWN0b3J5KXtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1ZpY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb25kaXRpb24oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5jaGVja0FueSh0aGlzLmRhdGEuY29uZGl0aW9uVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KXtcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc3RhcnQucHVzaCh0aGlzLm9uc3RhcnRldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc2VsZWN0LnB1c2godGhpcy5vbnNlbGVjdGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25tb3ZlLnB1c2godGhpcy5vbm1vdmVldmVudCk7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpY3M7XHJcbiAgICAgICAgZ3JhcGhpY3MuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLmNyZWF0ZUNvbXBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5idWlsZEludGVyYWN0aW9uTWFwKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMuc3BsaWNlKDAsIHRoaXMuc3RhdGVzLmxlbmd0aCk7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5nYW1lc3RhcnQoKTsgLy9QcmV2ZW50IGdhbWVvdmVyXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVwYXVzZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lb3ZlcihyZWFzb24pe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGluayhkaWZmKXsgLy8/Pz9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5hZ2VyfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQga21vdmVtYXAgPSBbXHJcbiAgICBbLTIsIC0xXSxcclxuICAgIFsgMiwgLTFdLFxyXG4gICAgWy0yLCAgMV0sXHJcbiAgICBbIDIsICAxXSxcclxuICAgIFxyXG4gICAgWy0xLCAtMl0sXHJcbiAgICBbIDEsIC0yXSxcclxuICAgIFstMSwgIDJdLFxyXG4gICAgWyAxLCAgMl1cclxuXTtcclxuXHJcbmxldCByZGlycyA9IFtcclxuICAgIFsgMCwgIDFdLCAvL2Rvd25cclxuICAgIFsgMCwgLTFdLCAvL3VwXHJcbiAgICBbIDEsICAwXSwgLy9sZWZ0XHJcbiAgICBbLTEsICAwXSAgLy9yaWdodFxyXG5dO1xyXG5cclxubGV0IGJkaXJzID0gW1xyXG4gICAgWyAxLCAgMV0sXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgIDFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwYWRpcnMgPSBbXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzID0gW1xyXG4gICAgWyAwLCAtMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcGFkaXJzTmVnID0gW1xyXG4gICAgWyAxLCAxXSxcclxuICAgIFstMSwgMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnNOZWcgPSBbXHJcbiAgICBbIDAsIDFdXHJcbl07XHJcblxyXG5cclxubGV0IHFkaXJzID0gcmRpcnMuY29uY2F0KGJkaXJzKTsgLy9tYXkgbm90IG5lZWRcclxuXHJcbmxldCB0Y291bnRlciA9IDA7XHJcblxyXG5mdW5jdGlvbiBnY2QoYSxiKSB7XHJcbiAgICBpZiAoYSA8IDApIGEgPSAtYTtcclxuICAgIGlmIChiIDwgMCkgYiA9IC1iO1xyXG4gICAgaWYgKGIgPiBhKSB7dmFyIHRlbXAgPSBhOyBhID0gYjsgYiA9IHRlbXA7fVxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAoYiA9PSAwKSByZXR1cm4gYTtcclxuICAgICAgICBhICU9IGI7XHJcbiAgICAgICAgaWYgKGEgPT0gMCkgcmV0dXJuIGI7XHJcbiAgICAgICAgYiAlPSBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBUaWxlIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogMiwgXHJcbiAgICAgICAgICAgIHBpZWNlOiAwLCBcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXSwgLy94LCB5XHJcbiAgICAgICAgICAgIHByZXY6IFstMSwgLTFdLCBcclxuICAgICAgICAgICAgc2lkZTogMCwgLy9XaGl0ZSA9IDAsIEJsYWNrID0gMVxyXG4gICAgICAgICAgICBxdWV1ZTogWzAsIDBdLCBcclxuICAgICAgICAgICAgbW92ZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmlkID0gdGNvdW50ZXIrKztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmFsdWUodil7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZhbHVlID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlmZigpe1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5kYXRhLmxvY1swXSAtIHRoaXMuZGF0YS5wcmV2WzBdLCB0aGlzLmRhdGEubG9jWzFdIC0gdGhpcy5kYXRhLnByZXZbMV1dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxvYztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcHJldigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucHJldjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbG9jKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2MgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIG9uaGl0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgb25hYnNvcmIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvbm1vdmUoKXtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMF0gLT0gdGhpcy5sb2NbMF0gLSB0aGlzLnByZXZbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnF1ZXVlWzFdIC09IHRoaXMubG9jWzFdIC0gdGhpcy5wcmV2WzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaChmaWVsZCwgeCwgeSl7XHJcbiAgICAgICAgZmllbGQuYXR0YWNoKHRoaXMsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQocmVsYXRpdmUgPSBbMCwgMF0pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSByZXR1cm4gdGhpcy5maWVsZC5nZXQoW1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzBdICsgcmVsYXRpdmVbMF0sXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gKyByZWxhdGl2ZVsxXVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGx0byl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQubW92ZSh0aGlzLmRhdGEubG9jLCBsdG8pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdXQoKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5wdXQodGhpcy5kYXRhLmxvYywgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBtb3ZlZCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubW92ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgbG9jKGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSBhWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSBhWzFdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgcXVldWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnF1ZXVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFF1ZXVlKGRpZmYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5tb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGF0YS5xdWV1ZVswXSA9IGRpZmZbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLnF1ZXVlWzFdID0gZGlmZlsxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjYWNoZUxvYygpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzBdID0gdGhpcy5kYXRhLmxvY1swXTtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlsxXSA9IHRoaXMuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEZpZWxkKGZpZWxkKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldExvYyhbeCwgeV0pe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSB4O1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXBsYWNlSWZOZWVkcygpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdID49IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQtMSAmJiB0aGlzLmRhdGEuc2lkZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdIDw9IDAgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcblxyXG5cclxuICAgIHJlc3BvbnNpdmUoZGlyKXtcclxuICAgICAgICBsZXQgbWxvYyA9IHRoaXMuZGF0YS5sb2M7XHJcbiAgICAgICAgbGV0IGxlYXN0ID0gdGhpcy5sZWFzdChkaXIpO1xyXG4gICAgICAgIGlmIChsZWFzdFswXSAhPSBtbG9jWzBdIHx8IGxlYXN0WzFdICE9IG1sb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBsZWFzdFF1ZXVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGVhc3QodGhpcy5xdWV1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGVhc3QoZGlmZil7XHJcbiAgICAgICAgbGV0IG1sb2MgPSB0aGlzLmRhdGEubG9jO1xyXG4gICAgICAgIGlmIChkaWZmWzBdID09IDAgJiYgZGlmZlsxXSA9PSAwKSByZXR1cm4gW21sb2NbMF0sIG1sb2NbMV1dO1xyXG5cclxuICAgICAgICBsZXQgbXggPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBtbiA9IE1hdGgubWluKE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcbiAgICAgICAgbGV0IGFzcCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0gLyBkaWZmWzFdKSwgTWF0aC5hYnMoZGlmZlsxXSAvIGRpZmZbMF0pKTtcclxuXHJcbiAgICAgICAgbGV0IGR2ID0gZ2NkKGRpZmZbMF0sIGRpZmZbMV0pO1xyXG4gICAgICAgIGxldCBkaXIgPSBbZGlmZlswXSAvIGR2LCBkaWZmWzFdIC8gZHZdO1xyXG5cclxuICAgICAgICBsZXQgdHJhY2UgPSAoKT0+e1xyXG4gICAgICAgICAgICBsZXQgbGVhc3QgPSBbbWxvY1swXSwgbWxvY1sxXV07XHJcbiAgICAgICAgICAgIGZvcihsZXQgbz0xO288PW14O28rKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2ZmID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzBdICogbyksIFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzFdICogbylcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1swXSArIG9mZlswXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1sxXSArIG9mZlsxXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuaW5zaWRlKGNsb2MpIHx8ICF0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gbGVhc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgbGVhc3RbMF0gPSBjbG9jWzBdO1xyXG4gICAgICAgICAgICAgICAgbGVhc3RbMV0gPSBjbG9jWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkLmdldChjbG9jKS50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlYXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsZWFzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgbGV0IHlkaXIgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gLTEgOiAxO1xyXG4gICAgICAgICAgICBpZiAoZGlyWzFdID09IHlkaXIpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbbWxvY1swXSArIGRpclswXSwgbWxvY1sxXSArIGRpclsxXV07XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gY2xvYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAxKSB7IC8vS25pZ2h0XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDIgfHxcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMiAmJiBNYXRoLmFicyhkaXJbMV0pID09IDFcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFttbG9jWzBdICsgZGlyWzBdLCBtbG9jWzFdICsgZGlyWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBjbG9jO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMCAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEgfHwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAwXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNCkgeyAvL1F1ZWVuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDEgfHwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDAgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXJbMF0pIDw9IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFttbG9jWzBdICsgZGlyWzBdLCBtbG9jWzFdICsgZGlyWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBjbG9jO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW21sb2NbMF0sIG1sb2NbMV1dO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5wb3NzaWJsZSh0aGlzLCBsb2MpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3NpYmxlTW92ZShsb2Mpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBpZiAobWxvY1swXSA9PSBsb2NbMF0gJiYgbWxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSBbXHJcbiAgICAgICAgICAgIGxvY1swXSAtIG1sb2NbMF0sXHJcbiAgICAgICAgICAgIGxvY1sxXSAtIG1sb2NbMV0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbXggPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBtbiA9IE1hdGgubWluKE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcbiAgICAgICAgbGV0IGFzcCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0gLyBkaWZmWzFdKSwgTWF0aC5hYnMoZGlmZlsxXSAvIGRpZmZbMF0pKTtcclxuXHJcbiAgICAgICAgbGV0IGR2ID0gZ2NkKGRpZmZbMF0sIGRpZmZbMV0pO1xyXG4gICAgICAgIGxldCBkaXIgPSBbZGlmZlswXSAvIGR2LCBkaWZmWzFdIC8gZHZdO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZC5nZXQobG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYWNlID0gKCk9PntcclxuICAgICAgICAgICAgZm9yKGxldCBvPTE7bzxteDtvKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZiA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclswXSAqIG8pLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclsxXSAqIG8pXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1swXSArIG9mZlswXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1sxXSArIG9mZlsxXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5pbnNpZGUoY2xvYykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkLmdldChjbG9jKS50aWxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGxldCB5ZGlyID0gdGhpcy5kYXRhLnNpZGUgPT0gMCA/IC0xIDogMTtcclxuICAgICAgICAgICAgaWYgKHRpbGUudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKGRpZmZbMF0pID09IDEgJiYgZGlmZlsxXSA9PSB5ZGlyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKGRpZmZbMF0pID09IDAgJiYgZGlmZlsxXSA9PSB5ZGlyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlmZlswXSkgPT0gMSAmJiBNYXRoLmFicyhkaWZmWzFdKSA9PSAyIHx8XHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaWZmWzBdKSA9PSAyICYmIE1hdGguYWJzKGRpZmZbMV0pID09IDFcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAyKSB7IC8vQmlzaG9wXHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAzKSB7IC8vUm9va1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDAgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAxICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmFicyhkaXJbMF0pID09IDEgJiYgTWF0aC5hYnMoZGlyWzFdKSA9PSAxIHx8IFxyXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGlyWzBdKSA9PSAwICYmIE1hdGguYWJzKGRpclsxXSkgPT0gMSB8fCBcclxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGRpclswXSkgPT0gMSAmJiBNYXRoLmFicyhkaXJbMV0pID09IDBcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA1KSB7IC8vS2luZ1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlswXSkgPD0gMSAmJiBNYXRoLmFicyhkaWZmWzFdKSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtUaWxlfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7IEdyYXBoaWNzRW5naW5lIH0gZnJvbSBcIi4vaW5jbHVkZS9ncmFwaGljc1wiO1xyXG5pbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vaW5jbHVkZS9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vaW5jbHVkZS9pbnB1dFwiO1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7XHJcbiAgICBsZXQgZ3JhcGhpY3MgPSBuZXcgR3JhcGhpY3NFbmdpbmUoKTtcclxuICAgIGxldCBpbnB1dCA9IG5ldyBJbnB1dCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLmF0dGFjaElucHV0KGlucHV0KTtcclxuICAgIG1hbmFnZXIuaW5pdFVzZXIoe2dyYXBoaWNzLCBpbnB1dH0pO1xyXG4gICAgbWFuYWdlci5nYW1lc3RhcnQoKTsgLy9kZWJ1Z1xyXG59KSgpOyJdfQ==
