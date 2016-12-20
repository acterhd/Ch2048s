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
            this.fields.splice(0, this.fields.length);
            for (var i = 0; i < this.data.height; i++) {
                if (!this.fields[i]) this.fields[i] = [];
                for (var j = 0; j < this.data.width; j++) {
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
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = this.ontileabsorption[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var f = _step3.value;
                                f(old.tile, tile);
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

                    this.clear(lto, tile).put(lto, tile);
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.ontilemove[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _f = _step4.value;
                            _f(tile);
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
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = this.ontileremove[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var f = _step5.value;
                                    f(tile, bytile);
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
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.ontileadd[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var f = _step6.value;
                        f(tile);
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
            var _this2 = this;

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
                _this2.graphicsTiles.splice(_this2.graphicsTiles.indexOf(object), 1);
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
            var tiles = this.manager.tiles;
            this.graphicsTiles.splice(0, this.graphicsTiles.length);
            for (var i = 0; i < tiles.length; i++) {
                this.graphicsTiles.push(this.createObject(tiles[i]));
            }
            return this;
        }
    }, {
        key: "clearTileset",
        value: function clearTileset() {
            this.graphicsTiles.splice(0, this.graphicsTiles.length);
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
            var _this3 = this;

            this.field = manager.field;
            this.manager = manager;

            this.field.ontileremove.push(function (tile) {
                //when tile removed
                _this3.removeObject(tile);
            });
            this.field.ontilemove.push(function (tile) {
                //when tile moved
                _this3.changeStyle(tile);
            });
            this.field.ontileadd.push(function (tile) {
                //when tile added
                _this3.pushTile(tile);
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
            var _this = this;

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
                if (!_this.selected) {
                    var selected = field.get(object.loc);
                    if (selected) {
                        _this.selected = selected;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _this.port.onselect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var f = _step.value;
                                f(_this, selected);
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
                    if (_selected && _selected.tile && _selected.tile.loc[0] != -1 && _selected != _this.selected && !field.possible(_this.selected.tile, object.loc) && !(object.loc[0] == _this.selected.loc[0] && object.loc[1] == _this.selected.loc[1])) {
                        _this.selected = _selected;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _this.port.onselect[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _f = _step2.value;
                                _f(_this, _this.selected);
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
                        var _selected2 = _this.selected;
                        _this.selected = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this.port.onmove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _f2 = _step3.value;

                                _f2(_this, _selected2, field.get(object.loc));
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
            controller.graphic.showPossible(_this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
        };

        this.field.ontileabsorption.push(function (old, tile) {
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
        key: "gamestart",
        value: function gamestart() {
            this.data.score = 0;
            this.data.movecounter = 0;
            this.data.absorbed = 0;
            this.field.generateTile();
            this.field.generateTile();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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QUFsQixHQUFzQixNQUF0QixHQUErQixTQUExQztBQUNBLGlCQUFJLElBQUksSUFBRSxDQUFWLEVBQVksSUFBRSxLQUFLLE1BQW5CLEVBQTBCLEdBQTFCLEVBQThCO0FBQzFCLG9CQUFJLE1BQU0sS0FBSyxHQUFMLENBQVMsS0FBSyxDQUFMLENBQVQsQ0FBVjtBQUNBLG9CQUFJLE9BQU8sQ0FBQyxJQUFJLElBQWhCLEVBQXNCLFdBQVcsSUFBWCxDQUFnQixHQUFoQjtBQUN6QjtBQUNELG1CQUFPLFVBQVA7QUFDSDs7OzRCQTVNVTtBQUNQLG1CQUFPLEtBQUssSUFBTCxDQUFVLEtBQWpCO0FBQ0gsUzswQkFFUyxDLEVBQUU7QUFDUixpQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUFsQjtBQUNIOzs7NEJBaUNRO0FBQ0wsbUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBakI7QUFDSCxTOzBCQUVPLEMsRUFBRTtBQUNOLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0g7Ozs7OztRQWlLRyxJLEdBQUEsSTs7O0FDaFJSOztBQUNBOztBQUNBOztBQUNBOztBQUVBLENBQUMsWUFBVTtBQUNQLFFBQUksVUFBVSxzQkFBZDtBQUNBLFFBQUksV0FBVyw4QkFBZjtBQUNBLFFBQUksUUFBUSxrQkFBWjs7QUFFQSxhQUFTLFdBQVQsQ0FBcUIsS0FBckI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsRUFBQyxrQkFBRCxFQUFXLFlBQVgsRUFBakI7QUFDQSxZQUFRLFNBQVIsR0FQTyxDQU9jO0FBQ3hCLENBUkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IodyA9IDQsIGggPSA0KXtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3LCBoZWlnaHQ6IGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy50aWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvID0ge1xyXG4gICAgICAgICAgICB0aWxlSUQ6IC0xLFxyXG4gICAgICAgICAgICB0aWxlOiBudWxsLFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9udGlsZXJlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWRkID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhYnNvcnB0aW9uID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgYW55UG9zc2libGUoKXtcclxuICAgICAgICBsZXQgYW55cG9zc2libGUgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUodGlsZSwgW2osIGldKSkgYW55cG9zc2libGUrKztcclxuICAgICAgICAgICAgICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhbnlwb3NzaWJsZSA+IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aWxlUG9zc2libGVMaXN0KHRpbGUpe1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgaWYgKCF0aWxlKSByZXR1cm4gbGlzdDsgLy9lbXB0eVxyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucG9zc2libGUodGlsZSwgW2osIGldKSkgbGlzdC5wdXNoKHRoaXMuZ2V0KFtqLCBpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwb3NzaWJsZSh0aWxlLCBsdG8pe1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdGlsZWkgPSB0aGlzLmdldChsdG8pO1xyXG4gICAgICAgIGxldCBhdGlsZSA9IHRpbGVpLnRpbGU7XHJcblxyXG4gICAgICAgIGxldCBwb3NzaWJsZXMgPSAhYXRpbGUgfHwgYXRpbGUudmFsdWUgPT0gdGlsZS52YWx1ZTtcclxuICAgICAgICBsZXQgb3Bwb25lbnQgPSAhYXRpbGUgfHwgYXRpbGUuZGF0YS5zaWRlICE9IHRpbGUuZGF0YS5zaWRlO1xyXG4gICAgICAgIGxldCBwaWVjZSA9IHRpbGUucG9zc2libGUobHRvKTtcclxuICAgICAgICBwb3NzaWJsZXMgPSBwb3NzaWJsZXMgJiYgcGllY2U7XHJcbiAgICAgICAgLy9wb3NzaWJsZXMgPSBwb3NzaWJsZXMgJiYgb3Bwb25lbnQ7IC8vSGFyZGNvcmUgbW9kZVxyXG5cclxuICAgICAgICByZXR1cm4gcG9zc2libGVzO1xyXG4gICAgfVxyXG5cclxuICAgIG5vdFNhbWUoKXtcclxuICAgICAgICBsZXQgc2FtZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmIChzYW1lcy5pbmRleE9mKHRpbGUudmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgc2FtZXMucHVzaCh0aWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5QaWVjZShleGNlcHRQYXduKXtcclxuICAgICAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZihybmQgPj0gMC4wICYmIHJuZCA8IDAuMil7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC4yICYmIHJuZCA8IDAuNCl7XHJcbiAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC40ICYmIHJuZCA8IDAuNil7XHJcbiAgICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC42ICYmIHJuZCA8IDAuNyl7XHJcbiAgICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgIH0gZWxzZSBcclxuICAgICAgICBpZihybmQgPj0gMC43ICYmIHJuZCA8IDAuOCl7XHJcbiAgICAgICAgICAgIHJldHVybiA1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoZXhjZXB0UGF3bikge1xyXG4gICAgICAgICAgICByZXR1cm4gNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVUaWxlKCl7XHJcbiAgICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL0NvdW50IG5vdCBvY2N1cGllZFxyXG4gICAgICAgIGxldCBub3RPY2N1cGllZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHRoaXMuZGF0YS5oZWlnaHQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDtqPHRoaXMuZGF0YS53aWR0aDtqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5maWVsZHNbaV1bal0udGlsZSkgbm90T2NjdXBpZWQucHVzaCh0aGlzLmZpZWxkc1tpXVtqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZihub3RPY2N1cGllZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnBpZWNlID0gdGhpcy5nZW5QaWVjZSgpO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEudmFsdWUgPSBNYXRoLnJhbmRvbSgpIDwgMC4yNSA/IDQgOiAyO1xyXG4gICAgICAgICAgICB0aWxlLmRhdGEuc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgIHRpbGUuYXR0YWNoKHRoaXMsIG5vdE9jY3VwaWVkW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdE9jY3VwaWVkLmxlbmd0aCldLmxvYyk7IC8vcHJlZmVyIGdlbmVyYXRlIHNpbmdsZVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvL05vdCBwb3NzaWJsZSB0byBnZW5lcmF0ZSBuZXcgdGlsZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLnRpbGVzLnNwbGljZSgwLCB0aGlzLnRpbGVzLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlZiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvKTsgLy9MaW5rIHdpdGggb2JqZWN0XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZUlEID0gLTE7XHJcbiAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZWYubG9jID0gW2osIGldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHNbaV1bal0gPSByZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBnZXRUaWxlKGxvYyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGxvYykudGlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0KGxvYyl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07IC8vcmV0dXJuIHJlZmVyZW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8sIHtcclxuICAgICAgICAgICAgbG9jOiBbbG9jWzBdLCBsb2NbMV1dXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dChsb2MsIHRpbGUpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICByZWYudGlsZUlEID0gdGlsZS5pZDtcclxuICAgICAgICAgICAgcmVmLnRpbGUgPSB0aWxlO1xyXG4gICAgICAgICAgICB0aWxlLnJlcGxhY2VJZk5lZWRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlKGxvYywgbHRvKXtcclxuICAgICAgICBpZiAobG9jWzBdID09IGx0b1swXSAmJiBsb2NbMV0gPT0gbHRvWzFdKSByZXR1cm4gdGhpczsgLy9TYW1lIGxvY2F0aW9uXHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzBdID0gdGlsZS5kYXRhLmxvY1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5wcmV2WzFdID0gdGlsZS5kYXRhLmxvY1sxXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMF0gPSBsdG9bMF07XHJcbiAgICAgICAgICAgICAgICB0aWxlLmRhdGEubG9jWzFdID0gbHRvWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBvbGQgPSB0aGlzLmZpZWxkc1tsdG9bMV1dW2x0b1swXV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWJzb3JwdGlvbikgZihvbGQudGlsZSwgdGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIobHRvLCB0aWxlKS5wdXQobHRvLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVtb3ZlKSBmKHRpbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhcihsb2MsIGJ5dGlsZSA9IG51bGwpe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPj0gMCAmJiBsb2NbMV0gPj0gMCAmJiBsb2NbMF0gPCB0aGlzLmRhdGEud2lkdGggJiYgbG9jWzFdIDwgdGhpcy5kYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgcmVmID0gdGhpcy5maWVsZHNbbG9jWzFdXVtsb2NbMF1dO1xyXG4gICAgICAgICAgICBpZiAocmVmLnRpbGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aWxlID0gcmVmLnRpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZWYudGlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zZXRMb2MoWy0xLCAtMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlcmVtb3ZlKSBmKHRpbGUsIGJ5dGlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2godGlsZSwgbG9jPVswLCAwXSl7XHJcbiAgICAgICAgaWYodGlsZSAmJiB0aGlzLnRpbGVzLmluZGV4T2YodGlsZSkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh0aWxlKTtcclxuICAgICAgICAgICAgdGlsZS5zZXRGaWVsZCh0aGlzKS5zZXRMb2MobG9jKS5wdXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZWFkZCkgZih0aWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RmllbGR9O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmxldCBpY29uc2V0ID0gW1xyXG4gICAgXCJpY29ucy9XaGl0ZVBhd24ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS25pZ2h0LnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUJpc2hvcC5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVSb29rLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVF1ZWVuLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZUtpbmcucG5nXCJcclxuXTtcclxuXHJcbmxldCBpY29uc2V0QmxhY2sgPSBbXHJcbiAgICBcImljb25zL0JsYWNrUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja1Jvb2sucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrS2luZy5wbmdcIlxyXG5dO1xyXG5cclxuY2xhc3MgR3JhcGhpY3NFbmdpbmUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzdmduYW1lID0gXCIjc3ZnXCIpe1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb24gPSBbXTtcclxuICAgICAgICB0aGlzLnNuYXAgPSBTbmFwKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxMCxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYwMCwgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDYwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aWxlOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMTI4LCBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMTI4LCBcclxuICAgICAgICAgICAgICAgIHN0eWxlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDIgJiYgdGlsZS52YWx1ZSA8IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDE5MiwgMTI4KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNCAmJiB0aWxlLnZhbHVlIDwgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCA5NilcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDggJiYgdGlsZS52YWx1ZSA8IDE2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA5NiwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxNiAmJiB0aWxlLnZhbHVlIDwgMzI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCA2NClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDMyICYmIHRpbGUudmFsdWUgPCA2NDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgNjQsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA2NCAmJiB0aWxlLnZhbHVlIDwgMTI4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAwLCAwKVwiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDEyOCAmJiB0aWxlLnZhbHVlIDwgMjU2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAxMjgsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyNTYgJiYgdGlsZS52YWx1ZSA8IDUxMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTkyLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNTEyICYmIHRpbGUudmFsdWUgPCAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMDI0ICYmIHRpbGUudmFsdWUgPCAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMjQsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyMDQ4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAyMzAsIDApXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZW1pVmlzaWJsZShsb2Mpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxvYzogbG9jXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihsb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBncm91cCA9IHMuZ3JvdXAocmVjdCk7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBvYmplY3QuZWxlbWVudCA9IGdyb3VwO1xyXG4gICAgICAgIG9iamVjdC5yZWN0YW5nbGUgPSByZWN0O1xyXG4gICAgICAgIG9iamVjdC5hcmVhID0gcmVjdDtcclxuICAgICAgICBvYmplY3QucmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMuc3BsaWNlKHRoaXMuZ3JhcGhpY3NUaWxlcy5pbmRleE9mKG9iamVjdCksIDEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlRGVjb3JhdGlvbigpe1xyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuICAgICAgICB0aGlzLnBhcmFtcy5ncmlkLndpZHRoID0gdHc7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgPSB0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGVjb3JhdGlvbkxheWVyID0gdGhpcy5ncmFwaGljc0xheWVyc1swXTtcclxuICAgICAgICBsZXQgcmVjdCA9IGRlY29yYXRpb25MYXllci5vYmplY3QucmVjdCgwLCAwLCB0dywgdGgsIDUsIDUpO1xyXG4gICAgICAgIHJlY3QuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMjI0LCAxOTIpXCIsIFxyXG4gICAgICAgICAgICBzdHJva2U6IFwicmdiKDEyOCwgNjQsIDMyKVwiLFxyXG4gICAgICAgICAgICBcInN0cm9rZS13aWR0aFwiOiBcIjhcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXBvc2l0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVycy5zcGxpY2UoMCwgdGhpcy5ncmFwaGljc0xheWVycy5sZW5ndGgpO1xyXG4gICAgICAgIGxldCBzY2VuZSA9IHRoaXMuc25hcC5ncm91cCgpO1xyXG4gICAgICAgIHNjZW5lLnRyYW5zZm9ybShcInRyYW5zbGF0ZSg1LCA1KVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMF0gPSB7IC8vRGVjb3JhdGlvblxyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1syXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzNdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGZvcihsZXQgeT0wO3k8aGVpZ2h0O3krKyl7XHJcbiAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXN1YWxpemF0aW9uW3ldW3hdID0gdGhpcy5jcmVhdGVTZW1pVmlzaWJsZShbeCwgeV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmVUaWxlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGVjb3JhdGlvbigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmope1xyXG4gICAgICAgIGxldCB0aWxlID0gb2JqLnRpbGU7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gb2JqLmVsZW1lbnQ7XHJcbiAgICAgICAgZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGxldCBzdHlsZSA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBfc3R5bGUgb2YgdGhpcy5wYXJhbXMudGlsZS5zdHlsZXMpIHtcclxuICAgICAgICAgICAgaWYoX3N0eWxlLmNvbmRpdGlvbi5jYWxsKG9iai50aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBfc3R5bGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLnRleHQuYXR0cih7XCJ0ZXh0XCI6IGAke3RpbGUudmFsdWV9YH0pO1xyXG4gICAgICAgIGlmIChzdHlsZS5mb250KSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIHN0eWxlLmZvbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iai50ZXh0LmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iai5pY29uLmF0dHIoe1wieGxpbms6aHJlZlwiOiBvYmoudGlsZS5kYXRhLnNpZGUgPT0gMCA/IGljb25zZXRbb2JqLnRpbGUuZGF0YS5waWVjZV0gOiBpY29uc2V0QmxhY2tbb2JqLnRpbGUuZGF0YS5waWVjZV19KTtcclxuXHJcblxyXG4gICAgICAgIGlmICghc3R5bGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIG9iai5yZWN0YW5nbGUuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IHN0eWxlLmZpbGxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU3R5bGUodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIGlmKG9iamVjdCkgb2JqZWN0LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dNb3ZlZCh0aWxlKXtcclxuICAgICAgICB0aGlzLmNoYW5nZVN0eWxlKHRpbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKFt4LCB5XSl7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLndpZHRoICArIGJvcmRlcikgKiB4LFxyXG4gICAgICAgICAgICBib3JkZXIgKyAocGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKSAqIHlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFZpc3VhbGl6ZXIobG9jKXtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICFsb2MgfHwgXHJcbiAgICAgICAgICAgICEobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5maWVsZC5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQpXHJcbiAgICAgICAgKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXN1YWxpemF0aW9uW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHtcclxuICAgICAgICAgICAgdGlsZTogdGlsZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG5cclxuICAgICAgICBsZXQgcyA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMV0ub2JqZWN0O1xyXG4gICAgICAgIGxldCByYWRpdXMgPSA1O1xyXG4gICAgICAgIGxldCByZWN0ID0gcy5yZWN0KFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLndpZHRoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICByYWRpdXMsIHJhZGl1c1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGxldCBpY29uID0gcy5pbWFnZShcclxuICAgICAgICAgICAgXCJcIiwgXHJcbiAgICAgICAgICAgIDMyLCBcclxuICAgICAgICAgICAgMzIsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCAtIDY0LCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUuaGVpZ2h0IC0gNjRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IHMudGV4dChwYXJhbXMudGlsZS53aWR0aCAvIDIsIDExMiwgXCJURVNUXCIpO1xyXG4gICAgICAgIHRleHQuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTZweFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiLCBcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0LCBpY29uLCB0ZXh0KTtcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgKTtcclxuXHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcbiAgICAgICAgICAgIG9iamVjdC5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRJbnRlcmFjdGlvbkxheWVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhpY3NMYXllcnNbM107XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTaG93ZWQoKXtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGZvciAobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZpcyA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgdmlzLmFyZWEuYXR0cih7ZmlsbDogXCJ0cmFuc3BhcmVudFwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuaW5wdXQuc2VsZWN0ZWQudGlsZTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZS5sb2MpO1xyXG4gICAgICAgIGlmIChvYmplY3Qpe1xyXG4gICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDI1NSwgMCwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dQb3NzaWJsZSh0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlaW5mbyBvZiB0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVpbmZvLnRpbGU7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZWluZm8ubG9jKTtcclxuICAgICAgICAgICAgaWYob2JqZWN0KXtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMCwgMjU1LCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlVGlsZXMoKXtcclxuICAgICAgICBsZXQgdGlsZXMgPSB0aGlzLm1hbmFnZXIudGlsZXM7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRpbGVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlc1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xlYXJUaWxlc2V0KCl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVzaFRpbGUodGlsZSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMucHVzaCh0aGlzLmNyZWF0ZU9iamVjdCh0aWxlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVyZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgcmVtb3ZlZFxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFkZC5wdXNoKCh0aWxlKT0+eyAvL3doZW4gdGlsZSBhZGRlZFxyXG4gICAgICAgICAgICB0aGlzLnB1c2hUaWxlKHRpbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hJbnB1dChpbnB1dCl7IC8vTWF5IHJlcXVpcmVkIGZvciBzZW5kIG9iamVjdHMgYW5kIG1vdXNlIGV2ZW50c1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBpbnB1dC5hdHRhY2hHcmFwaGljcyh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQge0dyYXBoaWNzRW5naW5lfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wb3J0ID0ge1xyXG4gICAgICAgICAgICBvbm1vdmU6IFtdLFxyXG4gICAgICAgICAgICBvbnN0YXJ0OiBbXSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IFtdLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaE1hbmFnZXIobWFuYWdlcil7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG1hbmFnZXIuZmllbGQ7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoR3JhcGhpY3MoZ3JhcGhpYyl7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljID0gZ3JhcGhpYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlSW50ZXJhY3Rpb25PYmplY3QodGlsZWluZm8sIHgsIHkpe1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aWxlaW5mbzogdGlsZWluZm8sXHJcbiAgICAgICAgICAgIGxvYzogW3gsIHldXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSBncmFwaGljLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24ob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgbGV0IGJvcmRlciA9IHRoaXMuZ3JhcGhpYy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIGxldCBhcmVhID0gaW50ZXJhY3RpdmUub2JqZWN0LnJlY3QocG9zWzBdIC0gYm9yZGVyLzIsIHBvc1sxXSAtIGJvcmRlci8yLCBwYXJhbXMudGlsZS53aWR0aCArIGJvcmRlciwgcGFyYW1zLnRpbGUuaGVpZ2h0ICsgYm9yZGVyKS5jbGljaygoKT0+e1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IGZpZWxkLmdldChvYmplY3QubG9jKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCBzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQudGlsZSAmJiBzZWxlY3RlZC50aWxlLmxvY1swXSAhPSAtMSAmJiBzZWxlY3RlZCAhPSB0aGlzLnNlbGVjdGVkICYmICFmaWVsZC5wb3NzaWJsZSh0aGlzLnNlbGVjdGVkLnRpbGUsIG9iamVjdC5sb2MpICYmICEob2JqZWN0LmxvY1swXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1swXSAmJiBvYmplY3QubG9jWzFdID09IHRoaXMuc2VsZWN0ZWQubG9jWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25tb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcywgc2VsZWN0ZWQsIGZpZWxkLmdldChvYmplY3QubG9jKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IG9iamVjdC5hcmVhID0gYXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBhcmVhLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEludGVyYWN0aW9uTWFwKCl7XHJcbiAgICAgICAgbGV0IG1hcCA9IHtcclxuICAgICAgICAgICAgdGlsZW1hcDogW10sIFxyXG4gICAgICAgICAgICBncmlkbWFwOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZC5kYXRhLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBtYXAudGlsZW1hcFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPGZpZWxkLmRhdGEud2lkdGg7aisrKXtcclxuICAgICAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldW2pdID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvbk9iamVjdChmaWVsZC5nZXQoW2osIGldKSwgaiwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtJbnB1dH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZFwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG5ldyBGaWVsZCg0LCA0KTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHNjb3JlOiAwLFxyXG4gICAgICAgICAgICBtb3ZlY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWJzb3JiZWQ6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uc3RhcnRldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgdGhpcy5nYW1lc3RhcnQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25zZWxlY3RldmVudCA9IChjb250cm9sbGVyLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLmNsZWFyU2hvd2VkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93UG9zc2libGUodGhpcy5maWVsZC50aWxlUG9zc2libGVMaXN0KHRpbGVpbmZvLnRpbGUpKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dTZWxlY3RlZCh0aWxlaW5mby50aWxlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25tb3ZlZXZlbnQgPSAoY29udHJvbGxlciwgc2VsZWN0ZWQsIHRpbGVpbmZvKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZWxkLnBvc3NpYmxlKHNlbGVjdGVkLnRpbGUsIHRpbGVpbmZvLmxvYykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQubW92ZShzZWxlY3RlZC5sb2MsIHRpbGVpbmZvLmxvYyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdCh0aWxlaW5mby50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGlsZWluZm8udGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2NvcmUgKz0gdGlsZS52YWx1ZSArIG9sZC52YWx1ZTtcclxuICAgICAgICAgICAgdGlsZS52YWx1ZSAqPSAyO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dNb3ZlZCh0aWxlKTtcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPD0gMC41IHx8ICh0aGlzLmRhdGEubW92ZWNvdW50ZXIrKykgJSAyID09IDAgJiYgdGhpcy5kYXRhLmFic29yYmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGlsZXMoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC50aWxlcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSl7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnN0YXJ0LnB1c2godGhpcy5vbnN0YXJ0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnNlbGVjdC5wdXNoKHRoaXMub25zZWxlY3RldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9ubW92ZS5wdXNoKHRoaXMub25tb3ZlZXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWNzO1xyXG4gICAgICAgIGdyYXBoaWNzLmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy5jcmVhdGVDb21wb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYnVpbGRJbnRlcmFjdGlvbk1hcCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZXN0YXJ0KCl7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEubW92ZWNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZGF0YS5hYnNvcmJlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmdlbmVyYXRlVGlsZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lcGF1c2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZW92ZXIocmVhc29uKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpbmsoZGlmZil7IC8vPz8/XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuYWdlcn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGttb3ZlbWFwID0gW1xyXG4gICAgWy0yLCAtMV0sXHJcbiAgICBbIDIsIC0xXSxcclxuICAgIFstMiwgIDFdLFxyXG4gICAgWyAyLCAgMV0sXHJcbiAgICBcclxuICAgIFstMSwgLTJdLFxyXG4gICAgWyAxLCAtMl0sXHJcbiAgICBbLTEsICAyXSxcclxuICAgIFsgMSwgIDJdXHJcbl07XHJcblxyXG5sZXQgcmRpcnMgPSBbXHJcbiAgICBbIDAsICAxXSwgLy9kb3duXHJcbiAgICBbIDAsIC0xXSwgLy91cFxyXG4gICAgWyAxLCAgMF0sIC8vbGVmdFxyXG4gICAgWy0xLCAgMF0gIC8vcmlnaHRcclxuXTtcclxuXHJcbmxldCBiZGlycyA9IFtcclxuICAgIFsgMSwgIDFdLFxyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsICAxXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcGFkaXJzID0gW1xyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBtZGlycyA9IFtcclxuICAgIFsgMCwgLTFdXHJcbl07XHJcblxyXG5cclxubGV0IHBhZGlyc05lZyA9IFtcclxuICAgIFsgMSwgMV0sXHJcbiAgICBbLTEsIDFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzTmVnID0gW1xyXG4gICAgWyAwLCAxXVxyXG5dO1xyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuY2xhc3MgVGlsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsdWU6IDIsIFxyXG4gICAgICAgICAgICBwaWVjZTogMCwgXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIC8veCwgeVxyXG4gICAgICAgICAgICBwcmV2OiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIHNpZGU6IDAgLy9XaGl0ZSA9IDAsIEJsYWNrID0gMVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pZCA9IHRjb3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB2YWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS52YWx1ZSA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2Modil7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvYyA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGZpZWxkLCB4LCB5KXtcclxuICAgICAgICBmaWVsZC5hdHRhY2godGhpcywgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChyZWxhdGl2ZSA9IFswLCAwXSl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHJldHVybiB0aGlzLmZpZWxkLmdldChbXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gKyByZWxhdGl2ZVswXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSArIHJlbGF0aXZlWzFdXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobHRvKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5tb3ZlKHRoaXMuZGF0YS5sb2MsIGx0byk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLnB1dCh0aGlzLmRhdGEubG9jLCB0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgbG9jKGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSBhWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSBhWzFdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWNoZUxvYygpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzBdID0gdGhpcy5kYXRhLmxvY1swXTtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlsxXSA9IHRoaXMuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEZpZWxkKGZpZWxkKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldExvYyhbeCwgeV0pe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSB4O1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXBsYWNlSWZOZWVkcygpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdID49IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQtMSAmJiB0aGlzLmRhdGEuc2lkZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdIDw9IDAgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3NzaWJsZShsb2Mpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldFBhd25BdHRhY2tUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsaXN0ID0gdGhpcy5nZXRQYXduTW92ZVRpbGVzKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMSkgeyAvL0tuaWdodFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0S25pZ2h0UG9zc2libGVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBiZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0RGlyZWN0aW9uVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QucmV2ZXJzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMykgeyAvL1Jvb2tcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiByZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBmb3IgKGxldCBkIG9mIHFkaXJzKXtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzBdIC0gdGhpcy5sb2NbMF0pICE9IGRbMF0gfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1sxXSAtIHRoaXMubG9jWzFdKSAhPSBkWzFdXHJcbiAgICAgICAgICAgICAgICApIGNvbnRpbnVlOyAvL05vdCBwb3NzaWJsZSBkaXJlY3Rpb25cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0RGlyZWN0aW9uVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QucmV2ZXJzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNSkgeyAvL0tpbmdcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldE5laWdodGJvclRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGdldEtuaWdodFBvc3NpYmxlVGlsZXMoKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8a21vdmVtYXAubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCBsb2MgPSBrbW92ZW1hcFtpXTtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGxvYyk7XHJcbiAgICAgICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0TmVpZ2h0Ym9yVGlsZXMoZGlyKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBtYXh0ID0gTWF0aC5tYXgodGhpcy5maWVsZC5kYXRhLndpZHRoLCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoW2RpclswXSwgZGlyWzFdXSk7XHJcbiAgICAgICAgaWYgKHRpZikgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlyZWN0aW9uVGlsZXMoZGlyKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBtYXh0ID0gTWF0aC5tYXgodGhpcy5maWVsZC5kYXRhLndpZHRoLCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPG1heHQ7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0gKiBpLCBkaXJbMV0gKiBpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgICAgICBpZiAodGlmLnRpbGUgfHwgIXRpZikgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQYXduQXR0YWNrVGlsZXMoKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBkaXJzID0gdGhpcy5kYXRhLnNpZGUgPT0gMCA/IHBhZGlycyA6IHBhZGlyc05lZztcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGRpcnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChkaXJzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHRpZiAmJiB0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQYXduTW92ZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwbWRpcnMgOiBwbWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgIXRpZi50aWxlKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7VGlsZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgeyBHcmFwaGljc0VuZ2luZSB9IGZyb20gXCIuL2luY2x1ZGUvZ3JhcGhpY3NcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL2luY2x1ZGUvbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2luY2x1ZGUvaW5wdXRcIjtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgbGV0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xyXG4gICAgbGV0IGdyYXBoaWNzID0gbmV3IEdyYXBoaWNzRW5naW5lKCk7XHJcbiAgICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoKTtcclxuXHJcbiAgICBncmFwaGljcy5hdHRhY2hJbnB1dChpbnB1dCk7XHJcbiAgICBtYW5hZ2VyLmluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KTtcclxuICAgIG1hbmFnZXIuZ2FtZXN0YXJ0KCk7IC8vZGVidWdcclxufSkoKTsiXX0=
