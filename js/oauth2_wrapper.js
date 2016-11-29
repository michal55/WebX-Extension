var URL_BASE = 'http://localhost:3000/webx';

/**
 * Extracts specified argument value from url
 * @param {String} url - URL in https://a.b/c#arg1=val1&arg2=val2 format
 * @param {String} arg - Argument to extract
 */
function extractArgFromUrl(url, arg) {
    var q = url.substr(url.indexOf('#') + 1);
    var parts = q.split('&');
    for (var i = 0; i < parts.length; ++i) {
        var kv = parts[i].split('=');
        if (kv[0] == arg) {
            return kv[1];
        }
    }

    return null;
}

/**
 * Sends OAuth2 authenticated XMLHttpRequest
 * @param {String} method - HTTP request method
 * @param {String} url - API url relative to /api server path (eg /data/user)
 * @param {boolean} interactive - If true, prompts unauthenticated user to log in
 *                              - If false with unauthenticated user, returns error to callback
 * @param {function} callback - (status, response)
 *                            - status - HTTP status or null on internal error
 *                            - response - HTTP response or internal error message
 * @param {String} params - Optional, parameters in JSON format to send with put and post
 */
function xhrWithAuth(method, url, interactive, callback, params) {
    var access_token;

    getToken();

    function getToken() {
        chrome.identity.launchWebAuthFlow({
                'url' : URL_BASE + '/oauth/authorize?client_id=' + chrome.runtime.getManifest().oauth2.client_id +
                    '&redirect_uri=' + encodeURIComponent(chrome.identity.getRedirectURL()) + '&response_type=token&scope=',
                'interactive' : interactive
            },
            function(redirect_url) {
                if (chrome.runtime.lastError) {
                    callback(null, chrome.runtime.lastError.message);
                } else {
                    access_token = extractArgFromUrl(redirect_url, 'access_token');

                    if (access_token == null) {
                        callback(null, 'Unable to extract access token from redirect url: ' + redirect_url);
                    } else {
                        requestStart();
                    }
                }
            });
    }

    function requestStart() {
        var xhr = new XMLHttpRequest();
        xhr.open(method, URL_BASE + '/api' + url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = requestComplete;
        xhr.send(params);
    }

    function requestComplete() {
        callback(this.status, this.response);
    }
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
