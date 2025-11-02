import { PALETTE_HEX, PALETTE_RGBA } from "./Palette.js";
import { TEXT_CONFIG } from "./textConfigs.js";
export default class infoBox extends Phaser.GameObjects.Container{
    /**
     * 
     * @param {*} config {scene,
            x, y,
            width, height,
            color,
            clickCallback?,
            hoverInCallback?,
            hoverOutCallback?,
            text?,
            textConfig?,
            textColor?}
     */
    constructor(config){
        super(config.scene,config.x,config.y);
        this.setSize(config.width,config.height);
        this.scene.add.existing(this);
        this.add(this.scene.add.rectangle(0,0,config.width,config.height,config.color,1));
        this.setInteractive();
        if (config.clickCallback) this.on("pointerdown",config.clickCallback,this.scene);
        if (config.hoverInCallback) this.on("pointerover",config.hoverInCallback,this.scene);
        if (config.hoverOutCallback) this.on("pointerout",config.hoverInCallback,this.scene);
        if (config.title) this.add.text(0,0,config.text,TEXT_CONFIG.SubHeading).setTint(config.textColor).setOrigin(0.0);
        
    }
}