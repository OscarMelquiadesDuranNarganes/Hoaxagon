import {KEYBINDS} from "../utils/Keybinds.js";
export default class GameScene extends Phaser.Scene{
    time;
    timeDisplay;
    KEYS;
    pause = false;
    constructor(){
        super({key: "gameScene"});
    }
    init(){

    }
    create() {
        this.time = 180000;
        this.timeDisplay = this.add.text(0,0,"timetest");
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
    }
    update(time, dt) {
        //#region timer
        this.time = Math.max(0,this.time-=dt);
        let TD = this.getTime();
        this.timeDisplay.text = (TD[0]+":"+TD[1]);
        //#endregion

        //#region input
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEUP)){
            this.addTime(30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEDOWN)){
            this.addTime(-30);
        }
        //#endregion


    }
    getTime(){
        let seconds = this.time/1000;
        return [Math.floor(seconds/60),Math.floor(seconds%60)];
    }
    addTime(time){
        this.time += (time*1000);
    }

}