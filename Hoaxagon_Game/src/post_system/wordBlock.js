export class WordBlock extends Phaser.GameObjects.Text {
    
    /**
     * Id of the sentence that contains the word.
     * @type {number}
     */
    sentenceID = 0;

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
        });

        this.sentenceID = sentenceID;
        scene.add.existing(this);

        this.setInteractive();

        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.setBackgroundColor('#c3c327ff');
            console.log(this.sentenceID);
        });
    }

    
}