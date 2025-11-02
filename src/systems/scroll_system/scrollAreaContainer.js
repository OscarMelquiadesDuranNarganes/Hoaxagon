import { PostBoxObject } from '../post_system/postBoxObject.js';

export class ScrollAreaContainer extends Phaser.GameObjects.Container {

    /**
     * @type {number}
     */
    _width;

    /**
     * @type {number}
     */
    _height;

    /**
     * @type {Phaser.GameObjects.Container}
     */
    _viewportAreaContainer;

    /**
     * @type {Phaser.GameObjects.Container}
     */
    _contentAreaContainer;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(scene, positionX, positionY, width, height) {
        super(scene, positionX, positionY);

        this._width = width;
        this._height = height;

        this._viewportAreaContainer = scene.add.container(positionX, positionY);

        this._contentAreaContainer = scene.add.container(0, -120);

        // The Content Container is inside the Viewport Container and it is the one that moves
        this._viewportAreaContainer.add(this._contentAreaContainer);

        // temp<<<<<<<<<<<<<<<<<
        for(let i = 0; i < 10; i++) {
            this._contentAreaContainer.add(new PostBoxObject(scene, 0, 150*i, "Textito\nDel bueno", 400));
        }
        // <<<<<<<<<<<<<<<<<<<<<

        // Definition of the mask that will cut the content out of the bounds of the viewport
        this.setSize(width, height);

        scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const scrollAmount = deltaY * 0.5;

            let newY = this._contentAreaContainer.y - scrollAmount;

            let contentHeight =  this._contentAreaContainer.getBounds().height;

            if(newY < -contentHeight + height) newY = -contentHeight + height;
            if(newY > 0) newY = 0;

            this._contentAreaContainer.y = newY;
        });
    }

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    setSize(width, height) {
        const maskShape = this.scene.make.graphics({});
        maskShape.fillRect(this.x, this.y, width, height);

        const mask = maskShape.createGeometryMask();

        this._viewportAreaContainer.setMask(mask);
    }
}