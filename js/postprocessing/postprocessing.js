// How to create new postprocessing in few easy steps
// 1. Create new js file in postprocessing folder, copy template bellow and edit as necessary
// 2. Update devtools.html to contain <script src="js/postprocessing/%new_postprocessing%.js"></script> below
//    <script src="js/postprocessing/postprocessing.js"></script> but above non-postprocessing scripts
// 3. Update devtools.html to contain some user interface elements for your new postprocessing,
//    use ng-show="script_builder.isSelectedPostprocessingType('type')" to show UI element only if the specific postprocessing type is selected
//    and script_builder.getSelectedPostprocessing() to bind variables from your new class to UI elements, for example:
//    script_builder.getSelectedPostprocessing().foo
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

    /// Optional hook functions, use them to update visual state of postprocessing
    /// To get Xpath of parent script use this.getParentXpath()

    // Called before postprocessing is shown to user, update variables bound to UI or show highlight
    show() {
        this.foo = 'Shown at ' + new Date().getTime() + ' with parent Xpath ' + this.getParentXpath();
    };

    // Called before postprocessing is hidden from view, cleanup highlight effects related to this postprocessing
    hide() {
        this.foo = '?#@*&%!, but user will never see this';
    };
}

// Register postprocessing
Postprocessing.register(PostprocessingName);
// NEW POSTPROCESSING TEMPLATE END */


function Postprocessing() { }

Postprocessing.types = [];

Postprocessing.register = function(proto, disabled) {
    var dummy = new proto;

    Postprocessing.types.push({
        name: dummy.label,
        type: dummy.type,
        disabled: disabled,
        proto: proto
    });
};

Postprocessing.create = function(type, visual_only_id, script_builder) {
    // Create 'unimplemented' postprocessing if requested one is not registered
    var postprocessing = new (Postprocessing.types.find((field) => field.type == type) || Postprocessing.types.find((field) => field.type == 'unimplemented')).proto;

    postprocessing.visual_only_id = visual_only_id;

    // Create empty 'virtual' functions if they are not defined in postprocessing
    postprocessing.show = postprocessing.show || function() {};
    postprocessing.hide = postprocessing.hide || function() {};

    // Create helper functions
    postprocessing.getParentXpath = function() {
        return script_builder.getSelectedScript().xpath;
    };

    return postprocessing;
};
