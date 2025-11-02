import { IMAGE_KEYS, SCENE_KEYS } from '../utils/CommonKeys.js'
//import { PostBoxObject } from '../systems/post_system/postBoxObject.js'
import { ScrollAreaContainer } from '../systems/scroll_system/scrollAreaContainer.js';

export default class TestScene extends Phaser.Scene {
	/**
	 * Escena de Título.
	 * @extends Phaser.Scene
	 */
	constructor() {
		//super(SceneKeys.TestScene);
        super(SCENE_KEYS.TEST_SCENE);
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {

		/*const text = "Esto es un texto de sección 0, esto de la 1. ¿Y esto de la 2?\n"
			+ "Esto de la 3, la 4 💡 ¡¡¡La 5 (incluido esto)!!!";

		let post = new PostBoxObject(this, 200, 200, text, 400);*/
		let scrollArea = new ScrollAreaContainer(this, 10, 10, 500, 500);
	}

	update(time, dt) {
        
    }

}