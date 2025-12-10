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
import { TutorialPhaseQueue } from '../systems/tutorial_mode_system/tutorialPhaseQueue.js';
import ImageButton from "../utils/imageButton.js";

const PHASES = {
    P1_INTRO: "P1_INTRO",
    P2_PANEL_INTRO: "P1_MODERATION_AREA_INTRO"
};

export default class TutorialScene extends Phaser.Scene{

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

    /**
     * @type {number}
     */
    SCREEN_HEIGHT;

    /**
     * @type {number}
     */
    SCREEN_WIDTH;

    /**
     * @type {TutorialPhaseQueue}
     */
    tutorialPhaseQueue;

    constructor() {
        super(SCENE_KEYS.TUTORIAL_SCENE);
    }

    init(data) {
        // Reset the containers and values, as the Scene instance is permanent an data reamins between 
        // scene changes
        this.loadedFallacyNames = [];
        this.fallacyPool = [];
        this.level = 0;
    }

    create(config) {
        this.SCREEN_HEIGHT = this.sys.game.canvas.height;
        this.SCREEN_WIDTH = this.sys.game.canvas.width;

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

        //     if (this.postManager.currentPostDefinition.fallacyType === "NONE") {
        //         this.success(true);
        //     }
        //     else {
        //         this.fail(true);
        //     }
        // });

        // this.declineButton.setInteractive();
        // this.declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

        //     if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
        //         this.success(false);
        //     } 
        //     else {
        //         this.fail(false);
        //     }
        // });

        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        // Setting the tutorial phases

        this.tutorialPhaseQueue = new TutorialPhaseQueue();

        this.buildTutorialEvents();

        this.tutorialPhaseQueue.execCurrentPhase();
    }
    

    update(time, dt) {
        this.scoreManager.update(time, dt);

        //this.scene.start(SCENE_KEYS.GAME_SCENE, { fallacies:[] });
    }

    textActionPhase(positionX, positionY, text, actionAfterClick) {
        const background = this.add.rectangle(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT, PALETTE_HEX.Black, 0.2)
        .setOrigin(0, 0)
        .setInteractive();

        let textConfig = TEXT_CONFIG.SubHeading2;
        textConfig.wordWrap = { width: this.SCREEN_WIDTH * 0.4 };

        const textObj = this.add.text(positionX, positionY, text, textConfig)
        .setOrigin(0.5, 0);

        background.on(Phaser.Input.Events.POINTER_DOWN, () => {
            textObj.destroy(); // Destroying the message UI
            background.destroy();

            actionAfterClick();
        });
    }

    buildTutorialEvents() {
        this.tutorialPhaseQueue.pushPhase(() => {
            this.textActionPhase(
                this.SCREEN_WIDTH * 0.4, 
                this.SCREEN_HEIGHT * 0.2,
                "Esto es el panel del moderador. " +
                "Aquí llevará a cabo sus labores. " + 
                "Para ello, tiene varias herramientas a su disposición.",
                () => {
                    this.time.addEvent({
                        delay: 500, // ms
                        callback: () => {
                            this.postManager.loadPosts(this.loadedFallacyNames);
                            this.postManager.loadNextPostInUI();

                            this.tutorialPhaseQueue.pop();
                            this.tutorialPhaseQueue.execCurrentPhase(); // Executes the next phase
                        }
                    });
                }
            );            
        });

        this.tutorialPhaseQueue.pushPhase(() => {
            this.time.addEvent({
                delay: 500, // ms
                callback: () => {
                    this.tutorialPhaseQueue.pop();
                    this.tutorialPhaseQueue.execCurrentPhase(); // Executes the next phase
                }
            });
        });

        this.tutorialPhaseQueue.pushPhase(() => {
            this.textActionPhase(
                this.SCREEN_WIDTH * 0.4, 
                this.SCREEN_HEIGHT * 0.2,
                "Vamos a evaluar este post.",
                () => {
                    this.time.addEvent({
                        delay: 500, // ms
                        callback: () => {
                            this.tutorialPhaseQueue.pop();
                            this.tutorialPhaseQueue.execCurrentPhase(); // Executes the next phase
                        }
                    });
                }
            );            
        });

        // PHASE 3
        /*
        const newFallacy = this.rollNewFallacy();
        this.addFallacy(newFallacy);

        this.scene.launch(SCENE_KEYS.INFO_SCENE, {
            fallacyObj: newFallacy,
            infoType: INFO_TYPE.NEW_TYPE_INFO
        }); // Notification Window*/
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

        if (this.scoreManager.boost) {
            this.scoreManager.addPoints(200);
            this.scoreManager.setBoost(false);
        }

        this.scoreManager.addPoints(100);
        this.scoreManager.streakUp();

        if (this.levelThresholds[this.level] != -1 && this.scoreManager.getScore()>=this.levelThresholds[this.level]) 
            this.levelUp();

        const selectedFallacyObj =  this.infoPanel.selectedInfoBox ? this.infoPanel.selectedInfoBox.fallacyObj : null; // Null if none selected
        this.postManager.savePostEvaluation(postAccepted, true, selectedFallacyObj);
            
        this.postManager.loadNextPostInUI(POST_VEREDICT.SUCCESSFUL);

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

        const selectedFallacyObj =  this.infoPanel.selectedInfoBox ? this.infoPanel.selectedInfoBox.fallacyObj : null; // Null if none selected
        this.postManager.savePostEvaluation(postAccepted, false, selectedFallacyObj);
            
        this.postManager.loadNextPostInUI(POST_VEREDICT.FAILURE);

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