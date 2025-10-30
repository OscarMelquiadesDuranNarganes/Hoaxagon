import Button from "../utils/button.js";
import { TEXT_CONFIG } from "../utils/textConfigs.js";
export default class MainMenu extends Phaser.Scene{
    title;
    playButton;
    settingsButton;
    trainingButton;
    exitButton;
    constructor(){
        super({key: "mainMenu"});
    }
    preload() {
        
    }
    init(){

    }
    create(){
        let { width, height } = this.sys.game.canvas;
        this.playButton = new Button({scene:this,
            x: width/2, y: height/2,
            width: 300, height:300,
            color:0xffffff,
            clickCallback: ()=>{this.scene.start("gameScene")},
            text: "PLAY",
            textConfig:TEXT_CONFIG.Heading,
            textColor:0x000000})
    }
}