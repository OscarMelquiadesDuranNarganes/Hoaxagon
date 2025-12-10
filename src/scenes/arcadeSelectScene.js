import { SCENE_KEYS } from "../utils/CommonKeys.js";
import { PALETTE_RGBA,PALETTE_HEX } from "../utils/Palette.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import Button from "../utils/button.js";

export default class ArcadeSelectScreen extends Phaser.Scene{
    constructor(){
        super(SCENE_KEYS.ARCADE_SELECT_SCENE);
    }
    create(){
            this.cameras.main.setBackgroundColor(PALETTE_RGBA.MiddleGrey);
    
            let { width, height } = this.sys.game.canvas;
    
            this.add.text(width/2,100,"Modo de juego",TEXT_CONFIG.Heading2).setColor(PALETTE_RGBA.White).setOrigin(0.5,0.5);
    
            this.arcadeButton = new Button({
                scene:this,
                x: width/2-250, y: height/2,
                width: 400, height:150,
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
                text: "ARCADE",
                textConfig:TEXT_CONFIG.Heading3,
                textColor: PALETTE_RGBA.DarkerGrey
            });
            this.tutorialButton = new Button({
                scene:this,
                x: width/2+250, y: height/2,
                width: 400, height:150,
                color: PALETTE_HEX.White,
                clickCallback: () => {
                    this.scene.start(
                       /* SCENE_KEYS.GAME_SCENE,
                        {
                            fallacies:[
                            ]
                        }*/
                       SCENE_KEYS.TUTORIAL_SCENE
                    )
                },
                text: "TUTORIAL",
                textConfig:TEXT_CONFIG.Heading3,
                textColor: PALETTE_RGBA.DarkerGrey
            });
    }

}