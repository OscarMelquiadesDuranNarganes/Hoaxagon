import { IMAGE_KEYS } from '../../utils/CommonKeys.js'
import { PALETTE_RGBA } from '../../utils/Palette.js';
import { TEXT_CONFIG } from '../../utils/textConfigs.js';
import { WordBlockContainer } from './wordBlockContainer.js'

const NINE_SLICE_DIMENSIONS = {
    WIDTH: 686,
    HEIGHT: 411,
    LEFT_WIDTH: 20,
    RIGHT_WIDTH: 20,
    TOP_WIDTH: 20,
    BOTTOM_WIDTH: 48
};

const REALATIVE_POSITIONS = {
    PHOTO_X: 10,
    PHOTO_Y: 10,
    WORD_BLOCK_CONTAINER_X: 10,
    WORD_BLOCK_CONTAINER_Y: 30,
};

export class PostBoxObject extends Phaser.GameObjects.Container {

    /**
     * @type {Phaser.GameObjects.NineSlice}
     */
    boxNineSlice;

    /**
     * @type {WordBlockContainer}
     */
    wordBlockContainer;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} positionX 
     * @param {number} positionY
     * @param {String} text  
     * @param {number} width 
     */
    constructor(scene, positionX, positionY, text, width, name) {
        super(scene, positionX, positionY);

        scene.add.existing(this);


        this.boxNineSlice = scene.add.nineslice(
            0, 0, 
            IMAGE_KEYS.TEMP_POST_CONTAINER, null, 
            NINE_SLICE_DIMENSIONS.WIDTH, NINE_SLICE_DIMENSIONS.HEIGHT,
            NINE_SLICE_DIMENSIONS.LEFT_WIDTH, NINE_SLICE_DIMENSIONS.RIGHT_WIDTH, 
            NINE_SLICE_DIMENSIONS.TOP_WIDTH, NINE_SLICE_DIMENSIONS.BOTTOM_WIDTH
        );

        this.boxNineSlice.setOrigin(0, 0);

        this.wordBlockContainer = new WordBlockContainer(
            scene, 
            REALATIVE_POSITIONS.WORD_BLOCK_CONTAINER_X,
            REALATIVE_POSITIONS.WORD_BLOCK_CONTAINER_Y,
            'Oswald-Medium', 20,
            width - REALATIVE_POSITIONS.WORD_BLOCK_CONTAINER_X * 2
        );

		this.wordBlockContainer.buildText(text);

        this.add(this.boxNineSlice)
        this.add(this.wordBlockContainer);

        this.add(scene.add.image(0,0,name).setScale(0.1,0.1));
        this.add(scene.add.text(30,5,name,TEXT_CONFIG.SubHeading2).setColor(PALETTE_RGBA.Black));

        const height = NINE_SLICE_DIMENSIONS.BOTTOM_WIDTH + NINE_SLICE_DIMENSIONS.TOP_WIDTH 
            + REALATIVE_POSITIONS.WORD_BLOCK_CONTAINER_X*2 + this.wordBlockContainer.getBounds().height;
        
        this.boxNineSlice.setSize(width, height);
    }

    // Ensure destruction of the children and the WordBlockContainer
    destroy(fromScene) {
        if (this.wordBlockContainer && typeof this.wordBlockContainer.destroy === 'function') {
            this.wordBlockContainer.destroy(fromScene);
            this.wordBlockContainer = null;
        }

        // Destroy other children that may remain
        if (this.list && this.list.length) {
            this.list.forEach(child => {
                if (child && typeof child.destroy === 'function') child.destroy(fromScene);
            });
        }

        super.destroy(fromScene);
    }
}