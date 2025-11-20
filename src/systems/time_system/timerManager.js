import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_RGBA } from "../../utils/Palette.js";
import { IMAGE_KEYS } from '../../utils/CommonKeys.js';

export class TimerManager {

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {boolean}
     */
    enabled = true;

    /**
     * The variable that keeps track of the timer in milliseconds.
     * @type {number}
     */
    timer;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    timeDisplay;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    timeDisplayShadow;

    /**
     * To facilitate moving the UI elements in the scene.
     * @type {Phaser.GameObjects.Container}
     */
    uiElementsConatiner;

    constructor(scene, initialTimeMilliseconds) {
        console.assert(scene instanceof Phaser.Scene, "ScoreManager: scene is not a Phaser.Scene");
        
        this.scene = scene;
        this.timer = initialTimeMilliseconds;

        const clockImage = this.scene.add.image(25, 80, IMAGE_KEYS.CHRONO_CLOCK)
            .setOrigin(0, 0.5);

        this.timeDisplayShadow = this.scene.add.text(
            175, 80,
            '', 
            TEXT_CONFIG.Heading
        )
        .setColor(PALETTE_RGBA.TranslucentGrey)
        .setOrigin(0, 0.5);

        this.timeDisplay = this.scene.add.text(
            170, 75,
            '', 
            TEXT_CONFIG.Heading
        )
        .setColor(PALETTE_RGBA.White)
        .setOrigin(0, 0.5);

        this.uiElementsConatiner = this.scene.add.container(
            45, 25, 
            [clockImage, this.timeDisplayShadow, this.timeDisplay]
        )
        .setScale(0.9, 0.9);
        
        this.updateTimer();
    }

    update(time, dt) {
        if(this.enabled)
            this.addTimeMilliseconds(-dt);    
    }
    
    /**
     * Updates the timer display to match the remaining time.
     */
    updateTimer() {
        let TD = this.getTime();
        const minutes = TD[0];
        const seconds = (Math.floor(TD[1] / 10)).toString() + (TD[1] % 10).toString();

        const newText = `${minutes}:${seconds}`;

        // Only update and animate if the text has changed
        if (newText !== this.timeDisplay.text) {
            this.timeDisplay.text = newText;
            this.timeDisplayShadow.text = newText;

            // Avoid tween collision
            this.scene.tweens.killTweensOf([this.timeDisplay, this.timeDisplayShadow]);

            this.scene.tweens.chain({
                targets: [this.timeDisplay, this.timeDisplayShadow],
                ease: 'Power1',
                duration: 20,
                loop: 0,
                tweens: [
                    { scaleY: 1.02, scaleX: 1.02, duration: 100 },
                    { scaleY: 1,   scaleX: 1,   duration: 100 }
                ]
            });
        }

        if (this.timer < 11000) this.timeDisplay.setColor(PALETTE_RGBA.RedAlert);
        else if (this.timer < 31000) this.timeDisplay.setColor(PALETTE_RGBA.AmberAlert);
        else if (this.timer < 61000) this.timeDisplay.setColor(PALETTE_RGBA.YellowAlert);
        else if (this.timer < 181000) this.timeDisplay.setColor(PALETTE_RGBA.White);
        else this.timeDisplay.setColor(PALETTE_RGBA.Teal);
    }

    /**
     * Returns an array with the number of minutes and seconds remaining on the timer.
     * @returns {Array<number>}
     */
    getTime() {
        let seconds = this.timer / 1000;
        return [Math.floor(seconds / 60), Math.floor(seconds % 60)];
    }

    /**
     * Adds the specified time to the scene timer, in milliseconds.
     * @param {number} time
     */
    addTimeMilliseconds(time) {
        this.timer = Math.max(0, this.timer += time);
        this.updateTimer();
    }

    /**
     * Adds the specified time to the scene timer, in seconds.
     * @param {number} time
     */
    addTimeSeconds(time) {
        this.timer = Math.max(0, this.timer += (time * 1000));
        this.updateTimer();
    }

    /**
     * Enables or disables the timer's function and display.
     * @param {boolean} enabled
     */
    setEnabled(enabled){
        this.enabled = enabled;
        this.uiElementsConatiner.setVisible(this.enabled);
    }
}