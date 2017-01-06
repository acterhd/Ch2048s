"use strict";

import { Field } from "./field";
import { Tile } from "./tile";

function gcd(a,b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {var temp = a; a = b; b = temp;}
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

Array.prototype.set = function(array, offset = 0){
    for (let i=0;i<array.length;i++) {
        this[offset + i] = array[i];
    }
}

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
            //conditionValue: 12288 //Threes-like
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

        let aftermove = (tile)=>{
            //let c = this.data.absorbed ? 1 : 2;
            let c = 1;
            for(let i=0;i<c;i++){
                //if(Math.random() < 0.3333) this.field.generateTile();
                if(Math.random() < 1.0) this.field.generateTile();
            }
            this.data.absorbed = false;

            while(!this.field.anyPossible() || !(this.field.checkAny(2, 2, -1) || this.field.checkAny(4, 2, -1))) { //Classic
            //while(!this.field.anyPossible() || !(this.field.checkAny(1, 1, -1) || this.field.checkAny(2, 1, -1))) { //Thress
                if (!this.field.generateTile()) break;
            }
            if (!this.field.anyPossible()) this.graphic.showGameover();

            if( this.checkCondition() && !this.data.victory) {
                this.resolveVictory();
            }
        };

        this.onmoveevent = (controller, selected, tileinfo)=>{
            if(this.field.possible(selected.tile, tileinfo.loc)) {
                this.saveState();
                //this.field.move(selected.loc, tileinfo.loc);

                let diff = [tileinfo.loc[0] - selected.loc[0], tileinfo.loc[1] - selected.loc[1]];
                let dv = gcd(diff[0], diff[1]);
                let dir = [diff[0] / dv, diff[1] / dv];
                let mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));

                diff[0] = dir[0] * this.field.width;
                diff[1] = dir[1] * this.field.height;

                //let tileList = [selected.tile];
                let tileList = this.field.tiles.concat([]);
                //let tileList = this.field.tilesByDirection(diff);

                tileList.sort((tile, op)=>{
                    let shiftingX = Math.sign(-dir[0] * (tile.loc[0] - op.loc[0]));
                    return Math.sign(shiftingX);
                });

                tileList.sort((tile, op)=>{
                    let shiftingY = Math.sign(-dir[1] * (tile.loc[1] - op.loc[1]));
                    return Math.sign(shiftingY);
                });
                
                
                for(let tile of tileList){
                    tile.setQueue([diff[0], diff[1]]);
                }
                
                for(let i=0;i<=mx;i++){
                    for(let tile of tileList){
                        tile.move(tile.leastQueue());
                    }
                }

                let movedcnt = 0;
                for(let tile of tileList){
                    if (tile.queue[0] != diff[0] || tile.queue[1] != diff[1]) {
                        movedcnt++
                    }
                    tile.queue[0] = 0;
                    tile.queue[1] = 0;
                }

                if(movedcnt > 0) aftermove();
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

            //if (opponent) {
                
                if (
                    oldval == curval 
                    //|| oldval == 1 && curval == 2 || oldval == 2 && curval == 1 //Thress-like 
                ) {
                    tile.value += oldval;
                } else 
                if (oldval < curval) {
                    tile.value = curval;
                    tile.data.side = old.data.side;
                } else {
                    tile.value = oldval;
                }
            //} 

            if(tile.value < 1) this.graphic.showGameover();
        
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
                queue: tile.data.queue.concat([]), 
                piece: tile.data.piece, 
                side: tile.data.side, 
                value: tile.data.value,
                prev: tile.data.prev.concat([]), 
                bonus: tile.data.bonus, 
                moved: tile.data.moved
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
