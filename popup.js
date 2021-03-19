
window.onload = function() {
    document.getElementById("creds").focus();
    document.getElementById("creds").onsubmit = (e) => {
        setCredentials();
    }
}
function setCredentials() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let expireIn5Years = Math.round(Date.now() / 1000) + 5 * 365 * 24 * 60 * 60;
    let expireIn60Sec = Math.round(Date.now() / 1000) + 20;

    chrome.cookies.set({name: "username", url: "https://cate.doc.ic.ac.uk/*", expirationDate: expireIn60Sec, value: username});
    chrome.cookies.set({name: "password", url: "https://cate.doc.ic.ac.uk/*", expirationDate: expireIn60Sec,  value: password});

    chrome.extension.getBackgroundPage().submitCreds({username: username, password: password});

    window.close();
}