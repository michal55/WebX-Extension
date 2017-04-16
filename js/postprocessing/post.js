class Post {
    constructor() {
        this.label = 'Post';
        this.type = 'post';
        this.url = '';
        this.fields = {};
        this.new_key = '';
        this.new_value = '';
    }

    canHaveChildren() {
        return false;
    };

    save() {
        // Return javascript object which is converted to JSON and saved
        return {
            type: this.type,
            url: this.url,
            fields: this.fields
        };
    };

    load(postprocessing) {
        this.url = postprocessing.url;
        this.fields = postprocessing.fields;
    };

    show() {
        this.fields = {
            'username': 'xsrba',
            'csrf': null
        };
        this.url = 'PH url'
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

}

// Register postprocessing
Postprocessing.register(Post);
