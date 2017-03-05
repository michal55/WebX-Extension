function ScriptBuilder(data_fields) {
    this.url = "";
    this.post_processing_stack = [];
    this.scripts = [];
    this.data_fields = data_fields;

    this.loadScripts = function(scripts) {
        console.log('dfs ', data_fields);
        console.log('script ', scripts);
        this.url = scripts.url;
        this._loadScripts(scripts, undefined);
    };

    this._loadScripts = function(scripts, parent) {
        function getDataFieldIdxForName(data_fields, name) {
            for (var i in data_fields) {
                if (data_fields[i].name == name) {
                    return i;
                }
            }

            return undefined;
        }

        for (var i in scripts.data) {
            var script = scripts.data[i];

            // Check if there is data field for current xpath, skip if not
            if (getDataFieldIdxForName(data_fields, script.name) == undefined) {
                continue;
            }

            var id = this.scripts.length;
            script.parent = (parent && parent.id) || -1;
            script.children = [];
            console.log('adding script', script);
            this.scripts.push(script);

            // Register root script id and display value
            if (parent == undefined) {
                var idx = getDataFieldIdxForName(data_fields, script.name);
                this.data_fields[idx].root = id;
                this.data_fields[idx].value = script.value;
            // Register as child
            } else {
                parent.children.push(id);
            }

            if (script.post_processing && script.post_processing.type == 'nested') {
                this._loadScripts(script.post_processing, script);
            }
        }
    };

    this.addPostProcessing = function(field) {
        console.log('postprocessing for field:', field.name);
        this.post_processing_stack.push(field);
    };

    this.leavePostProcessing = function() {
        console.log('leving post processng, stack_trace: ', this.post_processing_stack);
        this.post_processing_stack.pop();
    };

    this.getStackPointer = function() {
        if (typeof this.post_processing_stack === 'undefined') {
            return false;
        }

        var size = this.post_processing_stack.length;
        if (size > 0) {
            return this.post_processing_stack[size-1].name;
        } else {
            return false;
        }
    };

    this.collectJsonData = function(json, scriptId) {
        console.log('collecting', scriptId);

        var script = this.scripts[scriptId];

        var data = {name: script.name, value: script.value};
        if (script.children.length) {
            data.post_processing = {type: 'nested', data: []};
        }

        for (var i in script.children) {
            this.collectJsonData(data.post_processing, script.children[i]);
        }

        json.data.push(data);
    };

    this.getJson = function() {
        var json = {url: this.url, data: []};

        for (var i in this.data_fields) {
            var data_field = this.data_fields[i];

            // Start collecting from each root
            if (data_field.root != undefined) {
                this.collectJsonData(json, data_field.root);
            }
        }

        console.log('collected ', json);
        return json;
    };
}
