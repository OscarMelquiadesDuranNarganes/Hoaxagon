import {KEYBINDS} from "../utils/Keybinds.js";
export default class GameScene extends Phaser.Scene{
    //TODO: Progresión de niveles
    //TODO: Variante para modo entrenamiento y arcade
    //TODO: Implementación de modo inspección, mensajes, barra de información.
    timer;
    timeDisplay;
    KEYS;
    pause = false;
    constructor(){
        super({key: "gameScene"});
    }
    init(){

    }
    create() {
        this.timer = 180000;
        this.timeDisplay = this.add.text(10,0,"",{ fontFamily: 'Horizon', color: 'rgba(255, 255, 255, 1)', fontSize: '72px'});
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
    }
    update(time, dt) {
        //#region timer
        this.addTimeRaw(-dt);
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
        let seconds = this.timer/1000;
        return [Math.floor(seconds/60),Math.floor(seconds%60)];
    }
    /**Adds the specified time to the scene timer, in seconds.
     */
    addTimeRaw(time){
        this.timer = Math.max(0,this.timer+=time);
        this.updateTimer();
    }
    addTime(time){
        this.timer = Math.max(0,this.timer+=(time*1000));
        this.updateTimer();
    }
    pauseGame(){
        this.scene.launch("pauseScene");
        this.scene.pause()
    }
    updateTimer(){
        let TD = this.getTime();
        this.timeDisplay.text = (TD[0]+":"+Math.floor(TD[1]/10)+TD[1]%10);
        if (this.timer<11000) this.timeDisplay.setColor('rgba(149, 41, 41, 1)');
        else if (this.timer<31000) this.timeDisplay.setColor('rgba(212, 125, 59, 1)');
        else if (this.timer<61000) this.timeDisplay.setColor('rgba(211, 172, 31, 1)');
        else if (this.timer<181000) this.timeDisplay.setColor('rgba(255, 255, 255, 1)');
        else this.timeDisplay.setColor('rgba(83, 208, 143, 1)');
    }

}