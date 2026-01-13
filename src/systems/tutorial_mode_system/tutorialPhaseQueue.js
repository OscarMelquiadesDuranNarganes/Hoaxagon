export class TutorialPhaseQueue {

    /**
     * @type {Array<function>}
     */
    phaseEvents = new Array();

    /**
     * @type {Phaser.Scene}
     */
    scene;

    constructor(scene) {
        console.assert(scene instanceof Phaser.Scene, "TutorialPhaseQueue: scene must be an scene");
        this.scene = scene;
    }

    /**
     * Adds to the queue a function (set of actions and/or declarations of scene objects).
     * @param {function} phaseEvent 
     */
    pushPhase(phaseEvent) {
        console.assert(typeof phaseEvent === 'function', "TutorialPhaseQueue: phaseEvent must be a function");

        this.phaseEvents.push(phaseEvent);
    }

    pushPhaseDelay(time) {
        this.pushPhase(() => {
            this.scene.time.addEvent({
                delay: time, // ms
                callback: () => {
                    this.pop();
                    this.execCurrentPhase(); // Executes the next phase
                }
            });
        });
    }

    /**
     * Pops the first stored function in the queue.
     * @returns {function}
     */
    pop() {
        if(this.phaseEvents.length === 0) return null;
        return this.phaseEvents.shift();
    }

    /**
     * Returns the function in the top.
     * @returns {function}
     */
    head() {
        if(this.phaseEvents.length === 0) return null;
        return this.phaseEvents[0];
    }

    /**
     * Executes the function in the head.
     */
    execCurrentPhase() {
        if(this.phaseEvents.length === 0) return;
        this.phaseEvents[0]();
    }
}