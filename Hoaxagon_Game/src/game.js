import MainMenu from "./scenes/mainMenu.js";
import TestScene from "./scenes/testScene.js";
import GameScene from "./scenes/gameScene.js";
import PauseScene from "./scenes/pauseScene.js";

let config = {
    type: Phaser.AUTO,
    width:  1320,
    height: 720,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },

    scene: [GameScene, TestScene, MainMenu, PauseScene],    // Decimos a Phaser cual es nuestra escena

    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 0 }, 
            debug: false
        } 
    },
    parent:"game"

};

new Phaser.Game(config);