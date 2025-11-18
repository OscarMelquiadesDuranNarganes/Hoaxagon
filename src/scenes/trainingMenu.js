import { IMAGE_KEYS, SCENE_KEYS,ANIM_KEYS,JSON_KEYS } from '../utils/CommonKeys.js'
import Button from "../utils/button.js";
import ImageButton from '../utils/imageButton.js';
import { TEXT_CONFIG } from "../utils/textConfigs.js";
import { PALETTE_HEX } from "../utils/Palette.js";
import { PALETTE_RGBA } from "../utils/Palette.js";
import { KEYBINDS } from '../utils/Keybinds.js';
import { ScrollAreaContainer } from '../systems/scroll_system/scrollAreaContainer.js';

export default class TrainingMenu extends Phaser.Scene{
    scrollArea;
    buttons;
    buttonWidth = 600;
    buttonHeight = 100;
    constructor(){
        super(SCENE_KEYS.TRAINING_MENU_SCENE);
    }
    create(){
        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);

        const { width, height } = this.sys.game.canvas;

        this.width = width;
        this.height = height;

        this.add.text(width/2,100,"TRAINING",TEXT_CONFIG.Heading2).setColor(PALETTE_RGBA.White).setOrigin(0.5,0.5)
        this.KEYS = this.input.keyboard.addKeys(KEYBINDS);

        this.infoDatabase = this.cache.json.get(JSON_KEYS.INFO_DB);

        this.cameras.main.setBackgroundColor(PALETTE_RGBA.MiddleGrey);
        this.scrollArea = new ScrollAreaContainer(this,this.width/2-300,200,600,450);

        for (let i = 0; i<this.infoDatabase.FALLACIES.length;i++){
            this.scrollArea.addGameObject
        (this.createNewButton(this.infoDatabase.FALLACIES[i]),this.buttonWidth/2,this.buttonHeight/2);
        }
        console.log(this.scrollArea);

        this.menuButton = new Button ({scene:this,x:width-120,y:60,
            width:200,height:80,
            color:PALETTE_HEX.White,text:"BACK",textConfig:TEXT_CONFIG.Heading3,textColor: PALETTE_RGBA.DarkerGrey,
            clickCallback:()=>{this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE)}});
    }
    update(time,dt){
        if (Phaser.Input.Keyboard.JustDown(this.KEYS.PAUSE)){
            this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE);
        }
    }
    createNewButton(fallacy){
        return new Button({scene:this, x:this.width/2,y:250,width:this.buttonWidth,height:this.buttonHeight,color:PALETTE_HEX.White,
            text:fallacy.name,textConfig:TEXT_CONFIG.Heading3,textColor:PALETTE_RGBA.DarkerGrey,
            clickCallback:()=>{this.scene.start(SCENE_KEYS.GAME_SCENE,{fallacies:[fallacy]})}});
    }
}