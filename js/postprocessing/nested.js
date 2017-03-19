class Nested {
    constructor() {
        this.children_ids = [];
    }

    canHaveChildren() {
        return true;
    };

    save() {
        return {
            type: 'nested',
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

Postprocessing.register('nested', Nested);
