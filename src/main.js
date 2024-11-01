import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";

//The width of the spritesheet.png is 624 pixels and each block is 16 px, so simply divide and you'll get 39
//Same formula for slixeY, 496 px and each block 16 px, we get 31
//Set the animations id from the spritesheet.png
k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39, 
    sliceY: 31,
    anims: {
        "idle-down": 944,
        "idle-side": 983,
        "idle-up": 1022,
        "walk-up": {from: 1022, to: 1025, loop: true, speed: 8},
        "walk-down": {from: 944, to: 947, loop: true, speed: 8},
        "walk-side": {from: 983, to: 986, loop: true, speed: 8},
    },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

//this creates a scene, a code which is going to run, before doing that specify k.go() function.
//by default it goes to main
k.scene("main", async() => { //async is used bcs we will be getting map data using fetch call
    const mapData = await(await fetch("./map.json")).json() //if await not used, the rest of the code will continue to run before fetching.
    
    const layers = mapData.layers; //load or eccess layers 

    // our first game object = contains diff components, like sprite layers and stuff.
    // two ways to create game objects: make and add, make will create an obj but not display, add will create and display
    const map = k.make([
        k.sprite("map"), // we give key to sprite, the key "map" is set in loadSprite.
        k.pos(0),
        //create a scaleFactor constant in constants.js
        k.scale(scaleFactor),
    ]);

    const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}),
        k.area({
            //this shape will a create a collision layer for the sprite.
            shape: new k.Rect(k.vec2(0, 3),10, 10), //vec2 take in x and y coordinates and width and height being the 2nd and 3rd param
        }),
        k.body(), // makes our player a tangible, physics obj, which can collide which other physics obj

        //TODO: try to change or delete the center value to see the difference.
        k.anchor("center"), //use it to draw the player from the center and not top-left corner
        k.pos(),
        k.scale(scaleFactor),
        //the below vars can be accessed by ex. (player.speed)
        {
            speed: 250,
            direction: "down",
            isInDialogue: false, //make sure that player don't move while in dialogue box until press close button
        },
        "player", //when you want to check for collision, it lets you know ,yes this collided with that
    ]);

    for(const layer of layers){
        if(layer.name === "boundaries"){
            for(const boundary of layer.objects){
                map.add([ // same as player, creates a static collision layer over all the boundaries
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true}),
                    k.pos(boundary.x, boundary.y),
                    boundary.name, //acts as tag, this is how we will identify what is boundary is.
                ]);

                if(boundary.name){
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        // TODO:
                    })
                }
            }
        }
    }
}); 

k.go("main"); //