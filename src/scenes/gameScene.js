import {KEYBINDS} from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import InfoBox from "../utils/infoBox.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";

import { PostManager } from '../systems/post_system/postManager.js'
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
     * @type {number}
     */
    timer;
   
    /**
     * @type {Phaser.GameObjects.Text}
     */
    timeDisplay;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    streakDisplay;

    /**
     * @type {boolean}
     */
    pause = false;

    /**
     * @type {number}
     */
    points;

    /**
    * @type {object}
    */
    streak = {
        /**
        * @type {number}
        */
        count: 0,
        /**
        * @type {number}
        */
        timeSince: 0,
        /**
        * @type {number}
        */
        BoostPity: 0
    };

    /**
        * @type {number}
        */
    falloffTime = 5000;

    /**
     * The centered X position of the generated `PostBoxObject`s.
     * @type {number}
     */
    postBoxCenterX;

    /**
     * The centered Y position of the generated `PostBoxObject`s.
     * @type {number}
     */
    postBoxCenterY;

    /**
     * @type {PostManager}
     */
    postManager;

    /**
     * @type {PostBoxObject}
     */
    currentPostObject;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    postUserInfo;

    /**
     * @type {boolean}
     */
    boost = false;

    constructor() {
        super(SCENE_KEYS.GAME_SCENE);
    }

    init(){

    }
    create(config) {
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);
        


        let { width, height } = this.sys.game.canvas;

        this.timer = 180000;
        this.timeDisplay = this.add.text(10, 0, "", TEXT_CONFIG.Heading).setColor(PALETTE_RGBA.White);
        this.updateTimer();

        this.streakDisplay = this.add.text(20,height-60,"Combo",TEXT_CONFIG.SubHeading2).setColor(PALETTE_RGBA.YellowAlert).setOrigin(0,1);
        this.streakDisplay.setVisible(false);

        this.points = 0;
        this.pointsDisplay = this.add.text(10,height-10,"Score: "+this.points,TEXT_CONFIG.Heading2).setColor(PALETTE_RGBA.White).setOrigin(0,1);
        
        this.boostDisplay = this.add.image(320,350,IMAGE_KEYS.TEMP_SPRITE).setVisible(false).setScale(0.5,0.5);
        this.boostDisplay.setDepth(1);


        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        this.postBoxCenterX = this.cameras.main.centerX * 0.8;
        this.postBoxCenterY = this.cameras.main.centerY;

        this.infoPanel = new FallacyInfoPanel(this, 900, 300, 400, 350);

        config.fallacies.forEach(element => {
        this.addFallacy(element);
        });
        this.cameras.main.setBackgroundColor( PALETTE_HEX.DarkGrey);

        this.postManager = new PostManager(this);

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
            
            this.postManager.loadNextPostInUI();
        });

        declineButton.setInteractive();
        declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {

            if (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
                this.success();
            } 
            else {
                this.fail();
            }
            
            this.postManager.loadNextPostInUI();
        });
    }

    update(time, dt) {
        //#region timer
        this.addTimeRaw(-dt);
        this.updateStreak(dt);
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
            this.addTime(30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.TIMEDOWN)){
            this.addTime(-30);
        }
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.BOOST)){
            this.setBoost(true);
        }
        //#endregion
        //#endregion


    }

    addFallacy(fallacy){
        this.infoPanel.addInfoBox(this.createInfoBox(0, 0, fallacy));
    }

    /**
     * Returns an array with the number of minutes and seconds remaining on the timer.
     * @returns {Array<number>}
     */
    getTime() {
        let seconds = this.timer / 1000;
        return [Math.floor(seconds / 60), Math.floor(seconds % 60)];
    }

    /**
     * Adds the specified time to the scene timer, in miliseconds.
     * @param {number} time
     */
    addTimeRaw(time){
        this.timer = Math.max(0, this.timer += time);
        this.updateTimer();
    }

    /**
     * Adds the specified time to the scene timer, in seconds.
     * @param {number} time
     */
    addTime(time) {
        this.timer = Math.max(0, this.timer += (time * 1000));
        this.updateTimer();
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
     * Updates the timer display to match the remaining time.
     */
    updateTimer() {
        let TD = this.getTime();
        const minutes = TD[0];
        const seconds = (Math.floor(TD[1] / 10)).toString() + (TD[1] % 10).toString();

        this.timeDisplay.text = (`${minutes}:${seconds}`);

        if (this.timer < 11000) this.timeDisplay.setColor(PALETTE_RGBA.RedAlert);
        else if (this.timer < 31000) this.timeDisplay.setColor(PALETTE_RGBA.AmberAlert);
        else if (this.timer < 61000) this.timeDisplay.setColor(PALETTE_RGBA.YellowAlert);
        else if (this.timer < 181000) this.timeDisplay.setColor(PALETTE_RGBA.White);
        else this.timeDisplay.setColor(PALETTE_RGBA.Teal);
    }

    /**
     * Adds the specified amount to the game's score.
     * @param {number} points
     */
    addPoints(points) {
        this.points+=points;
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
        if (this.streak.count>=3){
            this.streakDisplay.setVisible(true);
            this.streakDisplay.text = this.streak.count + "x Combo! +"+streakPoints+" score."
        }
        this.rollForBoost();
    }

    /**
     * Sets all Streak scores to 0.
     */
    resetStreak(){
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
     * Creates a clickable infobox at the set position, with a given entry.
     * @param {number} posX
     * @param {number} posy
     * @param {object} infoEntry
     * @returns {InfoBox}
     */
    createInfoBox(posx,posy,infoEntry){
        return new InfoBox({
            scene: this,
            x: posx,
            y: posy,
            width: 400,
            height: 100,
            info:infoEntry,
            clickCallback: ()=>{this.expandInfo(infoEntry);}
        });
    }

    /**
     * Activates InfoScene according to the clicked infobox.
     * @param {object} infoEntry
     */
    expandInfo(infoEntry) {
        let mousex = this.game.input.mousePointer.x;
        let mousey = this.game.input.mousePointer.y;
        if (!this.scene.isActive(SCENE_KEYS.INFO_SCENE) && mousey>360) 
            this.scene.launch(SCENE_KEYS.INFO_SCENE, infoEntry);
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

    /**
     * Awards points upon correctly evaluating a message.
     */
    success(){
        if (this.boost){
            this.addPoints(200);
            this.addTime(10);
            this.setBoost(false);
        }
        this.addPoints(100);
        this.streakUp();
        console.log("GOOD CHOICE");
    }

    /**
     * Deducts time upon failing to evaluate a message.
     */
    fail(){
        this.setBoost(false);
        this.resetStreak();
        this.addTime(-30);
        console.log("BAD CHOICE");
    }
}