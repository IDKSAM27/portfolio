export function displayDialogue(text, onDisplayEnd){ //onDisplayEnd is the function which will run the text is visible
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block";

    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if(index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }

        clearInterval(intervalRef);
    }, 1); //this function in executed every 5 seconds
    //I have named or set a var to setInterval so that it could be cleared using clearInterval

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }

    closeBtn.addEventListener("click", onCloseBtnClick);  
}

// export function displayDialogue(text, onDisplayEnd, autoClose = false) { 
//     const dialogueUI = document.getElementById("textbox-container");
//     const dialogue = document.getElementById("dialogue");
//     const closeBtn = document.getElementById("close");

//     dialogueUI.style.display = "block";
//     dialogue.innerHTML = text;

//     let timeoutRef;
//     if (autoClose) {
//         timeoutRef = setTimeout(() => {
//             onCloseBtnClick(); // Close only the initial dialogue box
//         }, 3000);
//     }

//     function onCloseBtnClick() {
//         onDisplayEnd();
//         dialogueUI.style.display = "none";
//         dialogue.innerHTML = "";
//         if (autoClose) {
//             clearTimeout(timeoutRef);
//         }
//         closeBtn.removeEventListener("click", onCloseBtnClick);
//     }

//     closeBtn.addEventListener("click", onCloseBtnClick);  
// }

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    if(resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return;
    }

    k.camScale(k.vec2(1.3));
}

export function setupExitButton() { // The exit button
    const exitButton = document.querySelector(".exitbutton");
    
    exitButton.addEventListener("click", () => {
        //location.reload(); // Reloads the page
        //window.location.href = "landing.html";
        window.location.href = "https://sampreetpatil.com/";
        // location.reload();
    });
}
