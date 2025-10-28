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
        this.timeDisplay = this.add.text(0,0,"timetest",{ fontFamily: 'Arial', color: 'rgba(255, 255, 255, 1)', fontSize: '72px'});
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
    }
    update(time, dt) {
        //#region timer
        this.time = Math.max(0,this.time-=dt);
        let TD = this.getTime();
        this.timeDisplay.text = (TD[0]+":"+TD[1]);
        //#endregion

        //#region input
        //#region gameplay
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.PAUSE)){
            this.pauseGame();
        }
        //#endregion
        //#region debug
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEUP)){
            this.addTime(30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEDOWN)){
            this.addTime(-30);
        }
        //#endregion
        //#endregion


    }
    /**Returns an array with the number of minutes and seconds remaining on the timer.
     */
    getTime(){
        let seconds = this.time/1000;
        return [Math.floor(seconds/60),Math.floor(seconds%60)];
    }
    /**Adds the specified time to the scene timer, in seconds.
     */
    addTime(time){
        this.time += (time*1000);
    }
    pauseGame(){
        this.scene.launch("pauseScene");
        this.scene.pause()
    }

}