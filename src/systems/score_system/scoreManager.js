import { IMAGE_KEYS } from "../../utils/CommonKeys.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_RGBA } from "../../utils/Palette.js";

class Streak {

    /**
     * @type {number}
     */
    count = 0;

    /**
    * @type {number}
    */
    timeSince = 0;

    /**
    * @type {number}
    */
    BoostPity = 0;
}

export class ScoreManager {

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {number}
     */
    points = 0;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    pointsDisplay = null;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    boostDisplay = null;

    /**
     * @type {Streak}
     */
    streak = new Streak();

    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Text} pointsDisplay 
     * @param {Phaser.GameObjects.Image} boostDisplay 
     * @param {Phaser.GameObjects.Text} streakDisplay 
     */
    constructor(scene) {
        console.assert(scene instanceof Phaser.Scene, "ScoreManager: scene is not a Phaser.Scene");

        this.scene = scene;

        const SCREEN_HEIGHT = this.scene.sys.game.canvas.height;

        // Create score display
        this.pointsDisplay = this.scene.add.text(
            10, SCREEN_HEIGHT - 10,
            `Score: ${this.points}`, 
            TEXT_CONFIG.Heading2
        )
        .setColor(PALETTE_RGBA.White)
        .setOrigin(0, 1);

        // Create boost display
        this.boostDisplay = this.scene.add.image(
            320, 350, 
            IMAGE_KEYS.TEMP_SPRITE
        )
        .setVisible(false)
        .setScale(0.5, 0.5)
        .setDepth(1);

        // Create streak display
        this.streakDisplay = this.scene.add.text(
            20, SCREEN_HEIGHT - 60,
            "Combo",
            TEXT_CONFIG.SubHeading2
        )
        .setColor(PALETTE_RGBA.YellowAlert)
        .setOrigin(0, 1)
        .setVisible(false);
    }

    /**
     * Adds the specified amount to the game's score.
     * @param {number} points
     */
    addPoints(points) {
        this.points += points;
        this.updateScore();
    }

    /**
     * Updates the score display to match the current score.
     */
    updateScore() {
        this.pointsDisplay.text = `Score: ${this.points}`;
    }

    /**
     * Enforces the time limit for a Streak.
     * @param {number} dt
     */
    updateStreak(dt) {
        this.streak.timeSince += dt;

        if (this.streak.timeSince >= this.falloffTime) { 
            this.resetStreak();
        }
    }

    /**
     * Advances the Streak by 1.
     */
    streakUp() {
        this.streak.count++;
        this.streak.BoostPity++;
        this.streak.timeSince = 0;

        let streakPoints = Math.min(150,50*Math.floor(this.streak.count/3));

        this.addPoints(streakPoints);

        if (this.streak.count>=3) {
            this.streakDisplay.setVisible(true);
            this.streakDisplay.text = this.streak.count + "x Combo! +"+streakPoints+" score."
        }

        this.rollForBoost();
    }

    /**
     * Sets all Streak scores to 0.
     */
    resetStreak() {
        this.streak.count = 0;
        this.streak.timeSince = 0;
        this.streak.BoostPity = 0;
        this.streakDisplay.setVisible(false);
    }

    /**
     * Determines whether the next message will be Boosted or not. Chance scales off Streak.
     */
    rollForBoost(){
        let pity = this.streak.BoostPity ** 2;
        let roll = Math.floor(Math.random() * 100);

        if (pity >= roll) {
            this.setBoost(true);
            //TODO: Next message is Boosted
            this.streak.BoostPity = 0;
        }
    }

    /**
     * Determines whether the next message is Boosted, and updates the UI accordingly.
     * @param {boolean} boost
     */
    setBoost(boost){
        this.boost = boost;
        
        if (this.boost) this.boostDisplay.setVisible(true);
        else this.boostDisplay.setVisible(false);
    }
}