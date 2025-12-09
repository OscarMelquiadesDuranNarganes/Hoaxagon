import DialogueNode from "./dialogueNode.js";
export default class DialogueChain{
    /**
     * @type {array<DialogueNode>}
     */
    dialogueNodes = [];

    /**
     * @type {array<DialogueNode>}
     */
    dialogueCheckpoints = [];

    currentIndex;

    /**
     * @type {boolean}
     */
    active = false;

    constructor(){
        this.dialogueNodes = [];
        this.dialogueCheckpoints = [0];
        this.currentIndex = 0;
    }

    addNode(node){
        this.dialogueNodes.push(node);
        return node;
    }
    addCheckpoint(i){
        this.dialogueCheckpoints.push(i);
    }
    toCheckpoint(i){
        this.toNode(this.dialogueCheckpoints[i]);
    }
    toNode(i){
        this.dialogueNodes[i].setVisible(false);
        this.currentIndex = i;
        if (i>this.dialogueNodes.length)
            this.dialogueNodes[i].setVisible(true);
    }

    /**
     * 
     * @param {array{Object}} chainInfo 
     */
    processChain(chainInfo,scene,x,y){
        let i = 0;
        chainInfo.lines.forEach(element => {
            element.links.forEach(element => {
                if (element == "next") element = i+1;
                if (element == "back") element = i-1;
            })
            var node = new DialogueNode({scene:scene,
                x:x,
                y:y,
                text:element.text,
                prompts:element.prompts,
                links:element.links});

            let j = 0;
            node.promptText.forEach(element =>{
                element.on("mousedown",()=>{
                    this.toNode(node.links[j]);
                })
                j++;
            })

            this.addNode(node);
            i++;
        });
        chainInfo.checkpoints.forEach(element=>{
            this.addCheckpoint(element);
        })
    }
}