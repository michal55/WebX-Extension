function getxpath() {
           chrome.tabs.getSelected(null, function(tab) {
                                //onClickXPath(true,false, false);
                                try {
                                        chrome.tabs.executeScript(tab.id, {     file: "js/xpathOnClick.js" }, function() {
                                                chrome.tabs.executeScript(tab.id, {     code: "try { "+
                                                        "onClickXPath(true, true, true, null, false);"+
                                                        "onClickXPath(true, true, true, null, true);"+
                                                        " } catch (err) {console.error(err)}" }, function() {
                                                        document.getElementById('msg').innerText = "Click on something to get xpath on js console";
                                                });
                                        });
                                } catch (err) {
                                        document.getElementById('msg').innerText = "Error: " + err.message;
                                }
                        });
           }

document.getElementById('button1').addEventListener('click', getxpath);
