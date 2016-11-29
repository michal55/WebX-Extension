// Send message to oauth2_wrapper.js background script to perform
// chrome.identity.launchWebAuthFlow API call
function xhrWithAuth(method, url, interactive, callback, params) {
    chrome.runtime.sendMessage({method: method, url: url, interactive: interactive, params: params},
        function(response) {
            callback(response.status, response.response);
        });
}

function apiGet(url, callback, params) {
    xhrWithAuth('GET', url, false, callback, params);
}

function apiPost(url, callback, params) {
    xhrWithAuth('POST', url, false, callback, params);
}

function apiDelete(url, callback, params) {
    xhrWithAuth('DELETE', url, false, callback, params);
}

function apiPut(url, callback, params) {
    xhrWithAuth('PUT', url, false, callback, params);
}
