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
        this.states = [];

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
                this.saveState();
                this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);
        };
        
        this.field.ontileabsorption.push((old, tile)=>{
            let oldval = old.value;
            let curval = tile.value;
            
            let opponent = tile.data.side != old.data.side;
            let owner = !opponent;

            if (opponent) {
                if (oldval == curval) {
                    tile.value = curval * 2.0;
                } else 
                if (oldval < curval) {
                    tile.value = oldval;
                } else {
                    tile.value = oldval;
                }
            } 

            if (owner) {
                tile.data.side = tile.data.side == 0 ? 1 : 0;

                if (oldval == curval) {
                    tile.value = curval * 2.0;
                } else 
                if (oldval < curval) {
                    tile.value = oldval;
                } else {
                    tile.value = oldval;
                }
            }

            if(tile.value <= 1) this.graphic.showGameover();
            
            this.data.score += tile.value;
            this.data.absorbed = true;
            this.graphic.removeObject(old);
            this.graphic.updateScore();
        });
        this.field.ontileremove.push((tile)=>{ //when tile removed
            this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push((tile)=>{ //when tile moved
            this.graphic.showMoved(tile);
            let c = Math.max(Math.ceil(Math.sqrt((this.field.data.width / 4) * (this.field.data.height / 4)) * 2), 1);
            if (!this.data.absorbed) {
                for(let i=0;i<c;i++){
                    if(Math.random() <= 0.5) this.field.generateTile();
                }
            } else {
                while(!(this.field.checkAny(2, 2) || this.field.checkAny(4, 2))) {
                    if (!this.field.generateTile()) break;
                }
            }
            this.data.absorbed = false;

            while (!this.field.anyPossible()) {
                if(!this.field.generateTile()) break;
            }
            if (!this.field.anyPossible()) this.graphic.showGameover();

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


    saveState(){
        let state = {
            tiles: [],
            width: this.field.width, 
            height: this.field.height
        };
        state.score = this.data.score;
        state.victory = this.data.victory;
        for(let tile of this.field.tiles){
            state.tiles.push({
                loc: tile.data.loc.concat([]), 
                piece: tile.data.piece, 
                side: tile.data.side, 
                value: tile.data.value,
                prev: tile.data.prev
            });
        }
        this.states.push(state);
        return state;
    }

    restoreState(state){
        if (!state) {
            state = this.states[this.states.length-1];
            this.states.pop();
        }
        if (!state) return this;

        this.field.init();
        this.data.score = state.score;
        this.data.victory = state.victory;

        for(let tdat of state.tiles) {
            let tile = new Tile();
            tile.data.piece = tdat.piece;
            tile.data.value = tdat.value;
            tile.data.side = tdat.side;
            tile.data.loc = tdat.loc;
            tile.data.prev = tdat.prev;
            tile.attach(this.field, tdat.loc);
        }

        this.graphic.updateScore();
        return this;
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
        this.data.victory = false;
        this.field.init();
        this.field.generateTile();
        this.field.generateTile();
        this.graphic.updateScore();
        this.states.splice(0, this.states.length);
        if(!this.field.anyPossible()) this.gamestart(); //Prevent gameover
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
