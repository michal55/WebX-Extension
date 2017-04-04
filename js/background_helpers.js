// Collection of helper functions for chrome.runtime.sendMessage calls

// xhrWithAuth
function xhrWithAuth(method, url, interactive, callback, params) {
    chrome.runtime.sendMessage({xhrWithAuth: {method: method, url: url, interactive: interactive, params: params}},
        function(response) {
            callback(response.status, response.response);
        });
}

function get_xpath(callback) {
    chrome.runtime.sendMessage({get_xpath: {}}, callback);
}

function starthighlight(xpath, type) {
    if (xpath != '') {
        chrome.runtime.sendMessage({start_highlight: {xpath: xpath, type: type}});
    }
}
function stophighlight() {
    chrome.runtime.sendMessage({stop_highlight: {}});
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
