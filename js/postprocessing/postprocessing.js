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

// Register postprocessing under chosen name
Postprocessing.register('name', PostprocessingName);
*/


function Postprocessing() { }

Postprocessing.types = [];

Postprocessing.register = function(name, proto) {
    Postprocessing.types[name] = proto;
};

Postprocessing.create = function(name) {
    return new Postprocessing.types[name];
};
