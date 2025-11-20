import { PALETTE_RGBA } from "./Palette.js";
import { TEXT_CONFIG } from "./textConfigs.js";
class Message extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,timer,width,height){
        super(scene,x,y,text);
        this.setOrigin(0,1);
        this.scene.add.existing(this);
        this.setWordWrapWidth(width);
        this.timermax = timer;
        this.timer = 0;
        this.yOffset = height*1.2;
        this.disable();
        this.setStyle(TEXT_CONFIG.Heading3);
        this.setColor(PALETTE_RGBA.DarkerGrey);
    }
    update(t,dt){
        if (this.active){
            this.timer+=dt;
            if (this.timer>=this.timermax) this.disable();
        }
    }
    reset(){
        this.setActive(true);
        this.setVisible(true);
        this.setY(0);
        this.scene.tweens.add({
            targets: this,
            ease:'Linear',
            loop: 0,
            alpha: {
                from: 2,
                to: 0,
                duration:this.timermax 
            },
        });
        this.timer = 0;
        console.log(this);
    }
    disable(){
        this.setActive(false);
        this.setVisible(false);
    }
    offsetMessage(){
        this.setY(this.y-=this.yOffset);
    }
}
export const MESSAGE_TYPE = {
    POINTS: "POINTS",
    STREAK: "STREAK",
    BONUS: "BONUS"
}
export default class ScoreScreen extends Phaser.GameObjects.Container{
    messageCount = 10;
    messages = [];

    constructor (scene,x,y,width,height){
        super(scene,x,y);
        this.scene.add.existing(this);
        this.setSize(width,height);
        this.messages = [];
        // this.add(this.scene.add.rectangle(0,0,width,height,0xffffff));
        for (let i = 0; i<this.messageCount;i++){
            var temp = new Message(scene,-width/2,-height/2,"",3000,width,40);
            this.messages.push(temp);
            this.add(temp);
        }
    }
    addNewMessage(type,number,number2){
        var text = "";
        switch(type){
            case MESSAGE_TYPE.POINTS:
                text = `+${number}!`;
                break;
            case MESSAGE_TYPE.STREAK:
                text = `${number}x COMBO! +${number2}!`;
                break;
            case MESSAGE_TYPE.BONUS:
                text = `BONUS! +${number}!`;
                break;
        }
        this.deployMessage(text);
    }
    deployMessage(text){
        let i = 0;
        while (i<this.messageCount && this.messages[i].active) i++;
        if (i>=this.messageCount) console.log("POOL DEPLETED");
        else{
            for (let j = 0; j<this.messageCount;j++){
                if (j!=i && this.messages[j].active) this.messages[j].offsetMessage(); 
            }
            this.messages[i].text = text;
            this.messages[i].reset();
        }
    }
    update(t,dt){
        this.messages.forEach(element =>{
            element.update(t,dt);
        })
    }
}