function getxpath(tab_id, callback) {
    try {
        chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
            chrome.tabs.executeScript(tab_id, {file: 'js/xpathOnClick.js'}, function () {
                chrome.tabs.sendMessage(tab_id, {onClickXPath: {}}, callback);
            });
        });
    } catch (err) {
        console.log(err.message);
    }

    return true;
}

function highlight(tab_id, start, xpath, type) {
    try {
        chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
            chrome.tabs.executeScript(tab_id, { file: 'js/xpathOnClick.js' }, function() {
                if (start) {
                    chrome.tabs.executeScript(tab_id, { code:
                        'try { ' +
                            'start_highlight(' + JSON.stringify(xpath) + ', ' + JSON.stringify(type) + '); ' +
                        '} catch (err) { console.error(err) }' }, function() {});
                } else {
                    chrome.tabs.executeScript(tab_id, { code:
                        'try { ' +
                            'stop_highlight();' +
                        '} catch (err) { console.error(err) }' }, function() {});
                }
            });
        });
    } catch (err) {
        console.log(err.message);
    }

    return true;
}

function get_attributes(xpath,tab_id,callback) {
        try {
            chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
                chrome.tabs.executeScript(tab_id, { file: 'js/xpathOnClick.js' }, function() {
                    chrome.tabs.sendMessage(tab_id, {get_attributes: {xpath:xpath}}, callback);
                });
            });
        } catch (err) {
            console.log(err.message);
        }

    return true;
}

function get_form_data(xpath,tab_id,callback) {
        try {
            chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
                chrome.tabs.executeScript(tab_id, { file: 'js/xpathOnClick.js' }, function() {
                    chrome.tabs.sendMessage(tab_id, {get_form_data: {xpath:xpath}}, callback);
                });
            });
        } catch (err) {
            console.log(err.message);
        }

    return true;
}

function restrictHighlight(tab_id, start, xpath) {
    try {
        chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
            chrome.tabs.executeScript(tab_id, { file: 'js/xpathOnClick.js' }, function() {
                if (start) {
                    chrome.tabs.executeScript(tab_id, { code:
                        'try { ' +
                            'startRestrictHighlight(' + JSON.stringify(xpath) + '); ' +
                        '} catch (err) { console.error(err) }' }, function() {});
                } else {
                    chrome.tabs.executeScript(tab_id, { code:
                        'try { ' +
                            'stopRestrictHighlight();' +
                        '} catch (err) { console.error(err) }' }, function() {});
                }
            });
        });
    } catch (err) {
        console.log(err.message);
    }

    return true;
}

function get_page_url(tab_id,callback) {
    chrome.tabs.get(tab_id, function (tab) {
        callback(tab.url);
    });
}

function shortenXpath(xpath,tab_id,callback) {
        try {
            chrome.tabs.executeScript(tab_id, { file: 'js/jquery.js' }, function() {
                chrome.tabs.executeScript(tab_id, { file: 'js/xpathOnClick.js' }, function() {
                    chrome.tabs.sendMessage(tab_id, {shortenXpath: {xpath:xpath}}, callback);
                });
            });
        } catch (err) {
            console.log(err.message);
        }

    return true;
}
