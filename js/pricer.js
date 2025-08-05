const TESTK = "r0jQfg7eVfY7uWJaYwBpvNQoyHsVH0Zw";
const SITE_URL = "https://ndntmndntm.github.io/"
const COOKIE_API = "tsm_api_key";
const TSM_AUTH = "https://auth.tradeskillmaster.com/oauth2/token";
let API_KEY = "";
let TOKEN = "";

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getToken() {
    let response = "";
    fetch(TSM_AUTH, {
        method: "POST",
        body: JSON.stringify({

            "client_id": "c260f00d-1071-409a-992f-dda2e5498536",

            "grant_type": "api_token",

            "scope": "app:realm-api app:pricing-api",

            "token": API_KEY

        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then((r) => r.json())
        .then((json) => response = JSON.parse(json));
    return response["access_token"];
}


window.onload = () => {
    API_KEY = getCookie(COOKIE_API);
    if (API_KEY == "") {
        window.location.replace(SITE_URL + "askapikey");
    }

    TOKEN = getToken();
}