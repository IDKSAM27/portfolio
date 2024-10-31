import { k } from "./kaboomCtx";

//The width of the spritesheet.png is 624 pixels and each block is 16 px, so simply divide and you'll get 39
//Same formula for slixeY, 496 px and each block 16 px, we get 31
k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39, 
    sliceY: 31,
});