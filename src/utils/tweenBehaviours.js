export class TweenBahaviour {
    
    static SiceBounceChain(scene, gameObjects, initialSizeX, initialSizeY, maxSizeX, maxSizeY, durationTime) {
        return this.scene.tweens.chain(
            {
                targets: gameObjects,
                ease: 'Power1',
                duration: 20,
                loop: 0,
                tweens: [
                    { scaleY: maxSizeY, scaleX: maxSizeX, duration: durationTime / 2 },
                    { scaleY: initialSizeY,   scaleX: initialSizeX, duration: durationTime / 2 }
                ]
            });
    }

    static SiceBounceSequence(scene, gameObjects, initialSizeX, initialSizeY, maxSizeX, maxSizeY, durationTime) {
        return [
            this.scene.tweens(
            {
                targets: gameObjects,
                ease: 'Power1',
                duration: durationTime / 2,
                loop: 0,
                scaleY: maxSizeY, scaleX: maxSizeX
            }),
            this.scene.tweens(
            {
                targets: gameObjects,
                ease: 'Power1',
                duration: durationTime / 2,
                loop: 0,
                scaleY: initialSizeY,   scaleX: initialSizeX
            })
        ];
    }
};