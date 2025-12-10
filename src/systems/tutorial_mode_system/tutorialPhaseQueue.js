export class TutorialPhaseQueue {

    /**
     * @type {Array<function>}
     */
    phaseEvents = new Array();

    /**
     * Adds to the queue a function (set of actions and/or declarations of scene objects).
     * @param {function} phaseEvent 
     */
    pushPhase(phaseEvent) {
        console.assert(typeof phaseEvent === 'function', "TutorialPhaseQueue: phaseEvent must be a function");

        this.phaseEvents.push(phaseEvent);
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
        if(this.phaseEvents.length === 0) return null;
        this.phaseEvents[0]();
    }
}