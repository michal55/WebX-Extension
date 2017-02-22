// This object is present in options.js, oauth2_wrapper.js files, update it everywhere at once
var default_options = {
    DEFAULT_SERVER_URL: 'http://localhost:3000/webx'
};

function getServerURL(callback) {
    chrome.storage.sync.get({
        server_url: default_options.DEFAULT_SERVER_URL
    }, function(items) {
        callback(items.server_url);
    });
}
