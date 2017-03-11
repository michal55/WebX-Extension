function ScriptBuilder(data_fields) {
    this.url = "";
    this.ROOT = -1;
    this.scripts = [];
    this.scripts[this.ROOT] = {
        id: this.ROOT,
        childrenIds: []
    };
    this.post_processing_stack = [this.ROOT];
    this.data_fields = data_fields;

    this.loadScripts = function(scripts) {
        console.log('dfs ', data_fields);
        console.log('script ', scripts);
        this.url = scripts.url;
        this._loadScripts(scripts, this.ROOT);
        this.displayScript(this.ROOT);
    };

    this.createScript = function(name, xpath, parentId) {
        var id = this.scripts.length;
        var script = {
            id: id,
            name: name,
            xpath: xpath,
            childrenIds: []
        };

        this.scripts[parentId].childrenIds.push(id);
        this.scripts.push(script);
        console.log('adding script', script);

        return id;
    };

    this._loadScripts = function(scripts, parentId) {
        for (var i in scripts.data) {
            var script = scripts.data[i];

            // Check if there is data field for current xpath, skip if not
            if (!this.data_fields.some((field) => field.name == script.name)) {
                continue;
            }

            var id = this.createScript(script.name, script.xpath, parentId);

            for (var j in script.postprocessing || []) {
                if (script.postprocessing[j] && script.postprocessing[j].type == 'nested') {
                    this._loadScripts(script.postprocessing[j], id);
                }
            }
        }
    };

    this.displayScript = function(scriptId) {
        // Find existing child or create new for each data field
        for (var i in this.data_fields) {
            var data_field = this.data_fields[i];
            var childId = this.scripts[scriptId].childrenIds.find((childId) => this.scripts[childId].name == data_field.name);

            if (childId != undefined) {
                data_field.scriptId = childId;
            } else {
                data_field.scriptId = this.createScript(data_field.name, '', scriptId);
            }
        }
    };

    this.addPostProcessing = function(scriptId) {
        this.displayScript(scriptId);
        this.post_processing_stack.push(scriptId);
    };

    this.leavePostProcessing = function() {
        this.post_processing_stack.pop();
        var size = this.post_processing_stack.length;
        this.displayScript(this.post_processing_stack[size - 1]);
    };

    this.getStackPointer = function() {
        if (typeof this.post_processing_stack === 'undefined') {
            return false;
        }

        var size = this.post_processing_stack.length;
        if (size > 0) {
            return this.scripts[this.post_processing_stack[size - 1]].name;
        } else {
            return false;
        }
    };

    this.collectJsonData = function(json, scriptId) {
        console.log('collecting', scriptId);

        var script = this.scripts[scriptId];

        // Nothing to collect here
        if (script.xpath == undefined || script.xpath == '') {
            return;
        }

        var data = {name: script.name, xpath: script.xpath, postprocessing: []};
        if (script.childrenIds.length) {
            data.postprocessing.push({type: 'nested', data: []});

            for (var i in script.childrenIds) {
                this.collectJsonData(data.postprocessing[0], script.childrenIds[i]);
            }
        }

        json.data.push(data);
    };

    this.getJson = function() {
        var json = {url: this.url, data: []};
        var root = this.scripts[this.ROOT];

        for (var i in root.childrenIds) {
            this.collectJsonData(json, root.childrenIds[i]);
        }

        console.log('collected ', json, 'from', this.scripts);
        return json;
    }
}
