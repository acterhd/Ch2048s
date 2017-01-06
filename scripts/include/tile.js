"use strict";

let kmovemap = [
    [-2, -1],
    [ 2, -1],
    [-2,  1],
    [ 2,  1],
    
    [-1, -2],
    [ 1, -2],
    [-1,  2],
    [ 1,  2]
];

let rdirs = [
    [ 0,  1], //down
    [ 0, -1], //up
    [ 1,  0], //left
    [-1,  0]  //right
];

let bdirs = [
    [ 1,  1],
    [ 1, -1],
    [-1,  1],
    [-1, -1]
];

let padirs = [
    [ 1, -1],
    [-1, -1]
];

let pmdirs = [
    [ 0, -1]
];


let padirsNeg = [
    [ 1, 1],
    [-1, 1]
];

let pmdirsNeg = [
    [ 0, 1]
];


let qdirs = rdirs.concat(bdirs); //may not need

let tcounter = 0;

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

class Tile {
    constructor(){
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
    
    get value(){
        return this.data.value;
    }

    set value(v){
        this.data.value = v;
    }

    get diff(){
        return [this.data.loc[0] - this.data.prev[0], this.data.loc[1] - this.data.prev[1]];
    }

    get loc(){
        return this.data.loc;
    }

    get prev(){
        return this.data.prev;
    }

    set loc(v){
        this.data.loc = v;
    }

    onhit(){
        return this;
    }

    onabsorb(){
        return this;
    }

    onmove(){
        this.data.queue[0] -= this.loc[0] - this.prev[0];
        this.data.queue[1] -= this.loc[1] - this.prev[1];
        return this;
    }

    attach(field, x, y){
        field.attach(this, x, y);
        return this;
    }
    
    get(relative = [0, 0]){
        if (this.field) return this.field.get([
            this.data.loc[0] + relative[0],
            this.data.loc[1] + relative[1]
        ]);
        return null;
    }
    
    move(lto){
        if (this.field) this.field.move(this.data.loc, lto);
        return this;
    }
    
    put(){
        if (this.field) this.field.put(this.data.loc, this);
        return this;
    }
    
    get moved(){
        return this.data.moved;
    }

    get loc(){
        return this.data.loc;
    }
    
    set loc(a){
        this.data.loc[0] = a[0];
        this.data.loc[1] = a[1];
    }
    
    get queue(){
        return this.data.queue;
    }

    setQueue(diff){
        this.data.moved = false;
        this.data.queue[0] = diff[0];
        this.data.queue[1] = diff[1];
        return this;
    }

    cacheLoc(){
        this.data.prev[0] = this.data.loc[0];
        this.data.prev[1] = this.data.loc[1];
        return this;
    }
    
    setField(field){
        this.field = field;
        return this;
    }
    
    setLoc([x, y]){
        this.data.loc[0] = x;
        this.data.loc[1] = y;
        return this;
    }
    
    replaceIfNeeds(){
        if (this.data.piece == 0){
            if (this.data.loc[1] >= this.field.data.height-1 && this.data.side == 1) {
                this.data.piece = this.field.genPiece(true);
            }
            if (this.data.loc[1] <= 0 && this.data.side == 0) {
                this.data.piece = this.field.genPiece(true);
            }
        }
        return this;
    }

    



    responsive(dir){
        let mloc = this.data.loc;
        let least = this.least(dir);
        if (least[0] != mloc[0] || least[1] != mloc[1]) return true;
        return false;
    }

    leastQueue(){
        return this.least(this.queue);
    }

    least(diff){
        let mloc = this.data.loc;
        if (diff[0] == 0 && diff[1] == 0) return [mloc[0], mloc[1]];

        let mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
        let mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
        let asp = Math.max(Math.abs(diff[0] / diff[1]), Math.abs(diff[1] / diff[0]));

        let dv = gcd(diff[0], diff[1]);
        let dir = [diff[0] / dv, diff[1] / dv];

        let trace = ()=>{
            let least = [mloc[0], mloc[1]];
            for(let o=1;o<=mx;o++){
                let off = [
                    Math.floor(dir[0] * o), 
                    Math.floor(dir[1] * o)
                ];

                let cloc = [
                    mloc[0] + off[0], 
                    mloc[1] + off[1]
                ];

                if (!this.field.inside(cloc) || !this.field.possible(this, cloc)) return least;

                least[0] = cloc[0];
                least[1] = cloc[1];

                if (this.field.get(cloc).tile) {
                    return least;
                }
            }
            return least;
        }

        if (this.data.piece == 0) { //PAWN
            let ydir = this.data.side == 0 ? -1 : 1;
            if (dir[1] == ydir){
                let cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                if(this.field.possible(this, cloc)) return cloc;
            }
        } else 

        if (this.data.piece == 1) { //Knight
            if (
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 2 ||
                Math.abs(dir[0]) == 2 && Math.abs(dir[1]) == 1
            ) {
                let cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                if(this.field.possible(this, cloc)) return cloc;
            }
        } else 

        if (this.data.piece == 2) { //Bishop
            if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
                return trace();
            }
        } else 

        if (this.data.piece == 3) { //Rook
            if (
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 4) { //Queen
            if (
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 5) { //King
            if (Math.abs(dir[0]) <= 1 && Math.abs(dir[1]) <= 1) {
                let cloc = [mloc[0] + dir[0], mloc[1] + dir[1]];
                if(this.field.possible(this, cloc)) return cloc;
            }
        }

        return [mloc[0], mloc[1]];
    }








    possible(loc){
        let mloc = this.data.loc;
        if (mloc[0] == loc[0] && mloc[1] == loc[1]) return false;

        let diff = [
            loc[0] - mloc[0],
            loc[1] - mloc[1],
        ];
        let mx = Math.max(Math.abs(diff[0]), Math.abs(diff[1]));
        let mn = Math.min(Math.abs(diff[0]), Math.abs(diff[1]));
        let asp = Math.max(Math.abs(diff[0] / diff[1]), Math.abs(diff[1] / diff[0]));

        let dv = gcd(diff[0], diff[1]);
        let dir = [diff[0] / dv, diff[1] / dv];
        let tile = this.field.get(loc);

        let trace = ()=>{
            for(let o=1;o<mx;o++){
                let off = [
                    Math.floor(dir[0] * o), 
                    Math.floor(dir[1] * o)
                ];
                let cloc = [
                    mloc[0] + off[0], 
                    mloc[1] + off[1]
                ];
                if (!this.field.inside(cloc)) return false;
                if (this.field.get(cloc).tile) return false;
            }
            return true;
        }

        if (this.data.piece == 0) { //PAWN
            let ydir = this.data.side == 0 ? -1 : 1;
            if (tile.tile) {
                return Math.abs(diff[0]) == 1 && diff[1] == ydir;
            } else {
                return Math.abs(diff[0]) == 0 && diff[1] == ydir;
            }
        } else 

        if (this.data.piece == 1) { //Knight
            if (
                Math.abs(diff[0]) == 1 && Math.abs(diff[1]) == 2 ||
                Math.abs(diff[0]) == 2 && Math.abs(diff[1]) == 1
            ) {
                return true;
            }
        } else 

        if (this.data.piece == 2) { //Bishop
            if (Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1) {
                return trace();
            }
        } else 

        if (this.data.piece == 3) { //Rook
            if (
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 4) { //Queen
            if (
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 0 && Math.abs(dir[1]) == 1 || 
                Math.abs(dir[0]) == 1 && Math.abs(dir[1]) == 0
            ) {
                return trace();
            }
        } else 

        if (this.data.piece == 5) { //King
            if (Math.abs(diff[0]) <= 1 && Math.abs(diff[1]) <= 1) {
                return true;
            }
        }

        return false;
    }

}

export {Tile};
