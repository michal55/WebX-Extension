class Post {
    constructor() {
        this.label = 'Post';
        this.type = 'post';
        this.url = '';
        this.fields = {};
        this.new_key = '';
        this.new_value = '';
        this.loaded = false;
    }

    canHaveChildren() {
        return false;
    };

    save() {
        // Return javascript object which is converted to JSON and saved
        return {
            type: this.type,
            url: this.url,
            fields: angular.toJson(this.fields)
        };
    };

    load(postprocessing) {
        this.loaded = true;
        this.url = postprocessing.url;
        this.fields = angular.fromJson(postprocessing.fields);
    };

    show() {
        // Don't fetch form fields if postprocessing was loaded from server
        if (this.loaded) {
            return;
        }

        this.refreshForm();
    };

    refreshForm() {
        var thisclass = this;
        get_form_data(this.getParentXpath(), function(result) {
            var meta_inputs = result.meta_inputs;
            var inputs = result.inputs;
            if (meta_inputs.FORM) {
                thisclass.url = meta_inputs.url;
                thisclass.fields = inputs;
                thisclass.updateParentXpath(meta_inputs.new_xpath);
                angular.element('[ng-controller="main"]').scope().$digest();
            } else {
                thisclass.url = "xpath does not point to form element";
            }
        });
    };

    addField() {
        this.fields[this.new_key] = this.new_value;
    }

    disableKey(key) {
        this.fields[key] = null;
    }

    enableKey(key) {
        this.fields[key] = '';
    }

    deleteKey(key) {
        delete this.fields[key];
    }
}

// Register postprocessing
Postprocessing.register(Post);
