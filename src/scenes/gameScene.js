import {KEYBINDS} from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import InfoBox from "../utils/infoBox.js";
import { INFO_DATABASE } from "../utils/infoDatabase.js";

export default class GameScene extends Phaser.Scene{
    //TODO: Progresión de niveles
    //TODO: Variante para modo entrenamiento y arcade
    //TODO: Implementación de modo inspección, mensajes, barra de información.
    timer;
    timeDisplay;
    KEYS;   
    pause = false;
    constructor(){
        super(SCENE_KEYS.GAME_SCENE);
    }
    init(){

    }
    create() {
        this.cameras.main.setBackgroundColor( PALETTE_HEX.DarkerGrey);
        this.timer = 180000;
        this.timeDisplay = this.add.text(10,0,"",{ fontFamily: 'Horizon', color: PALETTE_RGBA.White, fontSize: '72px'});
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
        this.createInfoBox(1000,500,INFO_DATABASE.TEST);
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
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.INSPECT)){

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
        this.scene.launch(SCENE_KEYS.PAUSE_SCENE);
        this.scene.pause()
        if (this.scene.isActive(SCENE_KEYS.INFO_SCENE))this.scene.pause(SCENE_KEYS.INFO_SCENE);
    }
    updateTimer(){
        let TD = this.getTime();
        this.timeDisplay.text = (TD[0]+":"+Math.floor(TD[1]/10)+TD[1]%10);
        if (this.timer<11000) this.timeDisplay.setColor(PALETTE_RGBA.RedAlert);
        else if (this.timer<31000) this.timeDisplay.setColor(PALETTE_RGBA.AmberAlert);
        else if (this.timer<61000) this.timeDisplay.setColor(PALETTE_RGBA.YellowAlert);
        else if (this.timer<181000) this.timeDisplay.setColor(PALETTE_RGBA.White);
        else this.timeDisplay.setColor(PALETTE_RGBA.Teal);
    }
    createInfoBox(posx,posy,infoEntry){
        new InfoBox({
            scene: this,
            x: posx,
            y: posy,
            width: 400,
            height: 160,
            info:infoEntry,
            clickCallback: ()=>{this.expandInfo(infoEntry)}
        })
    }
    expandInfo(infoEntry){
        this.scene.launch(SCENE_KEYS.INFO_SCENE,infoEntry);
    }

}