
let secureDetails = {name :"secure", url: "https://cate.doc.ic.ac.uk/"};
let passDetails = {name : "password", url: "https://cate.doc.ic.ac.uk/"};
let userDetails = {name : "username", url: "https://cate.doc.ic.ac.uk/"};

window.onload = function() {
    let checkBox = document.getElementById("secure");
    chrome.cookies.get(secureDetails, (cookie) => {
        if(cookie) {
            checkBox.checked = (cookie.value === "true");
        }
    });
    checkBox.onclick = setSecurity;


    document.getElementById("reset").onclick = resetCreds;
};

function setSecurity() {
    let expireIn5Years = Math.round(Date.now() / 1000) + 5 * 365 * 24 * 60 * 60;
    let checked = document.getElementById("secure").checked;
    chrome.cookies.set({...secureDetails, expirationDate: expireIn5Years, value: checked ? "true" : "false"})


    if(!checked) {
        chrome.cookies.set({
            ...passDetails,
            expirationDate : 0,
            value : ""
        });
    }
}

function resetCreds() {

    chrome.cookies.set({
        ...passDetails,
        expirationDate : 0
    });

    chrome.cookies.set({
        ...userDetails,
        expirationDate : 0,
        value : ""
    });
}