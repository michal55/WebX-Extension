function getxpath() {
    chrome.tabs.getSelected(null, function(tab) {
    try {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery.js" }, function() {
            chrome.tabs.executeScript(tab.id, {     file: "js/xpathOnClick.js" }, function() {
                chrome.tabs.executeScript(tab.id, {     code: "try { "+
                                                   "onClickXPath(true, true, true, function(path){}, false);"+
                                                   "onClickXPath(true, true, true, function(path){}, true);"+
                                                   "} catch (err) {console.error(err)}" }, function() {}
                                         );
                                     });
                                 });
    } catch (err) {
        console.log(err.message);
                  }
    });
   return true;
}

//document.getElementById('button1').addEventListener('click', getxpath);
