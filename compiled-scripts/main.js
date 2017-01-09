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
            var pawnr = Math.random();
            if (pawnr < 0.6 && !exceptPawn) {
                return 0;
            }

            var rnd = Math.random();
            if (rnd >= 0.0 && rnd < 0.2) {
                return 1;
            } else if (rnd >= 0.2 && rnd < 0.6) {
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
                tile.data.value = Math.random() < 0.1 ? 4 : 2;
                tile.data.bonus = 0;
                tile.data.side = Math.random() < 0.5 ? 1 : 0;

                var bcheck = true; //this.checkAny(tile.data.value, 1, 1);
                var wcheck = true; //this.checkAny(tile.data.value, 1, 0);
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

var iconset = ["./assets/whitePawn.svg", "./assets/whiteKnight.svg", "./assets/whiteBishop.svg", "./assets/whiteRook.svg", "./assets/whiteQueen.svg", "./assets/whiteKing.svg"];

var iconsetBlack = ["./assets/blackPawn.svg", "./assets/blackKnight.svg", "./assets/blackBishop.svg", "./assets/blackRook.svg", "./assets/blackQueen.svg", "./assets/blackKing.svg"];

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
            var w = params.tile.width;
            var h = params.tile.height;

            var rect = s.rect(0, 0, w, h, radius, radius);

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

            var w = params.tile.width;
            var h = params.tile.height;

            var rect = s.rect(0, 0, w, h, radius, radius);

            var fillsizew = params.tile.width * (0.5 - 0.125);
            var fillsizeh = fillsizew; //params.tile.height * (1.0 - 0.2);

            var icon = s.image("", fillsizew, fillsizeh, w - fillsizew * 2, h - fillsizeh * 2);

            var text = s.text(w / 2, h / 2 + h * 0.35, "TEST");
            var group = s.group(rect, icon, text);

            group.transform("\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + w / 2 + ", " + h / 2 + ") \n            scale(0.01, 0.01) \n            translate(" + -w / 2 + ", " + -h / 2 + ")\n        ");
            group.attr({ "opacity": "0" });

            group.animate({
                "transform": "\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + w / 2 + ", " + h / 2 + ") \n            scale(1.0, 1.0) \n            translate(" + -w / 2 + ", " + -h / 2 + ")\n            ",
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
                    "transform": "\n                translate(" + object.pos[0] + ", " + object.pos[1] + ") \n                translate(" + w / 2 + ", " + h / 2 + ") \n                scale(0.01, 0.01) \n                translate(" + -w / 2 + ", " + -h / 2 + ")\n                ",
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
            conditionValue: 2048,
            accumulated: 0
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
            var c = 0;
            _this.data.accumulated++;
            if (!_this.data.absorbed) {
                c = 1;_this.data.accumulated = 0;
            }

            var p = 1.0;
            for (var i = 0; i < c; i++) {
                if (Math.random() < p) _this.field.generateTile();
            }
            _this.data.absorbed = false;

            while (!_this.field.anyPossible()) {
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
            state.accumulated = this.data.accumulated;
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
            this.data.accumulated = state.accumulated;

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

function matchDirection(dir, list) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ldir = _step.value;

            if (dir[0] == ldir[0] && dir[1] == ldir[1]) return true;
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
            var d = Math.max(Math.ceil(diff[0] == 0 ? 0 : diff[0] / dir[0]), Math.ceil(diff[1] == 0 ? 0 : diff[1] / dir[1]));

            var trace = function trace() {
                var least = [mloc[0], mloc[1]];
                for (var o = 1; o <= d; o++) {
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
                if (matchDirection(dir, this.data.side == 0 ? pmdirs : pmdirsNeg) || matchDirection(dir, this.data.side == 0 ? padirs : padirsNeg)) {
                    var cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                    if (this.possible(cloc)) return cloc;
                }
            } else if (this.data.piece == 1) {
                //Knight
                if (matchDirection(dir, kmovemap)) {
                    var _cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                    if (this.possible(_cloc)) return _cloc;
                }
            } else if (this.data.piece == 2) {
                //Bishop
                if (matchDirection(dir, bdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 3) {
                //Rook
                if (matchDirection(dir, rdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 4) {
                //Queen
                if (matchDirection(dir, qdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 5) {
                //King
                if (matchDirection(dir, qdirs)) {
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
            //let mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
            //let mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
            var asp = Math.max(Math.abs(diff[0] / diff[1]), Math.abs(diff[1] / diff[0]));

            var dv = gcd(diff[0], diff[1]);
            var dir = [diff[0] / dv, diff[1] / dv];
            var tile = this.field.get(loc);
            var d = Math.max(Math.ceil(diff[0] == 0 ? 0 : diff[0] / dir[0]), Math.ceil(diff[1] == 0 ? 0 : diff[1] / dir[1]));

            var trace = function trace() {
                for (var o = 1; o < d; o++) {
                    var off = [Math.floor(dir[0] * o), Math.floor(dir[1] * o)];
                    var cloc = [mloc[0] + off[0], mloc[1] + off[1]];
                    if (!_this2.field.inside(cloc) || !_this2.field.isAvailable(cloc)) return false;
                    if (_this2.field.get(cloc).tile) return false;
                }
                return true;
            };

            if (this.data.piece == 0) {
                //PAWN
                if (tile.tile) {
                    return matchDirection(diff, this.data.side == 0 ? padirs : padirsNeg);
                } else {
                    return matchDirection(diff, this.data.side == 0 ? pmdirs : pmdirsNeg);
                }
            } else if (this.data.piece == 1) {
                //Knight
                if (matchDirection(diff, kmovemap)) {
                    return true;
                }
            } else if (this.data.piece == 2) {
                //Bishop
                if (matchDirection(dir, bdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 3) {
                //Rook
                if (matchDirection(dir, rdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 4) {
                //Queen
                if (matchDirection(dir, qdirs)) {
                    return trace();
                }
            } else if (this.data.piece == 5) {
                //King
                if (matchDirection(diff, qdirs)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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LCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKHcgPSA0LCBoID0gNCl7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogdywgaGVpZ2h0OiBoXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbyA9IHtcclxuICAgICAgICAgICAgdGlsZUlEOiAtMSxcclxuICAgICAgICAgICAgdGlsZTogbnVsbCxcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIGJvbnVzOiAwLCAvL0RlZmF1bHQgcGllY2UsIDEgYXJlIGludmVydGVyLCAyIGFyZSBtdWx0aS1zaWRlXHJcbiAgICAgICAgICAgIGF2YWlsYWJsZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbnRpbGVyZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFkZCA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWJzb3JwdGlvbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgd2lkdGgoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FueSh2YWx1ZSwgY291bnQgPSAxLCBzaWRlID0gLTEpe1xyXG4gICAgICAgIGxldCBjb3VudGVkID0gMDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPT0gdmFsdWUgJiYgKHNpZGUgPCAwIHx8IHRpbGUuZGF0YS5zaWRlID09IHNpZGUpICYmIHRpbGUuZGF0YS5ib251cyA9PSAwKSBjb3VudGVkKys7Ly9yZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYoY291bnRlZCA+PSBjb3VudCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYW55UG9zc2libGUoKXtcclxuICAgICAgICBsZXQgYW55cG9zc2libGUgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRpbGUucG9zc2libGUoW2osIGldKSkgYW55cG9zc2libGUrKztcclxuICAgICAgICAgICAgICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aWxlUG9zc2libGVMaXN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gbGlzdDsgLy9lbXB0eVxyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUucG9zc2libGUoW2osIGldKSkgbGlzdC5wdXNoKHRoaXMuZ2V0KFtqLCBpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwb3NzaWJsZSh0aWxlLCBsdG8pe1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdGlsZWkgPSB0aGlzLmdldChsdG8pO1xyXG4gICAgICAgIGlmICghdGlsZWkuYXZhaWxhYmxlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBhdGlsZSA9IHRpbGVpLnRpbGU7XHJcbiAgICAgICAgbGV0IHBpZWNlID0gdGlsZS5wb3NzaWJsZU1vdmUobHRvKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdGlsZSkgcmV0dXJuIHBpZWNlO1xyXG4gICAgICAgIGxldCBwb3NzaWJsZXMgPSBwaWVjZTtcclxuXHJcbiAgICAgICAgaWYodGlsZS5kYXRhLmJvbnVzID09IDApe1xyXG4gICAgICAgICAgICBsZXQgb3Bwb25lbnQgPSBhdGlsZS5kYXRhLnNpZGUgIT0gdGlsZS5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDsgLy9BbHNvIHBvc3NpYmxlIG93bmVyXHJcbiAgICAgICAgICAgIGxldCBib3RoID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IG5vYm9keSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNhbWUgPSBhdGlsZS52YWx1ZSA9PSB0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgaGlndGVyVGhhbk9wID0gdGlsZS52YWx1ZSA8IGF0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgbG93ZXJUaGFuT3AgPSBhdGlsZS52YWx1ZSA8IHRpbGUudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgd2l0aGNvbnZlcnRlciA9IGF0aWxlLmRhdGEuYm9udXMgIT0gMDtcclxuICAgICAgICAgICAgbGV0IHR3b0FuZE9uZSA9IHRpbGUudmFsdWUgPT0gMiAmJiBhdGlsZS52YWx1ZSA9PSAxIHx8IGF0aWxlLnZhbHVlID09IDIgJiYgdGlsZS52YWx1ZSA9PSAxO1xyXG4gICAgICAgICAgICBsZXQgZXhjZXB0VHdvID0gISh0aWxlLnZhbHVlID09IDIgJiYgdGlsZS52YWx1ZSA9PSBhdGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRPbmUgPSAhKHRpbGUudmFsdWUgPT0gMSAmJiB0aWxlLnZhbHVlID09IGF0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vU2V0dGluZ3Mgd2l0aCBwb3NzaWJsZSBvcHBvc2l0aW9uc1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRocmVlc0xpa2UgPSAoXHJcbiAgICAgICAgICAgICAgICBzYW1lICYmIGV4Y2VwdFR3byAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgdHdvQW5kT25lICYmIGJvdGggfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgbm9ib2R5IHx8IFxyXG4gICAgICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgbm9ib2R5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY2hlc3NMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBvcHBvbmVudCB8fCBcclxuICAgICAgICAgICAgICAgIGhpZ3RlclRoYW5PcCAmJiBvcHBvbmVudCB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG9wcG9uZW50XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY2xhc3NpY0xpa2UgPSAoXHJcbiAgICAgICAgICAgICAgICBzYW1lICYmIGJvdGggfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgbm9ib2R5IHx8IFxyXG4gICAgICAgICAgICAgICAgbG93ZXJUaGFuT3AgJiYgbm9ib2R5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwb3NzaWJsZXMgPSBwb3NzaWJsZXMgJiYgY2xhc3NpY0xpa2U7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9zc2libGVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZXMgJiYgYXRpbGUuZGF0YS5ib251cyA9PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdFNhbWUoKXtcclxuICAgICAgICBsZXQgc2FtZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmIChzYW1lcy5pbmRleE9mKHRpbGUudmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgc2FtZXMucHVzaCh0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5QaWVjZShleGNlcHRQYXduKSB7XHJcbiAgICAgICAgbGV0IHBhd25yID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZiAocGF3bnIgPCAwLjYgJiYgIWV4Y2VwdFBhd24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZihybmQgPj0gMC4wICYmIHJuZCA8IDAuMikge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgaWYocm5kID49IDAuMiAmJiBybmQgPCAwLjYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjYgJiYgcm5kIDwgMC44KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC44ICYmIHJuZCA8IDAuOSkge1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gdGhpcy5nZXQoW2osIGldKTtcclxuICAgICAgICAgICAgICAgIGlmICghZi50aWxlICYmIGYuYXZhaWxhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKG5vdE9jY3VwaWVkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSB0aGlzLmdlblBpZWNlKCk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IE1hdGgucmFuZG9tKCkgPCAwLjEgPyA0IDogMjtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmJvbnVzID0gMDtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgYmNoZWNrID0gdHJ1ZTsvL3RoaXMuY2hlY2tBbnkodGlsZS5kYXRhLnZhbHVlLCAxLCAxKTtcclxuICAgICAgICAgICAgbGV0IHdjaGVjayA9IHRydWU7Ly90aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChiY2hlY2sgJiYgd2NoZWNrIHx8ICFiY2hlY2sgJiYgIXdjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgaWYgKCFiY2hlY2spe1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmICghd2NoZWNrKXtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVzQnlEaXJlY3Rpb24oZGlmZil7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZS5yZXNwb25zaXZlKGRpZmYpKSB0aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKDAsIHRoaXMudGlsZXMubGVuZ3RoKTtcclxuICAgICAgICAvL3RoaXMuZmllbGRzLnNwbGljZSgwLCB0aGlzLmZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV0pIHRoaXMuZmllbGRzW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZHNbaV1bal0gPyB0aGlzLmZpZWxkc1tpXVtqXS50aWxlIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUpeyAvL2lmIGhhdmVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlKGxvYykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV0sIFxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluc2lkZShsb2Mpe1xyXG4gICAgICAgIHJldHVybiBsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdXQobG9jLCB0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpc0F2YWlsYWJsZShsdG8pe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChsdG8pLmF2YWlsYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZ2V0VGlsZShsb2MpO1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSAmJiB0aGlzLmluc2lkZShsdG8pICYmIHRoaXMuaXNBdmFpbGFibGUobHRvKSAmJiB0aWxlICYmICF0aWxlLmRhdGEubW92ZWQgJiYgdGlsZS5wb3NzaWJsZShsdG8pKXtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZ2V0KGxvYyk7XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdGlsZS5kYXRhLm1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldlsxXSA9IHRpbGUuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICBsZXQgb2xkID0gdGhpcy5maWVsZHNbbHRvWzFdXVtsdG9bMF1dO1xyXG4gICAgICAgICAgICBpZiAob2xkICYmIG9sZC50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBvbGQudGlsZS5vbmFic29yYigpO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5vbmhpdCgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFic29ycHRpb24pIGYob2xkLnRpbGUsIHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKGx0bywgdGlsZSkucHV0KGx0bywgdGlsZSk7XHJcbiAgICAgICAgICAgIHRpbGUub25tb3ZlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIobG9jLCBieXRpbGUgPSBudWxsKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZVBhd24uc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL3doaXRlS25pZ2h0LnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZUJpc2hvcC5zdmdcIixcclxuICAgIFwiLi9hc3NldHMvd2hpdGVSb29rLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZVF1ZWVuLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZUtpbmcuc3ZnXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrUGF3bi5zdmdcIixcclxuICAgIFwiLi9hc3NldHMvYmxhY2tLbmlnaHQuc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrQmlzaG9wLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy9ibGFja1Jvb2suc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrUXVlZW4uc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrS2luZy5zdmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnN2Z2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50V2lkdGgpLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUuZGF0YS5ib251cyA9PSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMTkyLCAxOTIsIDE5MilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMCwgMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlIDwgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDMyLCAzMiwgMzIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxICYmIHRpbGUudmFsdWUgPCAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDEyOClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCB3ID0gcGFyYW1zLnRpbGUud2lkdGg7IFxyXG4gICAgICAgIGxldCBoID0gcGFyYW1zLnRpbGUuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICB3LCBcclxuICAgICAgICAgICAgaCwgXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNDAsIDIyNCwgMTkyKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgLy9EZWNvcmF0aXZlIGNoZXNzIGZpZWxkXHJcbiAgICAgICAgdGhpcy5jaGVzc2ZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2ZpZWxkW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9yZGVyID0gMDsvL3RoaXMucGFyYW1zLmJvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBzLmdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmLnJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcixcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxsXCI6IHggJSAyICE9IHkgJSAyID8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIiA6IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZi50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXS1ib3JkZXIvMn0sICR7cG9zWzFdLWJvcmRlci8yfSlgKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdChcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgdHcgKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aCArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCwgXHJcbiAgICAgICAgICAgICAgICA1LCBcclxuICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21wb3NpdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMuc3BsaWNlKDAsIHRoaXMuZ3JhcGhpY3NMYXllcnMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNuYXAuZ3JvdXAoKTtcclxuICAgICAgICBzY2VuZS50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0sICR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSlgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s1XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS53aWR0aCAgPSAodGhpcy5wYXJhbXMuZ3JpZC53aWR0aCAgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAod2lkdGggKyAxKSAgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyB3aWR0aDtcclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLmhlaWdodCA9ICh0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCAtIHRoaXMucGFyYW1zLmJvcmRlciAqIChoZWlnaHQgKyAxKSAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIGhlaWdodDtcclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZU92ZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZpY3RvcnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZUdhbWVPdmVyKCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyNTUsIDIyNCwgMjI0LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiVW5kb1wiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IHRoaXMucGFyYW1zLnRpbGUud2lkdGggKiAwLjE1LCAvL1wiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBvYmoucmVjdGFuZ2xlLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBzdHlsZS5maWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZvbnQpIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgc3R5bGUuZm9udCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVN0eWxlKHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICBpZiAob2JqZWN0KSBvYmplY3QucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd01vdmVkKHRpbGUpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKXtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUud2lkdGggICsgYm9yZGVyKSAqIHgsXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpICogeVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VmlzdWFsaXplcihsb2Mpe1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWxvYyB8fCBcclxuICAgICAgICAgICAgIShsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmZpZWxkLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5maWVsZC5kYXRhLmhlaWdodClcclxuICAgICAgICApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc3VhbGl6YXRpb25bbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aWxlOiB0aWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG5cclxuICAgICAgICBsZXQgdyA9IHBhcmFtcy50aWxlLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gcGFyYW1zLnRpbGUuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICB3LFxyXG4gICAgICAgICAgICBoLCBcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZmlsbHNpemV3ID0gcGFyYW1zLnRpbGUud2lkdGggICogKDAuNSAtIDAuMTI1KTtcclxuICAgICAgICBsZXQgZmlsbHNpemVoID0gZmlsbHNpemV3Oy8vcGFyYW1zLnRpbGUuaGVpZ2h0ICogKDEuMCAtIDAuMik7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIGZpbGxzaXpldywgXHJcbiAgICAgICAgICAgIGZpbGxzaXplaCwgXHJcbiAgICAgICAgICAgIHcgIC0gZmlsbHNpemV3ICogMiwgXHJcbiAgICAgICAgICAgIGggLSBmaWxsc2l6ZWggKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBzLnRleHQodyAvIDIsIGggLyAyICsgaCAqIDAuMzUsIFwiVEVTVFwiKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QsIGljb24sIHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3cvMn0sICR7aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstdy8yfSwgJHstaC8yfSlcclxuICAgICAgICBgKTtcclxuICAgICAgICBncm91cC5hdHRyKHtcIm9wYWNpdHlcIjogXCIwXCJ9KTtcclxuXHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3cvMn0sICR7aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDEuMCwgMS4wKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXcvMn0sICR7LWgvMn0pXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5wb3MgPSBwb3M7XHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcblxyXG4gICAgICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7b2JqZWN0LnBvc1swXX0sICR7b2JqZWN0LnBvc1sxXX0pIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7dy8yfSwgJHtoLzJ9KSBcclxuICAgICAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXcvMn0sICR7LWgvMn0pXHJcbiAgICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgICAgIG9iamVjdC5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEludGVyYWN0aW9uTGF5ZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaGljc0xheWVyc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNob3dlZCgpe1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgZm9yIChsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICB2aXMuYXJlYS5hdHRyKHtmaWxsOiBcInRyYW5zcGFyZW50XCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5pbnB1dC5zZWxlY3RlZC50aWxlO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlLmxvYyk7XHJcbiAgICAgICAgaWYgKG9iamVjdCl7XHJcbiAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMjU1LCAwLCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Bvc3NpYmxlKHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBmb3IobGV0IHRpbGVpbmZvIG9mIHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZWluZm8udGlsZTtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICBpZihvYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgwLCAyNTUsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2VpdmVUaWxlcygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaWxlcygpO1xyXG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMubWFuYWdlci50aWxlcztcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyVGlsZXMoKXtcclxuICAgICAgICBmb3IgKGxldCB0aWxlIG9mIHRoaXMuZ3JhcGhpY3NUaWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlKSB0aWxlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNjb3JlKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkLmlubmVySFRNTCA9IHRoaXMubWFuYWdlci5kYXRhLnNjb3JlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWJzb3JwdGlvbi5wdXNoKChvbGQsIHRpbGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaElucHV0KGlucHV0KXsgLy9NYXkgcmVxdWlyZWQgZm9yIHNlbmQgb2JqZWN0cyBhbmQgbW91c2UgZXZlbnRzXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIGlucHV0LmF0dGFjaEdyYXBoaWNzKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB7R3JhcGhpY3NFbmdpbmV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5jbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnQgPSB7XHJcbiAgICAgICAgICAgIG9ubW92ZTogW10sXHJcbiAgICAgICAgICAgIG9uc3RhcnQ6IFtdLFxyXG4gICAgICAgICAgICBvbnNlbGVjdDogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdW5kb1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0b3JlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgaWYoIXRoaXMuY2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGhpcy5zZWxlY3RlZC50aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hHcmFwaGljcyhncmFwaGljKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVJbnRlcmFjdGlvbk9iamVjdCh0aWxlaW5mbywgeCwgeSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRpbGVpbmZvOiB0aWxlaW5mbyxcclxuICAgICAgICAgICAgbG9jOiBbeCwgeV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuXHJcbiAgICAgICAgbGV0IHN2Z2VsZW1lbnQgPSBncmFwaGljLnN2Z2VsO1xyXG4gICAgICAgIHN2Z2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSBncmFwaGljLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24ob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMuZ3JhcGhpYy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB3ID0gcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXI7XHJcbiAgICAgICAgbGV0IGggPSBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXI7XHJcblxyXG4gICAgICAgIGxldCBhcmVhID0gaW50ZXJhY3RpdmUub2JqZWN0LnJlY3QoMCwgMCwgdywgaCkudHJhbnNmb3JtKFxyXG4gICAgICAgICAgICBgdHJhbnNsYXRlKCR7cG9zWzBdIC0gYm9yZGVyLzJ9LCAke3Bvc1sxXSAtIGJvcmRlci8yfSlgXHJcbiAgICAgICAgKS5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiBzZWxlY3RlZC50aWxlICYmIHNlbGVjdGVkLnRpbGUubG9jWzBdICE9IC0xICYmIHNlbGVjdGVkICE9IHRoaXMuc2VsZWN0ZWQgJiYgKCF0aGlzLnNlbGVjdGVkLnRpbGUgfHwgIXRoaXMuc2VsZWN0ZWQudGlsZS5wb3NzaWJsZShvYmplY3QubG9jKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9ubW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMsIHNlbGVjdGVkLCBmaWVsZC5nZXQob2JqZWN0LmxvYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSBvYmplY3QuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRJbnRlcmFjdGlvbk1hcCgpe1xyXG4gICAgICAgIGxldCBtYXAgPSB7XHJcbiAgICAgICAgICAgIHRpbGVtYXA6IFtdLCBcclxuICAgICAgICAgICAgZ3JpZG1hcDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZmllbGQuZGF0YS5oZWlnaHQ7aSsrKXtcclxuICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajxmaWVsZC5kYXRhLndpZHRoO2orKyl7XHJcbiAgICAgICAgICAgICAgICBtYXAudGlsZW1hcFtpXVtqXSA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QoZmllbGQuZ2V0KFtqLCBpXSksIGosIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7SW5wdXR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vZmllbGRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmZ1bmN0aW9uIGdjZChhLGIpIHtcclxuICAgIGlmIChhIDwgMCkgYSA9IC1hO1xyXG4gICAgaWYgKGIgPCAwKSBiID0gLWI7XHJcbiAgICBpZiAoYiA+IGEpIHt2YXIgdGVtcCA9IGE7IGEgPSBiOyBiID0gdGVtcDt9XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmIChiID09IDApIHJldHVybiBhO1xyXG4gICAgICAgIGEgJT0gYjtcclxuICAgICAgICBpZiAoYSA9PSAwKSByZXR1cm4gYjtcclxuICAgICAgICBiICU9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFycmF5LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihhcnJheSwgb2Zmc2V0ID0gMCl7XHJcbiAgICBmb3IgKGxldCBpPTA7aTxhcnJheS5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgdGhpc1tvZmZzZXQgKyBpXSA9IGFycmF5W2ldO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbmV3IEZpZWxkKDQsIDQpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmljdG9yeTogZmFsc2UsIFxyXG4gICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgbW92ZWNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFic29yYmVkOiAwLCBcclxuICAgICAgICAgICAgY29uZGl0aW9uVmFsdWU6IDIwNDgsIFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRlZDogMFxyXG4gICAgICAgICAgICAvL2NvbmRpdGlvblZhbHVlOiAxMjI4OCAvL1RocmVlcy1saWtlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYWZ0ZXJtb3ZlID0gKHRpbGUpPT57XHJcbiAgICAgICAgICAgIGxldCBjID0gMDtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFjY3VtdWxhdGVkKys7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kYXRhLmFic29yYmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjID0gMTsgdGhpcy5kYXRhLmFjY3VtdWxhdGVkID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHAgPSAxLjA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8YztpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA8IHApIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCkpIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZiggdGhpcy5jaGVja0NvbmRpdGlvbigpICYmICF0aGlzLmRhdGEudmljdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbm1vdmVldmVudCA9IChjb250cm9sbGVyLCBzZWxlY3RlZCwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmllbGQucG9zc2libGUoc2VsZWN0ZWQudGlsZSwgdGlsZWluZm8ubG9jKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5maWVsZC5tb3ZlKHNlbGVjdGVkLmxvYywgdGlsZWluZm8ubG9jKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZGlmZiA9IFt0aWxlaW5mby5sb2NbMF0gLSBzZWxlY3RlZC5sb2NbMF0sIHRpbGVpbmZvLmxvY1sxXSAtIHNlbGVjdGVkLmxvY1sxXV07XHJcbiAgICAgICAgICAgICAgICBsZXQgZHYgPSBnY2QoZGlmZlswXSwgZGlmZlsxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICAgICAgICAgIGxldCBteCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMjA0OCBhbGlrZVxyXG4gICAgICAgICAgICAgICAgZGlmZlswXSA9IGRpclswXSAqIHRoaXMuZmllbGQud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkaWZmWzFdID0gZGlyWzFdICogdGhpcy5maWVsZC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGVMaXN0ID0gW3NlbGVjdGVkLnRpbGVdO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgdGlsZUxpc3QgPSB0aGlzLmZpZWxkLnRpbGVzLmNvbmNhdChbXSk7IC8vIDIwNDggYWxpa2UgbW92aW5nIChncm91cGluZylcclxuICAgICAgICAgICAgICAgIC8vbGV0IHRpbGVMaXN0ID0gdGhpcy5maWVsZC50aWxlc0J5RGlyZWN0aW9uKGRpZmYpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1ggPSBNYXRoLnNpZ24oLWRpclswXSAqICh0aWxlLmxvY1swXSAtIG9wLmxvY1swXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdYKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1kgPSBNYXRoLnNpZ24oLWRpclsxXSAqICh0aWxlLmxvY1sxXSAtIG9wLmxvY1sxXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdZKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRRdWV1ZShbZGlmZlswXSwgZGlmZlsxXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPD1teDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUubW92ZSh0aWxlLmxlYXN0UXVldWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb3ZlZGNudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZUxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aWxlLm1vdmVkKSBtb3ZlZGNudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKG1vdmVkY250ID4gMCkgYWZ0ZXJtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBsZXQgb2xkdmFsID0gb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgY3VydmFsID0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBvcHBvbmVudCA9IHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBvbGR2YWwgPT0gY3VydmFsIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vfHwgb2xkdmFsID09IDEgJiYgY3VydmFsID09IDIgfHwgb2xkdmFsID09IDIgJiYgY3VydmFsID09IDEgLy9UaHJlc3MtbGlrZSBcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKz0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBvbGQuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL30gXHJcblxyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlIDwgMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2NvcmUgKz0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdChvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93TW92ZWQodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aWxlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnRpbGVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBzdGF0ZS5hY2N1bXVsYXRlZCA9IHRoaXMuZGF0YS5hY2N1bXVsYXRlZDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcXVldWU6IHRpbGUuZGF0YS5xdWV1ZS5jb25jYXQoW10pLCBcclxuICAgICAgICAgICAgICAgIHBpZWNlOiB0aWxlLmRhdGEucGllY2UsIFxyXG4gICAgICAgICAgICAgICAgc2lkZTogdGlsZS5kYXRhLnNpZGUsIFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRpbGUuZGF0YS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIHByZXY6IHRpbGUuZGF0YS5wcmV2LmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgYm9udXM6IHRpbGUuZGF0YS5ib251cywgXHJcbiAgICAgICAgICAgICAgICBtb3ZlZDogdGlsZS5kYXRhLm1vdmVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZVN0YXRlKHN0YXRlKXtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZXNbdGhpcy5zdGF0ZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IHN0YXRlLnNjb3JlO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gc3RhdGUudmljdG9yeTtcclxuICAgICAgICB0aGlzLmRhdGEuYWNjdW11bGF0ZWQgPSBzdGF0ZS5hY2N1bXVsYXRlZDtcclxuXHJcbiAgICAgICAgZm9yKGxldCB0ZGF0IG9mIHN0YXRlLnRpbGVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnF1ZXVlLnNldCh0ZGF0LnF1ZXVlKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGRhdC5waWVjZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gdGRhdC52YWx1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0ZGF0LnNpZGU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2Muc2V0KHRkYXQubG9jKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXYuc2V0KHRkYXQucHJldik7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IHRkYXQuYm9udXM7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5tb3ZlZCA9IHRkYXQubW92ZWQ7XHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMuZmllbGQsIHRkYXQubG9jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVWaWN0b3J5KCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YS52aWN0b3J5KXtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1ZpY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb25kaXRpb24oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5jaGVja0FueSh0aGlzLmRhdGEuY29uZGl0aW9uVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KXtcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc3RhcnQucHVzaCh0aGlzLm9uc3RhcnRldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc2VsZWN0LnB1c2godGhpcy5vbnNlbGVjdGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25tb3ZlLnB1c2godGhpcy5vbm1vdmVldmVudCk7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpY3M7XHJcbiAgICAgICAgZ3JhcGhpY3MuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLmNyZWF0ZUNvbXBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5idWlsZEludGVyYWN0aW9uTWFwKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMuc3BsaWNlKDAsIHRoaXMuc3RhdGVzLmxlbmd0aCk7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5nYW1lc3RhcnQoKTsgLy9QcmV2ZW50IGdhbWVvdmVyXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVwYXVzZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lb3ZlcihyZWFzb24pe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGluayhkaWZmKXsgLy8/Pz9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5hZ2VyfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQga21vdmVtYXAgPSBbXHJcbiAgICBbLTIsIC0xXSxcclxuICAgIFsgMiwgLTFdLFxyXG4gICAgWy0yLCAgMV0sXHJcbiAgICBbIDIsICAxXSxcclxuICAgIFxyXG4gICAgWy0xLCAtMl0sXHJcbiAgICBbIDEsIC0yXSxcclxuICAgIFstMSwgIDJdLFxyXG4gICAgWyAxLCAgMl1cclxuXTtcclxuXHJcbmxldCByZGlycyA9IFtcclxuICAgIFsgMCwgIDFdLCAvL2Rvd25cclxuICAgIFsgMCwgLTFdLCAvL3VwXHJcbiAgICBbIDEsICAwXSwgLy9sZWZ0XHJcbiAgICBbLTEsICAwXSAgLy9yaWdodFxyXG5dO1xyXG5cclxubGV0IGJkaXJzID0gW1xyXG4gICAgWyAxLCAgMV0sXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgIDFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwYWRpcnMgPSBbXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzID0gW1xyXG4gICAgWyAwLCAtMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcGFkaXJzTmVnID0gW1xyXG4gICAgWyAxLCAxXSxcclxuICAgIFstMSwgMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnNOZWcgPSBbXHJcbiAgICBbIDAsIDFdXHJcbl07XHJcblxyXG5cclxuZnVuY3Rpb24gbWF0Y2hEaXJlY3Rpb24oZGlyLCBsaXN0KXtcclxuICAgIGZvcihsZXQgbGRpciBvZiBsaXN0KXtcclxuICAgICAgICBpZiAoZGlyWzBdID09IGxkaXJbMF0gJiYgZGlyWzFdID09IGxkaXJbMV0pIHJldHVybiB0cnVlOyBcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gZ2NkKGEsYikge1xyXG4gICAgaWYgKGEgPCAwKSBhID0gLWE7XHJcbiAgICBpZiAoYiA8IDApIGIgPSAtYjtcclxuICAgIGlmIChiID4gYSkge3ZhciB0ZW1wID0gYTsgYSA9IGI7IGIgPSB0ZW1wO31cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGIgPT0gMCkgcmV0dXJuIGE7XHJcbiAgICAgICAgYSAlPSBiO1xyXG4gICAgICAgIGlmIChhID09IDApIHJldHVybiBiO1xyXG4gICAgICAgIGIgJT0gYTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwLCAvL1doaXRlID0gMCwgQmxhY2sgPSAxXHJcbiAgICAgICAgICAgIHF1ZXVlOiBbMCwgMF0sIFxyXG4gICAgICAgICAgICBtb3ZlZDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkaWZmKCl7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmRhdGEubG9jWzBdIC0gdGhpcy5kYXRhLnByZXZbMF0sIHRoaXMuZGF0YS5sb2NbMV0gLSB0aGlzLmRhdGEucHJldlsxXV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwcmV2KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wcmV2O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2Modil7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvYyA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgb25oaXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvbmFic29yYigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG9ubW92ZSgpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5xdWV1ZVswXSAtPSB0aGlzLmxvY1swXSAtIHRoaXMucHJldlswXTtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMV0gLT0gdGhpcy5sb2NbMV0gLSB0aGlzLnByZXZbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGZpZWxkLCB4LCB5KXtcclxuICAgICAgICBmaWVsZC5hdHRhY2godGhpcywgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChyZWxhdGl2ZSA9IFswLCAwXSl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHJldHVybiB0aGlzLmZpZWxkLmdldChbXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gKyByZWxhdGl2ZVswXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSArIHJlbGF0aXZlWzFdXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobHRvKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5tb3ZlKHRoaXMuZGF0YS5sb2MsIGx0byk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLnB1dCh0aGlzLmRhdGEubG9jLCB0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1vdmVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5tb3ZlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sb2M7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBsb2MoYSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IGFbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IGFbMV07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBxdWV1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucXVldWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVldWUoZGlmZil7XHJcbiAgICAgICAgdGhpcy5kYXRhLm1vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kYXRhLnF1ZXVlWzBdID0gZGlmZlswXTtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMV0gPSBkaWZmWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNhY2hlTG9jKCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMF0gPSB0aGlzLmRhdGEubG9jWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzFdID0gdGhpcy5kYXRhLmxvY1sxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0RmllbGQoZmllbGQpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0TG9jKFt4LCB5XSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IHg7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlcGxhY2VJZk5lZWRzKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sb2NbMV0gPj0gdGhpcy5maWVsZC5kYXRhLmhlaWdodC0xICYmIHRoaXMuZGF0YS5zaWRlID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sb2NbMV0gPD0gMCAmJiB0aGlzLmRhdGEuc2lkZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuXHJcblxyXG4gICAgcmVzcG9uc2l2ZShkaXIpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBsZXQgbGVhc3QgPSB0aGlzLmxlYXN0KGRpcik7XHJcbiAgICAgICAgaWYgKGxlYXN0WzBdICE9IG1sb2NbMF0gfHwgbGVhc3RbMV0gIT0gbWxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxlYXN0UXVldWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZWFzdCh0aGlzLnF1ZXVlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZWFzdChkaWZmKXtcclxuICAgICAgICBsZXQgbWxvYyA9IHRoaXMuZGF0YS5sb2M7XHJcbiAgICAgICAgaWYgKGRpZmZbMF0gPT0gMCAmJiBkaWZmWzFdID09IDApIHJldHVybiBbbWxvY1swXSwgbWxvY1sxXV07XHJcblxyXG4gICAgICAgIGxldCBteCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcbiAgICAgICAgbGV0IG1uID0gTWF0aC5taW4oTWF0aC5hYnMoZGlmZlswXSksIE1hdGguYWJzKGRpZmZbMV0pKTtcclxuICAgICAgICBsZXQgYXNwID0gTWF0aC5tYXgoTWF0aC5hYnMoZGlmZlswXSAvIGRpZmZbMV0pLCBNYXRoLmFicyhkaWZmWzFdIC8gZGlmZlswXSkpO1xyXG5cclxuICAgICAgICBsZXQgZHYgPSBnY2QoZGlmZlswXSwgZGlmZlsxXSk7XHJcbiAgICAgICAgbGV0IGRpciA9IFtkaWZmWzBdIC8gZHYsIGRpZmZbMV0gLyBkdl07XHJcbiAgICAgICAgbGV0IGQgPSBNYXRoLm1heChNYXRoLmNlaWwoZGlmZlswXSA9PSAwID8gMCA6IGRpZmZbMF0gLyBkaXJbMF0pLCBNYXRoLmNlaWwoZGlmZlsxXSA9PSAwID8gMCA6IGRpZmZbMV0gLyBkaXJbMV0pKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYWNlID0gKCk9PntcclxuICAgICAgICAgICAgbGV0IGxlYXN0ID0gW21sb2NbMF0sIG1sb2NbMV1dO1xyXG4gICAgICAgICAgICBmb3IobGV0IG89MTtvPD1kO28rKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2ZmID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzBdICogbyksIFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzFdICogbylcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1swXSArIG9mZlswXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1sxXSArIG9mZlsxXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuaW5zaWRlKGNsb2MpIHx8ICF0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gbGVhc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgbGVhc3RbMF0gPSBjbG9jWzBdO1xyXG4gICAgICAgICAgICAgICAgbGVhc3RbMV0gPSBjbG9jWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkLmdldChjbG9jKS50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlYXN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsZWFzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXJlY3Rpb24oZGlyLCB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnKSB8fCBcclxuICAgICAgICAgICAgICAgIG1hdGNoRGlyZWN0aW9uKGRpciwgdGhpcy5kYXRhLnNpZGUgPT0gMCA/IHBhZGlycyA6IHBhZGlyc05lZylcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFttbG9jWzBdICsgZGlyWzBdLCBtbG9jWzFdICsgZGlyWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBjbG9jO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpciwga21vdmVtYXApKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFttbG9jWzBdICsgZGlyWzBdLCBtbG9jWzFdICsgZGlyWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBjbG9jO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpciwgYmRpcnMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAzKSB7IC8vUm9va1xyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCByZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCBxZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaXIsIHFkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbbWxvY1swXSArIGRpclswXSwgbWxvY1sxXSArIGRpclsxXV07XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKGNsb2MpKSByZXR1cm4gY2xvYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFttbG9jWzBdLCBtbG9jWzFdXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHBvc3NpYmxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQucG9zc2libGUodGhpcywgbG9jKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3NzaWJsZU1vdmUobG9jKXtcclxuICAgICAgICBsZXQgbWxvYyA9IHRoaXMuZGF0YS5sb2M7XHJcbiAgICAgICAgaWYgKG1sb2NbMF0gPT0gbG9jWzBdICYmIG1sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBkaWZmID0gW1xyXG4gICAgICAgICAgICBsb2NbMF0gLSBtbG9jWzBdLFxyXG4gICAgICAgICAgICBsb2NbMV0gLSBtbG9jWzFdLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgLy9sZXQgbXggPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIC8vbGV0IG1uID0gTWF0aC5taW4oTWF0aC5hYnMoZGlmZlswXSksIE1hdGguYWJzKGRpZmZbMV0pKTtcclxuICAgICAgICBsZXQgYXNwID0gTWF0aC5tYXgoTWF0aC5hYnMoZGlmZlswXSAvIGRpZmZbMV0pLCBNYXRoLmFicyhkaWZmWzFdIC8gZGlmZlswXSkpO1xyXG5cclxuICAgICAgICBsZXQgZHYgPSBnY2QoZGlmZlswXSwgZGlmZlsxXSk7XHJcbiAgICAgICAgbGV0IGRpciA9IFtkaWZmWzBdIC8gZHYsIGRpZmZbMV0gLyBkdl07XHJcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkLmdldChsb2MpO1xyXG4gICAgICAgIGxldCBkID0gTWF0aC5tYXgoTWF0aC5jZWlsKGRpZmZbMF0gPT0gMCA/IDAgOiBkaWZmWzBdIC8gZGlyWzBdKSwgTWF0aC5jZWlsKGRpZmZbMV0gPT0gMCA/IDAgOiBkaWZmWzFdIC8gZGlyWzFdKSk7XHJcblxyXG4gICAgICAgIGxldCB0cmFjZSA9ICgpPT57XHJcbiAgICAgICAgICAgIGZvcihsZXQgbz0xO288ZDtvKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZiA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclswXSAqIG8pLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRpclsxXSAqIG8pXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsb2MgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1swXSArIG9mZlswXSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbWxvY1sxXSArIG9mZlsxXVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5pbnNpZGUoY2xvYykgfHwgIXRoaXMuZmllbGQuaXNBdmFpbGFibGUoY2xvYykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkLmdldChjbG9jKS50aWxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDApIHsgLy9QQVdOXHJcbiAgICAgICAgICAgIGlmICh0aWxlLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaERpcmVjdGlvbihkaWZmLCB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcGFkaXJzIDogcGFkaXJzTmVnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaERpcmVjdGlvbihkaWZmLCB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcG1kaXJzIDogcG1kaXJzTmVnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAxKSB7IC8vS25pZ2h0XHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaWZmLCBrbW92ZW1hcCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpciwgYmRpcnMpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAzKSB7IC8vUm9va1xyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCByZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCBxZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDUpIHsgLy9LaW5nXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaWZmLCBxZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RpbGV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHsgR3JhcGhpY3NFbmdpbmUgfSBmcm9tIFwiLi9pbmNsdWRlL2dyYXBoaWNzXCI7XHJcbmltcG9ydCB7IE1hbmFnZXIgfSBmcm9tIFwiLi9pbmNsdWRlL21hbmFnZXJcIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9pbmNsdWRlL2lucHV0XCI7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIGxldCBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKTtcclxuICAgIGxldCBncmFwaGljcyA9IG5ldyBHcmFwaGljc0VuZ2luZSgpO1xyXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KCk7XHJcblxyXG4gICAgZ3JhcGhpY3MuYXR0YWNoSW5wdXQoaW5wdXQpO1xyXG4gICAgbWFuYWdlci5pbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSk7XHJcbiAgICBtYW5hZ2VyLmdhbWVzdGFydCgpOyAvL2RlYnVnXHJcbn0pKCk7Il19
