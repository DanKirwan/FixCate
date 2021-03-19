
let auth = {confirmed: false, count : 0};
let _submitResolve;

let usernameDetails = {name :"username", url: "https://cate.doc.ic.ac.uk/*"};
let passwordDetails = {name :"password", url: "https://cate.doc.ic.ac.uk/*"};

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


        let userResolver;
        let usernamePromise = new Promise((resolve) => userResolver = resolve);

        let passResolver;
        let passPromise= new Promise((resolve) => {passResolver = resolve});



        chrome.cookies.get(usernameDetails, (cookie) => {userResolver(cookie)});
        chrome.cookies.get(passwordDetails, (cookie) => {passResolver(cookie)});

        let username = await usernamePromise.then((cookie) => {return cookie ? cookie.value : null});
        let password = await passPromise.then((cookie) => {return cookie ? cookie.value : null});
        alert(username);

        if(username === null || (!auth.confirmed && auth.count > 2)) {

            let promise;
            requestCredentials();
            promise = new Promise((resolve) => {

                _submitResolve = resolve;
            });
            await promise.then((data) => {
                password = data.password;
                username = data.username;
            });


        }
        auth.count ++;

        if(auth.count > 3) {
            auth.count = 0;
        }



        callbackFn({'authCredentials': {username: username, password: password}});
        //callbackFn({'authCredentials': {username: auth.username, password: auth.password}});




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