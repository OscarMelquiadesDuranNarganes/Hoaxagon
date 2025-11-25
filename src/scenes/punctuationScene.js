import { ScoreManager } from "../systems/score_system/scoreManager.js";
import { SCENE_KEYS } from "../utils/CommonKeys.js";
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";

export default class PunctuationScene extends Phaser.Scene {

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

    timeBetweenScoreUpdates = 10;

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

        this.cameras.main.setBackgroundColor(PALETTE_HEX.LightGrey);

        this.punctuation = data.punctuation;

        this.scoreManager = new ScoreManager(this);

        this.scoreManager.uiElementsConatiner.setPosition(500, SCREEN_HEIGHT / 2);

        this.timeBetweenScoreUpdates = 1000 / data.punctuation;

        this.countDown = this.timeBetweenScoreUpdates;

        this.fullScoreShown = false;

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if(this.fullScoreShown)
                this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE);
        })
    }

    update(time, dt) {
        this.countDown--;

        if(this.countDown <= 0 && !this.fullScoreShown) {
            this.countDown = this.timeBetweenScoreUpdates;
            this.scoreManager.addPoints(1);
        }

        if(this.scoreManager.points === this.punctuation)
            this.fullScoreShown = true;
    }
}