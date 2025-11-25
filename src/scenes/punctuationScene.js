import { ScoreManager } from "../systems/score_system/scoreManager.js";
import { SCENE_KEYS } from "../utils/CommonKeys.js";

class PunctuationScene extends Phaser.Scene {

    /**
     * @type {number}
     */
    punctuation;

    /**
     * @type {ScoreManager}
     */
    scoreManager;

    /**
     * Whether the score has been fully displayed or not.
     */
    fullScoreShown = false;

    timeBetweenScoreUpdates = 100;

    countDown;

    constructor() {
        super(SCENE_KEYS.PUNCTUATION_SCENE);
    }

    /**
     * 
     * @param {
     *     {
     *         punctuation: number
     *     }
     * } data 
     */
    create(data) {
        const SCREEN_HEIGHT = this.sys.game.canvas.height;

        this.punctuation = data.punctuation;

        this.scoreManager = new ScoreManager(this);

        this.scoreManager.uiElementsConatiner.setPosition(500, SCREEN_HEIGHT / 2);

        this.countDown = this.timeBetweenScoreUpdates;

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start(SCENE_KEYS.GAME_SCENE);
        })
    }

    update(time, dt) {
        this.countDown--;

        if(this.countDown <= 0 ) {
            this.countDown = this.timeBetweenScoreUpdates;
            this.scoreManager.addPoints(1);
        }
    }
}