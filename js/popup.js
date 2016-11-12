// Launch interactive dummy API call which will trigger login prompt if necessary
function loginPrompt() {
    xhrWithAuth('GET', '', true, function(status, response) {
        if (status != null) {
            document.getElementById('login').disabled = true;
        }
    });
}

function getUserInfo() {
    xhrWithAuth('GET', '/data/user', false, onUserInfo);
}

function onUserInfo(status, response) {
    if (status == 200) {
        alert('OK:\n' + response);
    } else if (status == null) {
        document.getElementById('login').disabled = false;
        alert('Internal error:\n' + response);
    } else {
        alert('HTTP error: ' + status + '\n' + response);
        document.getElementById('login').disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('click', loginPrompt);
    document.getElementById('user_info').addEventListener('click', getUserInfo);
});
