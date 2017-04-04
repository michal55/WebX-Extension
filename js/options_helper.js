var default_options = {
    DEFAULT_SERVER_URL: 'http://team16-16.studenti.fiit.stuba.sk/webx'
};

function getServerURL(callback) {
    chrome.storage.sync.get({
        server_url: default_options.DEFAULT_SERVER_URL
    }, function(items) {
        callback(items.server_url);
    });
}
