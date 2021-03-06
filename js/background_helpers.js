// Collection of helper functions for chrome.runtime.sendMessage calls

// xhrWithAuth
function xhrWithAuth(method, url, interactive, callback, params) {
    chrome.runtime.sendMessage({xhrWithAuth: {method: method, url: url, interactive: interactive, params: params}},
        function(response) {
            callback(response.status, response.response);
        });
}

function get_xpath(callback) {
    chrome.runtime.sendMessage({get_xpath: {tab_id: chrome.devtools.inspectedWindow.tabId}}, callback);
}

function starthighlight(xpath, type) {
    if (xpath != '') {
        chrome.runtime.sendMessage({start_highlight: {xpath: xpath, type: type, tab_id: chrome.devtools.inspectedWindow.tabId}});
    }
}
function stophighlight() {
    chrome.runtime.sendMessage({stop_highlight: {tab_id: chrome.devtools.inspectedWindow.tabId}});
}

function get_attributes(xpath, callback){
    chrome.runtime.sendMessage({get_attributes: {xpath: xpath, tab_id: chrome.devtools.inspectedWindow.tabId}}, callback);
}

function get_form_data(xpath, callback){
    chrome.runtime.sendMessage({get_form_data: {xpath: xpath, tab_id: chrome.devtools.inspectedWindow.tabId}}, callback);
}

function get_page_url(callback){
    chrome.runtime.sendMessage({get_page_url: {tab_id: chrome.devtools.inspectedWindow.tabId}}, callback);
}

function shortenXpath(xpath,callback) {
    chrome.runtime.sendMessage({shortenXpath: {xpath: xpath, tab_id: chrome.devtools.inspectedWindow.tabId}}, callback);
}

function startRestrictHighlight(xpath) {
    chrome.runtime.sendMessage({start_restrict_highlight: {tab_id: chrome.devtools.inspectedWindow.tabId, xpath: xpath}});
}

function stopRestrictHighlight(xpath) {
    chrome.runtime.sendMessage({stop_restrict_highlight: {tab_id: chrome.devtools.inspectedWindow.tabId}});
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
