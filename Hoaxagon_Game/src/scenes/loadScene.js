//import { SceneKeys } from '../../assets/srcKeys.js'


export default class LoadScene extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        //super(SceneKeys.Load);
        super();
    }

    /**
     * Cargamos todos los assets que vamos a necesitar
     */
    preload() {
        let { width, height } = this.sys.game.canvas;
        const progress = this.add.graphics();
        this.load.on("progress",(value)=>{
                progress.clear();
                progress.fillStyle('rgba(160, 160, 160, 1)');
                progress.fillRect(0, height-100, 400 * width, 50);
        })
        this.load.on("complete",()=>{
            console.log("LoaderOut");
            this.scene.start("mainMenu");
        })

            //* Music
            // this.load.audio(SoundKeys.Ambiance, 'assets/music/scify-theme.mp3')

            // Main Menu
            // this.load.image(TextureKeys.Health, 'assets/item/health.png');
    }

    /**
    * Creación de los elementos de la escena principal de juego
    */
    create() {
        // this.scene.start(SceneKeys.MainMenu);
    }
    
    /*
    createAnimations()
    {
        this.anims.create({
			key: AnimationKeys.Player_Idle,
			frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:0, end:3}),
			frameRate: 5,
			repeat: -1
		});
    }
    */
}