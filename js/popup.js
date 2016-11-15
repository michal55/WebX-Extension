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
            if (json.length == 0){
                return;
            }
            for (var i = 0; i<json.length; i++){
                var div = document.createElement('DIV');
                div.id = 'project' + json[i].id;
                var btn = document.createElement('BUTTON');
                var text = document.createTextNode(json[i].name);
                var prev_div = document.getElementById('project' + json[i].id);

                // remove existing DIV before reloading it
                if (prev_div){
                    prev_div.parentNode.removeChild(prev_div);
                }

                btn.appendChild(text);
                btn.addEventListener('click', getSchema(json[i].id));
                btn.addEventListener('click', getScripts(json[i].id));
                div.appendChild(btn);
                document.getElementById('projects_div').appendChild(div);          
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
            if (json.length == 0){
                return;
            }
            var p = document.createElement('P');

            p.appendChild(document.createTextNode('Scripts'));
            document.getElementById('project' + json[0].project_id).appendChild(p);

            for (var i = 0; i<json.length; i++){
                var div = document.createElement('DIV');
                var li = document.createElement('LI');
                var btn = document.createElement('BUTTON');
                var text = document.createTextNode(json[i].name);

                div.id = 'script' + json[i].id;
                li.appendChild(btn);
                btn.appendChild(text);
                div.appendChild(li);
                document.getElementById('project' + json[i].project_id).appendChild(div);
            }
        }    
}

function getSchema(project_id) {
    xhrWithAuth('GET', '/data/user/project/'+ project_id +'/data_schemas', false, onSchema);
    }

function onSchema(status, response) {
        if (status == 200) {
            var json = JSON.parse(response);
            if (json.length == 0){
                return;
            }
            var p = document.createElement('P');

            p.appendChild(document.createTextNode('Schema'));
            document.getElementById('project' + json[0].project_id).appendChild(p);

            for (var i = 0; i<json.length; i++){
                var li = document.createElement('LI');
                var text = document.createTextNode(json[i].name + ' : ' + json[i].data_type);
                li.appendChild(text);

                document.getElementById('project' + json[i].project_id).appendChild(li);       
        }
    }

}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('click', loginPrompt);
    document.getElementById('user_info').addEventListener('click', getUserInfo);
    document.getElementById('projects').addEventListener('click', getProjects);

});
