"use strict";

import { Tile } from "./tile";

class Field {
    constructor(w = 4, h = 4){
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
    
    get width(){
        return this.data.width;
    }

    get height(){
        return this.data.height;
    }

    checkAny(value, count = 1, side = -1){
        let counted = 0;
        for(let tile of this.tiles){
            if(tile.value == value && (side < 0 || tile.data.side == side) && tile.data.bonus == 0) counted++;//return true;
            if(counted >= count) return true;
        }
        return false;
    }
    
    anyPossible(){
        let anypossible = 0;
        for (let i=0;i<this.data.height;i++) {
            for (let j=0;j<this.data.width;j++) {
                 for(let tile of this.tiles) {
                    if(this.possible(tile, [j, i])) anypossible++;
                    if(anypossible > 0) return true;
                 }
            }
        }
        if(anypossible > 0) return true;
        return false;
    }

    tilePossibleList(tile){
        let list = [];
        if (!tile) return list; //empty
        for (let i=0;i<this.data.height;i++) {
            for (let j=0;j<this.data.width;j++) {
                if(this.possible(tile, [j, i])) list.push(this.get([j, i]));
            }
        }
        return list;
    }


    possible(tile, lto){
        if (!tile) return false;

        let tilei = this.get(lto);
        let atile = tilei.tile;
        let piece = tile.possible(lto);

        if (!atile) return piece;
        let possibles = piece;

        if(tile.data.bonus == 0){
            let opponent = atile.data.side != tile.data.side;
            let owner = !opponent; //Also possible owner
            let both = true;
            let nobody = false;

            let same = atile.value == tile.value;
            let higterThanOp = tile.value * 2 == atile.value;
            let lowerThanOp = atile.value * 2 == tile.value;

            let withconverter = atile.data.bonus != 0;

            //Settings with possible oppositions
            possibles = possibles && 
            (
                same && opponent || 
                higterThanOp && nobody || 
                lowerThanOp && nobody || 
                withconverter
            );

            return possibles;
        } else {
            return possibles && atile.data.bonus == 0;
        }

        return false;
    }

    notSame(){
        let sames = [];
        for(let tile of this.tiles){
            if (sames.indexOf(tile.value) < 0) {
                sames.push(tile.value);
            } else {
                return false;
            }
        }
        return true;
    }

    genPiece(exceptPawn){
        let pawnr = Math.random();
        if (pawnr < 0.4 && !exceptPawn) {
            return 0;
        }

        let rnd = Math.random();
        if(rnd >= 0.0 && rnd < 0.3){
            return 1;
        } else 
        if(rnd >= 0.3 && rnd < 0.6){
            return 2;
        } else 
        if(rnd >= 0.6 && rnd < 0.8){
            return 3;
        } else 
        if(rnd >= 0.8 && rnd < 0.85){
            return 4;
        }
        return 5;
    }

    generateTile(){
        let tile = new Tile();
        

        //Count not occupied
        let notOccupied = [];
        for (let i=0;i<this.data.height;i++) {
            for (let j=0;j<this.data.width;j++) {
                if (!this.fields[i][j].tile) notOccupied.push(this.fields[i][j]);
            }
        }

        

        if(notOccupied.length > 0){
            if(Math.random() < 0.1){
                tile.data.side = 0;
                tile.data.bonus = 1; //Inverter
                tile.data.value = 2;
                tile.data.piece = 5;
            } else {
                tile.data.piece = this.genPiece();
                tile.data.value = Math.random() < 0.2 ? 4 : 2;
                tile.data.bonus = 0;

                let bcheck = this.checkAny(2, 1, 1) || this.checkAny(4, 1, 1);
                let wcheck = this.checkAny(2, 1, 0) || this.checkAny(4, 1, 0);

                if (bcheck && wcheck || !bcheck && !wcheck) {
                    tile.data.side = Math.random() < 0.5 ? 1 : 0;
                } else 
                if (!bcheck){
                    tile.data.side = 1;
                } else 
                if (!wcheck){
                    tile.data.side = 0;
                }
            }

            tile.attach(this, notOccupied[Math.floor(Math.random() * notOccupied.length)].loc); //prefer generate single
            
            
        } else {
            return false; //Not possible to generate new tiles
        }
        return true;
    }


    init(){
        this.tiles.splice(0, this.tiles.length);
        //this.fields.splice(0, this.fields.length);
        for (let i=0;i<this.data.height;i++) {
            if (!this.fields[i]) this.fields[i] = [];
            for (let j=0;j<this.data.width;j++) {
                let tile = this.fields[i][j] ? this.fields[i][j].tile : null;
                if(tile){ //if have
                    for (let f of this.ontileremove) f(tile);
                }
                let ref = Object.assign({}, this.defaultTilemapInfo); //Link with object
                ref.tileID = -1;
                ref.tile = null;
                ref.loc = [j, i];
                this.fields[i][j] = ref;
            }
        }
        return this;
    }

    
    getTile(loc){
        return this.get(loc).tile;
    }
    
    get(loc){
        if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
            return this.fields[loc[1]][loc[0]]; //return reference
        }
        return Object.assign({}, this.defaultTilemapInfo, {
            loc: [loc[0], loc[1]]
        });
    }
    
    put(loc, tile){
        if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
            let ref = this.fields[loc[1]][loc[0]];
            ref.tileID = tile.id;
            ref.tile = tile;
            tile.replaceIfNeeds();
        }
        return this;
    }
    
    move(loc, lto){
        if (loc[0] == lto[0] && loc[1] == lto[1]) return this; //Same location
        if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
            let ref = this.fields[loc[1]][loc[0]];
            if (ref.tile) {
                let tile = ref.tile;
                ref.tileID = -1;
                ref.tile = null;
                tile.data.prev[0] = tile.data.loc[0];
                tile.data.prev[1] = tile.data.loc[1];
                tile.data.loc[0] = lto[0];
                tile.data.loc[1] = lto[1];

                let old = this.fields[lto[1]][lto[0]];
                if (old.tile) {
                    for (let f of this.ontileabsorption) f(old.tile, tile);
                }
                
                this.clear(lto, tile).put(lto, tile);
                for (let f of this.ontilemove) f(tile);
            }
        }
        return this;
    }
    
    clear(loc, bytile = null){
        if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
            let ref = this.fields[loc[1]][loc[0]];
            if (ref.tile) {
                let tile = ref.tile;
                if (tile) {
                    ref.tileID = -1;
                    ref.tile = null;
                    let idx = this.tiles.indexOf(tile);
                    if (idx >= 0) {
                        tile.setLoc([-1, -1]);
                        this.tiles.splice(idx, 1);
                        for (let f of this.ontileremove) f(tile, bytile);
                    }
                }
            }
        }
        return this;
    }
    
    attach(tile, loc=[0, 0]){
        if(tile && this.tiles.indexOf(tile) < 0) {
            this.tiles.push(tile);
            tile.setField(this).setLoc(loc).put();
            for (let f of this.ontileadd) f(tile);
        }
        return this;
    }
}

export {Field};
