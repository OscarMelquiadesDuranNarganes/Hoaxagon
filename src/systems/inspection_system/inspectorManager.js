import { PostManager } from "../post_system/postManager.js";
import { FallacyInfoPanel } from "../ui_system/fallacyInfoPanel.js";
import { InfoBox } from "../../utils/infoBox.js";
import { IMAGE_KEYS } from "../../utils/CommonKeys.js";
import { WordBlock } from "../post_system/wordBlock.js";
import { PALETTE_HEX } from "../../utils/Palette.js";

export class InspectorManager {

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {PostManager}
     */
    postManager;

    /**
     * @type {FallacyInfoPanel}
     */
    infoPanel;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    inspectorModeButton;

    /**
     * @type {boolean}
     */
    inspectionActive = false;

    /**
     * @type {function}
     */
    _wordBlockClickHandler;

    /**
     * @param {Phaser.Scene} scene 
     * @param {FallacyInfoPanel} infoPanel 
     * @param {PostManager} postManager 
     */
    constructor(scene, infoPanel, postManager, inspectorModeButton) {
        console.assert(scene instanceof Phaser.Scene, "InspectorManager: scene is not a Phaser.Scene");
        console.assert(infoPanel instanceof FallacyInfoPanel, "InspectorManager: infoPanel is not a FallacyInfoPanel");
        console.assert(postManager instanceof PostManager, "InspectorManager: postManager is not a PostManager");

        this.scene = scene;
        this.infoPanel = infoPanel;
        this.postManager = postManager;

        const SCREEN_HEIGHT = this.scene.sys.game.canvas.height;

        // Inspector Button Settings
        this.inspectorModeButton = this.scene.add.image(100, SCREEN_HEIGHT - 180, IMAGE_KEYS.INSPECTOR_BUTTON);
        this.inspectorModeButton.setInteractive();
        this.inspectorModeButton.on(Phaser.Input.Events.POINTER_UP, () => { 
            this.handleInspectorButtonClick() 
        });

        // To handle when a `WordBlock` is clicked

        this._wordBlockClickHandler = (pointer, game_objects) => {
            game_objects.forEach((game_object) => this.handleWordBlockClick(game_object));
        };

        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this._wordBlockClickHandler);

        // To handle when an info box is clicked in the info panel
        this.infoPanel.onInfoBoxClicked = this.handleInfoBoxClick.bind(this);
    }

    destroy(fromScene) {
        // Remove registered event handler
        if (this._wordBlockClickHandler && this.scene && this.scene.input) {
            this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this._wordBlockClickHandler);
            this._wordBlockClickHandler = null;
        }
        
        // Call the parent's destroy method to clean up the container's children
        super.destroy(fromScene);
    }

    /**
     * Handles the click event on an InfoBox.
     * @param {InfoBox} infoBox 
     */
    handleInfoBoxClick(infoBox) {
        if (!this.inspectionActive) {
            infoBox.expandInfo();
            return;
        }

        // Deselect all info boxes
        this.infoPanel.infoBoxes.forEach((infoBox) => {
            infoBox.setSelectionState(false);
        });

        // Select clicked info box
        infoBox.setSelectionState(!infoBox.isSelected);
    }

    /**
     * Gets a sentence highlighted if the user clicks on one `WordBlock` that forms part of the
     * sentence.
     * @param {Phaser.GameObjects} clickedObject 
     */
    handleWordBlockClick(clickedObject) {
        if (!this.inspectionActive) return;
        if(!(clickedObject instanceof WordBlock)) return;

        this.postManager.currentPostObject.wordBlockContainer.selectSentence(clickedObject.sentenceID);
    }

    handleInspectorButtonClick() {
        this.inspectionActive = !this.inspectionActive;

        if(this.inspectionActive)
            this.inspectorModeButton.setTint(PALETTE_HEX.YellowAlert);
        else
            this.inspectorModeButton.setTint(PALETTE_HEX.White);

        // Deselect all info boxes
        this.infoPanel.infoBoxes.forEach((infoBox) => {
            infoBox.setSelectionState(false);
        });

        this.postManager.currentPostObject.wordBlockContainer.deselectAllWordBlocks();
    }
}