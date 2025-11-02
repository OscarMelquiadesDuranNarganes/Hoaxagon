import { JSON_KEYS } from "../../utils/CommonKeys.js";
import { PostBoxObject } from "./postBoxObject.js";

export const FALLACY_TYPE = {
    ALL: "ALL",
    AD_HOMINEM: "AD_HOMINEM"
};

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
     * @type {Array(Post)}
     */
    postList;

    constructor() {

        this.postList = this.scene.cache.json.get(JSON_KEYS.POST_LIST);
    }

    /**
     * 
     * @param {FALLACY_TYPE} fallacyType 
     */
    loadPosts(fallacyType) {
        
        
    }
}