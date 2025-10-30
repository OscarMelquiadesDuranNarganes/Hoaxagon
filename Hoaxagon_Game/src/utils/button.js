export default class Button extends Phaser.GameObjects.Rectangle{
    /**
     * 
     * @param {*} config {scene,
            x, y,
            width, height,
            color,
            clickCallback?,
            hoverInCallback?,
            hoverOutCallback?,
            text?}
     */
    constructor(config){
        super(config.scene,config.x,config.y,config.width,config.height,config.color,1);
        this.scene.add.existing(this);
        this.setInteractive();
        if (config.clickCallback) this.on("pointerdown",config.clickCallback,this.scene);
        if (config.hoverInCallback) this.on("pointerover",config.hoverInCallback,this.scene);
        if (config.hoverOutCallback) this.on("pointerout",config.hoverInCallback,this.scene);
        if (config.text) this.scene.add.text(x,y,config.text);
    }
}