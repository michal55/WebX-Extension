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

        console.log([xpath,tab_id,callback]);
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

