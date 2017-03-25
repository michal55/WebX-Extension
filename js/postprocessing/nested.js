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
            type: Nested.type,
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

Postprocessing.register(Nested, 'nested');
