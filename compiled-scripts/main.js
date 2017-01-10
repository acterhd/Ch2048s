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
        value: function genPiece(side, exceptPawn) {
            if (Math.random() < 8 / 16 && !exceptPawn) {
                return 0;
            }
            if (Math.random() < 2 / 8) {
                return 1;
            }
            if (Math.random() < 2 / 6) {
                return 2;
            }
            if (Math.random() < 2 / 4) {
                return 3;
            }
            if (Math.random() < 1 / 2) {
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
                tile.data.side = Math.random() < 0.5 ? 1 : 0;
                tile.data.piece = this.genPiece(tile.data.side);
                tile.data.value = Math.random() < 0.1 ? 4 : 2;
                tile.data.bonus = 0;

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
                    this.data.piece = this.field.genPiece(this.data.side, true);
                }
                if (this.data.loc[1] <= 0 && this.data.side == 0) {
                    this.data.piece = this.field.genPiece(this.data.side, true);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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bGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3ID0gNCwgaCA9IDQpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IHcsIGhlaWdodDogaFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLnRpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8gPSB7XHJcbiAgICAgICAgICAgIHRpbGVJRDogLTEsXHJcbiAgICAgICAgICAgIHRpbGU6IG51bGwsXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBib251czogMCwgLy9EZWZhdWx0IHBpZWNlLCAxIGFyZSBpbnZlcnRlciwgMiBhcmUgbXVsdGktc2lkZVxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub250aWxlcmVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhZGQgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZW1vdmUgPSBbXTtcclxuICAgICAgICB0aGlzLm9udGlsZWFic29ycHRpb24gPSBbXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHdpZHRoKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tBbnkodmFsdWUsIGNvdW50ID0gMSwgc2lkZSA9IC0xKXtcclxuICAgICAgICBsZXQgY291bnRlZCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlID09IHZhbHVlICYmIChzaWRlIDwgMCB8fCB0aWxlLmRhdGEuc2lkZSA9PSBzaWRlKSAmJiB0aWxlLmRhdGEuYm9udXMgPT0gMCkgY291bnRlZCsrOy8vcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGlmKGNvdW50ZWQgPj0gY291bnQpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFueVBvc3NpYmxlKCl7XHJcbiAgICAgICAgbGV0IGFueXBvc3NpYmxlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aWxlLnBvc3NpYmxlKFtqLCBpXSkpIGFueXBvc3NpYmxlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZVBvc3NpYmxlTGlzdCh0aWxlKXtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGxpc3Q7IC8vZW1wdHlcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aWxlLnBvc3NpYmxlKFtqLCBpXSkpIGxpc3QucHVzaCh0aGlzLmdldChbaiwgaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcG9zc2libGUodGlsZSwgbHRvKXtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVpID0gdGhpcy5nZXQobHRvKTtcclxuICAgICAgICBpZiAoIXRpbGVpLmF2YWlsYWJsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYXRpbGUgPSB0aWxlaS50aWxlO1xyXG4gICAgICAgIGxldCBwaWVjZSA9IHRpbGUucG9zc2libGVNb3ZlKGx0byk7XHJcblxyXG4gICAgICAgIGlmICghYXRpbGUpIHJldHVybiBwaWVjZTtcclxuICAgICAgICBsZXQgcG9zc2libGVzID0gcGllY2U7XHJcblxyXG4gICAgICAgIGlmKHRpbGUuZGF0YS5ib251cyA9PSAwKXtcclxuICAgICAgICAgICAgbGV0IG9wcG9uZW50ID0gYXRpbGUuZGF0YS5zaWRlICE9IHRpbGUuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICBsZXQgb3duZXIgPSAhb3Bwb25lbnQ7IC8vQWxzbyBwb3NzaWJsZSBvd25lclxyXG4gICAgICAgICAgICBsZXQgYm90aCA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCBub2JvZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzYW1lID0gYXRpbGUudmFsdWUgPT0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGhpZ3RlclRoYW5PcCA9IHRpbGUudmFsdWUgPCBhdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGxvd2VyVGhhbk9wID0gYXRpbGUudmFsdWUgPCB0aWxlLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHdpdGhjb252ZXJ0ZXIgPSBhdGlsZS5kYXRhLmJvbnVzICE9IDA7XHJcbiAgICAgICAgICAgIGxldCB0d29BbmRPbmUgPSB0aWxlLnZhbHVlID09IDIgJiYgYXRpbGUudmFsdWUgPT0gMSB8fCBhdGlsZS52YWx1ZSA9PSAyICYmIHRpbGUudmFsdWUgPT0gMTtcclxuICAgICAgICAgICAgbGV0IGV4Y2VwdFR3byA9ICEodGlsZS52YWx1ZSA9PSAyICYmIHRpbGUudmFsdWUgPT0gYXRpbGUudmFsdWUpO1xyXG4gICAgICAgICAgICBsZXQgZXhjZXB0T25lID0gISh0aWxlLnZhbHVlID09IDEgJiYgdGlsZS52YWx1ZSA9PSBhdGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL1NldHRpbmdzIHdpdGggcG9zc2libGUgb3Bwb3NpdGlvbnNcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0aHJlZXNMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBleGNlcHRUd28gJiYgYm90aCB8fCBcclxuICAgICAgICAgICAgICAgIHR3b0FuZE9uZSAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG5vYm9keSB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG5vYm9keVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNoZXNzTGlrZSA9IChcclxuICAgICAgICAgICAgICAgIHNhbWUgJiYgb3Bwb25lbnQgfHwgXHJcbiAgICAgICAgICAgICAgICBoaWd0ZXJUaGFuT3AgJiYgb3Bwb25lbnQgfHwgXHJcbiAgICAgICAgICAgICAgICBsb3dlclRoYW5PcCAmJiBvcHBvbmVudFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGNsYXNzaWNMaWtlID0gKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBib3RoIHx8IFxyXG4gICAgICAgICAgICAgICAgaGlndGVyVGhhbk9wICYmIG5vYm9keSB8fCBcclxuICAgICAgICAgICAgICAgIGxvd2VyVGhhbk9wICYmIG5vYm9keVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcG9zc2libGVzID0gcG9zc2libGVzICYmIGNsYXNzaWNMaWtlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zc2libGVzICYmIGF0aWxlLmRhdGEuYm9udXMgPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBnZW5QaWVjZShzaWRlLCBleGNlcHRQYXduKSB7XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCA4LzE2ICYmICFleGNlcHRQYXduKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDIvOCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAyLzYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMi80KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDEvMikge1xyXG4gICAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBmID0gdGhpcy5nZXQoW2osIGldKTtcclxuICAgICAgICAgICAgICAgIGlmICghZi50aWxlICYmIGYuYXZhaWxhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKG5vdE9jY3VwaWVkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSh0aWxlLmRhdGEuc2lkZSk7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IE1hdGgucmFuZG9tKCkgPCAwLjEgPyA0IDogMjtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLmJvbnVzID0gMDtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgYmNoZWNrID0gdHJ1ZTsvL3RoaXMuY2hlY2tBbnkodGlsZS5kYXRhLnZhbHVlLCAxLCAxKTtcclxuICAgICAgICAgICAgbGV0IHdjaGVjayA9IHRydWU7Ly90aGlzLmNoZWNrQW55KHRpbGUuZGF0YS52YWx1ZSwgMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChiY2hlY2sgJiYgd2NoZWNrIHx8ICFiY2hlY2sgJiYgIXdjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgaWYgKCFiY2hlY2spe1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmICghd2NoZWNrKXtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVzQnlEaXJlY3Rpb24oZGlmZil7XHJcbiAgICAgICAgbGV0IHRpbGVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZS5yZXNwb25zaXZlKGRpZmYpKSB0aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGlsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKDAsIHRoaXMudGlsZXMubGVuZ3RoKTtcclxuICAgICAgICAvL3RoaXMuZmllbGRzLnNwbGljZSgwLCB0aGlzLmZpZWxkcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV0pIHRoaXMuZmllbGRzW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpcy5maWVsZHNbaV1bal0gPyB0aGlzLmZpZWxkc1tpXVtqXS50aWxlIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmKHRpbGUpeyAvL2lmIGhhdmVcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5zaWRlKGxvYykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV0sIFxyXG4gICAgICAgICAgICBhdmFpbGFibGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluc2lkZShsb2Mpe1xyXG4gICAgICAgIHJldHVybiBsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdXQobG9jLCB0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpc0F2YWlsYWJsZShsdG8pe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChsdG8pLmF2YWlsYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZ2V0VGlsZShsb2MpO1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSAmJiB0aGlzLmluc2lkZShsdG8pICYmIHRoaXMuaXNBdmFpbGFibGUobHRvKSAmJiB0aWxlICYmICF0aWxlLmRhdGEubW92ZWQgJiYgdGlsZS5wb3NzaWJsZShsdG8pKXtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZ2V0KGxvYyk7XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdGlsZS5kYXRhLm1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEucHJldlsxXSA9IHRpbGUuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICBsZXQgb2xkID0gdGhpcy5maWVsZHNbbHRvWzFdXVtsdG9bMF1dO1xyXG4gICAgICAgICAgICBpZiAob2xkICYmIG9sZC50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBvbGQudGlsZS5vbmFic29yYigpO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5vbmhpdCgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFic29ycHRpb24pIGYob2xkLnRpbGUsIHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKGx0bywgdGlsZSkucHV0KGx0bywgdGlsZSk7XHJcbiAgICAgICAgICAgIHRpbGUub25tb3ZlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXIobG9jLCBieXRpbGUgPSBudWxsKXtcclxuICAgICAgICBpZiAodGhpcy5pbnNpZGUobG9jKSkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZVBhd24uc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL3doaXRlS25pZ2h0LnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZUJpc2hvcC5zdmdcIixcclxuICAgIFwiLi9hc3NldHMvd2hpdGVSb29rLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZVF1ZWVuLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy93aGl0ZUtpbmcuc3ZnXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrUGF3bi5zdmdcIixcclxuICAgIFwiLi9hc3NldHMvYmxhY2tLbmlnaHQuc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrQmlzaG9wLnN2Z1wiLFxyXG4gICAgXCIuL2Fzc2V0cy9ibGFja1Jvb2suc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrUXVlZW4uc3ZnXCIsXHJcbiAgICBcIi4vYXNzZXRzL2JsYWNrS2luZy5zdmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnN2Z2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50V2lkdGgpLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUuZGF0YS5ib251cyA9PSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMTkyLCAxOTIsIDE5MilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMCwgMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlIDwgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDMyLCAzMiwgMzIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxICYmIHRpbGUudmFsdWUgPCAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDEyOClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCB3ID0gcGFyYW1zLnRpbGUud2lkdGg7IFxyXG4gICAgICAgIGxldCBoID0gcGFyYW1zLnRpbGUuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICB3LCBcclxuICAgICAgICAgICAgaCwgXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5lbGVtZW50ID0gZ3JvdXA7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LmFyZWEgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVEZWNvcmF0aW9uKCl7XHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KDAsIDAsIHR3LCB0aCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNDAsIDIyNCwgMTkyKVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgLy9EZWNvcmF0aXZlIGNoZXNzIGZpZWxkXHJcbiAgICAgICAgdGhpcy5jaGVzc2ZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy5jaGVzc2ZpZWxkW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9yZGVyID0gMDsvL3RoaXMucGFyYW1zLmJvcmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0ub2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGYgPSBzLmdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmLnJlY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcixcclxuICAgICAgICAgICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaWxsXCI6IHggJSAyICE9IHkgJSAyID8gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIiA6IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZi50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXS1ib3JkZXIvMn0sICR7cG9zWzFdLWJvcmRlci8yfSlgKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdChcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICAtdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLzIsIFxyXG4gICAgICAgICAgICAgICAgdHcgKyB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aCArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCwgXHJcbiAgICAgICAgICAgICAgICA1LCBcclxuICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCIsXHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21wb3NpdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMuc3BsaWNlKDAsIHRoaXMuZ3JhcGhpY3NMYXllcnMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgc2NlbmUgPSB0aGlzLnNuYXAuZ3JvdXAoKTtcclxuICAgICAgICBzY2VuZS50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0sICR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSlgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s1XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS53aWR0aCAgPSAodGhpcy5wYXJhbXMuZ3JpZC53aWR0aCAgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAod2lkdGggKyAxKSAgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyB3aWR0aDtcclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLmhlaWdodCA9ICh0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCAtIHRoaXMucGFyYW1zLmJvcmRlciAqIChoZWlnaHQgKyAxKSAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIGhlaWdodDtcclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZU92ZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZpY3RvcnkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGNyZWF0ZUdhbWVPdmVyKCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNF0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyNTUsIDIyNCwgMjI0LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiTmV3IGdhbWVcIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyIC0gMTA1fSwgJHt0aCAvIDIgKyAyMH0pYCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdG9yZVN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMTkyLCAxOTIsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiVW5kb1wiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IHRoaXMucGFyYW1zLnRpbGUud2lkdGggKiAwLjE1LCAvL1wiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXN0eWxlKSByZXR1cm4gdGhpcztcclxuICAgICAgICBvYmoucmVjdGFuZ2xlLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBzdHlsZS5maWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZvbnQpIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgc3R5bGUuZm9udCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVN0eWxlKHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdE9iamVjdCh0aWxlKTtcclxuICAgICAgICBpZiAob2JqZWN0KSBvYmplY3QucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd01vdmVkKHRpbGUpe1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKXtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUud2lkdGggICsgYm9yZGVyKSAqIHgsXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXIpICogeVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VmlzdWFsaXplcihsb2Mpe1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgIWxvYyB8fCBcclxuICAgICAgICAgICAgIShsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmZpZWxkLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5maWVsZC5kYXRhLmhlaWdodClcclxuICAgICAgICApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc3VhbGl6YXRpb25bbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aWxlOiB0aWxlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG5cclxuICAgICAgICBsZXQgdyA9IHBhcmFtcy50aWxlLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gcGFyYW1zLnRpbGUuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICB3LFxyXG4gICAgICAgICAgICBoLCBcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZmlsbHNpemV3ID0gcGFyYW1zLnRpbGUud2lkdGggICogKDAuNSAtIDAuMTI1KTtcclxuICAgICAgICBsZXQgZmlsbHNpemVoID0gZmlsbHNpemV3Oy8vcGFyYW1zLnRpbGUuaGVpZ2h0ICogKDEuMCAtIDAuMik7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIGZpbGxzaXpldywgXHJcbiAgICAgICAgICAgIGZpbGxzaXplaCwgXHJcbiAgICAgICAgICAgIHcgIC0gZmlsbHNpemV3ICogMiwgXHJcbiAgICAgICAgICAgIGggLSBmaWxsc2l6ZWggKiAyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHQgPSBzLnRleHQodyAvIDIsIGggLyAyICsgaCAqIDAuMzUsIFwiVEVTVFwiKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QsIGljb24sIHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3cvMn0sICR7aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstdy8yfSwgJHstaC8yfSlcclxuICAgICAgICBgKTtcclxuICAgICAgICBncm91cC5hdHRyKHtcIm9wYWNpdHlcIjogXCIwXCJ9KTtcclxuXHJcbiAgICAgICAgZ3JvdXAuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3cvMn0sICR7aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDEuMCwgMS4wKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXcvMn0sICR7LWgvMn0pXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5wb3MgPSBwb3M7XHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcblxyXG4gICAgICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7b2JqZWN0LnBvc1swXX0sICR7b2JqZWN0LnBvc1sxXX0pIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7dy8yfSwgJHtoLzJ9KSBcclxuICAgICAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXcvMn0sICR7LWgvMn0pXHJcbiAgICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgICAgIG9iamVjdC5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEludGVyYWN0aW9uTGF5ZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaGljc0xheWVyc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNob3dlZCgpe1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgZm9yIChsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICB2aXMuYXJlYS5hdHRyKHtmaWxsOiBcInRyYW5zcGFyZW50XCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5pbnB1dC5zZWxlY3RlZC50aWxlO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlLmxvYyk7XHJcbiAgICAgICAgaWYgKG9iamVjdCl7XHJcbiAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMjU1LCAwLCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Bvc3NpYmxlKHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBmb3IobGV0IHRpbGVpbmZvIG9mIHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZWluZm8udGlsZTtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICBpZihvYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgwLCAyNTUsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2VpdmVUaWxlcygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaWxlcygpO1xyXG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMubWFuYWdlci50aWxlcztcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyVGlsZXMoKXtcclxuICAgICAgICBmb3IgKGxldCB0aWxlIG9mIHRoaXMuZ3JhcGhpY3NUaWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlKSB0aWxlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNjb3JlKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkLmlubmVySFRNTCA9IHRoaXMubWFuYWdlci5kYXRhLnNjb3JlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWJzb3JwdGlvbi5wdXNoKChvbGQsIHRpbGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaElucHV0KGlucHV0KXsgLy9NYXkgcmVxdWlyZWQgZm9yIHNlbmQgb2JqZWN0cyBhbmQgbW91c2UgZXZlbnRzXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIGlucHV0LmF0dGFjaEdyYXBoaWNzKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB7R3JhcGhpY3NFbmdpbmV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5jbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnQgPSB7XHJcbiAgICAgICAgICAgIG9ubW92ZTogW10sXHJcbiAgICAgICAgICAgIG9uc3RhcnQ6IFtdLFxyXG4gICAgICAgICAgICBvbnNlbGVjdDogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdW5kb1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0b3JlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgaWYoIXRoaXMuY2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGhpcy5zZWxlY3RlZC50aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hHcmFwaGljcyhncmFwaGljKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVJbnRlcmFjdGlvbk9iamVjdCh0aWxlaW5mbywgeCwgeSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRpbGVpbmZvOiB0aWxlaW5mbyxcclxuICAgICAgICAgICAgbG9jOiBbeCwgeV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuXHJcbiAgICAgICAgbGV0IHN2Z2VsZW1lbnQgPSBncmFwaGljLnN2Z2VsO1xyXG4gICAgICAgIHN2Z2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSBncmFwaGljLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24ob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMuZ3JhcGhpYy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB3ID0gcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXI7XHJcbiAgICAgICAgbGV0IGggPSBwYXJhbXMudGlsZS5oZWlnaHQgKyBib3JkZXI7XHJcblxyXG4gICAgICAgIGxldCBhcmVhID0gaW50ZXJhY3RpdmUub2JqZWN0LnJlY3QoMCwgMCwgdywgaCkudHJhbnNmb3JtKFxyXG4gICAgICAgICAgICBgdHJhbnNsYXRlKCR7cG9zWzBdIC0gYm9yZGVyLzJ9LCAke3Bvc1sxXSAtIGJvcmRlci8yfSlgXHJcbiAgICAgICAgKS5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiBzZWxlY3RlZC50aWxlICYmIHNlbGVjdGVkLnRpbGUubG9jWzBdICE9IC0xICYmIHNlbGVjdGVkICE9IHRoaXMuc2VsZWN0ZWQgJiYgKCF0aGlzLnNlbGVjdGVkLnRpbGUgfHwgIXRoaXMuc2VsZWN0ZWQudGlsZS5wb3NzaWJsZShvYmplY3QubG9jKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9ubW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMsIHNlbGVjdGVkLCBmaWVsZC5nZXQob2JqZWN0LmxvYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSBvYmplY3QuYXJlYSA9IGFyZWE7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRJbnRlcmFjdGlvbk1hcCgpe1xyXG4gICAgICAgIGxldCBtYXAgPSB7XHJcbiAgICAgICAgICAgIHRpbGVtYXA6IFtdLCBcclxuICAgICAgICAgICAgZ3JpZG1hcDogbnVsbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZmllbGQuZGF0YS5oZWlnaHQ7aSsrKXtcclxuICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajxmaWVsZC5kYXRhLndpZHRoO2orKyl7XHJcbiAgICAgICAgICAgICAgICBtYXAudGlsZW1hcFtpXVtqXSA9IHRoaXMuY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QoZmllbGQuZ2V0KFtqLCBpXSksIGosIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7SW5wdXR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vZmllbGRcIjtcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcclxuXHJcbmZ1bmN0aW9uIGdjZChhLGIpIHtcclxuICAgIGlmIChhIDwgMCkgYSA9IC1hO1xyXG4gICAgaWYgKGIgPCAwKSBiID0gLWI7XHJcbiAgICBpZiAoYiA+IGEpIHt2YXIgdGVtcCA9IGE7IGEgPSBiOyBiID0gdGVtcDt9XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmIChiID09IDApIHJldHVybiBhO1xyXG4gICAgICAgIGEgJT0gYjtcclxuICAgICAgICBpZiAoYSA9PSAwKSByZXR1cm4gYjtcclxuICAgICAgICBiICU9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFycmF5LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihhcnJheSwgb2Zmc2V0ID0gMCl7XHJcbiAgICBmb3IgKGxldCBpPTA7aTxhcnJheS5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgdGhpc1tvZmZzZXQgKyBpXSA9IGFycmF5W2ldO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbmV3IEZpZWxkKDQsIDQpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmljdG9yeTogZmFsc2UsIFxyXG4gICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgbW92ZWNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFic29yYmVkOiAwLCBcclxuICAgICAgICAgICAgY29uZGl0aW9uVmFsdWU6IDIwNDgsIFxyXG4gICAgICAgICAgICBhY2N1bXVsYXRlZDogMFxyXG4gICAgICAgICAgICAvL2NvbmRpdGlvblZhbHVlOiAxMjI4OCAvL1RocmVlcy1saWtlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0YXRlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYWZ0ZXJtb3ZlID0gKHRpbGUpPT57XHJcbiAgICAgICAgICAgIGxldCBjID0gMDtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFjY3VtdWxhdGVkKys7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kYXRhLmFic29yYmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjID0gMTsgdGhpcy5kYXRhLmFjY3VtdWxhdGVkID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHAgPSAxLjA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8YztpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA8IHApIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCkpIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpKSB0aGlzLmdyYXBoaWMuc2hvd0dhbWVvdmVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZiggdGhpcy5jaGVja0NvbmRpdGlvbigpICYmICF0aGlzLmRhdGEudmljdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbm1vdmVldmVudCA9IChjb250cm9sbGVyLCBzZWxlY3RlZCwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmllbGQucG9zc2libGUoc2VsZWN0ZWQudGlsZSwgdGlsZWluZm8ubG9jKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5maWVsZC5tb3ZlKHNlbGVjdGVkLmxvYywgdGlsZWluZm8ubG9jKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZGlmZiA9IFt0aWxlaW5mby5sb2NbMF0gLSBzZWxlY3RlZC5sb2NbMF0sIHRpbGVpbmZvLmxvY1sxXSAtIHNlbGVjdGVkLmxvY1sxXV07XHJcbiAgICAgICAgICAgICAgICBsZXQgZHYgPSBnY2QoZGlmZlswXSwgZGlmZlsxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICAgICAgICAgIGxldCBteCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMjA0OCBhbGlrZVxyXG4gICAgICAgICAgICAgICAgZGlmZlswXSA9IGRpclswXSAqIHRoaXMuZmllbGQud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkaWZmWzFdID0gZGlyWzFdICogdGhpcy5maWVsZC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGVMaXN0ID0gW3NlbGVjdGVkLnRpbGVdO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgdGlsZUxpc3QgPSB0aGlzLmZpZWxkLnRpbGVzLmNvbmNhdChbXSk7IC8vIDIwNDggYWxpa2UgbW92aW5nIChncm91cGluZylcclxuICAgICAgICAgICAgICAgIC8vbGV0IHRpbGVMaXN0ID0gdGhpcy5maWVsZC50aWxlc0J5RGlyZWN0aW9uKGRpZmYpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1ggPSBNYXRoLnNpZ24oLWRpclswXSAqICh0aWxlLmxvY1swXSAtIG9wLmxvY1swXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdYKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRpbGVMaXN0LnNvcnQoKHRpbGUsIG9wKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGlmdGluZ1kgPSBNYXRoLnNpZ24oLWRpclsxXSAqICh0aWxlLmxvY1sxXSAtIG9wLmxvY1sxXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnNpZ24oc2hpZnRpbmdZKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRRdWV1ZShbZGlmZlswXSwgZGlmZlsxXV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPD1teDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aWxlTGlzdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUubW92ZSh0aWxlLmxlYXN0UXVldWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBtb3ZlZGNudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZUxpc3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aWxlLm1vdmVkKSBtb3ZlZGNudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUucXVldWVbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKG1vdmVkY250ID4gMCkgYWZ0ZXJtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBsZXQgb2xkdmFsID0gb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgY3VydmFsID0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBvcHBvbmVudCA9IHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGU7XHJcbiAgICAgICAgICAgIGxldCBvd25lciA9ICFvcHBvbmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgKG9wcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBvbGR2YWwgPT0gY3VydmFsIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vfHwgb2xkdmFsID09IDEgJiYgY3VydmFsID09IDIgfHwgb2xkdmFsID09IDIgJiYgY3VydmFsID09IDEgLy9UaHJlc3MtbGlrZSBcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKz0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBvbGQuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gb2xkdmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL30gXHJcblxyXG4gICAgICAgICAgICBpZih0aWxlLnZhbHVlIDwgMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2NvcmUgKz0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmFic29yYmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdChvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93TW92ZWQodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0aWxlcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnRpbGVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxuICAgIHNhdmVTdGF0ZSgpe1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgdGlsZXM6IFtdLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5maWVsZC53aWR0aCwgXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5maWVsZC5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHN0YXRlLnNjb3JlID0gdGhpcy5kYXRhLnNjb3JlO1xyXG4gICAgICAgIHN0YXRlLnZpY3RvcnkgPSB0aGlzLmRhdGEudmljdG9yeTtcclxuICAgICAgICBzdGF0ZS5hY2N1bXVsYXRlZCA9IHRoaXMuZGF0YS5hY2N1bXVsYXRlZDtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy5maWVsZC50aWxlcyl7XHJcbiAgICAgICAgICAgIHN0YXRlLnRpbGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbG9jOiB0aWxlLmRhdGEubG9jLmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgcXVldWU6IHRpbGUuZGF0YS5xdWV1ZS5jb25jYXQoW10pLCBcclxuICAgICAgICAgICAgICAgIHBpZWNlOiB0aWxlLmRhdGEucGllY2UsIFxyXG4gICAgICAgICAgICAgICAgc2lkZTogdGlsZS5kYXRhLnNpZGUsIFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRpbGUuZGF0YS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIHByZXY6IHRpbGUuZGF0YS5wcmV2LmNvbmNhdChbXSksIFxyXG4gICAgICAgICAgICAgICAgYm9udXM6IHRpbGUuZGF0YS5ib251cywgXHJcbiAgICAgICAgICAgICAgICBtb3ZlZDogdGlsZS5kYXRhLm1vdmVkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZVN0YXRlKHN0YXRlKXtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZXNbdGhpcy5zdGF0ZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IHN0YXRlLnNjb3JlO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gc3RhdGUudmljdG9yeTtcclxuICAgICAgICB0aGlzLmRhdGEuYWNjdW11bGF0ZWQgPSBzdGF0ZS5hY2N1bXVsYXRlZDtcclxuXHJcbiAgICAgICAgZm9yKGxldCB0ZGF0IG9mIHN0YXRlLnRpbGVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnF1ZXVlLnNldCh0ZGF0LnF1ZXVlKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGRhdC5waWVjZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gdGRhdC52YWx1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0ZGF0LnNpZGU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2Muc2V0KHRkYXQubG9jKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXYuc2V0KHRkYXQucHJldik7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IHRkYXQuYm9udXM7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5tb3ZlZCA9IHRkYXQubW92ZWQ7XHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMuZmllbGQsIHRkYXQubG9jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVWaWN0b3J5KCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YS52aWN0b3J5KXtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1ZpY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb25kaXRpb24oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5jaGVja0FueSh0aGlzLmRhdGEuY29uZGl0aW9uVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KXtcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc3RhcnQucHVzaCh0aGlzLm9uc3RhcnRldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc2VsZWN0LnB1c2godGhpcy5vbnNlbGVjdGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25tb3ZlLnB1c2godGhpcy5vbm1vdmVldmVudCk7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpY3M7XHJcbiAgICAgICAgZ3JhcGhpY3MuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLmNyZWF0ZUNvbXBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5idWlsZEludGVyYWN0aW9uTWFwKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMuc3BsaWNlKDAsIHRoaXMuc3RhdGVzLmxlbmd0aCk7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5nYW1lc3RhcnQoKTsgLy9QcmV2ZW50IGdhbWVvdmVyXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVwYXVzZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lb3ZlcihyZWFzb24pe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGluayhkaWZmKXsgLy8/Pz9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5hZ2VyfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQga21vdmVtYXAgPSBbXHJcbiAgICBbLTIsIC0xXSxcclxuICAgIFsgMiwgLTFdLFxyXG4gICAgWy0yLCAgMV0sXHJcbiAgICBbIDIsICAxXSxcclxuICAgIFxyXG4gICAgWy0xLCAtMl0sXHJcbiAgICBbIDEsIC0yXSxcclxuICAgIFstMSwgIDJdLFxyXG4gICAgWyAxLCAgMl1cclxuXTtcclxuXHJcbmxldCByZGlycyA9IFtcclxuICAgIFsgMCwgIDFdLCAvL2Rvd25cclxuICAgIFsgMCwgLTFdLCAvL3VwXHJcbiAgICBbIDEsICAwXSwgLy9sZWZ0XHJcbiAgICBbLTEsICAwXSAgLy9yaWdodFxyXG5dO1xyXG5cclxubGV0IGJkaXJzID0gW1xyXG4gICAgWyAxLCAgMV0sXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgIDFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwYWRpcnMgPSBbXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzID0gW1xyXG4gICAgWyAwLCAtMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcGFkaXJzTmVnID0gW1xyXG4gICAgWyAxLCAxXSxcclxuICAgIFstMSwgMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnNOZWcgPSBbXHJcbiAgICBbIDAsIDFdXHJcbl07XHJcblxyXG5cclxuZnVuY3Rpb24gbWF0Y2hEaXJlY3Rpb24oZGlyLCBsaXN0KXtcclxuICAgIGZvcihsZXQgbGRpciBvZiBsaXN0KXtcclxuICAgICAgICBpZiAoZGlyWzBdID09IGxkaXJbMF0gJiYgZGlyWzFdID09IGxkaXJbMV0pIHJldHVybiB0cnVlOyBcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuZnVuY3Rpb24gZ2NkKGEsYikge1xyXG4gICAgaWYgKGEgPCAwKSBhID0gLWE7XHJcbiAgICBpZiAoYiA8IDApIGIgPSAtYjtcclxuICAgIGlmIChiID4gYSkge3ZhciB0ZW1wID0gYTsgYSA9IGI7IGIgPSB0ZW1wO31cclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKGIgPT0gMCkgcmV0dXJuIGE7XHJcbiAgICAgICAgYSAlPSBiO1xyXG4gICAgICAgIGlmIChhID09IDApIHJldHVybiBiO1xyXG4gICAgICAgIGIgJT0gYTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFRpbGUge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAyLCBcclxuICAgICAgICAgICAgcGllY2U6IDAsIFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdLCAvL3gsIHlcclxuICAgICAgICAgICAgcHJldjogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBzaWRlOiAwLCAvL1doaXRlID0gMCwgQmxhY2sgPSAxXHJcbiAgICAgICAgICAgIHF1ZXVlOiBbMCwgMF0sIFxyXG4gICAgICAgICAgICBtb3ZlZDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaWQgPSB0Y291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2KXtcclxuICAgICAgICB0aGlzLmRhdGEudmFsdWUgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkaWZmKCl7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmRhdGEubG9jWzBdIC0gdGhpcy5kYXRhLnByZXZbMF0sIHRoaXMuZGF0YS5sb2NbMV0gLSB0aGlzLmRhdGEucHJldlsxXV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwcmV2KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5wcmV2O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2Modil7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvYyA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgb25oaXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvbmFic29yYigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIG9ubW92ZSgpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5xdWV1ZVswXSAtPSB0aGlzLmxvY1swXSAtIHRoaXMucHJldlswXTtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMV0gLT0gdGhpcy5sb2NbMV0gLSB0aGlzLnByZXZbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGZpZWxkLCB4LCB5KXtcclxuICAgICAgICBmaWVsZC5hdHRhY2godGhpcywgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChyZWxhdGl2ZSA9IFswLCAwXSl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHJldHVybiB0aGlzLmZpZWxkLmdldChbXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gKyByZWxhdGl2ZVswXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSArIHJlbGF0aXZlWzFdXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobHRvKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5tb3ZlKHRoaXMuZGF0YS5sb2MsIGx0byk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLnB1dCh0aGlzLmRhdGEubG9jLCB0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1vdmVkKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5tb3ZlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sb2M7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBsb2MoYSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IGFbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IGFbMV07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBxdWV1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucXVldWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UXVldWUoZGlmZil7XHJcbiAgICAgICAgdGhpcy5kYXRhLm1vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kYXRhLnF1ZXVlWzBdID0gZGlmZlswXTtcclxuICAgICAgICB0aGlzLmRhdGEucXVldWVbMV0gPSBkaWZmWzFdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNhY2hlTG9jKCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMF0gPSB0aGlzLmRhdGEubG9jWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzFdID0gdGhpcy5kYXRhLmxvY1sxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0RmllbGQoZmllbGQpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0TG9jKFt4LCB5XSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IHg7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlcGxhY2VJZk5lZWRzKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sb2NbMV0gPj0gdGhpcy5maWVsZC5kYXRhLmhlaWdodC0xICYmIHRoaXMuZGF0YS5zaWRlID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodGhpcy5kYXRhLnNpZGUsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdIDw9IDAgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0aGlzLmRhdGEuc2lkZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG5cclxuXHJcbiAgICByZXNwb25zaXZlKGRpcil7XHJcbiAgICAgICAgbGV0IG1sb2MgPSB0aGlzLmRhdGEubG9jO1xyXG4gICAgICAgIGxldCBsZWFzdCA9IHRoaXMubGVhc3QoZGlyKTtcclxuICAgICAgICBpZiAobGVhc3RbMF0gIT0gbWxvY1swXSB8fCBsZWFzdFsxXSAhPSBtbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGVhc3RRdWV1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlYXN0KHRoaXMucXVldWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxlYXN0KGRpZmYpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBpZiAoZGlmZlswXSA9PSAwICYmIGRpZmZbMV0gPT0gMCkgcmV0dXJuIFttbG9jWzBdLCBtbG9jWzFdXTtcclxuXHJcbiAgICAgICAgbGV0IG14ID0gTWF0aC5tYXgoTWF0aC5hYnMoZGlmZlswXSksIE1hdGguYWJzKGRpZmZbMV0pKTtcclxuICAgICAgICBsZXQgbW4gPSBNYXRoLm1pbihNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBhc3AgPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdIC8gZGlmZlsxXSksIE1hdGguYWJzKGRpZmZbMV0gLyBkaWZmWzBdKSk7XHJcblxyXG4gICAgICAgIGxldCBkdiA9IGdjZChkaWZmWzBdLCBkaWZmWzFdKTtcclxuICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICBsZXQgZCA9IE1hdGgubWF4KE1hdGguY2VpbChkaWZmWzBdID09IDAgPyAwIDogZGlmZlswXSAvIGRpclswXSksIE1hdGguY2VpbChkaWZmWzFdID09IDAgPyAwIDogZGlmZlsxXSAvIGRpclsxXSkpO1xyXG5cclxuICAgICAgICBsZXQgdHJhY2UgPSAoKT0+e1xyXG4gICAgICAgICAgICBsZXQgbGVhc3QgPSBbbWxvY1swXSwgbWxvY1sxXV07XHJcbiAgICAgICAgICAgIGZvcihsZXQgbz0xO288PWQ7bysrKXtcclxuICAgICAgICAgICAgICAgIGxldCBvZmYgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJbMF0gKiBvKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJbMV0gKiBvKVxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBtbG9jWzBdICsgb2ZmWzBdLCBcclxuICAgICAgICAgICAgICAgICAgICBtbG9jWzFdICsgb2ZmWzFdXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZC5pbnNpZGUoY2xvYykgfHwgIXRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBsZWFzdDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZWFzdFswXSA9IGNsb2NbMF07XHJcbiAgICAgICAgICAgICAgICBsZWFzdFsxXSA9IGNsb2NbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmllbGQuZ2V0KGNsb2MpLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGVhc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGxlYXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKSB7IC8vUEFXTlxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBtYXRjaERpcmVjdGlvbihkaXIsIHRoaXMuZGF0YS5zaWRlID09IDAgPyBwbWRpcnMgOiBwbWRpcnNOZWcpIHx8IFxyXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXJlY3Rpb24oZGlyLCB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcGFkaXJzIDogcGFkaXJzTmVnKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW21sb2NbMF0gKyBkaXJbMF0sIG1sb2NbMV0gKyBkaXJbMV1dO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZShjbG9jKSkgcmV0dXJuIGNsb2M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMSkgeyAvL0tuaWdodFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCBrbW92ZW1hcCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbG9jID0gW21sb2NbMF0gKyBkaXJbMF0sIG1sb2NbMV0gKyBkaXJbMV1dO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZShjbG9jKSkgcmV0dXJuIGNsb2M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMikgeyAvL0Jpc2hvcFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCBiZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaXIsIHJkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNCkgeyAvL1F1ZWVuXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaXIsIHFkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNSkgeyAvL0tpbmdcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpciwgcWRpcnMpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFttbG9jWzBdICsgZGlyWzBdLCBtbG9jWzFdICsgZGlyWzFdXTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUoY2xvYykpIHJldHVybiBjbG9jO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW21sb2NbMF0sIG1sb2NbMV1dO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcG9zc2libGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5wb3NzaWJsZSh0aGlzLCBsb2MpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3NpYmxlTW92ZShsb2Mpe1xyXG4gICAgICAgIGxldCBtbG9jID0gdGhpcy5kYXRhLmxvYztcclxuICAgICAgICBpZiAobWxvY1swXSA9PSBsb2NbMF0gJiYgbWxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGRpZmYgPSBbXHJcbiAgICAgICAgICAgIGxvY1swXSAtIG1sb2NbMF0sXHJcbiAgICAgICAgICAgIGxvY1sxXSAtIG1sb2NbMV0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICAvL2xldCBteCA9IE1hdGgubWF4KE1hdGguYWJzKGRpZmZbMF0pLCBNYXRoLmFicyhkaWZmWzFdKSk7XHJcbiAgICAgICAgLy9sZXQgbW4gPSBNYXRoLm1pbihNYXRoLmFicyhkaWZmWzBdKSwgTWF0aC5hYnMoZGlmZlsxXSkpO1xyXG4gICAgICAgIGxldCBhc3AgPSBNYXRoLm1heChNYXRoLmFicyhkaWZmWzBdIC8gZGlmZlsxXSksIE1hdGguYWJzKGRpZmZbMV0gLyBkaWZmWzBdKSk7XHJcblxyXG4gICAgICAgIGxldCBkdiA9IGdjZChkaWZmWzBdLCBkaWZmWzFdKTtcclxuICAgICAgICBsZXQgZGlyID0gW2RpZmZbMF0gLyBkdiwgZGlmZlsxXSAvIGR2XTtcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuZmllbGQuZ2V0KGxvYyk7XHJcbiAgICAgICAgbGV0IGQgPSBNYXRoLm1heChNYXRoLmNlaWwoZGlmZlswXSA9PSAwID8gMCA6IGRpZmZbMF0gLyBkaXJbMF0pLCBNYXRoLmNlaWwoZGlmZlsxXSA9PSAwID8gMCA6IGRpZmZbMV0gLyBkaXJbMV0pKTtcclxuXHJcbiAgICAgICAgbGV0IHRyYWNlID0gKCk9PntcclxuICAgICAgICAgICAgZm9yKGxldCBvPTE7bzxkO28rKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2ZmID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzBdICogbyksIFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoZGlyWzFdICogbylcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xvYyA9IFtcclxuICAgICAgICAgICAgICAgICAgICBtbG9jWzBdICsgb2ZmWzBdLCBcclxuICAgICAgICAgICAgICAgICAgICBtbG9jWzFdICsgb2ZmWzFdXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmluc2lkZShjbG9jKSB8fCAhdGhpcy5maWVsZC5pc0F2YWlsYWJsZShjbG9jKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmllbGQuZ2V0KGNsb2MpLnRpbGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgaWYgKHRpbGUudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoRGlyZWN0aW9uKGRpZmYsIHRoaXMuZGF0YS5zaWRlID09IDAgPyBwYWRpcnMgOiBwYWRpcnNOZWcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoRGlyZWN0aW9uKGRpZmYsIHRoaXMuZGF0YS5zaWRlID09IDAgPyBwbWRpcnMgOiBwbWRpcnNOZWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDEpIHsgLy9LbmlnaHRcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpZmYsIGttb3ZlbWFwKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMikgeyAvL0Jpc2hvcFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hEaXJlY3Rpb24oZGlyLCBiZGlycykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDMpIHsgLy9Sb29rXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaXIsIHJkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNCkgeyAvL1F1ZWVuXHJcbiAgICAgICAgICAgIGlmIChtYXRjaERpcmVjdGlvbihkaXIsIHFkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNSkgeyAvL0tpbmdcclxuICAgICAgICAgICAgaWYgKG1hdGNoRGlyZWN0aW9uKGRpZmYsIHFkaXJzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGlsZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgeyBHcmFwaGljc0VuZ2luZSB9IGZyb20gXCIuL2luY2x1ZGUvZ3JhcGhpY3NcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL2luY2x1ZGUvbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2luY2x1ZGUvaW5wdXRcIjtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgbGV0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xyXG4gICAgbGV0IGdyYXBoaWNzID0gbmV3IEdyYXBoaWNzRW5naW5lKCk7XHJcbiAgICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoKTtcclxuXHJcbiAgICBncmFwaGljcy5hdHRhY2hJbnB1dChpbnB1dCk7XHJcbiAgICBtYW5hZ2VyLmluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KTtcclxuICAgIG1hbmFnZXIuZ2FtZXN0YXJ0KCk7IC8vZGVidWdcclxufSkoKTsiXX0=
