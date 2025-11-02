import { KEYBINDS } from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { PALETTE_HEX,PALETTE_RGBA } from "../utils/Palette.js";
import Button from "../utils/button.js";

//import SIZES from "../utils/Sizes.js";
export default class PauseScene extends Phaser.Scene{
    textsize = 72;
    exitbutton;
    constructor(){
        super(SCENE_KEYS.PAUSE_SCENE);
    }
    preload() {
        
    }
    init(){
    
    }
    create() {
        this.cameras.main.setBackgroundColor(PALETTE_RGBA.TranslucentGrey);
        let { width, height } = this.sys.game.canvas;
        this.SCREENX = width;
        this.SCREENY = height;
        console.log(this.SCREENX);
        console.log(this.SCREENY);
                this.add.text(this.SCREENX/2-215,this.SCREENY/2-50,"PAUSED",TEXT_CONFIG.Heading).setColor(PALETTE_RGBA.White);
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
        this.exitbutton = new Button({scene:this,
            x:this.SCREENX/2,y:this.SCREENY/2+50,
            width:200,height:40,
            color:PALETTE_HEX.White,
            clickCallback:this.quitToMenu,
            text:"QUIT",
            textConfig: TEXT_CONFIG.SubHeading,
            textColor: PALETTE_RGBA.DarkerGrey});
    }
    update(time, dt) {
        //#region input
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.PAUSE)){
            this.scene.resume(SCENE_KEYS.GAME_SCENE);
            if (this.scene.isActive(SCENE_KEYS.INFO_SCENE)) this.scene.resume(SCENE_KEYS.INFO_SCENE);
            this.scene.stop();
        }
        //#endregion
    }
    quitToMenu(){
        console.log("LoaderOut");
        this.scene.stop(SCENE_KEYS.GAME_SCENE);
        this.scene.stop(SCENE_KEYS.INFO_SCENE);
        this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE);
    }
}