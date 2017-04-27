var default_options = {
    DEFAULT_SERVER_URL: 'http://147.175.149.171/webx'
};

function getServerURL(callback) {
    chrome.storage.sync.get({
        server_url: default_options.DEFAULT_SERVER_URL
    }, function(items) {
        callback(items.server_url);
    });
}
