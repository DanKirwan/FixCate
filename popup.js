
window.onload = function() {
    document.getElementById("creds").focus();
    document.getElementById("creds").onsubmit = (e) => {
        setCredentials();
    }
}
function setCredentials() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    chrome.extension.getBackgroundPage().submitCreds({username: username, password: password});
    window.close();
}