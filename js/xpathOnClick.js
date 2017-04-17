// Message handler for xpathOnClick.js content script
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.onClickXPath) {
        try {
            onClickXPath(true, true, true, callback, true);
        } catch (err) {
            console.error(err);
        }

        return true;
    }

    else if (request.get_attributes){
        try {
            get_attributes(request.get_attributes.xpath, callback);
        } catch (err) {
            console.error(err);
        }
        return true;
    }

    else if (request.get_form_data){
        try {
            get_form_data(request.get_form_data.xpath, callback);
        } catch (err) {
            console.error(err);
        }
        return true;
    }

    return true;
});

var custom_styles = {
    "highlighting-mouse-over-element": "<style type='text/css' id='WebX_custom_styles'> .highlighting-mouse-over-element{ background-color: rgba(0, 255, 0, 0.6) !important;} </style>",
    "restrict-selected-highlight": "<style type='text/css'> .restrict-selected-highlight{background-color: rgba(194, 188, 9, 0.23) !important;} </style>",
    "highlighting-selected-elements": "<style type='text/css'> .highlighting-selected-elements{ background-color: rgba(0, 0, 255, 0.4) !important;} </style>",
    "highlighting-negative-elements": "<style type='text/css'> .highlighting-negative-elements{ background-color: rgba(255, 0, 0, 0.6) !important;} </style>",
    "highlighting-positive-elements": "<style type='text/css'> .highlighting-positive-elements{ background-color: rgba(0, 100, 0, 0.6) !important;} </style>"
};

function initializeCustomStyles() {
    if ($("#WebX_custom_styles").length == 0) {
        for (var i in custom_styles) {
            $(custom_styles[i]).appendTo("head");
        }
    }
}

function addNodes(array, collection) {
    for (var i = 0; collection && collection.length && i < collection.length; i++) {
        array.push(collection[i]);
    }
}

function onClickXPath(useIdx, useId, useClass, callback, relative) {
    initializeCustomStyles();

    var ae = [];
    addNodes(ae, document.getElementsByTagName("*"));
    for (var i = 0; i < ae.length; i++) {
        if (ae[i].tagName == 'IFRAME') {
            try {
                var d = ae[i].contentDocument;

                if (d) {
                    addNodes(ae, d.getElementsByTagName("*"));
                }
            }
            catch (err) { }
        }
    }

    function handler(event) {
        $('*').off('click.onClickXPath_handler');
        $('*').off('mouseover.onClickXPath');
        $('.highlighting-mouse-over-element').removeClass('highlighting-mouse-over-element');

        var e = this;
        var idx;

        for (var path = ''; e && e.nodeType == 1; e = e.parentNode) {
            var predicate = [];
            var brothers = e.parentNode.children;
            var count = 0;
            var unique = false;

            for (var i = 0; brothers && (i < brothers.length); i++) {
                if (brothers[i].tagName == e.tagName) {
                    count++;
                    if (brothers[i] == e) {
                        idx = count;
                    }
                }
            }

            if (idx == 1 && count == 1) {
                idx = null;
            }

            if (useId && e.id) {
                predicate[predicate.length] = "@id='" + e.id + "'";
                unique = true;
            }

            if (useClass && e.className) {
                predicate[predicate.length] = "@class='" + e.className + "'";
            }

            idx = ( useIdx && idx && !unique ) ? ('[' + idx + ']') : '';
            predicate = (predicate.length > 0) ? ('[' + predicate.join(' and ') + ']') : '';
            path = '/' + e.tagName.toLowerCase() + idx + predicate + path;

            if (unique && relative) {
                path = '/' + path;
                break;
            }
        }
        var classes = Object.keys(custom_styles);
        for (var i in classes) {
            path.replace(new RegExp(classes[i], 'g'), "");
        }
        path.replace(/\[\s*@class='\s*'\s*\]/g, "");

        callback(path);
        return false;
    }

    for (var i = 0; i < ae.length; i++) {
        $(ae[i]).on('click.onClickXPath_handler', handler);
    }

    $('*').on('mouseover.onClickXPath',
        function(e) {
            $('.highlighting-mouse-over-element').removeClass('highlighting-mouse-over-element');
            $(this).addClass('highlighting-mouse-over-element');
            return false;
        });
}

function xpathArray(parent, exp) {
    if (! parent ) {
        return parent;
    }

    if (parent != document && exp.match("^\\/")) {
        console.error('path', exp, 'should be relative to a specific parent but seems to be absolute. Did you forget a starting dot?');
    }

    var it = document.evaluate(exp, parent, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var a = [];
    var i = it.iterateNext();

    while (i !== null) {
        a.push(i);
        i = it.iterateNext();
    }

    return a;
}

function start_highlight(xpath, type) {
    initializeCustomStyles();

    var style = 'highlighting-selected-elements';

    if (type == 'positive') {
        style = 'highlighting-positive-elements';
    } else if (type == 'negative') {
        style = 'highlighting-negative-elements';
    }

    var elements_iter = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    var el = elements_iter.iterateNext();
    var elements = [];

    while (el) {
        elements.push(el);
        el = elements_iter.iterateNext();
    }

    for (var i in elements) {
        elements[i].className += ' ' + style;
    }

}

function stop_highlight() {
    $('.highlighting-selected-elements').removeClass('highlighting-selected-elements');
    $('.highlighting-negative-elements').removeClass('highlighting-negative-elements');
    $('.highlighting-positive-elements').removeClass('highlighting-positive-elements');
}

function get_attributes(xpath , callback) {
    var elements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null ) ;
    var el = elements.iterateNext();
    var attributes = [];
    attributes.push("text");
    attributes.push("innerhtml");

    while (el !== null) {
        if ( el.textContent !== undefined) {

            if ((isNaN(parseFloat(el.textContent)) !== true) && (attributes.indexOf("float") == -1 ) ) {
                attributes.push("float");
                attributes.push("integer");
            }
        }

        var i = 0;
        while ( i < el.attributes.length) {
            if (attributes.indexOf(el.attributes[i].name) == -1 ) {
                attributes.push(el.attributes[i].name);
            }
            i += 1;
        }
        el = elements.iterateNext();
    }
    callback(attributes);
}
function get_form_data(xpath , callback) {
    var elements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null ) ;
    var el = elements.iterateNext();
    var inputs = {};
    var meta_inputs = {};
    console.log(xpath);

    if (el.tagName == "FORM") {
        meta_inputs.FORM = 1;
        meta_inputs.url = el.attributes.action.value;
        for (var i in el.children) {
            child = el.children[i];
            if ((child.tagName == "INPUT") && (child.type !== "button")){
                inputs[child.name] = child.value;
            }
        }

    }else {
        console.log("xpath does not point to form");
        meta_inputs.FORM = 0;
    }

    callback({"meta_inputs":meta_inputs,"inputs":inputs});
}

function startRestrictHighlight(xpath) {
    initializeCustomStyles();

    var elements_iter = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    var el = elements_iter.iterateNext();
    var elements = [];

    while (el) {
        elements.push(el);
        el = elements_iter.iterateNext();
    }

    for (var i in elements) {
        elements[i].className += ' restrict-selected-highlight';
    }
}

function stopRestrictHighlight() {
    $('.restrict-selected-highlight').removeClass('restrict-selected-highlight');
}
