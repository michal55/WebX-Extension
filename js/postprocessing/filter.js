class Filter {
    constructor() {
        this.label = 'Filter';
        this.type = 'filter';
        this.filter = '';
        this.warning = undefined;

        this.filters = [
            {name: 'yesterday'}
        ];
    }

    canHaveChildren() {
        return false;
    };

    save() {
        return {
            type: this.type,
            filter: this.filter
        };
    };

    load(postprocessing) {
        this.filter = postprocessing.filter;
        this.onchange();
    };

    onchange() {
        if (this.filter === 'yesterday') {
            // Show warning if current field type is not date
            if ((this.getScriptBuilder().data_fields.find((field) => field.name === this.getScriptBuilder().getSelectedScript().name) || {data_type: undefined}).data_type !== 'date') {
                this.warning = 'Invalid filter selected: Data field type is not "date", the filter will have no effect';
            }
        } else {
            // No warning
            this.warning = undefined;
        }
    }
}

// Register postprocessing
Postprocessing.register(Filter);
