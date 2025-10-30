import { KEYBINDS } from "../utils/Keybinds.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import Button from "../utils/button.js";
//import SIZES from "../utils/Sizes.js";
export default class PauseScene extends Phaser.Scene{
    textsize = 72;
    exitbutton;
    constructor(){
        super({key: "pauseScene"});
    }
    preload() {
        
    }
    init(){
    
    }
    create() {
        let { width, height } = this.sys.game.canvas;
        this.SCREENX = width;
        this.SCREENY = height;
        console.log(this.SCREENX);
        console.log(this.SCREENY);
                this.add.text(this.SCREENX/2-215,this.SCREENY/2-50,"PAUSED",TEXT_CONFIG.Heading).setTint(0xffffff);
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);
        this.exitbutton = new Button({scene:this,
            x:this.SCREENX/2,y:this.SCREENY/2+50,
            width:200,height:40,
            color:0xffffff,
            clickCallback:this.quitToMenu,
            text:"QUIT",
            textConfig: TEXT_CONFIG.SubHeading,
            textColor: 0x000000});
    }
    update(time, dt) {
        //#region input
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.PAUSE)){
            this.scene.resume("gameScene");
            this.scene.stop();
        }
        //#endregion
    }
    quitToMenu(){
        console.log("LoaderOut");
        this.scene.stop("gameScene");
        this.scene.start("mainMenu");
    }
}