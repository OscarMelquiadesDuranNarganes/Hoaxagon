import { WordBlock } from './wordBlock.js'

/**
 * Container that keeps a list of `WordBlock` that form part of a sencence (the words contain
 * the same `sentenceID` value) in order to form a text box with a fixed width.
 */
export class WordBlockContainer extends Phaser.GameObjects.Container {

    /**
     * Space between text lines.
     * @type {number}
     */
    lineSpacing = 0;

    /**
     * Array of `WordBlock` objects.
     * @type {Array(WordBlock)}
     */
    wordList = new Array();

    /**
     * @type {String}
     */
    textFontFamily;

    /**
     * @type {number}
     */
    textFontSize;

    /**
     * @type {number}
     */
    lineMaxWidth;

    /**
     * Whether the contined WordBlocks can bee selected and highlighted or not.
     * It depends on the state of inspector mode.
     * @type {boolean}
     */
    wordBlockSelectionEnabled = true;
    
    /**
     * In which line is the container currently adding `WordBlock` objects.
     * @type {number}
     */
    _currentLineIndex = 0;

    /**
     * How long the line is in width. Used to control when is it necessary to continue 
     * in the next line.
     * @type {number}
     */
    _currentLineWidth = 0;

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} positionX 
     * @param {number} positionY 
     */
    constructor(scene, positionX, positionY, textFontFamily, textFontSize, lineMaxWidth) {
        super(scene, positionX, positionY);
        
        this.lineMaxWidth = lineMaxWidth;
        this.textFontSize = textFontSize;
        this.textFontFamily = textFontFamily;

        scene.add.existing(this);

        
        scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer, game_objects) => {
		 	game_objects.forEach((game_object) => this.handleWordBlockSelection(game_object));
		});
        
    }

    /**
     * Returns the size that a `WordBlock` would have.
     * @param {String} str
     * @returns {Phaser.Types.GameObjects.Text.TextMetrics}
     */
    getSizeOfText(str) {
        if (!this.textFontFamily || !this.textFontSize) {
            console.error("Font not defined correctly.");
            return { width: 0, height: 0 };
        }

        // Define the style of the text that we are considering 
        const styleConfig = {
            fontFamily: this.textFontFamily,
            fontSize: this.textFontSize,
        };

        const tempText = new Phaser.GameObjects.Text(this.scene, 0, 0, str, styleConfig);

        const metrics = {
            width: tempText.width,
            height: tempText.height
        };

        tempText.destroy(); 

        return metrics;
    }

    /**
     * Creates a `WordBlock` with the passed string and its sentenceID. If it is necessary it
     * creates more than one `WordBlock` object to distribute it through multiple lines.
     * @param {String} wordString
     * @param {number} sentenceID
     */
    buildAndAddWord(wordString, sentenceID) {     
        const WORD_SIZE = this.getSizeOfText(wordString);

        const LINE_HEIGHT = this.getSizeOfText('A').height;

        let leftoverWordPart = "";

        // Handling where and how the WordBlock is positioned
        if(WORD_SIZE.width <= this.lineMaxWidth) {
            // The word only fits entirely in the next line
            if(this._currentLineWidth + WORD_SIZE.width > this.lineMaxWidth) {
                this._currentLineIndex++;
                this._currentLineWidth = 0;
            }
        }
        else { // The word needs to ocupy more than one single line
            this._currentLineIndex++;
            this._currentLineWidth = 0;

            let i = 0;
            let w = this.getSizeOfText(wordString[0]).width; 

            while(i < wordString.length && w <= this.lineMaxWidth) {
                w += this.getSizeOfText(wordString[i]).width;
                i++;
            }

            if(i < wordString.length) { // The whole word didn't fit -> word divission
                leftoverWordPart = wordString.slice(i);
                wordString = wordString.slice(0, i);
            }  
        }

        // Creting the WordBlock
        const posX = this._currentLineWidth;
        const posY = this._currentLineIndex * (LINE_HEIGHT + this.lineSpacing);

        const wordBlock = new WordBlock(this.scene, posX, posY, wordString, sentenceID, this.textFontFamily, this.textFontSize);
        this.add(wordBlock);
        this.wordList.push(wordBlock);

        // Updating the used width in the line
        this._currentLineWidth += this.getSizeOfText(wordString).width;
         
        // Repeat process with the rest of the word if needed
        if(leftoverWordPart != "")
            this.buildAndAddWord(leftoverWordPart, sentenceID);
    }

    /**
     * Uses buildAndAddWord() to create sentences made out of `WordBlock`s
     * @param {String} text 
     */
    buidText(text) {
        let currentSentenceID = 0;
        let currentBuiltWord = "";

        const separatorTypes = [',', '.', ';', ':'];
        const openingMarkTypes = ['¿', '¡'];
        const closingMarkTypes = ['?', '!'];
        const spaceTypes = ['\n', '\t', ' '];

        let lastChar = "";
        let emptySentence = true; 

        for(let i = 0; i < text.length; i++) {

            // Chars that create word separation
            if(spaceTypes.includes(text[i])){
                // The current word is finished and built
                this.buildAndAddWord(currentBuiltWord, currentSentenceID);
                currentBuiltWord = "";

                // Space chars handling
                if(text[i] === '\n') {
                    this._currentLineIndex++;
                    this._currentLineWidth = 0;
                }
                else if(text[i] === '\t') {
                    this.buildAndAddWord("   ", currentSentenceID);
                }
                else if(text[i] === ' ') {
                    this.buildAndAddWord(" ", currentSentenceID);
                }
            }
            // If there is a point, coma, etc.
            else if(separatorTypes.includes(text[i])) {
                currentBuiltWord += text[i];
                this.buildAndAddWord(currentBuiltWord, currentSentenceID);

                currentBuiltWord = "";
                currentSentenceID++;
                emptySentence = true; // After a point can come a ¿ or ¡, what creates anoder index unnecessarily
            }
            // If there is a ¿¿?? or ¡¡!!
            else if(openingMarkTypes.includes(text[i]) || closingMarkTypes.includes(text[i])) {
                // Start new sentence context           // To allow ¿¿¿ or ¡¡¡
                if(openingMarkTypes.includes(text[i]) && spaceTypes.includes(lastChar) && !emptySentence) {
                    currentSentenceID++;
                }

                currentBuiltWord += text[i]; // Always add the char

                // In case of: ¡¡¿¿what???!!¿sure?
                if(i < text.length-1 && closingMarkTypes.includes(text[i]) && !closingMarkTypes.includes(text[i+1])) {
                    this.buildAndAddWord(currentBuiltWord, currentSentenceID);
                    currentBuiltWord = "";
                    currentSentenceID++;
                }
            }
            // By default characters
            else {
                currentBuiltWord += text[i];
                emptySentence = false;
            }

            lastChar = text[i];
        }

        if(currentBuiltWord != "") { // Register the last part of the text
            this.buildAndAddWord(currentBuiltWord, currentSentenceID);
        }
    }

    /**
     * Gets a sentence highlighted if the user clicks on one `WordBlock` that forms part of the
     * sentence.
     * @param {Phaser.GameObjects} clickedObject 
     */
    handleWordBlockSelection(clickedObject) {
        if(!(clickedObject instanceof WordBlock)) return;

        this.wordList.forEach((wordBlock) => {
            wordBlock.setSelectionState(wordBlock.sentenceID == clickedObject.sentenceID);
        });
    }
}