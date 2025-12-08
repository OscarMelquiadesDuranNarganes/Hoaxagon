import { IMAGE_KEYS, SCENE_KEYS } from "../utils/CommonKeys.js";
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import { CorrectionFeedbackBox } from "../systems/ui_system/correctionFeedbackBox.js";
import { PostManager } from "../systems/post_system/postManager.js";
import { TimerManager } from "../systems/time_system/timerManager.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { ScrollAreaContainer } from "../systems/scroll_system/scrollAreaContainer.js";

export default class PunctuationScene extends Phaser.Scene {

    /**
     * @type {number}
     */
    punctuation;

    /**
     * @type {String}
     */
    timeInGame;

    /**
     * @type {PostManager}
     */
    postManager;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    icosamuelSprite;

    /**
     * @type {number}
     */
    icosamuelFrame = 0;

    /**
     * @type {number}
     */
    icosamuelFrameDuration = 50;

    /**
     * @type {number}
     */
    icosamuelFrameTimer = 0;

    /**
     * @type {ScrollAreaContainer}
     */
    scrollArea;

    /**
     * 
     */

    constructor() {
        super(SCENE_KEYS.PUNCTUATION_SCENE);
    }

    /**
     * 
     * @param {
     *     {
     *         punctuation: number
     *         timeInGame: String
     *         postManager: PostManager
     *     }
     * } data 
     */
    create(data) {
        const SCREEN_HEIGHT = this.sys.game.canvas.height;
        const SCREEN_WIDTH = this.sys.game.canvas.width;

        this.cameras.main.setBackgroundColor(PALETTE_HEX.LightGrey);

        // Icosamuel
        this.icosamuelSprite = this.add.sprite(SCREEN_WIDTH * 0.70, SCREEN_HEIGHT * 0.45, IMAGE_KEYS.ICOSAMUEL, 0);
        this.icosamuelSprite.setScale(1, 1);

        this.add.text(SCREEN_WIDTH * 0.60, SCREEN_HEIGHT * 0.10, "Icosamuel", TEXT_CONFIG.SubHeading);

        // Click to continue
        const continueButton = this.add.text(SCREEN_WIDTH * 0.60, SCREEN_HEIGHT * 0.9, "Volver al menú", TEXT_CONFIG.SubHeading2)
            //.setOrigin(0.5, 0.5)
            .setColor(PALETTE_RGBA.DarkerGrey)
            .setInteractive();

        continueButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE);
        });

        // Information Panel
        
        this.punctuation = data.punctuation;
        this.timeInGame = data.timeInGame;
        this.postManager = data.postManager;

        const panel = this.add.rectangle(
            10, 0,
            SCREEN_WIDTH * 0.395, this.cameras.main.height,
            PALETTE_HEX.MiddleGrey
        )
        .setOrigin(0, 0);

        const panelCenterX  = panel.width * 0.5 + panel.x;

        this.add.text(panelCenterX, 60, `Score: ${this.punctuation}`, TEXT_CONFIG.Heading2)
            .setOrigin(0.5, 0);

        this.add.text(panelCenterX, 140, `Tiempo jugado:`, TEXT_CONFIG.SubHeading2)
            .setOrigin(0.5, 0);

        this.add.text(panelCenterX, 170, `${this.timeInGame}`, TEXT_CONFIG.SubHeading)
            .setOrigin(0.5, 0);
        
        if(this.postManager.evaluatedPostsInfo.length > 0) {
            this.add.text(panel.x + 10, 240, `Correcciones:`, TEXT_CONFIG.SubHeading2)
                .setOrigin(0, 0);
        }

        this.scrollArea = new ScrollAreaContainer(this, panel.x + 10, SCREEN_HEIGHT * 0.38, SCREEN_WIDTH * 0.38, SCREEN_HEIGHT * 0.6);

        this.postManager.evaluatedPostsInfo.forEach((evaluatedPostInfo, index) => {
            const feedbackBox = new CorrectionFeedbackBox(
                this,
                0, 0,
                SCREEN_WIDTH * 0.39,
                evaluatedPostInfo
            );
            this.scrollArea.addGameObject(feedbackBox);
        });
    }

    update(time, dt) {
        this.icosamuelFrameTimer += dt;

        if (this.icosamuelFrameTimer >= this.icosamuelFrameDuration) {
            this.icosamuelSprite.setFrame((this.icosamuelFrame + 1) % 24);
            this.icosamuelFrame++;

            this.icosamuelFrameTimer = 0;
        }
    }
}