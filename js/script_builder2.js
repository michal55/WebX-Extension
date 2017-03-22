class ScriptBuilder {
    constructor(data_fields) {
        this.url = "";
        this.ROOT = 0;
        this.ROOT_PP = 0;
        this.scripts = [];
        this.scripts[this.ROOT] = {
            id: this.ROOT,
            postprocessing: [Postprocessing.create('nested')]
        };
        this.post_processing_stack = [[this.ROOT, this.ROOT_PP]];
        this.data_fields = data_fields;
        this.state = this.ROOT;
        this.selected_postprocessing = this.ROOT_PP;
    }

    //!!! To be reworked
    toJSON() {
        return angular.toJson({
            url: this.url,
            ROOT: this.ROOT,
            scripts: this.scripts,
            post_processing_stack: this.post_processing_stack,
            data_fields: this.data_fields
        });
    }

    //!!! To be reworked
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
        this.scripts = [];
        this.scripts[this.ROOT] = {
            id: this.ROOT,
            postprocessing: [Postprocessing.create('nested')]
        };
        this.post_processing_stack = [[this.ROOT, this.ROOT_PP]];

        this._loadScripts(scripts, this.ROOT, this.ROOT_PP);
        this.displayScript(this.ROOT, this.ROOT_PP);

        localStorage.script_builder = this.toJSON();
    }

    createScript(name, xpath, parentScriptId, parentPostprocessingId) {
        var id = this.scripts.length;
        var script = {
            id: id,
            name: name,
            xpath: xpath,
            postprocessing: []
        };

        this.scripts[parentScriptId].postprocessing[parentPostprocessingId].registerChild(id);
        this.scripts.push(script);

        return id;
    }

    _loadScripts(scripts, parentScriptId, parentPostprocessingId) {
        for (var i in scripts.data) {
            var script = scripts.data[i];

            // Check if there is data field for current xpath, skip if not
            if (!this.data_fields.some((field) => field.name == script.name)) {
                continue;
            }

            var id = this.createScript(script.name, script.xpath, parentScriptId, parentPostprocessingId);

            for (var j in script.postprocessing || []) {
                var postprocessing = script.postprocessing[j];

                this.scripts[id].postprocessing[j] = Postprocessing.create(postprocessing.type);
                this.scripts[id].postprocessing[j].load(postprocessing);

                if (this.scripts[id].postprocessing[j].canHaveChildren()) {
                    this._loadScripts(script.postprocessing[j], id, j);
                }
            }
        }
    }

    displayScript(scriptId, postprocessingId) {
        this.post_processing_stack.push([scriptId, postprocessingId]);
        console.assert(this.scripts[scriptId].postprocessing[postprocessingId].canHaveChildren(), 'Attempt to display script / postprocessing combination without children');

        // Find existing child or create new for each data field
        for (var i in this.data_fields) {
            var data_field = this.data_fields[i];
            var childId = this.scripts[scriptId].postprocessing[postprocessingId].children_ids.find((childId) => this.scripts[childId].name == data_field.name);

            data_field.positives = [];
            data_field.negatives = [];

            if (childId != undefined) {
                data_field.scriptId = childId;
            } else {
                data_field.scriptId = this.createScript(data_field.name, '', scriptId, postprocessingId);
            }
        }
    }

    selectPostprocessing(postprocessing) {
        this.selected_postprocessing = postprocessing;
        console.log("selected: ", postprocessing);
        this.displayScript(this.state, 0);
    }

    showPostProcessings(current_field) {
        this.state = current_field.scriptId;
        this.selected_postprocessing = false;
        this.displayScript(this.state, 0);
    }

    isSelected(name) {
        return name == this.selected_postprocessing.type;
    }

    // scriptId - id of script, same as before
    // postprocessingId - id of postprocessing, relevant for ordering and indexing
    // postprocessingName - postprocessing to be created if one doesn't exist, ignored if postprocessing with supplied id exists
    addPostProcessing(scriptId, postprocessingName) {
        this.scripts[scriptId].postprocessing.push(Postprocessing.create(postprocessingName));
        this.selected_postprocessing = this.scripts[scriptId].postprocessing[this.scripts[scriptId].postprocessing.length - 1]
        localStorage.script_builder = this.toJSON();
    }

    leavePostProcessing() {
        this.post_processing_stack.pop();
        var size = this.post_processing_stack.length;
        this.displayScript(this.post_processing_stack[size - 1][0], this.post_processing_stack[size - 1][1]);

        localStorage.script_builder = this.toJSON();
    }

    getStackPointer() {
        if (typeof this.post_processing_stack === 'undefined') {
            return false;
        }

        var size = this.post_processing_stack.length;

        if (size > 0) {
            return this.scripts[this.post_processing_stack[size - 1][0]].name;
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

        for (var i in script.postprocessing) {
            var postprocessing = script.postprocessing[i];

            data.postprocessing.push(postprocessing.save(script));
            if (postprocessing.canHaveChildren()) {
                postprocessing.children_ids.forEach((child_id) => this.collectJsonData(data.postprocessing[i], child_id))
            }
        }

        json.data.push(data);
    }

    getJson() {
        var json = {url: this.url, data: []};
        var root = this.scripts[this.ROOT].postprocessing[this.ROOT_PP];

        for (var i in root.children_ids) {
            this.collectJsonData(json, root.children_ids[i]);
        }

        return json;
    }
}
