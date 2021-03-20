
window.onload = function() {
    let creds = document.getElementById("creds")
    creds.focus();
    creds.onsubmit = (e) => {
        setCredentials();
    }

    chrome.cookies.get({name: "username", url: "https://cate.doc.ic.ac.uk/"}, (cookie) => {

        if (cookie && cookie.value !== "" && document.getElementById("username").value === "") {
            document.getElementById("username").value = cookie.value;
            document.getElementById("password").focus();
        }

    });
}
function setCredentials() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let expireIn5Years = Math.round(Date.now() / 1000) + 5 * 365 * 24 * 60 * 60;

    chrome.cookies.set({name: "username", url: "https://cate.doc.ic.ac.uk/", expirationDate: expireIn5Years, value: username});
    chrome.cookies.get({name: "secure", url: "https://cate.doc.ic.ac.uk/"}, (cookie) => {
        if(cookie && cookie.value === "true") {

            chrome.cookies.set({
                name: "password",
                url: "https://cate.doc.ic.ac.uk/",
                expirationDate: expireIn5Years,
                value: password
            });
        }

        window.close();
    });


    chrome.extension.getBackgroundPage().submitCreds({username: username, password: password});
}