class ScriptBuilder {
    constructor(data_fields) {
        this.url = "";
        this.ROOT = 0;
        this.scripts = [];
        this.scripts[this.ROOT] = {
            id: this.ROOT,
            childrenIds: []
        };
        this.post_processing_stack = [this.ROOT];
        this.data_fields = data_fields;
    }

    toJSON() {
        return angular.toJson({
            url: this.url,
            ROOT: this.ROOT,
            scripts: this.scripts,
            post_processing_stack: this.post_processing_stack,
            data_fields: this.data_fields
        });
    }

    fromJSON(json) {
        var data = angular.fromJson(json);
        this.url = data.url;
        this.ROOT = data.ROOT;
        this.scripts = data.scripts;
        this.post_processing_stack = data.post_processing_stack;
        this.data_fields = data.data_fields;
    }

    loadScripts(scripts) {
        this.url = scripts.url;
        this._loadScripts(scripts, this.ROOT);
        this.displayScript(this.ROOT);

        localStorage.script_builder = this.toJSON();
    }

    createScript(name, xpath, parentId) {
        var id = this.scripts.length;
        var script = {
            id: id,
            name: name,
            xpath: xpath,
            childrenIds: []
        };

        this.scripts[parentId].childrenIds.push(id);
        this.scripts.push(script);

        return id;
    }

    _loadScripts(scripts, parentId) {
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
    }

    displayScript(scriptId) {
        // Find existing child or create new for each data field
        for (var i in this.data_fields) {
            var data_field = this.data_fields[i];
            var childId = this.scripts[scriptId].childrenIds.find((childId) => this.scripts[childId].name == data_field.name);

            data_field.positives = [];
            data_field.negatives = [];

            if (childId != undefined) {
                data_field.scriptId = childId;
            } else {
                data_field.scriptId = this.createScript(data_field.name, '', scriptId);
            }
        }
    }

    addPostProcessing(scriptId) {
        this.displayScript(scriptId);
        this.post_processing_stack.push(scriptId);

        localStorage.script_builder = this.toJSON();
    }

    leavePostProcessing() {
        this.post_processing_stack.pop();
        var size = this.post_processing_stack.length;
        this.displayScript(this.post_processing_stack[size - 1]);

        localStorage.script_builder = this.toJSON();
    }

    getStackPointer() {
        if (typeof this.post_processing_stack === 'undefined') {
            return false;
        }

        var size = this.post_processing_stack.length;
        if (size > 0) {
            return this.scripts[this.post_processing_stack[size - 1]].name;
        } else {
            return false;
        }
    }

    collectJsonData(json, scriptId) {
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
    }

    getJson() {
        var json = {url: this.url, data: []};
        var root = this.scripts[this.ROOT];

        for (var i in root.childrenIds) {
            this.collectJsonData(json, root.childrenIds[i]);
        }

        return json;
    }
}
