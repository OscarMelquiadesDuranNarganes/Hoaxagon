const { KeyCodes } = Phaser.Input.Keyboard;
export const KEYBINDS = {
    //#region gameplay
    PAUSE: KeyCodes.ESC,
    INSPECT: KeyCodes.SPACE,
    ACCEPT: KeyCodes.A,
    REJECT: KeyCodes.D,
    //#endregion

    //#region debug
    TIMEUP: KeyCodes.Q,
    TIMEDOWN: KeyCodes.W,
    SUCCEED: KeyCodes.E,
    FAIL: KeyCodes.R
    //#endregion
};