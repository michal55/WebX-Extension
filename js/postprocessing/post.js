class Post {
    constructor() {
        this.label = 'Post';
        this.type = 'post';
        this.url = '';
        this.fields = [];
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
            fields: angular.toJson(this.fields)
        };
    };

    load(postprocessing) {
        this.loaded = true;
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
                thisclass.fields = inputs;
                console.log(inputs);
                thisclass.updateParentXpath(meta_inputs.new_xpath);
                angular.element('[ng-controller="main"]').scope().$digest();
            } else {
                thisclass.url = "selected xpath does not point into form element";
            }
        });
    };

    addField() {
        this.fields.push({"name":this.new_key,"value":this.new_value,"hidden":0,"custom":1});
    }

    disableKey(indx) {
        this.fields[indx].hidden = 1;
    }

    enableKey(indx) {
        this.fields[indx].hidden = 0;
    }

    deleteKey(indx) {
        this.fields.splice(indx,1);
    }
}

// Register postprocessing
Postprocessing.register(Post);
