// How to create new postprocessing in few easy steps
// 1. Create new js file in postprocessing folder, copy template bellow and edit as necessary
// 2. Add new entry to devtools.js - $scope.postprocessings table with type same as in your new class and name should match the label variable
// 3. Update devtools.html to contain some user interface elements for your new postprocessing,
//     use ng-show="script_builder.isSelectedPostprocessingType('type')" to show UI element only if the specific postprocessing type is selected
//     and script_builder.getSelectedPostprocessing() to bind variables from your new class to UI elements, for example:
//     script_builder.getSelectedPostprocessing().foo
//
/* NEW POSTPROCESSING TEMPLATE START
// All methods are mandatory (can be left empty though)
class PostprocessingName {
    constructor() {
        // Label - shows in UI
        this.label = 'Label';
        // Type - same value as passed into Postprocessing.register
        this.type = 'type';
        // Define attributes specific to this postprocessing
        this.foo = 'bar';
    }

    canHaveChildren() {
        // return true for nested post processing types, false otherwise
        // Note: just return false or use nested.js as template
        return false;
    };

    save() {
        // Return javascript object which is converted to JSON and saved
        return {
            type: this.type,
            foo: this.foo
        };
    };

    load(postprocessing) {
        // Load own attributes from postprocessing saved in database
        this.foo = postprocessing.foo;
        // We could validate postprocessing.type here but who cares, it should match or we have bigger problem
    };
}

// Register postprocessing under chosen type
Postprocessing.register(PostprocessingName, 'type');
// NEW POSTPROCESSING TEMPLATE END */


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
