class ScriptBuilder {
    constructor(data_fields) {
        this.url = '';
        this.ROOT = 0;
        this.ROOT_PP = 0;
        this.scripts = [];
        this.scripts[this.ROOT] = {
            id: this.ROOT,
            postprocessing: [Postprocessing.create('nested', this.ROOT_PP)]
        };
        this.post_processing_stack = [[this.ROOT, this.ROOT_PP]];
        this.data_fields = data_fields;
        this.selected_script_id = this.ROOT;
        this.selected_postprocessing_id = this.ROOT_PP;
    }

    toJSON() {
        return angular.toJson({
            data_fields: this.data_fields,
            json: this.getJson(),
            post_processing_stack: this.post_processing_stack,
            selected_script_id: this.selected_script_id,
            selected_postprocessing_id: this.selected_postprocessing_id
        });
    }

    fromJSON(json) {
        var data = angular.fromJson(json);
        this.data_fields = data.data_fields;
        if (typeof data.json !== 'undefined') {
            this.loadScripts(data.json);
            this.post_processing_stack = data.post_processing_stack;
            this.show(data.selected_script_id, data.selected_postprocessing_id);
        }
    }

    loadScripts(scripts) {
        this.url = scripts.url;
        this.scripts = [];
        this.scripts[this.ROOT] = {
            id: this.ROOT,
            postprocessing: [Postprocessing.create('nested', this.ROOT_PP)]
        };
        this.post_processing_stack = [[this.ROOT, this.ROOT_PP]];
        this.selected_script_id = this.ROOT;
        this.selected_postprocessing_id = this.ROOT_PP;

        this._loadScripts(scripts, this.ROOT, this.ROOT_PP);
        this.show(this.ROOT, this.ROOT_PP);

        localStorage.script_builder = this.toJSON();
    }

    createScript(name, xpath, parent_script_id, parent_postprocessing_id) {
        var id = this.scripts.length;
        var script = {
            id: id,
            name: name,
            xpath: xpath,
            postprocessing: []
        };

        this.scripts[parent_script_id].postprocessing[parent_postprocessing_id].registerChild(id);
        this.scripts.push(script);

        return id;
    }

    _loadScripts(scripts, parent_script_id, parent_postprocessing_id) {
        for (var i in scripts.data) {
            var script = scripts.data[i];

            // Check if there is data field for current xpath, skip if not
            if (!this.data_fields.some((field) => field.name == script.name)) {
                continue;
            }

            var id = this.createScript(script.name, script.xpath, parent_script_id, parent_postprocessing_id);

            for (var j in script.postprocessing || []) {
                var postprocessing = script.postprocessing[j];

                this.scripts[id].postprocessing[j] = Postprocessing.create(postprocessing.type, j);
                this.scripts[id].postprocessing[j].load(postprocessing);

                if (this.scripts[id].postprocessing[j].canHaveChildren()) {
                    this._loadScripts(script.postprocessing[j], id, j);
                }
            }
        }
    }

    show(script_id, postprocessing_id, new_level) {
        this.selected_script_id = script_id;
        this.selected_postprocessing_id = postprocessing_id;

        if (new_level) {
            this.post_processing_stack.push([script_id, postprocessing_id]);
        } else {
            this.setPostprocessingStackTop([script_id, postprocessing_id]);
        }

        if (!this.getSelectedPostprocessing() || !this.getSelectedPostprocessing().canHaveChildren()) {
            return;
        }

        // Find existing child or create new for each data field
        for (var i in this.data_fields) {
            var data_field = this.data_fields[i];
            var child_id = this.getSelectedPostprocessing().children_ids.find((childId) => this.scripts[childId].name == data_field.name);

            data_field.positives = [];
            data_field.negatives = [];

            if (child_id != undefined) {
                data_field.script_id = child_id;
            } else {
                data_field.script_id = this.createScript(data_field.name, '', script_id, postprocessing_id);
            }
        }
    }

    getSelectedScript() {
        return this.scripts[this.selected_script_id];
    }

    getSelectedPostprocessing() {
        return this.scripts[this.selected_script_id].postprocessing[this.selected_postprocessing_id];
    }

    getPostprocessingStackTop() {
        return this.post_processing_stack[this.post_processing_stack.length - 1];
    }

    setPostprocessingStackTop(value) {
        this.post_processing_stack[this.post_processing_stack.length - 1] = value;
    }

    getPostprocessingStackTopName() {
        return this.scripts[this.getPostprocessingStackTop()[0]].name;
    }

    // On postprocessing tab click
    selectPostprocessing(postprocessing) {
        this.show(this.selected_script_id, postprocessing.id);

        localStorage.script_builder = this.toJSON();
    }

    // On arrow (->) click right of xpath input field
    showPostProcessings(current_field) {
        this.show(current_field.script_id, 0, true);

        localStorage.script_builder = this.toJSON();
    }

    isSelectedPostprocessing(postprocessing) {
        return this.selected_postprocessing_id == postprocessing.id;
    }

    isSelectedPostprocessingType(type) {
        return this.getSelectedPostprocessing() && type == this.getSelectedPostprocessing().type;
    }

    // On add postprocessing button click
    addPostProcessing(postprocessing_name) {
        var new_postprocessing_id = this.getSelectedScript().postprocessing.length;
        this.getSelectedScript().postprocessing.push(Postprocessing.create(postprocessing_name, new_postprocessing_id));
        this.show(this.selected_script_id, new_postprocessing_id);

        localStorage.script_builder = this.toJSON();
    }

    // On postprocessing tab X click
    deletePostprocessing(postprocessing_id) {
        this.getSelectedScript().postprocessing.splice(postprocessing_id, 1);

        // Update ids
        for (var i = postprocessing_id; i < this.getSelectedScript().postprocessing.length; ++i) {
            this.getSelectedScript().postprocessing[i].id = i;
        }

        // If user deleted currently show postprocessing, show postprocessing 0
        if (postprocessing_id == this.selected_postprocessing_id) {
            this.show(this.selected_script_id, 0);
        // If user deleted postprocessing left of shown one, keep showing the same one (now with id one less)
        } else if (postprocessing_id < this.selected_postprocessing_id) {
            this.show(this.selected_script_id, this.selected_postprocessing_id - 1);
        }

        localStorage.script_builder = this.toJSON();
    }

    leavePostProcessing() {
        this.post_processing_stack.pop();
        this.show(this.getPostprocessingStackTop()[0], this.getPostprocessingStackTop()[1]);

        localStorage.script_builder = this.toJSON();
    }

    collectJsonData(json, script_id) {
        var script = this.scripts[script_id];

        // Nothing to collect here
        if (script.xpath == undefined || script.xpath == '') {
            return;
        }

        var data = {name: script.name, xpath: script.xpath};

        if (script.postprocessing.length) {
            data.postprocessing = [];
        }

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