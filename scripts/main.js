"use strict";
import { GraphicsEngine } from "./include/graphics";
import { Manager } from "./include/manager";
import { Input } from "./include/input";

(function(){
    let manager = new Manager();
    let graphics = new GraphicsEngine();
    let input = new Input();

    graphics.attachInput(input);
    manager.initUser({graphics, input});
    manager.gamestart(); //debug
})();