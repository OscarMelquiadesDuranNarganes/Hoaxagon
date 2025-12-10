import { IMAGE_KEYS, SCENE_KEYS, JSON_KEYS,ANIM_KEYS } from '../utils/CommonKeys.js'

//import { SceneKeys } from '../../assets/srcKeys.js'
import { PALETTE_HEX,PALETTE_RGBA } from "../utils/Palette.js";

export default class LoadScene extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        //super(SceneKeys.Load);
        super(SCENE_KEYS.LOAD_SCENE);
    }

    /**
     * Cargamos todos los assets que vamos a necesitar
     */
    preload() {
        let { width, height } = this.sys.game.canvas;
        const progress = this.add.graphics();
        this.load.on("progress",(value)=>{
                progress.clear();
                progress.fillStyle();
                progress.fillRect(0, height-100, 400 * width, 50);
        })
        this.load.on("complete",()=>{
            console.log("LoaderOut");
            this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE);
        })

            //* Music
            // this.load.audio(SoundKeys.Ambiance, 'assets/music/scify-theme.mp3')

            // Main Menu
            // this.load.image(TextureKeys.Health, 'assets/item/health.png');
        this.load.image(IMAGE_KEYS.TEMP_POST_CONTAINER, './assets/images/temp_post_container.png');
        this.load.image(IMAGE_KEYS.BOOST_STAR, './assets/images/boost_star.png');
        this.load.image(IMAGE_KEYS.TEMP_SPRITE, './assets/images/wigglytuff.png');
        this.load.spritesheet(IMAGE_KEYS.ICOSAMUEL,"./assets/images/ICOSAMUEL/icosamuel_spritesheet.png",{frameWidth:540,frameHeight:540});
        
        this.load.image(IMAGE_KEYS.BACKGROUND_TRIANGLE, './assets/images/background_triangle.png');
        this.load.image(IMAGE_KEYS.BACKGROUND_TRIANGLES, './assets/images/background_triangles.png');
        this.load.image(IMAGE_KEYS.INSPECTOR_BUTTON, './assets/images/inspector_button.png');
        this.load.image(IMAGE_KEYS.CHRONO_CLOCK, './assets/images/chrono_clock.png');
        this.load.image(IMAGE_KEYS.TRICTORIA, './assets/images/trictoria.png');
        this.load.image(IMAGE_KEYS.CUADRICIO, './assets/images/cuadricio.png');
        this.load.image(IMAGE_KEYS.PENTADEO, './assets/images/pentadeo.png');
        this.load.image(IMAGE_KEYS.HEXANDRA, './assets/images/hexandra.png');
        this.load.image(IMAGE_KEYS.CIRCLAUDIA, './assets/images/circlaudia.png');

        this.load.image(IMAGE_KEYS.ACCEPT, './assets/images/temp_accept_button.png');
        this.load.image(IMAGE_KEYS.DECLINE, './assets/images/temp_decline_button.png');

        this.load.json(JSON_KEYS.POST_LIST, './assets/objects/postList.json');
        this.load.json(JSON_KEYS.INFO_DB, './assets/objects/infoDatabase.json');

    }

    /**
    * Creación de los elementos de la escena principal de juego
    */
    create() {
        this.anims.create({
            key: ANIM_KEYS.ICOSAMUEL_IDLE,
            frames: this.anims.generateFrameNumbers(IMAGE_KEYS.ICOSAMUEL, {start:0,end:23}),
            frameRate: 24,
            repeat: -1
        });
        this.anims.create({
            key: ANIM_KEYS.ICOSAMUEL_DANCE,
            frames: this.anims.generateFrameNumbers(IMAGE_KEYS.ICOSAMUEL, {start:6,end:17}),
            frameRate: 24,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: ANIM_KEYS.ICOSAMUEL_RIGHT,
            frames: this.anims.generateFrameNumbers(IMAGE_KEYS.ICOSAMUEL, {start:11,end:16}),
            frameRate: 24,
            repeat: 0,
        }); 
        //this.scene.start(SCENE_KEYS.TEST_SCENE);
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