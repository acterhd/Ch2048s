"use strict";

import { Field } from "./field";
import { Tile } from "./tile";

class Manager {
    constructor(){
        this.graphic = null;
        this.input = null;
        this.field = new Field(4, 4);
        this.data = {
            score: 0,
            movecounter: 0,
            absorbed: 0
        };

        this.onstartevent = (controller, tileinfo)=>{
            this.gamestart();
        };
        this.onselectevent = (controller, tileinfo)=>{
            controller.graphic.clearShowed();
            controller.graphic.showPossible(this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
        };
        this.onmoveevent = (controller, selected, tileinfo)=>{
            if(this.field.possible(selected.tile, tileinfo.loc)) {
                this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);

            if(!this.field.anyPossible()) this.graphic.showGameover();
            //this.graphic.showGameover();
        };
        
        this.field.ontileabsorption.push((old, tile)=>{
            this.graphic.removeObject(old);
            this.data.score += tile.value + old.value;
            tile.value *= 2;
            this.data.absorbed = true;
        });
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.graphic.showMoved(tile);
            if (Math.random() <= 0.5 || (this.data.movecounter++) % 2 == 0 && this.data.absorbed) {
                this.field.generateTile();
            }
            this.data.absorbed = false;
        });
        this.field.ontileadd.push((tile)=>{ //when tile added
            this.graphic.pushTile(tile);
        });
    }

    get tiles(){
        return this.field.tiles;
    }

    initUser({graphics, input}){
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
    
    restart(){
        this.gamestart();
        return this;
    }

    gamestart(){
        this.graphic.clearTiles();
        this.field.init();
        this.data.score = 0;
        this.data.movecounter = 0;
        this.data.absorbed = 0;
        this.field.generateTile();
        this.field.generateTile();
        this.graphic.receiveTiles();
        this.graphic.hideGameover();
        return this;
    }
    
    gamepause(){
        return this;
    }
    
    gameover(reason){
        return this;
    }
    
    think(diff){ //???
        return this;
    }
}

export {Manager};
