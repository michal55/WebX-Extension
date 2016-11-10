var HOST = 'http://localhost:3000';

function extractArgFromUrl(url, arg) {
    var q = url.substr(url.indexOf('#') + 1);
    var parts = q.split('&');
    for (var i = 0; i < parts.length; ++i) {
        var kv = parts[i].split('=');
        if (kv[0] == arg) {
            return kv[1];
        }
    }

    // Error?
    return "";
}

// Launch interactive WebAuthFlow, prompts user for login if necessary
function loginPrompt() {
    chrome.identity.launchWebAuthFlow( {
            'url' : HOST + '/webx/oauth/authorize?client_id=' + chrome.runtime.getManifest().oauth2.client_id +
                '&redirect_uri=' + encodeURIComponent(chrome.identity.getRedirectURL()) + '&response_type=token&scope=',
            'interactive' : true
        },
        function(redirect_url) {
            alert(extractArgFromUrl(redirect_url, 'access_token'));
        });
}

function xhrWithAuth(method, url, interactive, callback) {
    var access_token;

    getToken();

    function getToken() {
        chrome.identity.launchWebAuthFlow( {
                'url' : HOST + '/webx/oauth/authorize?client_id=' + chrome.runtime.getManifest().oauth2.client_id +
                '&redirect_uri=' + encodeURIComponent(chrome.identity.getRedirectURL()) + '&response_type=token&scope=',
                'interactive' : interactive
            },
            function(redirect_url) {
                access_token = extractArgFromUrl(redirect_url, 'access_token');
                requestStart();
            });
    }

    function requestStart() {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = requestComplete;
        xhr.send();
    }

    function requestComplete() {
        callback(this.status, this.response);
    }
}

function getUserInfo() {
    xhrWithAuth('GET',
        HOST + '/webx/api/data/user',
        false,
        onUserInfoFetched);
}

function onUserInfoFetched(status, response) {
    if (status == 200) {
        alert(response);
    } else {
        // We failed...
        alert('RIP ' + status + '\n' + response);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('click', loginPrompt);
    document.getElementById('google').addEventListener('click', getUserInfo);
});
