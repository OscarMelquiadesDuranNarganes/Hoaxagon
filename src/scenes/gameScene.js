import {KEYBINDS} from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import { InfoBox } from "../utils/infoBox.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";

import { PostManager, POST_VEREDICT } from '../systems/post_system/postManager.js'
import { TimerManager } from "../systems/time_system/timerManager.js";
import { ScoreManager } from "../systems/score_system/scoreManager.js";
import { InspectorManager } from "../systems/inspection_system/inspectorManager.js";

import { FallacyInfoPanel } from '../systems/ui_system/fallacyInfoPanel.js'
import { PostBoxObject } from '../systems/post_system/postBoxObject.js';

export const GAMEMODES = 
{
    TUTORIAL: "TUTORIAL",
    TRAINING: "TRAINING",
    ARCADE: "ARCADE"
}

export default class GameScene extends Phaser.Scene{
    //TODO: Progresión de niveles
    //TODO: Variante para modo entrenamiento y arcade
    //TODO: Implementación de modo inspección, mensajes, barra de información.

    /**
     * @type {boolean}
     */
    pause = false;

    /**
     * @type {PostManager}
     */
    postManager;

    /**
     * @type {TimerManager}
     */
    timerManager;

    /**
     * @type {ScoreManager}
     */
    scoreManager;

    /**
     * @type {InspectorManager} 
     */
    inspectorManager;

    /**
     * @type {PostBoxObject}
     */
    currentPostObject;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    postUserInfo;

    constructor() {
        super(SCENE_KEYS.GAME_SCENE);
    }

    init(){

    }
    create(config) {
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);
        
        this.timerManager = new TimerManager(this, 180000);

        this.scoreManager = new ScoreManager(this);

        this.postManager = new PostManager(this);

        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        this.infoPanel = new FallacyInfoPanel(this, 900, 300, 400, 350);

        config.fallacies.forEach(element => {
        this.addFallacy(element);
        });

        this.inspectorManager = new InspectorManager(this, this.infoPanel, this.postManager, null);

        this.cameras.main.setBackgroundColor( PALETTE_HEX.DarkGrey);

        const acceptButton = this.add.text(900, 250, "ACCEPT", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);
        const declineButton = this.add.text(1100, 250, "DECLINE", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);

        acceptButton.setInteractive();
        acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
                this.success();
            }
            else {
                this.fail();
            }
        });

        declineButton.setInteractive();
        declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
                this.success();
            } 
            else {
                this.fail();
            }
        });
    }

    update(time, dt) {
        //#region timer
        this.timerManager.update(time, dt);
        this.scoreManager.update(time, dt);
        //#endregion

        //#region input
        //#region gameplay
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.PAUSE)){
            this.pauseGame();
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.INSPECT)){

        }
        //#endregion
        //#region debug
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEUP)){
            this.timerManager.addTimeSeconds(30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEDOWN)){
            this.timerManager.addTimeSeconds(-30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.BOOST)){
            this.scoreManager.setBoost(true);
        }
        //#endregion
        //#endregion


    }

    addFallacy(fallacy){
        this.infoPanel.addInfoBox(
            new InfoBox({
                scene: this,
                x: 0,
                y: 0,
                width: 400,
                height: 100,
                info: fallacy,
            })
        );
    }

    /**
     * Pauses the current scene and initializes PauseScene while closing info boxes.
     */
    pauseGame() {
        this.scene.launch(SCENE_KEYS.PAUSE_SCENE);
        this.scene.pause();

        if (this.scene.isActive(SCENE_KEYS.INFO_SCENE))
            this.scene.stop(SCENE_KEYS.INFO_SCENE);
    }

    /**
     * Awards points upon correctly evaluating a message.
     */
    success() {
        if (this.boost) {
            this.scoreManager.addPoints(200);
            this.scoreManager.setBoost(false);
            
            this.timerManager.addTimeSeconds(10);
        }

        this.scoreManager.addPoints(100);
        this.scoreManager.streakUp();
            
        this.postManager.loadNextPostInUI(POST_VEREDICT.SUCCESSFUL);

        console.log("GOOD CHOICE");
    }

    /**
     * Deducts time upon failing to evaluate a message.
     */
    fail() {    
        this.scoreManager.setBoost(false);
        this.scoreManager.resetStreak();

        this.timerManager.addTimeSeconds(-30);
            
        this.postManager.loadNextPostInUI(POST_VEREDICT.FAILURE);

        console.log("BAD CHOICE");
    }
}