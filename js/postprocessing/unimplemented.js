class Unimplemented {
    constructor() {
        this.label = 'Unimplemented';
        this.type = 'unimplemented';
        this.postprocessing = {};
    }

    canHaveChildren() {
        return false;
    };

    // Don't modify the data, user can be just using old version of extension
    save() {
        return this.postprocessing;
    };

    load(postprocessing) {
        this.postprocessing = postprocessing;
    };
}

// Register 'unimplemented' postprocessing as disabled - not shown in menu
Postprocessing.register(Unimplemented, true);
