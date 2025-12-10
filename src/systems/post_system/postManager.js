import { JSON_KEYS } from "../../utils/CommonKeys.js";
import { PostBoxObject } from "./postBoxObject.js";
import { TEXT_CONFIG } from "../../utils/textConfigs.js";
import { PALETTE_RGBA } from "../../utils/Palette.js";
import { EvaluatedPostInfo } from "./evaluatedPostInfo.js";
import { InfoBox } from "../../utils/infoBox.js";

export const FALLACY_TYPE = {
    ALL: "ALL",
    AD_HOMINEM: "AD_HOMINEM"
};

export const POST_VEREDICT = {
    SUCCESSFUL: "SUCCESSFUL",
    FAILURE: "FAILURE"
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
     * @type {Array<String>}
     */
    fallacyTipeNames = [];

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
     * @type {Array<EvaluatedPostInfo>}
     */
    evaluatedPostsInfo = new Array();

    /**
     * @type {PostBoxObject}
     */
    currentPostObject = null;

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
        
        const fallacyInfoDataBase = scene.cache.json.get(JSON_KEYS.INFO_DB);
        this.fallacyTipeNames.map((fallacyType) => fallacyType.name);
    }

    /**
     * Fills the _postList array with the posts from the database that match the given fallacy type names.
     * @param {Array<String>} fallacyTypes
     */
    loadPosts(fallacyTypes = []) {
        
        // Ensuring the parameters are right
        if(fallacyTypes.length > 0) {
            console.assert(fallacyTypes instanceof Array, "fallacyType must be an Array");
            fallacyTypes.forEach((fallacyType) => {
                console.assert(this.fallacyTipeNames.includes(fallacyType), "All fallacyTypes elements must be valid");
            });            
        }

        this._postList = []; // Clear

        this.postDataBase.posts.forEach((postDef) => {
            if(
                fallacyTypes.length === 0 ||
                fallacyTypes.includes(postDef.fallacyType) ||
                postDef.fallacyType === "NONE"
                )
                this._postList.push(postDef);
        });

        this.shufflePostList();

        console.log(this._postList);

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

        return new PostBoxObject(this.scene, 0, 0, this.currentPostDefinition.text, POST_WIDTH,this.currentPostDefinition.user);
    }

    /**
     * Eliminates de current PostBoxObject in differet ways depending on whether the post veredict
     * is correct or not. The parameter veredictResult is a constant that belongs to `POST_VEREDICT`
     * @param {String} veredictResult 
     */
    replacePostInUI(veredictResult) {
        console.assert(veredictResult in POST_VEREDICT, "veredictResult must be a POST_VEREDICT");
        
        if(veredictResult === POST_VEREDICT.SUCCESSFUL) {
            this.scene.tweens.chain({
                targets: this.currentPostObject,
                ease: "Linear",
                repeat: 0,
                duration: 200,

                tweens: [
                    {
                        scaleX: 1.3,
                        scaleY: 0.7,
                        duration: 100
                    },
                    {
                        scaleX: 0.7,
                        scaleY: 1.3,
                        duration: 100
                    },
                    {
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100
                    },
                ],

                onComplete: () =>{
                    this.currentPostObject.destroy();
                    this.createPostInUI();
                },
            });

            return;
        }

        if(veredictResult === POST_VEREDICT.FAILURE) {
            this.scene.tweens.chain({
                targets: this.currentPostObject,
                ease: "Linear",
                repeat: 0,
                duration: 800,

                tweens: [
                    {
                        rotation: 0.2,
                        duration: 50,
                    },
                    {
                        rotation: -0.2,
                        duration: 50,
                    },
                    {
                        rotation: 0.2,
                        duration: 50,
                    },
                    {
                        rotation: -0.2,
                        duration: 50,
                    },
                ],

                onComplete: () =>{
                    this.currentPostObject.destroy();
                    this.createPostInUI();
                },
            });
        }
    }

    createPostInUI() {
        const newPost = this.buildNewPostObject();
        newPost.setScale(0);

        const appearTween = this.scene.tweens.add({
            targets: newPost,
            ease: "Linear",
            repeat: 0,
            duration: 250,
            props: {
                scaleX: 1,
                scaleY: 1,
            },
        });

        this.currentPostObject = newPost;
        this.currentPostObject.setPosition(this.postBoxCenterX - 200, this.postBoxCenterY);

        const yPos = this.currentPostObject.y;

        this.scene.tweens.chain({
            targets: this.currentPostObject,
            ease: "Linear",
            repeat: -1,
            delay: 0,
            duration: 800,

            tweens: [
                {
                    y: yPos + 4,
                    duration: 1000,
                },
                {
                    y: yPos - 4,
                    duration: 2000,
                },
                {
                    y: yPos,
                    duration: 1000,
                },
            ],
        });

        this.postUserInfo.setText("Usuario: " + this.currentPostDefinition.user);
    }

    /**
     * Registers a new `EvaluatedPostInfo` in the manager list of evaluated posts.
     * @param {boolean} postAccepted
     * @param {boolean} playerSuccessed 
     * @param {InfoBox} selectedFallacyObj 
     */
    savePostEvaluation(postAccepted, playerSuccessed, selectedFallacyObj) {
        let selectedSentenceID = -1;

        // We check if the player has justified his veredict by selecting a sentence
        if(this.currentPostObject.wordBlockContainer.getSelectedSentenceIDs().length > 0)
            selectedSentenceID = this.currentPostObject.wordBlockContainer.getSelectedSentenceIDs()[0]; // We can ensure there is only one selected

        this.evaluatedPostsInfo.push(
            new EvaluatedPostInfo(postAccepted, this.currentPostDefinition, playerSuccessed, selectedSentenceID, selectedFallacyObj)
        );
        console.log(this.evaluatedPostsInfo);
    }

    /**
     * Handles the load of a new post box.
     * @param {String} veredictResult 
     */
    loadNextPostInUI(veredictResult) {
        if(this.currentPostObject)
            this.replacePostInUI(veredictResult);
        else
            this.createPostInUI();
    }
}