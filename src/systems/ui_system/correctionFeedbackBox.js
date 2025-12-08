import { PostBoxObject } from "../post_system/postBoxObject.js";
import { PALETTE_HEX, PALETTE_RGBA } from "../../utils/Palette.js";
import { EvaluatedPostInfo } from "../post_system/evaluatedPostInfo.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";

/**
 * Box that shows correction feedback to the player.
 */
export class CorrectionFeedbackBox extends Phaser.GameObjects.Container {

    /**
     * @type {EvaluatedPostInfo}
     */
    evaluatedPostInfo;

    /**
     * @type {PostBoxObject}
     */
    postBoxObject;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    _mainRectangle;

    /**
     * @type {Phaser.GameObjects.Rectangle}
     */
    _shadowRectangle;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width
     * @param {EvaluatedPostInfo} evaluatedPostInfo 
     */
    constructor(scene, x, y, width, evaluatedPostInfo) {
        console.assert(evaluatedPostInfo instanceof EvaluatedPostInfo, "CorrectionFeedbackBox: evaluatedPostInfo must ba a EvaluatedPostInfo object");
        
        super(scene, x, y);
        this.scene.add.existing(this);
        
        this.evaluatedPostInfo = evaluatedPostInfo;

        // Shadow rectangle
        this._shadowRectangle = this.scene.add.rectangle(10, 10, width, 0, PALETTE_HEX.DarkerGrey, 0.5)
            .setOrigin(0, 0);
            
        this.add(this._shadowRectangle);

        // Main rectangle
        const boxColor = this.evaluatedPostInfo.playerSuccessed ? PALETTE_HEX.LightGreen : PALETTE_HEX.LightRed;

        this._mainRectangle = this.scene.add.rectangle(0, 0, width, 0, boxColor, 1);
        this._mainRectangle.setOrigin(0, 0);
        this.add(this._mainRectangle);

        let contentHeight = 10;

        // Player's decision
        let decision = "Has marcado el post como ";
        decision += this.evaluatedPostInfo.postAccepted ? "CORRECTO." : "FALAZ.";
        
        const playerDecisionText = this.scene.add.text(
            10, contentHeight,
            decision,
            TEXT_CONFIG.Paragraph
        )
        .setTint(PALETTE_RGBA.DarkerGrey)
        .setOrigin(0, 0)
        .setWordWrapWidth(width - 20);
        
        this.add(playerDecisionText);

        contentHeight += playerDecisionText.getBounds().height + 10;

        // PostBoxObject
        this.postBoxObject = new PostBoxObject(
            scene,
            width * 0.1, contentHeight,
            this.evaluatedPostInfo.postObjectDef.text,
            width * 0.8
        );
        this.add(this.postBoxObject);

        if(this.evaluatedPostInfo.playerSuccessed) {        // What did the player mark?
            this.postBoxObject.wordBlockContainer.selectSentence(this.evaluatedPostInfo.sentenceSelectedID);
        }
        else {
            this.postBoxObject.wordBlockContainer.selectSentence(this.evaluatedPostInfo.sentenceSelectedID, PALETTE_RGBA.RedAlert);
            this.postBoxObject.wordBlockContainer.selectSentence(this.evaluatedPostInfo.postObjectDef.fallaciousSentenceID, PALETTE_RGBA.Teal);
        }

        contentHeight += this.postBoxObject.getBounds().height + 10;

        // Aclaration text
        let aclarationText = "";

        if(this.evaluatedPostInfo.selectedFallacyObj) {
            aclarationText += 
                `Has seleccionado la falacia: ${this.evaluatedPostInfo.selectedFallacyObj.name}.
                ${this.evaluatedPostInfo.selectedFallacyObj.long_desc}`;
        }
        else {
            aclarationText += "No lo has asociado a ninguna falacia.";
        }

        if(this.evaluatedPostInfo.postObjectDef.fallacyType !== "NONE") {
            aclarationText += `\nLa falacia correcta era: ${this.evaluatedPostInfo.postObjectDef.fallacyType}.`;
        }
        else {
            aclarationText += `\nEl post no contenía ninguna falacia.`;
        }

        const aclarationTextBox = this.scene.add.text(
            10, contentHeight,
            aclarationText,
            TEXT_CONFIG.Paragraph
        )
        .setTint(PALETTE_RGBA.DarkerGrey)
        .setOrigin(0, 0)
        .setWordWrapWidth(width - 20);
        
        this.add(aclarationTextBox);

        contentHeight += aclarationTextBox.getBounds().height + 10;

        // Adjusting the box to its content
        this._mainRectangle.setSize(this._mainRectangle.width, contentHeight);
        this._shadowRectangle.setSize(this._mainRectangle.width, contentHeight);
    }

}