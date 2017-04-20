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
        var fields=[];
        for (var i in this.fields){
            if ((this.fields[i][2] === 0) && (this.fields[i][1] !== "")){
                fields.push({"name":this.fields[i][0], "value":this.fields[i][1], "custom":this.fields[i][3]});
            }
        }
        return {
            type: this.type,
            fields: angular.toJson(fields)
        };
    };

    load(postprocessing) {
        this.loaded = true;
        var fields = angular.fromJson(postprocessing.fields);
        for (var i in fields){
            this.fields.push([fields[i].name, fields[i].value, 0, fields[i].custom]);
        }
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
        this.fields.push([this.new_key, this.new_value,0,1]);
    }

    disableKey(indx) {
        this.fields[indx][2] = 1;
    }

    enableKey(indx) {
        this.fields[indx][2] = 0;
    }

    deleteKey(indx) {
        this.fields.splice(indx,1);
    }
}

// Register postprocessing
Postprocessing.register(Post);
