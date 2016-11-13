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

function getProjects() {
    xhrWithAuth('GET', '/data/user/projects', false, onProjects);
}

function onProjects(status, response) {
        if (status == 200) {
            var json = JSON.parse(response);
            for (var i = 0; i<json.length; i++){
                var div = document.createElement("DIV");
                var btn = document.createElement("BUTTON");
                var text = document.createTextNode(json[i].name);

                div.id = "project" + json[i].id;
                btn.appendChild(text);
                btn.addEventListener('click', getScripts(json[i].id));
                div.appendChild(btn);
                document.getElementById("projects_div").appendChild(div);          

            }
        }
        else
            alert('Error:\n' + response);
    }


function getScripts(project_id) {
    xhrWithAuth('GET', '/data/user/project/'+ project_id +'/scripts', false, onScripts);
    }

function onScripts(status, response) {
        if (status == 200) {
            var json = JSON.parse(response);
            for (var i = 0; i<json.length; i++){
                var div = document.createElement("DIV");
                var li = document.createElement("LI");
                var btn = document.createElement("BUTTON");
                var text = document.createTextNode(json[i].name);

                div.id = "script" + json[i].id;
                li.appendChild(btn);
                btn.appendChild(text);
                div.appendChild(li);

                document.getElementById("project" + json[i].project_id).appendChild(div);
            }
        }    
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('click', loginPrompt);
    document.getElementById('user_info').addEventListener('click', getUserInfo);
    document.getElementById('projects').addEventListener('click', getProjects);

});
