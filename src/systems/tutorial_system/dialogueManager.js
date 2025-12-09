import DialogueNode from "./dialogueNode.js";
import DialogueChain from "./dialogueChain.js";
export default class DialogueManager{
    /**
     * @type {array{DialogueChain}}
     */
    dialogueChains = [];
    constructor(scene,x,y){
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param {array{Object}} chainInfo 
     */
    processChain(chainInfo){
        var newchain = new DialogueChain();
        let i = 0;
        chainInfo.lines.forEach(element => {
            element.links.forEach(element => {
                if (element == "next") element = i+1;
                if (element == "back") element = i-1;
            })
            var node = new DialogueNode({scene:this.scene,
                x:this.x,
                y:this.y,
                text:element.text,
                prompts:element.prompts,
                links:element.links});
            newchain.addNode(node);
            i++;
        });
        chainInfo.checkpoints.forEach(element=>{
            newchain.addCheckpoint(element);
        })

    }
}

