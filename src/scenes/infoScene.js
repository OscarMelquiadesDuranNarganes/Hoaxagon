import { KEYBINDS } from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX,PALETTE_RGBA } from "../utils/Palette.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { InfoBox } from "../utils/infoBox.js";
//import SIZES from "../utils/Sizes.js";

export const INFO_TYPE = {
    FLASH_CARD: "FLASH_CARD",
    NEW_TYPE_INFO: "NEW_TYPE_INFO"
};

export default class InfoScene extends Phaser.Scene {

    constructor(){
        super(SCENE_KEYS.INFO_SCENE);
    }

    create(config) {
        const { width, height } = this.scale; 

        const blocker = this.add.rectangle(
            width / 2, height / 2,
            width, height
        );

        blocker.setInteractive();

        this.cameras.main.setBackgroundColor(PALETTE_HEX.DarkGrey);
        this.cameras.main.backgroundColor.alpha = 0;

        this.tweens.add({
            targets: this.cameras.main.backgroundColor, 
    
            alpha: {
                from: 0,    // Transparente (0)
                to: 140     // Opaco (255)
            },
            
            duration: 200,
            repeat: 0,
            onComplete: () => {
                this.buildInfoBox(config.fallacyObj, config.infoType);
            },
        });
        if (config.infoType === INFO_TYPE.NEW_TYPE_INFO) 
            this.scene.pause(SCENE_KEYS.GAME_SCENE);
    }

    buildInfoBox(fallacyObj, infoType) {
        console.log(fallacyObj);
        const width = this.sys.game.canvas.width;
        const height = this.sys.game.canvas.height;

        if(infoType === INFO_TYPE.FLASH_CARD) {
            new InfoBox({
                scene: this,
                x: width / 2, y: height / 2,
                width: 600, height: 400,
                info: fallacyObj,
                expanded: true
            });
            
            this.add.text(
                width / 2 - 300, height / 2 + 210,
                "Pulsa en cualquier lugar para continuar.",
                TEXT_CONFIG.ParagraphBold
            )
            .setColor(PALETTE_RGBA.White);

            this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {this.scene.stop()});
            return;
        }

        if(infoType === INFO_TYPE.NEW_TYPE_INFO) {
            this.add.text(
                width / 2, height / 2 - 270,
                "NUEVA FALACIA",
                TEXT_CONFIG.Heading2
            )
            .setColor(PALETTE_RGBA.White)
            .setOrigin(0.5, 0);

            new InfoBox({
                scene: this,
                x: width / 2, y: height / 2,
                width: 600, height: 400,
                info: fallacyObj,
                expanded: true
            });

            const confirmButton = this.add.text(
                width / 2 - 290, height / 2 + 230,
                "¡VALE!",
                TEXT_CONFIG.SubHeading
            )
            .setColor(PALETTE_RGBA.White);

            confirmButton.setInteractive();

            confirmButton.on(Phaser.Input.Events.POINTER_DOWN, () => {this.scene.resume(SCENE_KEYS.GAME_SCENE);this.scene.stop();});
        }
    }
}