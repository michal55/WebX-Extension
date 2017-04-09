class Pagination {
    constructor() {
        this.label = 'Pagination';
        this.type = 'pagination';
    }

    canHaveChildren() {
        return false;
    };

    save() {
        return {
            type: this.type,
        };
    };

    load(postprocessing) {};
}

// Register postprocessing
Postprocessing.register(Pagination);
