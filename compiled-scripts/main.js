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
                var higterThanOp = tile.value * 2 == atile.value;
                var lowerThanOp = atile.value * 2 == tile.value;

                var withconverter = atile.data.bonus != 0;

                //Settings with possible oppositions
                possibles = possibles && (same && opponent || higterThanOp && nobody || lowerThanOp && nobody || withconverter);

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
                if (Math.random() < 0.1) {
                    tile.data.side = 0;
                    tile.data.bonus = 1; //Inverter
                    tile.data.value = 2;
                    tile.data.piece = 5;
                } else {
                    tile.data.piece = this.genPiece();
                    tile.data.value = Math.random() < 0.2 ? 4 : 2;
                    tile.data.bonus = 0;

                    var bcheck = this.checkAny(2, 1, 1) || this.checkAny(4, 1, 1);
                    var wcheck = this.checkAny(2, 1, 0) || this.checkAny(4, 1, 0);

                    if (bcheck && wcheck || !bcheck && !wcheck) {
                        tile.data.side = Math.random() < 0.5 ? 1 : 0;
                    } else if (!bcheck) {
                        tile.data.side = 1;
                    } else if (!wcheck) {
                        tile.data.side = 0;
                    }
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

            if (tile.data.bonus == 0) {
                obj.text.attr({ "text": "" + tile.value });
                obj.icon.attr({ "xlink:href": obj.tile.data.side == 0 ? iconset[obj.tile.data.piece] : iconsetBlack[obj.tile.data.piece] });
                obj.text.attr({
                    "font-size": this.params.tile.width * 0.15, //"16px",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS",
                    "color": "black"
                });
            } else {
                obj.text.attr({ "text": "Inversion" });
                obj.icon.attr({ "xlink:href": bonuses[tile.data.bonus - 1] });
                obj.text.attr({
                    "font-size": this.params.tile.width * 0.15, //"16px",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS",
                    "color": "black"
                });
            }

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

            var pbonus = old.data.bonus;
            var mbonus = tile.data.bonus;
            var opponent = tile.data.side != old.data.side;
            var owner = !opponent;

            if (pbonus == 1) {
                tile.data.side = tile.data.side == 0 ? 1 : 0;
            }

            if (mbonus == 1 && pbonus == 0) {
                tile.data.bonus = 0;
                tile.data.side = old.data.side;
                tile.data.value = old.data.value;
                tile.data.piece = old.data.piece;
                tile.data.side = old.data.side == 0 ? 1 : 0;
            }

            if (opponent && pbonus == 0 && mbonus == 0) {
                if (oldval == curval) {
                    tile.value = curval * 2.0;
                } else if (oldval < curval) {
                    tile.value = oldval;
                } else {
                    tile.value = oldval;
                }
            }

            if (owner && pbonus == 0 && mbonus == 0) {
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

            if (pbonus == 0 && mbonus == 0) {
                _this.data.score += tile.value;
                _this.data.absorbed = true;
                _this.graphic.removeObject(old);
                _this.graphic.updateScore();
            }
        });
        this.field.ontileremove.push(function (tile) {
            //when tile removed
            _this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push(function (tile) {
            //when tile moved
            _this.graphic.showMoved(tile);
            var c = Math.max(Math.ceil(Math.sqrt(_this.field.data.width / 4 * (_this.field.data.height / 4)) * 2), 1);

            if (!_this.data.absorbed) {
                for (var i = 0; i < c; i++) {
                    if (Math.random() <= 0.25) _this.field.generateTile();
                }
            }
            _this.data.absorbed = false;

            while (!(_this.field.checkAny(2, 1, 0) && _this.field.checkAny(2, 1, 1) || _this.field.checkAny(4, 1, 0) && _this.field.checkAny(4, 1, 1)) || !_this.field.anyPossible()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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QWdCLEdBQWhCO0FBQ3pCO0FBQ0QsbUJBQU8sVUFBUDtBQUNIOzs7NEJBNU1VO0FBQ1AsbUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDSCxTOzBCQUVTLEMsRUFBRTtBQUNSLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLENBQWxCO0FBQ0g7Ozs0QkFpQ1E7QUFDTCxtQkFBTyxLQUFLLElBQUwsQ0FBVSxHQUFqQjtBQUNILFM7MEJBRU8sQyxFQUFFO0FBQ04saUJBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxDQUFkLElBQW1CLEVBQUUsQ0FBRixDQUFuQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDSDs7Ozs7O1FBaUtHLEksR0FBQSxJOzs7QUNoUlI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsQ0FBQyxZQUFVO0FBQ1AsUUFBSSxVQUFVLHNCQUFkO0FBQ0EsUUFBSSxXQUFXLDhCQUFmO0FBQ0EsUUFBSSxRQUFRLGtCQUFaOztBQUVBLGFBQVMsV0FBVCxDQUFxQixLQUFyQjtBQUNBLFlBQVEsUUFBUixDQUFpQixFQUFDLGtCQUFELEVBQVcsWUFBWCxFQUFqQjtBQUNBLFlBQVEsU0FBUixHQVBPLENBT2M7QUFDeEIsQ0FSRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3ID0gNCwgaCA9IDQpe1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IHcsIGhlaWdodDogaFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLnRpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8gPSB7XHJcbiAgICAgICAgICAgIHRpbGVJRDogLTEsXHJcbiAgICAgICAgICAgIHRpbGU6IG51bGwsXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIFxyXG4gICAgICAgICAgICBib251czogMCAvL0RlZmF1bHQgcGllY2UsIDEgYXJlIGludmVydGVyLCAyIGFyZSBtdWx0aS1zaWRlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9udGlsZXJlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWRkID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhYnNvcnB0aW9uID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB3aWR0aCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQW55KHZhbHVlLCBjb3VudCA9IDEsIHNpZGUgPSAtMSl7XHJcbiAgICAgICAgbGV0IGNvdW50ZWQgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKXtcclxuICAgICAgICAgICAgaWYodGlsZS52YWx1ZSA9PSB2YWx1ZSAmJiAoc2lkZSA8IDAgfHwgdGlsZS5kYXRhLnNpZGUgPT0gc2lkZSkgJiYgdGlsZS5kYXRhLmJvbnVzID09IDApIGNvdW50ZWQrKzsvL3JldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBpZihjb3VudGVkID49IGNvdW50KSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhbnlQb3NzaWJsZSgpe1xyXG4gICAgICAgIGxldCBhbnlwb3NzaWJsZSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLnRpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBhbnlwb3NzaWJsZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFueXBvc3NpYmxlID4gMCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbGVQb3NzaWJsZUxpc3QodGlsZSl7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBsaXN0OyAvL2VtcHR5XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wb3NzaWJsZSh0aWxlLCBbaiwgaV0pKSBsaXN0LnB1c2godGhpcy5nZXQoW2osIGldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHBvc3NpYmxlKHRpbGUsIGx0byl7XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCB0aWxlaSA9IHRoaXMuZ2V0KGx0byk7XHJcbiAgICAgICAgbGV0IGF0aWxlID0gdGlsZWkudGlsZTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aWxlLnBvc3NpYmxlKGx0byk7XHJcblxyXG4gICAgICAgIGlmICghYXRpbGUpIHJldHVybiBwaWVjZTtcclxuICAgICAgICBsZXQgcG9zc2libGVzID0gcGllY2U7XHJcblxyXG4gICAgICAgIGlmKHRpbGUuZGF0YS5ib251cyA9PSAwKXtcclxuICAgICAgICAgICAgbGV0IG9wcG9uZW50ID0gYXRpbGUuZGF0YS5zaWRlICE9IHRpbGUuZGF0YS5zaWRlO1xyXG4gICAgICAgICAgICBsZXQgb3duZXIgPSAhb3Bwb25lbnQ7IC8vQWxzbyBwb3NzaWJsZSBvd25lclxyXG4gICAgICAgICAgICBsZXQgYm90aCA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCBub2JvZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzYW1lID0gYXRpbGUudmFsdWUgPT0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGhpZ3RlclRoYW5PcCA9IHRpbGUudmFsdWUgKiAyID09IGF0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgbG93ZXJUaGFuT3AgPSBhdGlsZS52YWx1ZSAqIDIgPT0gdGlsZS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aXRoY29udmVydGVyID0gYXRpbGUuZGF0YS5ib251cyAhPSAwO1xyXG5cclxuICAgICAgICAgICAgLy9TZXR0aW5ncyB3aXRoIHBvc3NpYmxlIG9wcG9zaXRpb25zXHJcbiAgICAgICAgICAgIHBvc3NpYmxlcyA9IHBvc3NpYmxlcyAmJiBcclxuICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgc2FtZSAmJiBvcHBvbmVudCB8fCBcclxuICAgICAgICAgICAgICAgIGhpZ3RlclRoYW5PcCAmJiBub2JvZHkgfHwgXHJcbiAgICAgICAgICAgICAgICBsb3dlclRoYW5PcCAmJiBub2JvZHkgfHwgXHJcbiAgICAgICAgICAgICAgICB3aXRoY29udmVydGVyXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9zc2libGVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZXMgJiYgYXRpbGUuZGF0YS5ib251cyA9PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdFNhbWUoKXtcclxuICAgICAgICBsZXQgc2FtZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmIChzYW1lcy5pbmRleE9mKHRpbGUudmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgc2FtZXMucHVzaCh0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5QaWVjZShleGNlcHRQYXduKXtcclxuICAgICAgICBsZXQgcGF3bnIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGlmIChwYXduciA8IDAuNCAmJiAhZXhjZXB0UGF3bikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBybmQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGlmKHJuZCA+PSAwLjAgJiYgcm5kIDwgMC4zKXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjMgJiYgcm5kIDwgMC42KXtcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjYgJiYgcm5kIDwgMC44KXtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjggJiYgcm5kIDwgMC44NSl7XHJcbiAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVRpbGUoKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG5ldyBUaWxlKCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vQ291bnQgbm90IG9jY3VwaWVkXHJcbiAgICAgICAgbGV0IG5vdE9jY3VwaWVkID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXVtqXS50aWxlKSBub3RPY2N1cGllZC5wdXNoKHRoaXMuZmllbGRzW2ldW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKG5vdE9jY3VwaWVkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBpZihNYXRoLnJhbmRvbSgpIDwgMC4xKXtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gMDtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IDE7IC8vSW52ZXJ0ZXJcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IDI7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEucGllY2UgPSA1O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gTWF0aC5yYW5kb20oKSA8IDAuMiA/IDQgOiAyO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmJvbnVzID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYmNoZWNrID0gdGhpcy5jaGVja0FueSgyLCAxLCAxKSB8fCB0aGlzLmNoZWNrQW55KDQsIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHdjaGVjayA9IHRoaXMuY2hlY2tBbnkoMiwgMSwgMCkgfHwgdGhpcy5jaGVja0FueSg0LCAxLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmNoZWNrICYmIHdjaGVjayB8fCAhYmNoZWNrICYmICF3Y2hlY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBcclxuICAgICAgICAgICAgICAgIGlmICghYmNoZWNrKXtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICBpZiAoIXdjaGVjayl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aWxlLmF0dGFjaCh0aGlzLCBub3RPY2N1cGllZFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub3RPY2N1cGllZC5sZW5ndGgpXS5sb2MpOyAvL3ByZWZlciBnZW5lcmF0ZSBzaW5nbGVcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoMCwgdGhpcy50aWxlcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkc1tpXVtqXSA/IHRoaXMuZmllbGRzW2ldW2pdLnRpbGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYodGlsZSl7IC8vaWYgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8pOyAvL0xpbmsgd2l0aCBvYmplY3RcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJlZi5sb2MgPSBbaiwgaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkc1tpXVtqXSA9IHJlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldFRpbGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQobG9jKS50aWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQobG9jKXtcclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHV0KGxvYywgdGlsZSl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSB0aWxlLmlkO1xyXG4gICAgICAgICAgICByZWYudGlsZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIHRpbGUucmVwbGFjZUlmTmVlZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobG9jLCBsdG8pe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgaWYgKHJlZi50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHJlZi50aWxlO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMV0gPSB0aWxlLmRhdGEubG9jWzFdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1swXSA9IGx0b1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuZmllbGRzW2x0b1sxXV1bbHRvWzBdXTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGQudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhYnNvcnB0aW9uKSBmKG9sZC50aWxlLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhcihsdG8sIHRpbGUpLnB1dChsdG8sIHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyKGxvYywgYnl0aWxlID0gbnVsbCl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnNldExvYyhbLTEsIC0xXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSwgYnl0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaCh0aWxlLCBsb2M9WzAsIDBdKXtcclxuICAgICAgICBpZih0aWxlICYmIHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy50aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgICAgICB0aWxlLnNldEZpZWxkKHRoaXMpLnNldExvYyhsb2MpLnB1dCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWRkKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtGaWVsZH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGljb25zZXQgPSBbXHJcbiAgICBcImljb25zL1doaXRlUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVJvb2sucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS2luZy5wbmdcIlxyXG5dO1xyXG5cclxubGV0IGljb25zZXRCbGFjayA9IFtcclxuICAgIFwiaWNvbnMvQmxhY2tQYXduLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tuaWdodC5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tCaXNob3AucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUm9vay5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tRdWVlbi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLaW5nLnBuZ1wiXHJcbl07XHJcblxyXG5sZXQgYm9udXNlcyA9IFtcclxuICAgIFwiaWNvbnMvSW52ZXJzZS5wbmdcIlxyXG5dO1xyXG5cclxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XHJcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gICAgZWxwcm90by50b0Zyb250ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJlcGVuZFRvKHRoaXMucGFwZXIpO1xyXG4gICAgfTtcclxuICAgIGVscHJvdG8udG9CYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmNsYXNzIEdyYXBoaWNzRW5naW5lIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc3ZnbmFtZSA9IFwiI3N2Z1wiKXtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzID0gW107XHJcbiAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5zbmFwID0gU25hcChzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnN2Z2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdmduYW1lKTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY29yZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogNCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiAxMCwgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHRoaXMuc3ZnZWwuY2xpZW50V2lkdGgpLCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogcGFyc2VGbG9hdCh0aGlzLnN2Z2VsLmNsaWVudEhlaWdodClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGlsZToge1xyXG4gICAgICAgICAgICAgICAgLy93aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2h0OiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUuZGF0YS5ib251cyA9PSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMTkyLCAxOTIsIDE5MilcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMCwgMCwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlIDwgMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDMyLCAzMiwgMzIpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyICYmIHRpbGUudmFsdWUgPCA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAxOTIsIDEyOClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDQgJiYgdGlsZS52YWx1ZSA8IDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgOTYpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA4ICYmIHRpbGUudmFsdWUgPCAxNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgOTYsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTYgJiYgdGlsZS52YWx1ZSA8IDMyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAzMiAmJiB0aWxlLnZhbHVlIDwgNjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCAwKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNjQgJiYgdGlsZS52YWx1ZSA8IDEyODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMCwgMClcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMjggJiYgdGlsZS52YWx1ZSA8IDI1NjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCAwKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMjU2ICYmIHRpbGUudmFsdWUgPCA1MTI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDE5MiwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDUxMiAmJiB0aWxlLnZhbHVlIDwgMTAyNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMjI0LCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTAyNCAmJiB0aWxlLnZhbHVlIDwgMjA0ODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMjI0LCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMjA0ODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMjMwLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2VtaVZpc2libGUobG9jKXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBsb2M6IGxvY1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24obG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzJdLm9iamVjdDtcclxuICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCxcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QpO1xyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWApO1xyXG5cclxuICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuYXJlYSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LnJlbW92ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSh0aGlzLmdyYXBoaWNzVGlsZXMuaW5kZXhPZihvYmplY3QpLCAxKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZURlY29yYXRpb24oKXtcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggICsgYikgKiB3ICsgYjtcclxuICAgICAgICBsZXQgdGggPSAodGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgKyBiKSAqIGggKyBiO1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQud2lkdGggPSB0dztcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLmhlaWdodCA9IHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkZWNvcmF0aW9uTGF5ZXIgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdO1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJlY3QgPSBkZWNvcmF0aW9uTGF5ZXIub2JqZWN0LnJlY3QoMCwgMCwgdHcsIHRoLCAwLCAwKTtcclxuICAgICAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI0MCwgMjI0LCAxOTIpXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG5cclxuICAgICAgICAvL0RlY29yYXRpdmUgY2hlc3MgZmllbGRcclxuICAgICAgICB0aGlzLmNoZXNzZmllbGQgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNoZXNzZmllbGRbeV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24oW3gsIHldKTtcclxuICAgICAgICAgICAgICAgIGxldCBib3JkZXIgPSAwOy8vdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1swXS5vYmplY3Q7XHJcbiAgICAgICAgICAgICAgICBsZXQgZiA9IHMuZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IGYucmVjdChcclxuICAgICAgICAgICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCArIGJvcmRlciwgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgICAgICAgICBcImZpbGxcIjogeCAlIDIgIT0geSAlIDIgPyBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKVwiIDogXCJyZ2JhKDAsIDAsIDAsIDAuMSlcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdLWJvcmRlci8yfSwgJHtwb3NbMV0tYm9yZGVyLzJ9KWApO1xyXG4gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gZGVjb3JhdGlvbkxheWVyLm9iamVjdC5yZWN0KFxyXG4gICAgICAgICAgICAgICAgLXRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aC8yLCBcclxuICAgICAgICAgICAgICAgIC10aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgvMiwgXHJcbiAgICAgICAgICAgICAgICB0dyArIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCxcclxuICAgICAgICAgICAgICAgIHRoICsgdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoLCBcclxuICAgICAgICAgICAgICAgIDUsIFxyXG4gICAgICAgICAgICAgICAgNVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmVjdC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIixcclxuICAgICAgICAgICAgICAgIHN0cm9rZTogXCJyZ2IoMTI4LCA2NCwgMzIpXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGhcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXBvc2l0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVycy5zcGxpY2UoMCwgdGhpcy5ncmFwaGljc0xheWVycy5sZW5ndGgpO1xyXG4gICAgICAgIGxldCBzY2VuZSA9IHRoaXMuc25hcC5ncm91cCgpO1xyXG4gICAgICAgIHNjZW5lLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRofSwgJHt0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGh9KWApO1xyXG5cclxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1swXSA9IHsgLy9EZWNvcmF0aW9uXHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1sxXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzJdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbM10gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1s0XSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzVdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcy50aWxlLndpZHRoICA9ICh0aGlzLnBhcmFtcy5ncmlkLndpZHRoICAtIHRoaXMucGFyYW1zLmJvcmRlciAqICh3aWR0aCArIDEpICAtIHRoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aCoyKSAvIHdpZHRoO1xyXG4gICAgICAgIHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ID0gKHRoaXMucGFyYW1zLmdyaWQuaGVpZ2h0IC0gdGhpcy5wYXJhbXMuYm9yZGVyICogKGhlaWdodCArIDEpIC0gdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoKjIpIC8gaGVpZ2h0O1xyXG5cclxuXHJcbiAgICAgICAgZm9yKGxldCB5PTA7eTxoZWlnaHQ7eSsrKXtcclxuICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV1beF0gPSB0aGlzLmNyZWF0ZVNlbWlWaXNpYmxlKFt4LCB5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVjZWl2ZVRpbGVzKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVEZWNvcmF0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVHYW1lT3ZlcigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVmljdG9yeSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgY3JlYXRlR2FtZU92ZXIoKXtcclxuICAgICAgICBsZXQgc2NyZWVuID0gdGhpcy5ncmFwaGljc0xheWVyc1s0XS5vYmplY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICsgYikgKiB3ICsgYjtcclxuICAgICAgICBsZXQgdGggPSAodGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgKyBiKSAqIGggKyBiO1xyXG5cclxuICAgICAgICBsZXQgYmcgPSBzY3JlZW4ucmVjdCgwLCAwLCB0dywgdGgsIDUsIDUpO1xyXG4gICAgICAgIGJnLmF0dHIoe1xyXG4gICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDI1NSwgMjI0LCAyMjQsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBnb3QgPSBzY3JlZW4udGV4dCh0dyAvIDIsIHRoIC8gMiAtIDMwLCBcIkdhbWUgT3ZlclwiKTtcclxuICAgICAgICBnb3QuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMzBcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyICsgNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjI0LCAxOTIsIDE5MiwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0b3JlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjI0LCAxOTIsIDE5MiwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJVbmRvXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuID0gc2NyZWVuO1xyXG4gICAgICAgIHNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGNyZWF0ZVZpY3RvcnkoKXtcclxuICAgICAgICBsZXQgc2NyZWVuID0gdGhpcy5ncmFwaGljc0xheWVyc1s1XS5vYmplY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZpZWxkLmRhdGEud2lkdGg7XHJcbiAgICAgICAgbGV0IGggPSB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCB0dyA9ICh0aGlzLnBhcmFtcy50aWxlLndpZHRoICsgYikgKiB3ICsgYjtcclxuICAgICAgICBsZXQgdGggPSAodGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgKyBiKSAqIGggKyBiO1xyXG5cclxuICAgICAgICBsZXQgYmcgPSBzY3JlZW4ucmVjdCgwLCAwLCB0dywgdGgsIDUsIDUpO1xyXG4gICAgICAgIGJnLmF0dHIoe1xyXG4gICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDIyNCwgMjI0LCAyNTYsIDAuOClcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBnb3QgPSBzY3JlZW4udGV4dCh0dyAvIDIsIHRoIC8gMiAtIDMwLCBcIllvdSB3b24hIFlvdSBnb3QgXCIgKyB0aGlzLm1hbmFnZXIuZGF0YS5jb25kaXRpb25WYWx1ZSArIFwiIVwiKTtcclxuICAgICAgICBnb3QuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMzBcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7dHcgLyAyICsgNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIk5ldyBnYW1lXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiAtIDEwNX0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgICAgICBidXR0b24uYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZpbGxcIjogXCJyZ2JhKDEyOCwgMTI4LCAyNTUsIDAuOClcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25UZXh0ID0gYnV0dG9uR3JvdXAudGV4dCg1MCwgMjAsIFwiQ29udGludWUuLi5cIik7XHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1ZpY3RvcnkoKXtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDEwMDAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZVZpY3RvcnkoKXtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSwgNTAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0dhbWVvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJ9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIwXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdhbWVvdmVyc2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUdhbWVvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSwgNTAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE9iamVjdCh0aWxlKXtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuZ3JhcGhpY3NUaWxlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5ncmFwaGljc1RpbGVzW2ldLnRpbGUgPT0gdGlsZSkgcmV0dXJuIHRoaXMuZ3JhcGhpY3NUaWxlc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoYW5nZVN0eWxlT2JqZWN0KG9iaiwgbmVlZHVwID0gZmFsc2Upe1xyXG4gICAgICAgIGxldCB0aWxlID0gb2JqLnRpbGU7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gb2JqLmVsZW1lbnQ7XHJcbiAgICAgICAgLy9ncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgaWYgKG5lZWR1cCkgZ3JvdXAudG9Gcm9udCgpO1xyXG4gICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWBcclxuICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5wb3MgPSBwb3M7XHJcblxyXG4gICAgICAgIGxldCBzdHlsZSA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBfc3R5bGUgb2YgdGhpcy5wYXJhbXMudGlsZS5zdHlsZXMpIHtcclxuICAgICAgICAgICAgaWYoX3N0eWxlLmNvbmRpdGlvbi5jYWxsKG9iai50aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBfc3R5bGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRpbGUuZGF0YS5ib251cyA9PSAwKXtcclxuICAgICAgICAgICAgb2JqLnRleHQuYXR0cih7XCJ0ZXh0XCI6IGAke3RpbGUudmFsdWV9YH0pO1xyXG4gICAgICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogdGhpcy5wYXJhbXMudGlsZS53aWR0aCAqIDAuMTUsIC8vXCIxNnB4XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIiwgXHJcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiYmxhY2tcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvYmoudGV4dC5hdHRyKHtcInRleHRcIjogYEludmVyc2lvbmB9KTtcclxuICAgICAgICAgICAgb2JqLmljb24uYXR0cih7XCJ4bGluazpocmVmXCI6IGJvbnVzZXNbdGlsZS5kYXRhLmJvbnVzLTFdfSk7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogdGhpcy5wYXJhbXMudGlsZS53aWR0aCAqIDAuMTUsIC8vXCIxNnB4XCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIiwgXHJcbiAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiYmxhY2tcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFzdHlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgb2JqLnJlY3RhbmdsZS5hdHRyKHtcclxuICAgICAgICAgICAgZmlsbDogc3R5bGUuZmlsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzdHlsZS5mb250KSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIHN0eWxlLmZvbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTdHlsZSh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmopO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU9iamVjdCh0aWxlKXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0gdGhpcy5zZWxlY3RPYmplY3QodGlsZSk7XHJcbiAgICAgICAgaWYgKG9iamVjdCkgb2JqZWN0LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dNb3ZlZCh0aWxlKXtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSl7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLndpZHRoICArIGJvcmRlcikgKiB4LFxyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKSAqIHlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFZpc3VhbGl6ZXIobG9jKXtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICFsb2MgfHwgXHJcbiAgICAgICAgICAgICEobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5maWVsZC5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpXHJcbiAgICAgICAgKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXN1YWxpemF0aW9uW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgdGlsZTogdGlsZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgcG9zID0gdGhpcy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKHRpbGUubG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdLm9iamVjdDtcclxuICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCxcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZmlsbHNpemV3ID0gcGFyYW1zLnRpbGUud2lkdGggICogKDAuNSAtIDAuMik7XHJcbiAgICAgICAgbGV0IGZpbGxzaXplaCA9IGZpbGxzaXpldzsvL3BhcmFtcy50aWxlLmhlaWdodCAqICgxLjAgLSAwLjIpO1xyXG5cclxuICAgICAgICBsZXQgaWNvbiA9IHMuaW1hZ2UoXHJcbiAgICAgICAgICAgIFwiXCIsIFxyXG4gICAgICAgICAgICBmaWxsc2l6ZXcsIFxyXG4gICAgICAgICAgICBmaWxsc2l6ZWgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCAgLSBmaWxsc2l6ZXcgKiAyLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0IC0gZmlsbHNpemVoICogMlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCB0ZXh0ID0gcy50ZXh0KHBhcmFtcy50aWxlLndpZHRoIC8gMiwgcGFyYW1zLnRpbGUuaGVpZ2h0IC8gMiArIHBhcmFtcy50aWxlLmhlaWdodCAqIDAuMzUsIFwiVEVTVFwiKTtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QsIGljb24sIHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgke3BhcmFtcy50aWxlLndpZHRoLzJ9LCAke3BhcmFtcy50aWxlLndpZHRoLzJ9KSBcclxuICAgICAgICAgICAgc2NhbGUoMC4wMSwgMC4wMSkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgYCk7XHJcbiAgICAgICAgZ3JvdXAuYXR0cih7XCJvcGFjaXR5XCI6IFwiMFwifSk7XHJcblxyXG4gICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcclxuICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDEuMCwgMS4wKSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7LXBhcmFtcy50aWxlLndpZHRoLzJ9LCAkey1wYXJhbXMudGlsZS53aWR0aC8yfSlcclxuICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqZWN0LnBvcyA9IHBvcztcclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5pY29uID0gaWNvbjtcclxuICAgICAgICBvYmplY3QudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgb2JqZWN0LnJlbW92ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSh0aGlzLmdyYXBoaWNzVGlsZXMuaW5kZXhPZihvYmplY3QpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGdyb3VwLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXHJcbiAgICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHtvYmplY3QucG9zWzBdfSwgJHtvYmplY3QucG9zWzFdfSkgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgICAgICBzY2FsZSgwLjAxLCAwLjAxKSBcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuICAgICAgICAgICAgICAgIG9iamVjdC5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZU9iamVjdChvYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldEludGVyYWN0aW9uTGF5ZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaGljc0xheWVyc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNob3dlZCgpe1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgZm9yIChsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHg9MDt4PHdpZHRoO3grKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlzID0gdGhpcy5zZWxlY3RWaXN1YWxpemVyKFt4LCB5XSk7XHJcbiAgICAgICAgICAgICAgICB2aXMuYXJlYS5hdHRyKHtmaWxsOiBcInRyYW5zcGFyZW50XCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VsZWN0ZWQoKXtcclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuc2VsZWN0ZWQpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCB0aWxlID0gdGhpcy5pbnB1dC5zZWxlY3RlZC50aWxlO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlLmxvYyk7XHJcbiAgICAgICAgaWYgKG9iamVjdCl7XHJcbiAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMjU1LCAwLCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Bvc3NpYmxlKHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBmb3IobGV0IHRpbGVpbmZvIG9mIHRpbGVpbmZvbGlzdCl7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZWluZm8udGlsZTtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcih0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICBpZihvYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFyZWEuYXR0cih7XCJmaWxsXCI6IFwicmdiYSgwLCAyNTUsIDAsIDAuMilcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2VpdmVUaWxlcygpe1xyXG4gICAgICAgIHRoaXMuY2xlYXJUaWxlcygpO1xyXG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMubWFuYWdlci50aWxlcztcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyVGlsZXMoKXtcclxuICAgICAgICBmb3IgKGxldCB0aWxlIG9mIHRoaXMuZ3JhcGhpY3NUaWxlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aWxlKSB0aWxlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNjb3JlKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZWJvYXJkLmlubmVySFRNTCA9IHRoaXMubWFuYWdlci5kYXRhLnNjb3JlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWJzb3JwdGlvbi5wdXNoKChvbGQsIHRpbGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaElucHV0KGlucHV0KXsgLy9NYXkgcmVxdWlyZWQgZm9yIHNlbmQgb2JqZWN0cyBhbmQgbW91c2UgZXZlbnRzXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIGlucHV0LmF0dGFjaEdyYXBoaWNzKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCB7R3JhcGhpY3NFbmdpbmV9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5jbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW50ZXJhY3Rpb25NYXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBvcnQgPSB7XHJcbiAgICAgICAgICAgIG9ubW92ZTogW10sXHJcbiAgICAgICAgICAgIG9uc3RhcnQ6IFtdLFxyXG4gICAgICAgICAgICBvbnNlbGVjdDogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGlja2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdW5kb1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudW5kb2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0b3JlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dTZWxlY3RlZCh0aGlzLnNlbGVjdGVkLnRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5oaWRlVmljdG9yeSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcclxuICAgICAgICAgICAgaWYoIXRoaXMuY2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRoaXMuc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGhpcy5zZWxlY3RlZC50aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hHcmFwaGljcyhncmFwaGljKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBncmFwaGljO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGVJbnRlcmFjdGlvbk9iamVjdCh0aWxlaW5mbywgeCwgeSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRpbGVpbmZvOiB0aWxlaW5mbyxcclxuICAgICAgICAgICAgbG9jOiBbeCwgeV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuXHJcbiAgICAgICAgbGV0IHN2Z2VsZW1lbnQgPSBncmFwaGljLnN2Z2VsO1xyXG4gICAgICAgIHN2Z2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSBncmFwaGljLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24ob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMuZ3JhcGhpYy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCBhcmVhID0gaW50ZXJhY3RpdmUub2JqZWN0LnJlY3QocG9zWzBdIC0gYm9yZGVyLzIsIHBvc1sxXSAtIGJvcmRlci8yLCBwYXJhbXMudGlsZS53aWR0aCArIGJvcmRlciwgcGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKS5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiBzZWxlY3RlZC50aWxlICYmIHNlbGVjdGVkLnRpbGUubG9jWzBdICE9IC0xICYmIHNlbGVjdGVkICE9IHRoaXMuc2VsZWN0ZWQgJiYgIWZpZWxkLnBvc3NpYmxlKHRoaXMuc2VsZWN0ZWQudGlsZSwgb2JqZWN0LmxvYykgJiYgIShvYmplY3QubG9jWzBdID09IHRoaXMuc2VsZWN0ZWQubG9jWzBdICYmIG9iamVjdC5sb2NbMV0gPT0gdGhpcy5zZWxlY3RlZC5sb2NbMV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5wb3J0Lm9uc2VsZWN0KSBmKHRoaXMsIHRoaXMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbm1vdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLCBzZWxlY3RlZCwgZmllbGQuZ2V0KG9iamVjdC5sb2MpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gb2JqZWN0LmFyZWEgPSBhcmVhO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFyZWEuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkSW50ZXJhY3Rpb25NYXAoKXtcclxuICAgICAgICBsZXQgbWFwID0ge1xyXG4gICAgICAgICAgICB0aWxlbWFwOiBbXSwgXHJcbiAgICAgICAgICAgIGdyaWRtYXA6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZ3JhcGhpYyA9IHRoaXMuZ3JhcGhpYztcclxuICAgICAgICBsZXQgcGFyYW1zID0gZ3JhcGhpYy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IGludGVyYWN0aXZlID0gZ3JhcGhpYy5nZXRJbnRlcmFjdGlvbkxheWVyKCk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGZpZWxkLmRhdGEuaGVpZ2h0O2krKyl7XHJcbiAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8ZmllbGQuZGF0YS53aWR0aDtqKyspe1xyXG4gICAgICAgICAgICAgICAgbWFwLnRpbGVtYXBbaV1bal0gPSB0aGlzLmNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KGZpZWxkLmdldChbaiwgaV0pLCBqLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0lucHV0fTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkXCI7XHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XHJcblxyXG5jbGFzcyBNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbmV3IEZpZWxkKDQsIDQpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmljdG9yeTogZmFsc2UsIFxyXG4gICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgbW92ZWNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFic29yYmVkOiAwLCBcclxuICAgICAgICAgICAgY29uZGl0aW9uVmFsdWU6IDIwNDhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3RhdGVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMub25zdGFydGV2ZW50ID0gKGNvbnRyb2xsZXIsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVzdGFydCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdGV2ZW50ID0gKGNvbnRyb2xsZXIsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3QodGlsZWluZm8udGlsZSkpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHRpbGVpbmZvLnRpbGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbm1vdmVldmVudCA9IChjb250cm9sbGVyLCBzZWxlY3RlZCwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmllbGQucG9zc2libGUoc2VsZWN0ZWQudGlsZSwgdGlsZWluZm8ubG9jKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQubW92ZShzZWxlY3RlZC5sb2MsIHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdChzZWxlY3RlZC50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQoc2VsZWN0ZWQudGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICBsZXQgb2xkdmFsID0gb2xkLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgY3VydmFsID0gdGlsZS52YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBwYm9udXMgPSBvbGQuZGF0YS5ib251cztcclxuICAgICAgICAgICAgbGV0IG1ib251cyA9IHRpbGUuZGF0YS5ib251cztcclxuICAgICAgICAgICAgbGV0IG9wcG9uZW50ID0gdGlsZS5kYXRhLnNpZGUgIT0gb2xkLmRhdGEuc2lkZTtcclxuICAgICAgICAgICAgbGV0IG93bmVyID0gIW9wcG9uZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKHBib251cyA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IHRpbGUuZGF0YS5zaWRlID09IDAgPyAxIDogMDtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGlmIChtYm9udXMgPT0gMSAmJiBwYm9udXMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmJvbnVzID0gMDtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gb2xkLmRhdGEuc2lkZTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS52YWx1ZSA9IG9sZC5kYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gb2xkLmRhdGEucGllY2U7XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IG9sZC5kYXRhLnNpZGUgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgaWYgKG9wcG9uZW50ICYmIHBib251cyA9PSAwICYmIG1ib251cyA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkdmFsID09IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBjdXJ2YWwgKiAyLjA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkdmFsIDwgY3VydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS52YWx1ZSA9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS52YWx1ZSA9IG9sZHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lciAmJiBwYm9udXMgPT0gMCAmJiBtYm9udXMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0aWxlLmRhdGEuc2lkZSA9PSAwID8gMSA6IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA9PSBjdXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aWxlLnZhbHVlID0gY3VydmFsICogMi4wO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZHZhbCA8IGN1cnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBvbGR2YWw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgPSBvbGR2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPD0gMSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocGJvbnVzID09IDAgJiYgbWJvbnVzID09IDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNjb3JlICs9IHRpbGUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdChvbGQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZXJlbW92ZS5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSByZW1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5zaG93TW92ZWQodGlsZSk7XHJcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5tYXgoTWF0aC5jZWlsKE1hdGguc3FydCgodGhpcy5maWVsZC5kYXRhLndpZHRoIC8gNCkgKiAodGhpcy5maWVsZC5kYXRhLmhlaWdodCAvIDQpKSAqIDIpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGF0YS5hYnNvcmJlZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxjO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoTWF0aC5yYW5kb20oKSA8PSAwLjI1KSB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUoIShcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuY2hlY2tBbnkoMiwgMSwgMCkgJiYgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuY2hlY2tBbnkoMiwgMSwgMSkgfHwgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuY2hlY2tBbnkoNCwgMSwgMCkgJiYgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLmNoZWNrQW55KDQsIDEsIDEpXHJcbiAgICAgICAgICAgICkgfHwgXHJcbiAgICAgICAgICAgICAgICAhdGhpcy5maWVsZC5hbnlQb3NzaWJsZSgpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYoIHRoaXMuY2hlY2tDb25kaXRpb24oKSAmJiAhdGhpcy5kYXRhLnZpY3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGlsZXMoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC50aWxlcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2F2ZVN0YXRlKCl7XHJcbiAgICAgICAgbGV0IHN0YXRlID0ge1xyXG4gICAgICAgICAgICB0aWxlczogW10sXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmZpZWxkLndpZHRoLCBcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmZpZWxkLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc3RhdGUuc2NvcmUgPSB0aGlzLmRhdGEuc2NvcmU7XHJcbiAgICAgICAgc3RhdGUudmljdG9yeSA9IHRoaXMuZGF0YS52aWN0b3J5O1xyXG4gICAgICAgIGZvcihsZXQgdGlsZSBvZiB0aGlzLmZpZWxkLnRpbGVzKXtcclxuICAgICAgICAgICAgc3RhdGUudGlsZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBsb2M6IHRpbGUuZGF0YS5sb2MuY29uY2F0KFtdKSwgXHJcbiAgICAgICAgICAgICAgICBwaWVjZTogdGlsZS5kYXRhLnBpZWNlLCBcclxuICAgICAgICAgICAgICAgIHNpZGU6IHRpbGUuZGF0YS5zaWRlLCBcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aWxlLmRhdGEudmFsdWUsXHJcbiAgICAgICAgICAgICAgICBwcmV2OiB0aWxlLmRhdGEucHJldiwgXHJcbiAgICAgICAgICAgICAgICBib251czogdGlsZS5kYXRhLmJvbnVzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZVN0YXRlKHN0YXRlKXtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZXNbdGhpcy5zdGF0ZXMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IHN0YXRlLnNjb3JlO1xyXG4gICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gc3RhdGUudmljdG9yeTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB0ZGF0IG9mIHN0YXRlLnRpbGVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGRhdC5waWVjZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gdGRhdC52YWx1ZTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSB0ZGF0LnNpZGU7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5sb2MgPSB0ZGF0LmxvYztcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnByZXYgPSB0ZGF0LnByZXY7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5ib251cyA9IHRkYXQuYm9udXM7XHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMuZmllbGQsIHRkYXQubG9jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVWaWN0b3J5KCl7XHJcbiAgICAgICAgaWYoIXRoaXMuZGF0YS52aWN0b3J5KXtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMuc2hvd1ZpY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb25kaXRpb24oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5jaGVja0FueSh0aGlzLmRhdGEuY29uZGl0aW9uVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KXtcclxuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc3RhcnQucHVzaCh0aGlzLm9uc3RhcnRldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9uc2VsZWN0LnB1c2godGhpcy5vbnNlbGVjdGV2ZW50KTtcclxuICAgICAgICB0aGlzLmlucHV0LnBvcnQub25tb3ZlLnB1c2godGhpcy5vbm1vdmVldmVudCk7XHJcbiAgICAgICAgaW5wdXQuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpY3M7XHJcbiAgICAgICAgZ3JhcGhpY3MuYXR0YWNoTWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljLmNyZWF0ZUNvbXBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5idWlsZEludGVyYWN0aW9uTWFwKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZpY3RvcnkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmZpZWxkLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZXMuc3BsaWNlKDAsIHRoaXMuc3RhdGVzLmxlbmd0aCk7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQuYW55UG9zc2libGUoKSkgdGhpcy5nYW1lc3RhcnQoKTsgLy9QcmV2ZW50IGdhbWVvdmVyXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdhbWVwYXVzZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lb3ZlcihyZWFzb24pe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGluayhkaWZmKXsgLy8/Pz9cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtNYW5hZ2VyfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5sZXQga21vdmVtYXAgPSBbXHJcbiAgICBbLTIsIC0xXSxcclxuICAgIFsgMiwgLTFdLFxyXG4gICAgWy0yLCAgMV0sXHJcbiAgICBbIDIsICAxXSxcclxuICAgIFxyXG4gICAgWy0xLCAtMl0sXHJcbiAgICBbIDEsIC0yXSxcclxuICAgIFstMSwgIDJdLFxyXG4gICAgWyAxLCAgMl1cclxuXTtcclxuXHJcbmxldCByZGlycyA9IFtcclxuICAgIFsgMCwgIDFdLCAvL2Rvd25cclxuICAgIFsgMCwgLTFdLCAvL3VwXHJcbiAgICBbIDEsICAwXSwgLy9sZWZ0XHJcbiAgICBbLTEsICAwXSAgLy9yaWdodFxyXG5dO1xyXG5cclxubGV0IGJkaXJzID0gW1xyXG4gICAgWyAxLCAgMV0sXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgIDFdLFxyXG4gICAgWy0xLCAtMV1cclxuXTtcclxuXHJcbmxldCBwYWRpcnMgPSBbXHJcbiAgICBbIDEsIC0xXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzID0gW1xyXG4gICAgWyAwLCAtMV1cclxuXTtcclxuXHJcblxyXG5sZXQgcGFkaXJzTmVnID0gW1xyXG4gICAgWyAxLCAxXSxcclxuICAgIFstMSwgMV1cclxuXTtcclxuXHJcbmxldCBwbWRpcnNOZWcgPSBbXHJcbiAgICBbIDAsIDFdXHJcbl07XHJcblxyXG5cclxubGV0IHFkaXJzID0gcmRpcnMuY29uY2F0KGJkaXJzKTsgLy9tYXkgbm90IG5lZWRcclxuXHJcbmxldCB0Y291bnRlciA9IDA7XHJcblxyXG5jbGFzcyBUaWxlIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogMiwgXHJcbiAgICAgICAgICAgIHBpZWNlOiAwLCBcclxuICAgICAgICAgICAgbG9jOiBbLTEsIC0xXSwgLy94LCB5XHJcbiAgICAgICAgICAgIHByZXY6IFstMSwgLTFdLCBcclxuICAgICAgICAgICAgc2lkZTogMCAvL1doaXRlID0gMCwgQmxhY2sgPSAxXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmlkID0gdGNvdW50ZXIrKztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmFsdWUodil7XHJcbiAgICAgICAgdGhpcy5kYXRhLnZhbHVlID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG9jKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sb2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxvYyh2KXtcclxuICAgICAgICB0aGlzLmRhdGEubG9jID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2goZmllbGQsIHgsIHkpe1xyXG4gICAgICAgIGZpZWxkLmF0dGFjaCh0aGlzLCB4LCB5KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KHJlbGF0aXZlID0gWzAsIDBdKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgcmV0dXJuIHRoaXMuZmllbGQuZ2V0KFtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1swXSArIHJlbGF0aXZlWzBdLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEubG9jWzFdICsgcmVsYXRpdmVbMV1cclxuICAgICAgICBdKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZShsdG8pe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLm1vdmUodGhpcy5kYXRhLmxvYywgbHRvKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHV0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHRoaXMuZmllbGQucHV0KHRoaXMuZGF0YS5sb2MsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgbG9jKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sb2M7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBsb2MoYSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IGFbMF07XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IGFbMV07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNhY2hlTG9jKCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnByZXZbMF0gPSB0aGlzLmRhdGEubG9jWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzFdID0gdGhpcy5kYXRhLmxvY1sxXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0RmllbGQoZmllbGQpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0TG9jKFt4LCB5XSl7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1swXSA9IHg7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlcGxhY2VJZk5lZWRzKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sb2NbMV0gPj0gdGhpcy5maWVsZC5kYXRhLmhlaWdodC0xICYmIHRoaXMuZGF0YS5zaWRlID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5waWVjZSA9IHRoaXMuZmllbGQuZ2VuUGllY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sb2NbMV0gPD0gMCAmJiB0aGlzLmRhdGEuc2lkZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3NpYmxlKGxvYyl7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAwKSB7IC8vUEFXTlxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0UGF3bkF0dGFja1RpbGVzKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxpc3QgPSB0aGlzLmdldFBhd25Nb3ZlVGlsZXMoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAxKSB7IC8vS25pZ2h0XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRLbmlnaHRQb3NzaWJsZVRpbGVzKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMikgeyAvL0Jpc2hvcFxyXG4gICAgICAgICAgICBmb3IgKGxldCBkIG9mIGJkaXJzKXtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzBdIC0gdGhpcy5sb2NbMF0pICE9IGRbMF0gfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1sxXSAtIHRoaXMubG9jWzFdKSAhPSBkWzFdXHJcbiAgICAgICAgICAgICAgICApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSAzKSB7IC8vUm9va1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkIG9mIHJkaXJzKXtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzBdIC0gdGhpcy5sb2NbMF0pICE9IGRbMF0gfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1sxXSAtIHRoaXMubG9jWzFdKSAhPSBkWzFdXHJcbiAgICAgICAgICAgICAgICApIGNvbnRpbnVlOyAvL05vdCBwb3NzaWJsZSBkaXJlY3Rpb25cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0RGlyZWN0aW9uVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QucmV2ZXJzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNCkgeyAvL1F1ZWVuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGQgb2YgcWRpcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMF0gLSB0aGlzLmxvY1swXSkgIT0gZFswXSB8fCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzFdIC0gdGhpcy5sb2NbMV0pICE9IGRbMV1cclxuICAgICAgICAgICAgICAgICkgY29udGludWU7IC8vTm90IHBvc3NpYmxlIGRpcmVjdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXREaXJlY3Rpb25UaWxlcyhkKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5waWVjZSA9PSA1KSB7IC8vS2luZ1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkIG9mIHFkaXJzKXtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzBdIC0gdGhpcy5sb2NbMF0pICE9IGRbMF0gfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1sxXSAtIHRoaXMubG9jWzFdKSAhPSBkWzFdXHJcbiAgICAgICAgICAgICAgICApIGNvbnRpbnVlOyAvL05vdCBwb3NzaWJsZSBkaXJlY3Rpb25cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TmVpZ2h0Ym9yVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihtLmxvY1swXSA9PSBsb2NbMF0gJiYgbS5sb2NbMV0gPT0gbG9jWzFdKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgZ2V0S25pZ2h0UG9zc2libGVUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrbW92ZW1hcC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IGxvYyA9IGttb3ZlbWFwW2ldO1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQobG9jKTtcclxuICAgICAgICAgICAgaWYgKHRpZikgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXROZWlnaHRib3JUaWxlcyhkaXIpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IG1heHQgPSBNYXRoLm1heCh0aGlzLmZpZWxkLmRhdGEud2lkdGgsIHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpO1xyXG4gICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChbZGlyWzBdLCBkaXJbMV1dKTtcclxuICAgICAgICBpZiAodGlmKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXJlY3Rpb25UaWxlcyhkaXIpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IG1heHQgPSBNYXRoLm1heCh0aGlzLmZpZWxkLmRhdGEud2lkdGgsIHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8bWF4dDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoW2RpclswXSAqIGksIGRpclsxXSAqIGldKTtcclxuICAgICAgICAgICAgaWYgKHRpZikgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgICAgIGlmICh0aWYudGlsZSB8fCAhdGlmKSBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBhd25BdHRhY2tUaWxlcygpe1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IGRpcnMgPSB0aGlzLmRhdGEuc2lkZSA9PSAwID8gcGFkaXJzIDogcGFkaXJzTmVnO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGRpcnNbaV0pO1xyXG4gICAgICAgICAgICBpZiAodGlmICYmIHRpZi50aWxlKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBhd25Nb3ZlVGlsZXMoKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBkaXJzID0gdGhpcy5kYXRhLnNpZGUgPT0gMCA/IHBtZGlycyA6IHBtZGlyc05lZztcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGRpcnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChkaXJzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHRpZiAmJiAhdGlmLnRpbGUpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtUaWxlfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCB7IEdyYXBoaWNzRW5naW5lIH0gZnJvbSBcIi4vaW5jbHVkZS9ncmFwaGljc1wiO1xyXG5pbXBvcnQgeyBNYW5hZ2VyIH0gZnJvbSBcIi4vaW5jbHVkZS9tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vaW5jbHVkZS9pbnB1dFwiO1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7XHJcbiAgICBsZXQgZ3JhcGhpY3MgPSBuZXcgR3JhcGhpY3NFbmdpbmUoKTtcclxuICAgIGxldCBpbnB1dCA9IG5ldyBJbnB1dCgpO1xyXG5cclxuICAgIGdyYXBoaWNzLmF0dGFjaElucHV0KGlucHV0KTtcclxuICAgIG1hbmFnZXIuaW5pdFVzZXIoe2dyYXBoaWNzLCBpbnB1dH0pO1xyXG4gICAgbWFuYWdlci5nYW1lc3RhcnQoKTsgLy9kZWJ1Z1xyXG59KSgpOyJdfQ==
