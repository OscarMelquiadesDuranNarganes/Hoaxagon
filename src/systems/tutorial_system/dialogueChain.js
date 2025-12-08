import DialogueNode from "./dialogueNode.js";
export default class DialogueChain{
    /**
     * @type {array{DialogueNode}}
     */
    dialogueNodes = [];

    /**
     * @type {array{DialogueNode}}
     */
    dialogueCheckpoints = [];

    /**
     * @type {boolean}
     */
    active = false;

    constructor(){
        this.dialogueNodes = [];
        this.dialogueCheckpoints = [];
    }

    addNode(node, lockout){
        this.dialogueNodes.push(node);
        return node;
    }
    addCheckpoint(){
        this.dialogueCheckpoints.push(this.dialogueLast);
    }
    toCheckpoint(i){
        this.dialogueCurrent = this.dialogueCheckpoints[i];
    }
}