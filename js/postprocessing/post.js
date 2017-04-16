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

        // Extract fields from form... this.getParentXpath()
        this.fields = {
            'username': 'xsrba',
            'csrf': null
        };

        // Extract url from form... this.getParentXpath()
        this.url = 'PH url';

        // Digest if we are assigning fields in callback
        //angular.element('[ng-controller="main"]').scope().$digest();
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
