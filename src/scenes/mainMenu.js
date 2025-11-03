import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
import Button from "../utils/button.js";
import ImageButton from '../utils/imageButton.js';
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { PALETTE_HEX } from "../utils/Palette.js";
import { PALETTE_RGBA } from "../utils/Palette.js";

export default class MainMenu extends Phaser.Scene{
    /**
    * @type {Phaser.GameObjects.Text}
    */
    title;

    /**
    * @type {Button}
    */
    playButton;

    /**
    * @type {Button}
    */
    settingsButton;

    /**
    * @type {Button}
    */
    trainingButton;

    /**
    * @type {Button}
    */
    exitButton;
    
    constructor(){
        super(SCENE_KEYS.MAIN_MENU_SCENE);
    }
    preload() {
        
    }
    init(){

    }
    create(){
        this.cameras.main.setBackgroundColor(PALETTE_RGBA.MiddleGrey);
        let { width, height } = this.sys.game.canvas;
        this.add.text(width/2,100,"HOAXAGON",TEXT_CONFIG.Heading).setColor(PALETTE_RGBA.White).setOrigin(0.5,0.5)
        this.playButton = new Button({scene:this,
            x: width/2, y: height/2,
            width: 300, height:300,
            color: PALETTE_HEX.White,
            clickCallback: ()=>{this.scene.start(SCENE_KEYS.GAME_SCENE)},
            text: "PLAY",
            textConfig:TEXT_CONFIG.Heading,
            textColor: PALETTE_RGBA.DarkerGrey});
    }
}