"use strict";

import { Field } from "./field";
import { Tile } from "./tile";

class Manager {
    constructor(){
        this.graphic = null;
        this.input = null;
        this.field = new Field(4, 4);
        this.data = {
            score: 0
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
            controller.graphic.clearShowed();
            controller.graphic.showPossible(this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
            if(this.field.possible(selected.tile, tileinfo.loc)) {
                this.field.move(selected.loc, tileinfo.loc);
            }
        };
        
        this.field.ontileabsorption.push((old, tile)=>{
            this.data.score += tile.value + old.value;
            tile.value *= 2;
        });
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.graphic.showMoved(tile);
            if (Math.random() < 0.75) this.field.generateTile();
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
    
    gamestart(){
        this.data.score = 0;
        this.field.generateTile();
        this.field.generateTile();
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
