
let auth = {username : "", password : "", confirmed: false, count : 0};
let _submitResolve;

function submitCreds(data) {
    _submitResolve(data);
}

function requestCredentials() {
    chrome.windows.create({url: "popup.html", type: "popup", focused: true, height:200, width:300}, function(win) {
        win._submitResolve = _submitResolve;
    });
}



chrome.webRequest.onAuthRequired.addListener(
    async function handler(details, callbackFn){
        let promise;

        if(!auth.confirmed && auth.count === 0) {
            requestCredentials();
            promise = new Promise((resolve) => {

                _submitResolve = resolve;
            });
            await promise.then((data) => {
                auth.username = data.username;
                auth.password = data.password;
            })
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