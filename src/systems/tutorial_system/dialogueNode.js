import { PALETTE_HEX, PALETTE_RGBA } from "../../utils/Palette.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";

export default class DialogueNode extends Phaser.GameObjects.Container{
    
    links = [];

    constructor(config){
        super(config.scene,config.x,config.y);
        this.setSize(400,300);
        this.bg = this.add(this.scene.add.rectangle(0,0,this.width,this.height,PALETTE_HEX.White));
        this.text = this.add(this.scene.add.text(0,0,config.text,TEXT_CONFIG.Paragraph).setColor(PALETTE_RGBA.Black).setWordWrapWidth(400))
        this.prompt = config.prompt;
    }
}