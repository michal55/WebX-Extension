class Pagination {
    constructor() {
        this.label = 'Pagination';
        this.type = 'pagination';
        this.limit = 100;
    }

    canHaveChildren() {
        return false;
    };

    save() {
        return {
            type: this.type,
            limit: this.limit
        };
    };

    load(postprocessing) {
        this.limit = postprocessing.limit;
    };
}

// Register postprocessing
Postprocessing.register(Pagination);
