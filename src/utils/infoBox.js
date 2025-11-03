import { PALETTE_HEX, PALETTE_RGBA } from "./Palette.js";
import { TEXT_CONFIG } from "./textConfigs.js";
export default class InfoBox extends Phaser.GameObjects.Container{
    /**
    * @type {object}
    */
    entry;

    /**
     * 
     * @param {*} config {scene,
            x, y,
            width, height,
            info,
            expanded}
     */
    constructor(config){
        super(config.scene,config.x,config.y);
        this.entry = config.info;
        console.log(this.entry);

        this.setSize(config.width,config.height);
        this.scene.add.existing(this);
        this.add(this.scene.add.rectangle(10,10,config.width,config.height,PALETTE_HEX.DarkerGrey,1));
        this.add(this.scene.add.rectangle(0,0,config.width,config.height,PALETTE_HEX.White,1));
        this.setInteractive();
        this.add(this.scene.add.text(-this.width/2+5,-this.height/2+10,this.entry.name,TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.DarkerGrey).setOrigin(0.0).setWordWrapWidth(this.width-10));
        this.add(this.scene.add.text(-this.width/2+10,-this.height/2+36,config.expanded ? this.entry.long_desc : this.entry.description,TEXT_CONFIG.Paragraph).setColor(PALETTE_RGBA.DarkerGrey).setOrigin(0.0).setWordWrapWidth(this.width-20));
        if (config.clickCallback) this.on("pointerdown",config.clickCallback,this.scene);
        if (config.hoverInCallback) this.on("pointerover",config.hoverInCallback,this.scene);
        if (config.hoverOutCallback) this.on("pointerout",config.hoverInCallback,this.scene);
    }
    //TODO: Inspect mode interaction
}