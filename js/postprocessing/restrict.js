class Restrict {
    constructor() {
        this.label = 'Restrict';
        this.type = 'restrict';
        this.children_ids = [];
    }

    canHaveChildren() {
        return true;
    };

    registerChild(childId) {
        this.children_ids.push(childId);
    };

    save() {
        return {
            type: this.type,
            // Will be filled by 'generic' functionality in script_builder2.js
            data: []
        };
    };

    load(postprocessing) { };

    show() {
        startRestrictHighlight(this.getParentXpath());
    };

    hide() {
        stopRestrictHighlight();
    };
}

// Register postprocessing
Postprocessing.register(Restrict);
