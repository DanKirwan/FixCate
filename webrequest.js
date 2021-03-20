
let auth = {confirmed: false, count : 0, password: null, username:null};
let _submitResolve;

let usernameDetails = {name :"username", url: "https://cate.doc.ic.ac.uk/"};
let passwordDetails = {name :"password", url: "https://cate.doc.ic.ac.uk/"};


function submitCreds(data) {
    _submitResolve(data);
}

function requestCredentials() {
    chrome.windows.create({url: "popup.html", type: "popup", focused: true, height:200, width:300}, function(win) {
        win._submitResolve = _submitResolve;
    });
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        let expireIn5Years = Math.round(Date.now() / 1000) + 5 * 365 * 24 * 60 * 60;
        chrome.cookies.set({...passwordDetails, expirationDate: expireIn5Years, value: "false"});
    }
});






chrome.webRequest.onAuthRequired.addListener(
    async function handler(details, callbackFn){


        let userResolver;
        let usernamePromise = new Promise((resolve) => userResolver = resolve);

        let passResolver;
        let passPromise= new Promise((resolve) => {passResolver = resolve});


        if(auth.username === null) {
            chrome.cookies.get(usernameDetails, (cookie) => {userResolver(cookie)});
            chrome.cookies.get(passwordDetails, (cookie) => {passResolver(cookie)});
            auth.username = await usernamePromise.then((cookie) => {return cookie ? cookie.value : null});
            auth.password = await passPromise.then((cookie) => {return cookie ? cookie.value : null});
        }

        if(auth.password === null || (!auth.confirmed && auth.count > 1)) {

            let promise;
            requestCredentials();
            promise = new Promise((resolve) => {

                _submitResolve = resolve;
            });
            await promise.then((data) => {
                auth.password = data.password;
                auth.username = data.username;
            });


        }
        auth.count ++;

        if(auth.count > 2) {
            auth.count = 0;
        }



        callbackFn({'authCredentials': {username: auth.username, password: auth.password}});

    },
    {urls:["https://cate.doc.ic.ac.uk/*"]},
    ['asyncBlocking']
);



chrome.webRequest.onCompleted.addListener(
    function handler() {
        auth.confirmed = true;
    },
    {urls:["https://cate.doc.ic.ac.uk/*"]}
);