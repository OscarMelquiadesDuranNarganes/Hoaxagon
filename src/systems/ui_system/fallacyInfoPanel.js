import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_HEX, PALETTE_RGBA } from "../../utils/Palette.js";
import { ScrollAreaContainer } from "../scroll_system/scrollAreaContainer.js";

import { PostBoxObject } from '../post_system/postBoxObject.js';

const SIZES = {
    TITLE_LABEL_HEIGHT: 65
}

export class FallacyInfoPanel extends Phaser.GameObjects.Container {

    /**
     * @type {ScrollAreaContainer}
     */
    scrollArea;

    /**
     * @type {Array<InfoBox>}
     */
    infoBoxes = new Array();

    /**
     * The currently selected InfoBox.
     * @type {InfoBox}
     */
    selectedInfoBox = null;

    /**
     * @type {function(InfoBox)}
     */
    onInfoBoxClicked = function(infoBox) {};

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

        scene.add.existing(this);

        this.add(
            scene.add.rectangle(0, 0, width, SIZES.TITLE_LABEL_HEIGHT, PALETTE_HEX.White, 1)
            .setOrigin(0, 0)
        );

        this.add(
            scene.add.text(35, 20, "INFO", TEXT_CONFIG.SubHeading)
            .setOrigin(0, 0)
            .setColor(PALETTE_RGBA.DarkerGrey)
        );

        this.scrollArea = new ScrollAreaContainer(
            scene, positionX, positionY + SIZES.TITLE_LABEL_HEIGHT + 10, 
            width, height - SIZES.TITLE_LABEL_HEIGHT
        );
    }

    /**
     * 
     * @param {Phaser.GameObjects.Container} infoBox 
     */
    addInfoBox(infoBox) {
        this.scrollArea.addGameObject(infoBox, infoBox.width / 2, infoBox.height / 2);
        
        this.infoBoxes.push(infoBox);

        // Add click event listener to the info box
        infoBox.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.onInfoBoxClicked(infoBox);
        });
    }

    setInfoBoxSelected(infoBox, selected) {
        infoBox.setSelectionState(selected);

        if(selected) {
            this.selectedInfoBox = infoBox;
            return;
        }

        if(this.selectedInfoBox === infoBox) {
            this.selectedInfoBox = null;
        }
    }

    clearBoxesSeleciton() {
        this.infoBoxes.forEach((infoBox) => {
            this.setInfoBoxSelected(infoBox, false);
        });
    }

    /**
     * 
     * @returns {boolean}
     */
    containsSelectedInfoBox() {
        return this.selectedInfoBox !== null;
    }
}