import {KEYBINDS} from "../utils/Keybinds.js";
import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS } from '../utils/CommonKeys.js'
import { PALETTE_HEX, PALETTE_RGBA } from "../utils/Palette.js";
import InfoBox from "../utils/infoBox.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";

import { PostManager } from '../systems/post_system/postManager.js'
import { FallacyInfoPanel } from '../systems/ui_system/fallacyInfoPanel.js'
import { PostBoxObject } from '../systems/post_system/postBoxObject.js';

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
    falloffTime = 10000;

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

    constructor() {
        super(SCENE_KEYS.GAME_SCENE);
    }

    init(){

    }
    create() {
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);
        this.cameras.main.setBackgroundColor( PALETTE_HEX.DarkGrey);

        let { width, height } = this.sys.game.canvas;

        this.timer = 180000;
        this.timeDisplay = this.add.text(10, 0, "", TEXT_CONFIG.Heading).setColor(PALETTE_RGBA.White);
        this.updateTimer();

        this.points = 0;
        this.pointsDisplay = this.add.text(10,height-10,"Score: "+this.points,TEXT_CONFIG.Heading2).setColor(PALETTE_RGBA.White).setOrigin(0,1);
        
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        this.postBoxCenterX = this.cameras.main.centerX * 0.8;
        this.postBoxCenterY = this.cameras.main.centerY;

        let infoPanel = new FallacyInfoPanel(this, 900, 300, 400, 350);

        infoPanel.addInfoBox(this.createInfoBox(0, 0, this.infoDatabase.FALLACIES.POST_HOC));
        infoPanel.addInfoBox(this.createInfoBox(0, 0, this.infoDatabase.FALLACIES.AD_VERECUNDIAM));
        infoPanel.addInfoBox(this.createInfoBox(0, 0, this.infoDatabase.FALLACIES.AD_CONSEQUENTIAM));

        // TextBox for post user info
        this.postUserInfo = this.add.text(900, 150, "Usuario: ", TEXT_CONFIG.Paragraph).setColor(PALETTE_RGBA.DarkerGrey);
        
        this.postManager = new PostManager(this);
        this.postManager.loadPosts(["ALL"]);
        this.loadNextPost();

        const acceptButton = this.add.text(900, 250, "ACCEPT", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.DarkerGrey);
        const declineButton = this.add.text(1100, 250, "DECLINE", TEXT_CONFIG.SubHeading).setColor(PALETTE_RGBA.DarkerGrey);

        acceptButton.setInteractive();
        acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.loadNextPost();

          /*  if  (this.postManager.currentPostDefinition.fallacyType === "NONE") {
                this.success();
            }
            else {
                this.fail();
            }*/
        });

        declineButton.setInteractive();
        declineButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.loadNextPost();

          /*  if  (this.postManager.currentPostDefinition.fallacyType !== "NONE") {
                this.success();
            } 
            else {
                this.fail();
            }*/
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
        //#endregion
        //#endregion


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
            this.streak.count = 0;
            this.streak.timeSince = 0;
            this.streak.BoostPity = 0;
        }
    }


    /**
     * Advances the Streak by 1.
     */
    streakUp() {
        this.streak.count++;
        this.streak.BoostPity++;
        this.streak.timeSince = 0;
        let streakPoints = Math.min(150,50*Math.floor(streak/3));
        this.addPoints(streakPoints);
    }

    /**
     * Determines whether the next message will be Boosted or not. Chance scales off Streak.
     */
    rollForBoost(){
        let pity = this.streak.BoostPity ** 2;
        let roll = Math.floor(Math.random() * 100);
        if (pity >= roll) {
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
        if (!this.scene.isActive(SCENE_KEYS.INFO_SCENE)) 
            this.scene.launch(SCENE_KEYS.INFO_SCENE, infoEntry);
    }

    /**
     * Awards points upon correctly evaluating a message.
     */
    success(){
        this.addPoints(100);
        this.streakUp();
        consople.log("GOOD CHOICE");
    }

    /**
     * Deducts time upon failing to evaluate a message.
     */
    fail(){
        this.streak.count = 0;
        this.streak.timeSince = 0;
        this.streak.BoostPity = 0;
        this.addTime(-30);
        console.log("BAD CHOICE");
    }

    loadNextPost(){
        if(this.currentPostObject){
            this.currentPostObject.destroy();
        }

        this.currentPostObject = this.postManager.buildNewPostObject();
        this.currentPostObject.setPosition(this.postBoxCenterX - 200, this.postBoxCenterY);

        this.postUserInfo.setText("Usuario: " +  this.postManager.currentPostDefinition.user);
    }
}