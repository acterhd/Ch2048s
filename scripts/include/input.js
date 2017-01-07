"use strict";


class Input {
    constructor(){
        this.graphic = null;
        this.fields = null;
        this.input = null;
        this.interactionMap = null;
        this.selected = null;

        this.port = {
            onmove: [],
            onstart: [],
            onselect: [],
        };

        this.clicked = false;
        this.restartbutton = document.querySelector("#restart");
        this.undobutton = document.querySelector("#undo");

        this.restartbutton.addEventListener("click", ()=>{
            this.manager.restart();
            this.graphic.hideGameover();
            this.graphic.hideVictory();
        });
        this.undobutton.addEventListener("click", ()=>{
            this.selected = null;
            this.manager.restoreState();

            this.graphic.clearShowed();
            if(this.selected){
                this.graphic.showPossible(this.field.tilePossibleList(this.selected.tile));
                this.graphic.showSelected(this.selected.tile);
            }

            this.graphic.hideGameover();
            this.graphic.hideVictory();
        });

        document.addEventListener("click", ()=>{
            if(!this.clicked) {
                this.selected = null;
                this.graphic.clearShowed();
                if(this.selected){
                    this.graphic.showPossible(this.field.tilePossibleList(this.selected.tile));
                    this.graphic.showSelected(this.selected.tile);
                }
            }
            this.clicked = false;
        });
    }
    
    attachManager(manager){
        this.field = manager.field;
        this.manager = manager;
        
        return this;
    }
    
    attachGraphics(graphic){
        this.graphic = graphic;
        return this;
    }
    
    createInteractionObject(tileinfo, x, y){
        let object = {
            
            tileinfo: tileinfo,
            loc: [x, y]
        };

        let graphic = this.graphic;
        let params = graphic.params;
        let interactive = graphic.getInteractionLayer();
        let field = this.field;

        let svgelement = graphic.svgel;
        svgelement.addEventListener("click", ()=>{
            this.clicked = true;
        });

        let pos = graphic.calculateGraphicsPosition(object.loc);
        let border = this.graphic.params.border;
        let area = interactive.object.rect(pos[0] - border/2, pos[1] - border/2, params.tile.width + border, params.tile.height + border).click(()=>{
            if (!this.selected) {
                let selected = field.get(object.loc);
                if (selected) {
                    this.selected = selected;
                    for (let f of this.port.onselect) f(this, this.selected);
                }
            } else {
                let selected = field.get(object.loc);
                if (selected && selected.tile && selected.tile.loc[0] != -1 && selected != this.selected && (!this.selected.tile || !this.selected.tile.possible(object.loc))) {
                    this.selected = selected;
                    for (let f of this.port.onselect) f(this, this.selected);
                } else {
                    let selected = this.selected;
                    this.selected = false;
                    for (let f of this.port.onmove) {
                        f(this, selected, field.get(object.loc));
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

    buildInteractionMap(){
        let map = {
            tilemap: [], 
            gridmap: null
        };

        let graphic = this.graphic;
        let params = graphic.params;
        let interactive = graphic.getInteractionLayer();
        let field = this.field;
        
        for(let i=0;i<field.data.height;i++){
            map.tilemap[i] = [];
            for(let j=0;j<field.data.width;j++){
                map.tilemap[i][j] = this.createInteractionObject(field.get([j, i]), j, i);
            }
        }
        
        this.interactionMap = map;
        return this;
    }
}

export {Input};
