
export class EvaluatedPostInfo {
    /**
     * @type {boolean}
     */
    postAccepted;

    /**
     * @type {Post}
     */
    postObjectDef;

    /**
     * @type {boolean}
     */
    playerSuccessed;

    /**
     * The sentence that has been selected by the player in the inspector mode.
     * @type {number}
     */
    sentenceSelectedID = -1;

    /**
     * The fallacy object that corresponds to the selected InfoBox in th inspector mode.
     * @type {Fallacy}
     */
    selectedFallacyObj = null;

    constructor(postAccepted, postObjectDef, playerSuccessed, sentenceSelectedID, selectedFallacyObjDef) {

        console.assert(typeof postAccepted === "boolean", "EvaluatedPostInfo: postAccepted is not a boolean");
        console.assert(postObjectDef !== null, "EvaluatedPostInfo: postObject is null");
        console.assert(
            Object.hasOwn(postObjectDef, "text") && 
            Object.hasOwn(postObjectDef, "fallacyType"), 
            "EvaluatedPostInfo: postObject is not a Post"
        );

        console.assert(typeof playerSuccessed === "boolean", "EvaluatedPostInfo: playerSuccessed is not a boolean");
        console.assert(typeof sentenceSelectedID === "number", "EvaluatedPostInfo: sentenceSelectedID is not a number");

        console.assert(
            selectedFallacyObjDef === null ||
            Object.hasOwn(selectedFallacyObjDef, "name") &&
            Object.hasOwn(selectedFallacyObjDef, "description"),
            "EvaluatedPostInfo: selectedFallacyObj is not a Fallacy"
        );

        this.postAccepted = postAccepted;
        this.postObjectDef = postObjectDef;
        this.playerSuccessed = playerSuccessed;
        this.sentenceSelectedID = sentenceSelectedID;
        this.selectedFallacyObj = selectedFallacyObjDef;
    }
}