import { IMAGE_KEYS, SCENE_KEYS,ANIM_KEYS,JSON_KEYS } from '../utils/CommonKeys.js'
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
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);
        
        // var icosamuel = this.add.sprite(0,0,IMAGE_KEYS.ICOSAMUEL).setOrigin(0,0);
        // icosamuel.setScale(0.5,0.5);

        // icosamuel.play(ANIM_KEYS.ICOSAMUEL_RIGHT);

        this.cameras.main.setBackgroundColor(PALETTE_RGBA.MiddleGrey);

        let { width, height } = this.sys.game.canvas;

        this.add.text(width/2,100,"HOAXAGON",TEXT_CONFIG.Heading).setColor(PALETTE_RGBA.White).setOrigin(0.5,0.5)

        this.playButton = new Button({
            scene:this,
            x: width/2, y: height/2,
            width: 300, height:300,
            color: PALETTE_HEX.White,
            clickCallback: () => {
                this.scene.start(
                    SCENE_KEYS.GAME_SCENE,
                    {
                        fallacies:[
                        ]
                    }
                )
            },
            text: "PLAY",
            textConfig:TEXT_CONFIG.Heading,
            textColor: PALETTE_RGBA.DarkerGrey
        });
        this.trainingButton = new Button({
            scene:this,
            x:width/2,y:height/2+200,
            width: 300, height: 60,
            color: PALETTE_HEX.White,
            clickCallback: () => {
                this.scene.start(SCENE_KEYS.TRAINING_MENU_SCENE)
            },
            text: "TRAINING",
            textConfig:TEXT_CONFIG.SubHeading,
            textColor: PALETTE_RGBA.DarkerGrey
        })
    }
}