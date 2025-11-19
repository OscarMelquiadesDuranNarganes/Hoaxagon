import GameScene from "../../scenes/gameScene";

class GameModeManager {

    /**
     * @type {GameScene}
     */
    gameScene;

    /**
     * 
     * @param {GameScene} gameScene 
     */
    constructor(gameScene) {
        console.assert(gameScene instanceof GameScene, "gameScene must be instance of GameScene");

        this.gameScene = gameScene;
    }
    
    buildArcadeSceneMode() {
        
    }
}