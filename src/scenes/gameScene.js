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

    /**
     * @type {Array<number>}
     */
    levelThresholds = [1000,5000,15000,30000,50000,-1];

    /**
     * @type {boolean}
     */
    arcade = false;

    /**
     * @type {number}
     */
    level;

    constructor() {
        super(SCENE_KEYS.GAME_SCENE);
    }

    create(config) {
        this.level = 0;

        this.add.image(0, 0, IMAGE_KEYS.BACKGROUND_TRIANGLES)
            .setOrigin(0, 0)
            .setTint(PALETTE_HEX.MiddleGrey)
            .setAlpha(0.15);


        this.add.rectangle(
            890, 0,
            420, this.cameras.main.height,
            PALETTE_HEX.MiddleGrey
        )
        .setOrigin(0, 0);

        /*new ChainState()
            .setTag("Timer Alpha Animation")
            .setStart(
                () => {
                    this.add.tween({
                        target: this.infoDatabase,
                        duration: 50,
                        onComplete: () => {
                            stateChainManager.endCurrentState();
                        }
                    });
                }
            )
            .setUpdate(
                (t, dt) => {

                }
            );*/
        
        
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);
        this.infoPanel = new FallacyInfoPanel(this, 900, 300, 400, 350);

        this.fallacyPool = [];
        this.infoDatabase.FALLACIES.forEach(element => {
            this.fallacyPool.push(element);
        });
        // this.fallacyPool = this.infoDatabase.FALLACIES;

        this.arcade = config.fallacies.length == 0
        if (this.arcade){ 
            this.addFallacy(this.rollNewFallacy());
        }

        this.timerManager = new TimerManager(this, 180000);

        this.scoreManager = new ScoreManager(this);

        this.postManager = new PostManager(this);

        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);


        config.fallacies.forEach(element => {
        this.addFallacy(element);
        });



        this.inspectorManager = new InspectorManager(this, this.infoPanel, this.postManager);

        this.cameras.main.setBackgroundColor( PALETTE_HEX.LightGrey);//LightGrey

        const acceptButton = this.add.text(900, 250, "ACCEPT", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);
        const declineButton = this.add.text(1100, 250, "DECLINE", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);

        acceptButton.setInteractive();
        acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if(this.inspectorManager.inspectionActive) return;

            if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
                this.success();
            }
            else {
                this.fail();
            }
        });

        declineButton.setInteractive();
        declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if(this.inspectorManager.inspectionActive) return;

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
    /**
     * Adds the provided fallacy's infobox to the panel.
     * @param {Object} fallacy 
     */
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
        if (this.scoreManager.boost) {
            this.scoreManager.addPoints(200);
            this.scoreManager.setBoost(false);
            
            this.timerManager.addTimeSeconds(10);
        }

        this.scoreManager.addPoints(100);
        this.scoreManager.streakUp();

        if (this.arcade && this.levelThresholds[this.level] != -1 && this.scoreManager.getScore()>this.levelThresholds[this.level]) 
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
    /**
     * Selects a fallacy at random from the remaining candidates.
     * @returns The selected fallacy.
     */
    rollNewFallacy(){
        let size = this.fallacyPool.length;
        let index = Math.floor(Math.random()*size);
        
        var newFallacy = this.fallacyPool[index];
        this.fallacyPool.splice(index,1);
        return newFallacy;
    }
    /**
     * Raises the current level by 1, adding a new fallacy to the list.
     */
    levelUp(){
        console.log(this.level);
        this.level++;
        let newFallacy = this.rollNewFallacy()
        this.addFallacy(newFallacy);
        //TODO: Pantalla explicativa de la nueva falacia

    }
}