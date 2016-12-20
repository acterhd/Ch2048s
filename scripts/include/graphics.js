"use strict";

let iconset = [
    "icons/WhitePawn.png",
    "icons/WhiteKnight.png",
    "icons/WhiteBishop.png",
    "icons/WhiteRook.png",
    "icons/WhiteQueen.png",
    "icons/WhiteKing.png"
];

let iconsetBlack = [
    "icons/BlackPawn.png",
    "icons/BlackKnight.png",
    "icons/BlackBishop.png",
    "icons/BlackRook.png",
    "icons/BlackQueen.png",
    "icons/BlackKing.png"
];

class GraphicsEngine {
    
    constructor(svgname = "#svg"){
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
                styles: [
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 2 && tile.value < 4;
                        }, 
                        fill: "rgb(255, 192, 128)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 4 && tile.value < 8;
                        }, 
                        fill: "rgb(224, 128, 96)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 8 && tile.value < 16;
                        }, 
                        fill: "rgb(224, 96, 64)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 16 && tile.value < 32;
                        }, 
                        fill: "rgb(224, 64, 64)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 32 && tile.value < 64;
                        }, 
                        fill: "rgb(224, 64, 0)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 64 && tile.value < 128;
                        }, 
                        fill: "rgb(224, 0, 0)", 
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 128 && tile.value < 256;
                        }, 
                        fill: "rgb(224, 128, 0)",
                        font: "rgb(255, 255, 255)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 256 && tile.value < 512;
                        }, 
                        fill: "rgb(224, 192, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 512 && tile.value < 1024;
                        }, 
                        fill: "rgb(224, 224, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 1024 && tile.value < 2048;
                        }, 
                        fill: "rgb(255, 224, 0)"
                    }, 
                    {
                        condition: function(){
                            let tile = this; 
                            return tile.value >= 2048;
                        }, 
                        fill: "rgb(255, 230, 0)"
                    }

                ]
            }
        };
    }

    createSemiVisible(loc){
        let object = {
            loc: loc
        };
        
        let params = this.params;
        let pos = this.calculateGraphicsPosition(loc);

        let s = this.graphicsLayers[2].object;
        let radius = 5;
        let rect = s.rect(
            0, 
            0, 
            params.tile.width, 
            params.tile.height,
            radius, radius
        );

        let group = s.group(rect);
        group.transform(`translate(${pos[0]}, ${pos[1]})`);

        rect.attr({
            fill: "transparent"
        });

        object.element = group;
        object.rectangle = rect;
        object.area = rect;
        object.remove = () => {
            this.graphicsTiles.splice(this.graphicsTiles.indexOf(object), 1);
        };
        return object;
    }
    
    createDecoration(){
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;
        this.params.grid.width = tw;
        this.params.grid.height = th;
        
        let decorationLayer = this.graphicsLayers[0];
        let rect = decorationLayer.object.rect(0, 0, tw, th, 5, 5);
        rect.attr({
            fill: "rgb(255, 224, 192)", 
            stroke: "rgb(128, 64, 32)",
            "stroke-width": "8"
        });
    }

    createComposition(){
        this.graphicsLayers.splice(0, this.graphicsLayers.length);
        let scene = this.snap.group();
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
        this.graphicsLayers[4] = {
            object: scene.group()
        };
        this.graphicsLayers[5] = {
            object: scene.group()
        };

        let width = this.manager.field.data.width;
        let height = this.manager.field.data.height;
        for(let y=0;y<height;y++){
            this.visualization[y] = [];
            for (let x=0;x<width;x++){
                this.visualization[y][x] = this.createSemiVisible([x, y]);
            }
        }

        this.receiveTiles();
        this.createDecoration();
        this.createGameOver();
        this.createVictory();
        return this;
    }
    

    createGameOver(){
        let screen = this.graphicsLayers[4].object;
        
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;

        let bg = screen.rect(0, 0, tw, th, 5, 5);
        bg.attr({
            "fill": "rgba(255, 224, 0, 0.8)"
        });
        let got = screen.text(tw / 2, th / 2 - 30, "Game Over");
        got.attr({
            "font-size": "30",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS"
        })

        let buttonGroup = screen.group();
        buttonGroup.transform(`translate(${tw / 2 - 50}, ${th / 2 + 20})`);
        buttonGroup.click(()=>{
            this.manager.restart();
            this.hideGameover();
        });

        let button = buttonGroup.rect(0, 0, 100, 30);
        button.attr({
            "fill": "rgba(224, 192, 0, 0.8)"
        });

        let buttonText = buttonGroup.text(50, 20, "New game");
        buttonText.attr({
            "font-size": "15",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS"
        });

        this.gameoverscreen = screen;
        screen.attr({"visibility": "hidden"});

        return this;
    }



    createVictory(){
        let screen = this.graphicsLayers[5].object;
        
        let w = this.field.data.width;
        let h = this.field.data.height;
        let b = this.params.border;
        let tw = (this.params.tile.width + b) * w + b;
        let th = (this.params.tile.height + b) * h + b;

        let bg = screen.rect(0, 0, tw, th, 5, 5);
        bg.attr({
            "fill": "rgba(224, 224, 256, 0.8)"
        });
        let got = screen.text(tw / 2, th / 2 - 30, "You won! You got " + this.manager.data.conditionValue + "!");
        got.attr({
            "font-size": "30",
            "text-anchor": "middle", 
            "font-family": "Comic Sans MS"
        })

        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 + 5}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.manager.restart();
                this.hideVictory();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(128, 128, 255, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        {
            let buttonGroup = screen.group();
            buttonGroup.transform(`translate(${tw / 2 - 105}, ${th / 2 + 20})`);
            buttonGroup.click(()=>{
                this.manager.restart();
                this.hideVictory();
            });

            let button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(128, 128, 255, 0.8)"
            });

            let buttonText = buttonGroup.text(50, 20, "Continue...");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle", 
                "font-family": "Comic Sans MS"
            });
        }

        this.victoryscreen = screen;
        screen.attr({"visibility": "hidden"});

        return this;
    }

    showVictory(){
        this.victoryscreen.attr({"visibility": "visible"});
        return this;
    }

    hideVictory(){
        this.victoryscreen.attr({"visibility": "hidden"});
        return this;
    }

    showGameover(){
        this.gameoverscreen.attr({"visibility": "visible"});
        return this;
    }

    hideGameover(){
        this.gameoverscreen.attr({"visibility": "hidden"});
        return this;
    }

    selectObject(tile){
        for(let i=0;i<this.graphicsTiles.length;i++){
            if(this.graphicsTiles[i].tile == tile) return this.graphicsTiles[i];
        }
        return null;
    }
    
    changeStyleObject(obj){
        let tile = obj.tile;
        let pos = this.calculateGraphicsPosition(tile.loc);
        let group = obj.element;
        group.transform(`translate(${pos[0]}, ${pos[1]})`);

        let style = null;
        for(let _style of this.params.tile.styles) {
            if(_style.condition.call(obj.tile)) {
                style = _style;
                break;
            }
        }

        obj.text.attr({"text": `${tile.value}`});
        if (style.font) {
            obj.text.attr("fill", style.font);
        } else {
            obj.text.attr("fill", "black");
        }
        obj.icon.attr({"xlink:href": obj.tile.data.side == 0 ? iconset[obj.tile.data.piece] : iconsetBlack[obj.tile.data.piece]});

        obj.text.attr({
            "font-size": "16px",
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

    changeStyle(tile){
        let obj = this.selectObject(tile);
        this.changeStyleObject(obj);
        return this;
    }

    removeObject(tile){
        let object = this.selectObject(tile);
        if (object) object.remove();
        return this;
    }

    showMoved(tile){
        this.changeStyle(tile);
        return this;
    }
    
    calculateGraphicsPosition([x, y]){
        let params = this.params;
        let border = this.params.border;
        return [
            border + (params.tile.width  + border) * x,
            border + (params.tile.height + border) * y
        ];
    }

    selectVisualizer(loc){
        if (
            !loc || 
            !(loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.field.data.width && loc[1] < this.field.data.height)
        ) return null;
        return this.visualization[loc[1]][loc[0]];
    }

    createObject(tile){
        if (this.selectObject(tile)) return null;

        let object = {
            tile: tile
        };

        let params = this.params;
        let pos = this.calculateGraphicsPosition(tile.loc);

        let s = this.graphicsLayers[1].object;
        let radius = 5;
        let rect = s.rect(
            0, 
            0, 
            params.tile.width, 
            params.tile.height,
            radius, radius
        );

        let icon = s.image(
            "", 
            32, 
            32, 
            params.tile.width - 64, 
            params.tile.height - 64
        );

        let text = s.text(params.tile.width / 2, 112, "TEST");
        let group = s.group(rect, icon, text);
        object.element = group;
        object.rectangle = rect;
        object.icon = icon;
        object.text = text;
        object.remove = () => {
            this.graphicsTiles.splice(this.graphicsTiles.indexOf(object), 1);
            object.element.remove();
        };

        this.changeStyleObject(object);
        return object;
    }
    
    getInteractionLayer(){
        return this.graphicsLayers[3];
    }

    clearShowed(){
        let width = this.manager.field.data.width;
        let height = this.manager.field.data.height;
        for (let y=0;y<height;y++){
            for (let x=0;x<width;x++){
                let vis = this.selectVisualizer([x, y]);
                vis.area.attr({fill: "transparent"});
            }
        }
        return this;
    }

    showSelected(){
        if (!this.input.selected) return this;
        let tile = this.input.selected.tile;
        if (!tile) return this;
        let object = this.selectVisualizer(tile.loc);
        if (object){
            object.area.attr({"fill": "rgba(255, 0, 0, 0.2)"});
        }
        return this;
    }

    showPossible(tileinfolist){
        if (!this.input.selected) return this;
        for(let tileinfo of tileinfolist){
            let tile = tileinfo.tile;
            let object = this.selectVisualizer(tileinfo.loc);
            if(object){
                object.area.attr({"fill": "rgba(0, 255, 0, 0.2)"});
            }
        }
        return this;
    }

    receiveTiles(){
        this.clearTiles();
        let tiles = this.manager.tiles;
        for(let tile of tiles){
            if (!this.selectObject(tile)) {
                this.graphicsTiles.push(this.createObject(tile));
            }
        }
        return this;
    }
    
    clearTiles(){
        for (let tile of this.graphicsTiles){
            if (tile) tile.remove();
        }
        return this;
    }
    
    pushTile(tile){
        if (!this.selectObject(tile)) {
            this.graphicsTiles.push(this.createObject(tile));
        }
        return this;
    }
    
    attachManager(manager){
        this.field = manager.field;
        this.manager = manager;
        
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.changeStyle(tile);
        });
        this.field.ontileadd.push((tile)=>{ //when tile added
            this.pushTile(tile);
        });
        return this;
    }
    
    attachInput(input){ //May required for send objects and mouse events
        this.input = input;
        input.attachGraphics(this);
        return this;
    }
    
}

export {GraphicsEngine};
