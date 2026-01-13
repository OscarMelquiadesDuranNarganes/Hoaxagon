import {KEYBINDS} from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import { InfoBox } from "../utils/infoBox.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { INFO_TYPE } from './infoScene.js';

import { PostManager, POST_VEREDICT } from '../systems/post_system/postManager.js';
import { TimerManager } from "../systems/time_system/timerManager.js";
import { ScoreManager } from "../systems/score_system/scoreManager.js";
import { InspectorManager } from "../systems/inspection_system/inspectorManager.js";

import { FallacyInfoPanel } from '../systems/ui_system/fallacyInfoPanel.js'
import { PostBoxObject } from '../systems/post_system/postBoxObject.js';
import ImageButton from "../utils/imageButton.js";

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
     * @type {Fallacy: 
     *   {
     *      name: String,
     *      description: String,
     *      long_desc: String
     *   }
     * }
     */
    config;

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
     * @type {Phaser.GameObjects.Text}
     */
    postUserInfo;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    acceptButton;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    declineButton;

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

    /**
     * Pendent Fallacy objects to be released in the arcade mode.
     * @type {Array<Object>}
     */
    fallacyPool;

    /**
     * @type {Array<String>}
     */
    loadedFallacyNames = [];

    constructor() {
        super(SCENE_KEYS.GAME_SCENE);
    }

    init(data) {
        // Reset the containers and values, as the Scene instance is permanent an data reamins between 
        // scene changes
        this.loadedFallacyNames = [];
        this.fallacyPool = [];
        this.level = 0;
    }

    create(config) {
        this.config = config;
        //this.level = 0;

        this.cameras.main.setBackgroundColor( PALETTE_HEX.LightGrey);//LightGrey

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

        this.timerManager = new TimerManager(this, 180000);

        this.scoreManager = new ScoreManager(this);

        this.postManager = new PostManager(this);

        this.infoPanel = new FallacyInfoPanel(this, 900, 300, 400, 350);

        this.inspectorManager = new InspectorManager(this, this.infoPanel, this.postManager);
        
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);

        this.fallacyPool = [];
        this.infoDatabase.FALLACIES.forEach(element => {
            this.fallacyPool.push(element);
        });

        this.acceptButton = new ImageButton({scene:this,x:1000,y:240,width:200,height:200,color:PALETTE_HEX.White,imageKey:IMAGE_KEYS.ACCEPT,clickCallback:()=>{ 
            if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
                this.success(true);
            }
            else {
                this.fail(true);
            }
            } });
        this.declineButton = new ImageButton({scene:this,x:1200,y:240,width:200,height:200,color:PALETTE_HEX.White,imageKey:IMAGE_KEYS.DECLINE,clickCallback:()=>{ 
            if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
                this.success(false);
            } 
            else {
                this.fail(false);
            }
        }});
        this.acceptButton.setImageScale(0.5);
        this.declineButton.setImageScale(0.5);

        // this.acceptButton = this.add.text(900, 250, "ACCEPT", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);
        // this.declineButton = this.add.text(1100, 250, "DECLINE", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.White);

        // this.acceptButton.setInteractive();
        // this.acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

        //     //if(this.inspectorManager.inspectionActive) return;

        //     if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
        //         this.success(true);
        //     }
        //     else {
        //         this.fail(true);
        //     }
        // });

        // this.declineButton.setInteractive();
        // this.declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

        //     // if(this.inspectorManager.inspectionActive) return;

        //     if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
        //         this.success(false);
        //     } 
        //     else {
        //         this.fail(false);
        //     }
        // });

        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        this.arcade = config.fallacies.length == 0;

        if (this.arcade){
            const newFallacy = this.rollNewFallacy();

            this.addFallacy(newFallacy);

            this.scene.launch(SCENE_KEYS.INFO_SCENE, {
                fallacyObj: newFallacy,
                infoType: INFO_TYPE.NEW_TYPE_INFO
            }); // Notification Window

            this.postManager.loadPosts(this.loadedFallacyNames);
        }
        else {
            config.fallacies.forEach(fallacyObj => {
                this.addFallacy(fallacyObj);
                this.loadedFallacyNames.push(fallacyObj.name);
            });
            
            this.postManager.loadPosts(this.loadedFallacyNames);

            this.timerManager.setEnabled(false);

            this.scene.launch(SCENE_KEYS.INFO_SCENE, {
                fallacyObj: config.fallacies[0],
                infoType: INFO_TYPE.NEW_TYPE_INFO
            }); // Notification Window
        }

        this.postManager.loadNextPostInUI();
    }
    

    update(time, dt) {
        //#region timer
        this.timerManager.update(time, dt);
        this.scoreManager.update(time, dt);

        if(this.timerManager.enabled && this.timerManager.timer === 0){
            this.scene.start(
                SCENE_KEYS.PUNCTUATION_SCENE, 
                {
                    punctuation: this.scoreManager.points,
                    postManager: this.postManager,
                    timeInGame: this.timerManager.getTimeInGameText()
                }
            );
        }
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
     * Awards points upon correctly evaluating a message and registers the evaluation.
     * @param {boolean} postAccepted
     */
    success(postAccepted) {
        console.assert(typeof postAccepted === "boolean", "GameScene.success: postAccepted is not a boolean");

        const selectedFallacyObj =  this.infoPanel.selectedInfoBox ? this.infoPanel.selectedInfoBox.fallacyObj : null; // Null if none selected
        
        this.postManager.savePostEvaluation(postAccepted, true, selectedFallacyObj);

        // Give points if the fallacy is identified
        let identified = selectedFallacyObj &&
            this.postManager.currentPostDefinition.fallaciousSentenceID == this.postManager.currentPostObject.wordBlockContainer.getSelectedSentenceIDs()[0] &&
            selectedFallacyObj.name == this.postManager.currentPostDefinition.fallacyType;
        
        console.log(identified); 
        
        if (identified){         
            this.scoreManager.addPoints(50);
        }

        // Handle combo score
        if (this.scoreManager.boost) {
            this.scoreManager.addPoints(200);
            this.scoreManager.setBoost(false);
            
            this.timerManager.addTimeSeconds(10);
        }

        this.scoreManager.addPoints(100);
        this.scoreManager.streakUp();

        if (this.arcade && this.levelThresholds[this.level] != -1 && this.scoreManager.getScore()>=this.levelThresholds[this.level]) 
            this.levelUp(); 

        this.postManager.loadNextPostInUI(POST_VEREDICT.SUCCESSFUL);

        console.log("GOOD CHOICE");
        if(this.inspectorManager.inspectionActive)
            this.inspectorManager.handleInspectorButtonClick();
    }

    /**
     * Deducts time upon failing to evaluate a message and registers the evaluation.
     * @param {boolean} postAccepted
     */
    fail(postAccepted) {
        console.assert(typeof postAccepted === "boolean", "GameScene.success: postAccepted is not a boolean");

        this.scoreManager.setBoost(false);
        this.scoreManager.resetStreak();

        this.timerManager.addTimeSeconds(-30);

        const selectedFallacyObj =  this.infoPanel.selectedInfoBox ? this.infoPanel.selectedInfoBox.fallacyObj : null; // Null if none selected
        this.postManager.savePostEvaluation(postAccepted, false, selectedFallacyObj);
            
        this.postManager.loadNextPostInUI(POST_VEREDICT.FAILURE);

        console.log("BAD CHOICE");
        if(this.inspectorManager.inspectionActive)
            this.inspectorManager.handleInspectorButtonClick();
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
        this.loadedFallacyNames.push(newFallacy.name);

        return newFallacy;
    }

    /**
     * Raises the current level by 1, adding a new fallacy to the list.
     */
    levelUp(){
        console.log(this.level);
        this.level++;
        let newFallacy = this.rollNewFallacy();

        this.addFallacy(newFallacy);
        this.scene.launch(SCENE_KEYS.INFO_SCENE, {
            fallacyObj: newFallacy,
            infoType: INFO_TYPE.NEW_TYPE_INFO
        }); // Notification Window

        this.postManager.loadPosts(this.loadedFallacyNames);
    }
}