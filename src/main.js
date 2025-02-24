import { setupExitButton } from "./utils.js";
import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

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




    // Show dialogue box on page load
    setTimeout(() => {
        displayDialogue("Welcome to the game! Click to move around.", () => {});
    }, 500); // 500ms delay
    


    
    const mapData = await(await fetch("./map.json")).json() //if await not used, the rest of the code will continue to run before fetching.
    
    const layers = mapData.layers; //load or eccess layers 

    // our first game object = contains diff components, like sprite layers and stuff.
    // two ways to create game objects: make and add, make will create an obj but not display, add will create and display
    const map = k.add([     //use add, which displays the map, before it was make!
        k.sprite("map"), // we give key to sprite, the key "map" is set in loadSprite.
        k.pos(0),
        //create a scaleFactor constant in constants.js
        k.scale(scaleFactor),
    ]);

    const player = k.make([ //before, it was make, hence the player was not visible, now changed to add
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
            speed: 350,
            direction: "down",
            isInDialogue: false, //make sure that player don't move while in dialogue box until press close button
        },
        "player", //when you want to check for collision, it lets you know ,yes this collided with that
        // {z:2}
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
                        displayDialogue(dialogueData[boundary.name], () => (player.isInDialogue = false)) //set it to false so the player can move again
                    })
                }
            }
            continue;
        }

        if (layer.name === "spawnpoint") {
            for(const entity of layer.objects){
                if(entity.name === "player"){
                    player.pos = k.vec2(    //acces the pos which was empty above in the code
                       (map.pos.x + entity.x) * scaleFactor,
                       (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k);

    k.onResize(() => {
        k.camPos(player.pos.x, player.pos.y + 100);
    });

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y + 100);
    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos()); //if we use only mousePos() we will get stuck eventually, that's why we use k.toWorld
        player.moveTo(worldMousePos, player.speed); //TODO: read about worldMousePos

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if( //plays moving up anim when char walks up
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up" //TODO: try to remove this line.

        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        }

        if( //plays moving down anim when char walks down
            mouseAngle > -upperBound &&
            mouseAngle < -lowerBound &&
            player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        }

        if(Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if(player.curAnim() !== "walk-side") {
                player.play("walk-side");
            }
            player.direction = "right";
            return;
        }

        if(Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if(player.curAnim() !== "walk-side") {
                player.play("walk-side");
            }
            player.direction = "left";
            return;
        }


    });

    k.onMouseRelease(() => {
        if(player.direction === "down") {
            player.play("idle-down");
            return;
        }
        if(player.direction === "up") {
            player.play("idle-up");
            return;
        }

        player.play("idle-side")
    });

    
}); 

setupExitButton();

// quite important
k.go("main"); //goes to main
