import Button from "./button.js";
export default class ImageButton extends Button{
        /**
     * 
     * @param {*} config {scene,
            x, y,
            width, height,
            color,
            imageKey,
            clickCallback?,
            hoverInCallback?,
            hoverOutCallback?}
     */
    constructor(config){
        var super_config = {
            scene: config.scene,
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            color: config.color,
            clickCallback: config.clickCallback,
            hoverInCallback: config.hoverInCallback,
            hoverOutCallback: config.hoverOutCallback
        }
        super(super_config);
        this.buttonImage = this.add(this.scene.add.image(0,0,config.imageKey).setOrigin(0.5,0.5));
    }
    setImageScale(valuex,valuey){
        if (!valuey) valuey = valuex
        this.buttonImage.setScale(valuex,valuey);
    }
}