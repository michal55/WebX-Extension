// Template for postprocessing classes
// All methods are mandatory unless stated otherwise (can be left empty though)
/*
class PostprocessingName {
    constructor() {
        // Constructor code, define attributes
        this.foo = 'bar';
        // Label - shows in UI
        this.label = 'Label';
        // Type - same value as passed into Postprocessing.register
        this.type = 'type';
    }

    canHaveChildren() {
        // return true for nested post processing types, false otherwise
        return false;
    };

    save() {
        // Returns javascript object which is converted to JSON and saved
        return {
            type: PostprocessingName.type,
            foo: this.foo
        };
    };

    load(postprocessing) {
        // Load own attributes from postprocessing saved in database
        this.foo = postprocessing.foo;
    };

    // Only if canHaveChildren returns true
    registerChild(childId) { };
}

// Register postprocessing under chosen type
Postprocessing.register(PostprocessingName, 'type');
*/


function Postprocessing() { }

Postprocessing.types = [];

Postprocessing.register = function(proto, name) {
    Postprocessing.types[name] = proto;
};

Postprocessing.create = function(name, id) {
    var postprocessing = new Postprocessing.types[name];
    postprocessing.id = id;
    return postprocessing;
};
