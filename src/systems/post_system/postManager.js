import { JSON_KEYS } from "../../utils/CommonKeys.js";
import { PostBoxObject } from "./postBoxObject.js";

export const FALLACY_TYPE = {
    ALL: "ALL",
    AD_HOMINEM: "AD_HOMINEM"
};

export const POST_WIDTH = 400;

/**
 * Class that handles the production of a random post from the list given a context of the
 * types of posts that it can build.
 */
export class PostManager {

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {Object}
     */
    postDataBase;

    /**
     * @type {Array<PostDef>}
     */
    _postList;

    /**
     * Keeps track of the current post element that the manager will build in the next `buildNewPost()` call.
     * @type {number}
     */
    _postListPosition;

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;

        this.postDataBase = scene.cache.json.get(JSON_KEYS.POST_LIST);
    }

    /**
     * 
     * @param {Array<String>} fallacyTypes
     */
    loadPosts(fallacyTypes) {
        
        // Ensuring the parameters are right
        console.assert(fallacyTypes instanceof Array, "fallacyType must be an Array");
        fallacyTypes.forEach((fallacyType) => {
            console.assert(fallacyType in FALLACY_TYPE, "All fallacyTypes elements must be a FALLACY_TYPE");
        });

        this._postList = []; // Clear

        this.postDataBase.posts.forEach((postDef) => {
            if(fallacyTypes.includes(FALLACY_TYPE.ALL) || fallacyTypes.includes(postDef.fallacyType))
                this._postList.push(postDef);
        });

        this.shufflePostList();

        this._postListPosition = 0;
    }

    /**
     * Randomize de post definition elements in _postList()
     */
    shufflePostList() {
        // Fisher-Yates algorithm to shuffle O(n)
        let i = this._postList.length;
        let aux, randIndx;

        // If there are elements to shuffle
        while(i) {
            // Random element in the not shuffled parto of the array
            randIndx = Math.floor(Math.random() * i--);

            // Exchange with the current index
            aux = this._postList[i];
            this._postList[i] = this._postList[randIndx];
            this._postList[randIndx] = aux;
        }
    }

    /**
     * Gets a Post Definition from the list, creates a `PostBoxObject` with it and returns it.
     * @returns {PostBoxObject}
     */
    buildNewPostObject() {
        this._postListPosition++;

        if(this._postListPosition >= this._postList.length) {
            this._postListPosition = 0;
            this.shufflePostList();
        }

        return new PostBoxObject(this.scene, 0, 0, this._postList[this._postListPosition].text, POST_WIDTH);
    }
}