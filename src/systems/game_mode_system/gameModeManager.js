import GameScene from "../../scenes/gameScene";

import { InfoBox } from '../../utils/infoBox.js';
import InfoScene from '../../scenes/infoScene.js';
import { SCENE_KEYS } from '../../utils/CommonKeys.js';

import { PostManager, POST_VEREDICT } from '../post_system/postManager.js';
import { TimerManager } from "../time_system/timerManager.js";
import { ScoreManager } from "../score_system/scoreManager.js";

class GameModeManager {

    /**
     * @type {GameScene}
     */
    gameScene;

    /**
     * @type {Array<Fallacy>}
     */
    fallacyPool = [];

    /**
     * The punctuations that produce a level up.
     * @type {Array<number>}
     */
    levelThresholds = [1000, 5000, 15000, 30000, 50000, -1];

    /**
     * @type {boolean}
     */
    arcade = false;

    /**
     * @type {number}
     */
    level = 1;

    /**
     * 
     * @param {GameScene} gameScene 
     */
    constructor(gameScene) {
        console.assert(gameScene instanceof GameScene, "gameScene must be instance of GameScene");

        this.gameScene = gameScene;

        this.arcade = config.fallacies.length == 0;

        if (this.arcade) {
            this.setupArcadeSceneMode();
        }
        else {
            this.setupTrainingMode();
        }

        this.gameScene.acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if(this.inspectorManager.inspectionActive) return;

            if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
                this.success();
            }
            else {
                this.fail();
            }
        });

        this.declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if(this.inspectorManager.inspectionActive) return;

            if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
                this.success();
            } 
            else {
                this.fail();
            }
        });
    }
    
    setupArcadeSceneMode() {
        this.addFallacy(this.rollNewFallacy());

        const infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);

        infoDatabase.FALLACIES.forEach(element => {
            this.fallacyPool.push(element);
        });
    }

    setupTrainingMode() {
        this.gameScene.timerManager.enabled = false;

        this.gameScene.config.fallacies.forEach(fallacyObj => {
            this.addFallacy(fallacyObj);
            this.gameScene.scene.launch(SCENE_KEYS.INFO_SCENE, fallacyObj);
        });
    }

    update(time, dt) {
        this.gameScene.timerManager.update(time, dt);
        this.gameScene.scoreManager.update(time, dt);
    }

    /**
     * Adds the provided fallacy's infobox to the panel.
     * @param {Object} fallacy 
     */
    addFallacyToPanel(fallacy){
        this.gameScene.infoPanel.addInfoBox(
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
     * Selects a fallacy at random from the remaining candidates.
     * @returns { Fallacy: 
     *   {
     *      name: String,
     *      description: String,
     *      long_desc: String
     *   }
     * }
     */
    rollNewFallacy(){
        let size = this.fallacyPool.length;
        let index = Math.floor(Math.random() * size);
        
        var newFallacy = this.fallacyPool[index];
        this.fallacyPool.splice(index, 1);

        return newFallacy;
    }

    /**
     * Raises the current level by 1, adding a new fallacy to the list and pops a notification
     * window of the added fallacy to the player.
     */
    levelUp(){
        this.level++;
        console.log(this.level);

        let newFallacy = this.rollNewFallacy();
        this.addFallacyToPanel(newFallacy);
        this.gameScene.scene.launch(SCENE_KEYS.INFO_SCENE, newFallacy); // Notification Window
    }

    /**
     * Awards points upon correctly evaluating a message.
     */
    success() {
        if (this.scoreManager.boost) {
            this.scoreManager.addPoints(200);
            this.scoreManager.setBoost(false);
            
            this.timerManager.addTimeSeconds(10);
        }

        this.scoreManager.addPoints(100);
        this.scoreManager.streakUp();

        if (this.arcade && this.levelThresholds[this.level] != -1 && this.scoreManager.getScore() > this.levelThresholds[this.level]) 
            this.levelUp();
            
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