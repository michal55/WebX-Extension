// Template for postprocessing classes
// All methods are mandatory unless stated otherwise (can be left empty though)
/*
class PostprocessingName {
    constructor() {
        // Constructor code, define attributes
        this.foo = 'bar';
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
PostprocessingName.type = 'type';
Postprocessing.register(PostprocessingName);
*/


function Postprocessing() { }

Postprocessing.types = [];

Postprocessing.register = function(proto) {
    Postprocessing.types[proto.type] = proto;
};

Postprocessing.create = function(name) {
    return new Postprocessing.types[name];
};
