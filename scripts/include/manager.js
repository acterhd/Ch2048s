"use strict";

import { Field } from "./field";
import { Tile } from "./tile";

class Manager {
    constructor(){
        this.graphic = null;
        this.input = null;
        this.field = new Field(4, 4);
        this.data = {
            victory: false, 
            score: 0,
            movecounter: 0,
            absorbed: 0, 
            conditionValue: 2048
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

            
            //this.graphic.showGameover();
        };
        
        this.field.ontileabsorption.push((old, tile)=>{
            if (tile.data.side != old.data.side) {
                this.data.score += tile.value + old.value;
                tile.value *= 2;
            }
            this.data.absorbed = true;
            this.graphic.removeObject(old);
            this.graphic.updateScore();
        });
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.graphic.showMoved(tile);
            if (Math.random() <= 0.75) {
                this.field.generateTile();
            }
            this.data.absorbed = false;

            if(!this.field.anyPossible()) this.graphic.showGameover();
            if( this.checkCondition() && !this.data.victory) {
                this.resolveVictory();
            }
        });
        this.field.ontileadd.push((tile)=>{ //when tile added
            this.graphic.pushTile(tile);
        });
    }

    get tiles(){
        return this.field.tiles;
    }

    resolveVictory(){
        if(!this.data.victory){
            this.data.victory = true;
            this.graphic.showVictory();
        }
        return this;
    }

    checkCondition(){
        return this.field.checkAny(this.data.conditionValue);
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
        this.data.score = 0;
        this.data.movecounter = 0;
        this.data.absorbed = 0;
        this.field.init();
        this.field.generateTile();
        this.field.generateTile();
        this.data.victory = false;
        this.graphic.updateScore();
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
