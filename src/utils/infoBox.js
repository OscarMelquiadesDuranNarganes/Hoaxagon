import { PALETTE_HEX, PALETTE_RGBA } from "./Palette.js";
import { TEXT_CONFIG } from "./textConfigs.js";
import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS } from './CommonKeys.js'
import { INFO_TYPE } from '../scenes/infoScene.js'

export class InfoBox extends Phaser.GameObjects.Container {
    /**
    * @type {Fallacy}
    */
    fallacyObj;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    boxRectangle;

    /**
     * Whether the info box is selected or not.
     * @type {boolean}
     */
    isSelected = false;

    /**
     * 
     * @param {*} config {scene,
            x, y,
            width, height,
            info,
            expanded}
     */
    constructor(config){
        super(config.scene, config.x, config.y);
        this.fallacyObj = config.info;
        
        this.setSize(config.width, config.height);
        this.scene.add.existing(this);

        // Shadow rectangle
        this.add(this.scene.add.rectangle(10, 10, config.width, config.height, PALETTE_HEX.DarkerGrey, 0.5));

        // Main rectangle
        this.boxRectangle = this.scene.add.rectangle(0, 0, config.width, config.height, PALETTE_HEX.White, 1);
        this.add(this.boxRectangle);

        this.setInteractive();

        // Heading
        this.add(
            this.scene.add.text(
                -this.width / 2 + 5, -this.height / 2 + 10,
                this.fallacyObj.name,
                TEXT_CONFIG.SubHeading
            )
            .setColor(PALETTE_RGBA.DarkerGrey)
            .setOrigin(0.0)
            .setWordWrapWidth(this.width-10)
        );
        
        // Description
        this.add(
            this.scene.add.text(
                -this.width / 2 + 10, -this.height / 2 + 36,
                config.expanded ? this.fallacyObj.long_desc : this.fallacyObj.description,
                TEXT_CONFIG.Paragraph
            )
            .setColor(PALETTE_RGBA.DarkerGrey)
            .setOrigin(0.0)
            .setWordWrapWidth(this.width-20)
        );

        if (config.clickCallback) 
            this.on(Phaser.Input.Events.POINTER_DOWN, config.clickCallback, this.scene);
        if (config.hoverInCallback) 
            this.on(Phaser.Input.Events.POINTER_OVER, config.hoverInCallback, this.scene);
        if (config.hoverOutCallback) 
            this.on(Phaser.Input.Events.POINTER_OUT, config.hoverOutCallback, this.scene);
    }
    
    /*
     * Clean up event listeners and children.
     */
    destroy(fromScene) {
        // Eliminate event listeners
        if (typeof this.off === 'function') {
            this.off(Phaser.Input.Events.POINTER_DOWN);
            this.off(Phaser.Input.Events.POINTER_OVER);
            this.off(Phaser.Input.Events.POINTER_OUT);
        }

        super.destroy(fromScene);
    }

    /**
     * Activates InfoScene according to the clicked infobox.
     */
    expandInfo() {
        let mousey = this.scene.game.input.mousePointer.y;
        if (!this.scene.scene.isActive(SCENE_KEYS.INFO_SCENE) && mousey > 360) 
            this.scene.scene.launch(SCENE_KEYS.INFO_SCENE, {
                fallacyObj: this.fallacyObj,
                infoType: INFO_TYPE.FLASH_CARD
            });
    }

    /**
     * Sets the InfoBox as selected or not, if the object is selected it gets highlighted.
     * @param {boolean} value 
     */
    setSelectionState(value) {
        this.isSelected = value;
        
        if(this.isSelected)
            this.boxRectangle.setFillStyle(PALETTE_HEX.YellowAlert);
        else
            this.boxRectangle.setFillStyle(PALETTE_HEX.White);
    }
}