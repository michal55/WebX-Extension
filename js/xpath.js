function getxpath() {
    chrome.tabs.getSelected(null, function(tab) {
        try {
            chrome.tabs.executeScript(tab.id, { file: 'js/jquery.js' }, function() {
                chrome.tabs.executeScript(tab.id, { file: 'js/xpathOnClick.js' }, function() {
                    chrome.tabs.executeScript(tab.id, { code:
                        'try {' +
                            'onClickXPath(true, true, true, function(path) {}, true);'+
                        '} catch (err) {console.error(err)}' }, function() {});
                    });
                });
        } catch (err) {
            console.log(err.message);
        }
    });

    return true;
}

function highlight(start, xpath, type) {
    chrome.tabs.getSelected(null, function(tab) {
        try {
            chrome.tabs.executeScript(tab.id, { file: 'js/jquery.js' }, function() {
                chrome.tabs.executeScript(tab.id, { file: 'js/xpathOnClick.js' }, function() {
                    if (start) {
                        chrome.tabs.executeScript(tab.id, { code:
                            'try { ' +
                                'start_highlight(' + JSON.stringify(xpath) + ', ' + JSON.stringify(type) + '); ' +
                            '} catch (err) { console.error(err) }' }, function() {});
                    } else {
                        chrome.tabs.executeScript(tab.id, { code:
                            'try { ' +
                                'stop_highlight();' +
                            '} catch (err) { console.error(err) }' }, function() {});
                    }
                });
            });
        } catch (err) {
            console.log(err.message);
        }
    });

    return true;
}
