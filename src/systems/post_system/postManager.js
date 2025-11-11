import { JSON_KEYS } from "../../utils/CommonKeys.js";
import { PostBoxObject } from "./postBoxObject.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_RGBA } from "../../utils/Palette.js";

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
     * The object from the JSON that defines the current post that the PostManager has generated.
     * @type {PostDef}
     */
    currentPostDefinition;

    /**
     * @type {Phaser.GameObjects.Container}
     */
    postFieldContainer;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    userNameTag;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    userPicture;

    /**
     * @type {PostBoxObject}
     */
    currentPostObject;

    /**
     * @type {Array<PostDef>}
     */
    _postList;

    /**
     * Keeps track of the current post element that the manager will build in the next `buildNewPost()` call.
     * @type {number}
     */
    _postListPosition;
    
    postBoxCenterX;
    postBoxCenterY;

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        console.assert(scene instanceof Phaser.Scene, "PostManager: scene is not a Phaser.Scene");

        this.scene = scene;

        this.postBoxCenterX = this.scene.cameras.main.centerX * 0.8;
        this.postBoxCenterY = this.scene.cameras.main.centerY;

        this.postUserInfo = this.scene.add.text(
            900, 150, 
            "Usuario: ", 
            TEXT_CONFIG.SubHeading
        )
        .setColor(PALETTE_RGBA.White);

        this.postDataBase = scene.cache.json.get(JSON_KEYS.POST_LIST);

        this.init(); // Set the initial state of the components the manager controls
    }

    init() {
        this.loadPosts(["ALL"]);
        this.loadNextPostInUI();
    }

    /**
     * Fills the _postList array with the posts from the database that match the given fallacy types.
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

        this.currentPostDefinition = this._postList[this._postListPosition];

        return new PostBoxObject(this.scene, 0, 0, this.currentPostDefinition.text, POST_WIDTH);
    }

    loadNextPostInUI() {
        const oldPost = this.currentPostObject;
        const newPost = this.buildNewPostObject();
        newPost.setScale(0);

        const appearTween = this.scene.tweens.add({
            targets: newPost,
            ease: "Linear",
            repeat: 0,
            duration: 200,
            props: {
                scaleX: 1,
                scaleY: 1,
            },
        });

        if(oldPost){
            const destroyTween = this.scene.tweens.add({
                targets: oldPost,
                ease: "Linear",
                repeat: 0,
                duration: 200,
                props: {
                    scaleX: 0,
                    scaleY: 0,
                },
                onComplete: () =>{
                    oldPost.destroy();
                },
            });
        }

        this.currentPostObject = newPost;
        this.currentPostObject.setPosition(this.postBoxCenterX - 200, this.postBoxCenterY);

        this.postUserInfo.setText("Usuario: " + this.currentPostDefinition.user);
        //this.userPicture.setTexture(newPost.userPicture);
    }
}