function makeRipple(e) {
    let button = e.currentTarget;


    let ripple = document.createElement("span");
    let diameter = Math.max(button.clientWidth, button.clientHeight);

    let btnRect = button.getBoundingClientRect();

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - (btnRect.left + button.clientWidth / 2)}px`;
    ripple.style.top = `${e.clientY - (btnRect.top + button.clientWidth / 2)}px`;

    ripple.classList.add("ripple");


    ripple.addEventListener("animationend", () => button.removeChild(ripple));

    button.appendChild(ripple);
}


function rippleButtons(doc) {
    let buttons = document.getElementsByTagName("button");

    for(let b of buttons) {
        b.addEventListener("mousedown", makeRipple);
    }
}