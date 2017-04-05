class Nested {
    constructor() {
        this.children_ids = [];
        this.label = 'Nested';
        this.type = 'nested';
    }

    canHaveChildren() {
        return true;
    };

    save() {
        return {
            type: this.type,
            // Will be filled by 'generic' functionality in script_builder2.js
            data: []
        }
    };

    load(postprocessing) {
        // Nothing to do, postprocessing contains only 'type' and 'data'.
        // Type is already known for us and data are handled specially because,
        // 'canHaveChildren' returns true.
    };

    registerChild(childId) {
        this.children_ids.push(childId);
    };
}

Postprocessing.register(Nested);
