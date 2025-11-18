import MainMenu from "./scenes/mainMenu.js";
import TestScene from "./scenes/testScene.js";
import GameScene from "./scenes/gameScene.js";
import PauseScene from "./scenes/pauseScene.js";
import LoadScene from "./scenes/loadScene.js";
import InfoScene from "./scenes/infoScene.js";
import TrainingMenu from "./scenes/trainingMenu.js";

let config = {
    type: Phaser.AUTO,
    width:  1320,
    height: 720,
    pixelArt: false,
    scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,

		mode: Phaser.Scale.FIT,
		min: {
			width: 640,
			height: 300
		},
		max: {
			width:  1320,
            height: 720
		},
		zoom: 1

	},

    scene: [LoadScene, GameScene, InfoScene, MainMenu, PauseScene, TestScene, TrainingMenu],    // Decimos a Phaser cual es nuestra escena

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