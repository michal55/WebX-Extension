class Attributes {
    constructor() {
        this.label = 'Attributes';
        this.type = 'attributes';
        this.postprocessing = {};
        //default is always string
        this.attribute = "string";
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
        console.log(this);
        if (this.getParentXpath() === ""){
            this.attributes = ["string","innerhtml"];
        } else{
            // wont work if I put only this into callback
            var thisclass = this;
            get_attributes(this.getParentXpath(),function(result){
                // Take only unique values from result
                thisclass.attributes = [...new Set(result)];
                angular.element('[ng-controller="main"]').scope().$digest();
            } );
        }
    }
}

Postprocessing.register(Attributes);
