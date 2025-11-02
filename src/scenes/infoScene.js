import { KEYBINDS } from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX,PALETTE_RGBA } from "../utils/Palette.js";
import Button from "../utils/button.js";
import InfoBox from "../utils/infoBox.js";
import { INFO_DATABASE } from "../utils/infoDatabase.js";

//import SIZES from "../utils/Sizes.js";
export default class InfoScene extends Phaser.Scene{
    textsize = 72;
    exitbutton;
    constructor(){
        super(SCENE_KEYS.INFO_SCENE);
    }
    preload() {
        
    }
    init(){
    
    }
    create(infoEntry) {
        this.cameras.main.setBackgroundColor(PALETTE_RGBA.TranslucentGrey);
        let { width, height } = this.sys.game.canvas;
        this.SCREENX = width;
        this.SCREENY = height;
        new InfoBox({scene:this,x:width/2,y: height/2,width: 600, height: 400,info:infoEntry,expanded:true})
        this.input.on('pointerdown', () => {this.scene.stop()});
    }
}