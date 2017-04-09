// All chrome messages for background page are handled here, if you want to add new one, add another 'else if' block.
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
    } else if (request.get_xpath) {
        getxpath(request.get_xpath.tab_id, function(result) {
            callback(result);
        });
        return true;

    } else if (request.stop_highlight) {
        highlight(request.stop_highlight.tab_id, false);
        return true;

    } else if (request.start_highlight) {
        highlight(request.start_highlight.tab_id, true, request.start_highlight.xpath, request.start_highlight.type);
        return true;

    } else if (request.get_attributes) {
        get_attributes(request.get_attributes.xpath, request.get_attributes.tab_id ,  function(result) {
            callback(result);
        });
        return true;
    }

    return true;
});
