import { PALETTE_RGBA } from "../../utils/Palette.js";

export class WordBlock extends Phaser.GameObjects.Text {
    
    /**
     * Id of the sentence that contains the word.
     * @type {number}
     */
    sentenceID = 0;

    /**
     * @type {boolean}
     */
    isSelected = false;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} sentenceID
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {String} text 
     * @param {String} _fontFamily 
     * @param {number} _fontSize 
     */
    constructor(scene, positionX, positionY, text, sentenceID, _fontFamily, _fontSize) {
        super(scene, positionX, positionY, text, {
            fontFamily: _fontFamily, 
            fontSize: _fontSize,
            color: '#000000'
        });

        this.sentenceID = sentenceID;
        scene.add.existing(this);

        this.setInteractive();
    }

    /**
     * Sets the WordBlock as selected or not, if the object is selected it gets highlighted.
     * @param {boolean} value 
     */
    setSelectionState(value) {
        this.isSelected = value;
        
        if(this.isSelected)
            this.setBackgroundColor(PALETTE_RGBA.YellowAlert);
        else
            this.setBackgroundColor(PALETTE_RGBA.Void);
    }
}