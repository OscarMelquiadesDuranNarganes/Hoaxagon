import { IMAGE_KEYS } from "../../utils/CommonKeys.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_HEX, PALETTE_RGBA } from "../../utils/Palette.js";
import ScoreScreen, { MESSAGE_TYPE } from "../../utils/scoreScreen.js";

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
     * @type {boolean}
     */
    enabled = true;

    /**
     * @type {number}
     */
    points = 0;

        /**
     * @type {number}
     */
    levelUpThreshold = 0;

    /**
        * @type {number}
        */
    falloffTime = 5000;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    pointsDisplay = null;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    pointsDisplayShadow;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    boostDisplay = null;

    /**
     * @type {Streak}
     */
    streak = new Streak();

    /**
     * @type {boolean}
     */
    boost = false;

    /**
     * To facilitate moving the UI elements in the scene.
     * @type {Phaser.GameObjects.Container}
     */
    uiElementsConatiner;

    /**
     * @type {ScoreScreen}
     */
    scoreLog;

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
        const SCREEN_WIDTH = this.scene.sys.game.canvas.width;

        this.scoreLog = new ScoreScreen(this.scene,SCREEN_WIDTH/2,SCREEN_HEIGHT/2,400,600);
        // Create score display
        this.pointsDisplayShadow = this.scene.add.text(
            5, 5,
            `Score: ${this.points}`, 
            TEXT_CONFIG.Heading2
        )
        .setColor(PALETTE_RGBA.TranslucentGrey)
        .setOrigin(0, 1);

        this.pointsDisplay = this.scene.add.text(
            0, 0,
            `Score: ${this.points}`, 
            TEXT_CONFIG.Heading2
        )
        .setColor(PALETTE_RGBA.White)
        .setOrigin(0, 1);

        // Create boost display
        this.boostDisplay = this.scene.add.image(
            325, 355, 
            IMAGE_KEYS.BOOST_STAR
        )
        .setVisible(false)
        .setScale(0.1, 0.1)
        .setDepth(1)
        .setTint(PALETTE_HEX.AmberAlert);

        // Create streak display
        this.streakDisplay = this.scene.add.text(
            SCREEN_WIDTH/2-350, SCREEN_HEIGHT/2+50,
            "Combo",
            TEXT_CONFIG.Heading2
        )
        .setColor(PALETTE_RGBA.AmberAlert)
        .setOrigin(1, 0.5)
        .setVisible(false);

        this.uiElementsConatiner = this.scene.add.container(
            60, SCREEN_HEIGHT - 40,
            [ this.pointsDisplayShadow, this.pointsDisplay ]
        );
    }

    update(time, dt) {
        if(this.enabled)
            this.updateStreak(dt);

        this.uiElementsConatiner.setVisible(this.enabled);
        this.scoreLog.update(time,dt);
    }

    /**
     * Adds the specified amount to the game's score.
     * @param {number} points
     */
    addPoints(points) {
        this.points += points;
        this.scoreLog.addNewMessage(MESSAGE_TYPE.POINTS,points);
        this.updateScore();
    }

    /**
     * Updates the score display to match the current score.
     */
    updateScore() {
        this.pointsDisplay.text = `Score: ${this.points}`;
        this.pointsDisplayShadow.text = this.pointsDisplay.text;

        this.scene.tweens.chain({
            targets: [this.pointsDisplayShadow, this.pointsDisplay ],
            ease: 'Power1',
            loop: 0,

            tweens: [
                { scaleX: 1.2, duration: 50 },
                { scaleX: 1, duration: 50 }
            ]
        });
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

        if (streakPoints>0) this.addPoints(streakPoints);

        if (this.streak.count>=3) {
            this.streakDisplay.setVisible(true);
            this.streakDisplay.text = `${this.streak.count}x!`;
            this.scene.tweens.add({
                targets:this.streakDisplay,
                ease:'Linear',
                loop: 0,
                alpha: {
                    from: 1.5,
                    to: 0,
                    duration:5000   
                },
            });
            this.scene.tweens.chain({
                targets: this.streakDisplay,
                ease: 'Power1',
                duration: 20,
                loop: 0,
                tweens: [
                    { scaleY: 1.5, scaleX: 1.5, duration: 100 },
                    { scaleY: 1,   scaleX: 1,   duration: 100 }
                ]
            })
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

    getScore(){
        return this.points;
    }
}