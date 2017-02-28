// All chrome messages are handled here, if you want to add new one, add another 'else if' block.
//
// 'request' is javascript object, which should have only one field on first level,
// for example 'request.xhrWithAuth' and parameters for 'xhrWithAuth' action should be fields of 'request.xhrWithAuth',
// like 'request.xhrWithAuth.method' and 'request.xhrWithAuth.url'.
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.xhrWithAuth) {
        xhrWithAuth(request.xhrWithAuth.method, request.xhrWithAuth.url, request.xhrWithAuth.interactive,
            function (status, response) {
                callback({status: status, response: response});
            }, request.xhrWithAuth.params);
        return true;
    } else if (request.setBadgeText) {
        chrome.browserAction.setBadgeText({text: request.setBadgeText.text});
        return true;

    } else if (request.get_xpath) {
    getxpath();
    return true
    }

    return true;
});
