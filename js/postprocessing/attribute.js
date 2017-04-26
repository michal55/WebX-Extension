class Attributes {
    constructor() {
        this.label = 'Attribute';
        this.type = 'attribute';
        this.postprocessing = {};
        // Default is always string
        this.attribute = 'string';
        this.attributes = [];
    }

    canHaveChildren() {
        return false;
    };

    save() {
        return {
            type: this.type,
            attribute: this.attribute
        };
    };

    load(postprocessing) {
        this.attribute = postprocessing.attribute;
    };

    show() {
        if (this.getParentXpath() === '') {
            this.attributes = ['text', 'innerhtml'];
        } else {
            // Won't work if I put only this into callback
            var thisclass = this;
            get_attributes(this.getParentXpath(), function(result) {
                // Take only unique values from result
                thisclass.attributes = [...new Set(result)];
                angular.element('[ng-controller="main"]').scope().$digest();
            });
        }
    }
}

Postprocessing.register(Attributes);
