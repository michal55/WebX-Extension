function addNodes(array, collection) {
    for (var i = 0; collection && collection.length && i < collection.length; i++) {
        array.push(collection[i]);
    }
}

function onClickXPath(useIdx, useId, useClass, callback, relative) {
    var ae = [];
    addNodes(ae, document.getElementsByTagName("*"));
    for (var i = 0; i < ae.length; i++) {
        if (ae[i].tagName == 'IFRAME') {
            try {
                var d = ae[i].contentDocument;
                }
            catch (err) {}
            if (d) {
                addNodes(ae, d.getElementsByTagName("*"));
            }
        }
    }
    $("<style type='text/css'> .highlighting-mouse-over-element{ background-color: rgba(0, 255, 0, 0.6);;} </style>").appendTo("head"); 
    // must be function in function - need to pass ae variable
    function handler (event) {
        for (var i = 0; i < ae.length; i++) {
            ae[i].removeEventListener('click', arguments.callee);
        }
        //$('*').unbind('hover');
        event.preventDefault();
        event.stopPropagation();

        var e = this;
    
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
            path='/' + e.tagName.toLowerCase() + idx + predicate + path;
      
            if (unique && relative) {
            path = '/' + path;
            break;
            }
        }

        chrome.storage.local.set({ "newxpath": path }, function(){});
        return false;
    };

    for (var i = 0; i < ae.length; i++) {
        ae[i].addEventListener('click', handler);
    }
    $('*').mouseover(
    function(e) {
        $('*').removeClass("highlighting-mouse-over-element");
        $(this).addClass("highlighting-mouse-over-element");//css('border', '1px solid black');
        e.preventDefault();
        e.stopPropagation();
        return false;
    }).mouseout(function(e) {
        $(this).removeClass("highlighting-mouse-over-element");//css('border', 'none');
        e.preventDefault();
        e.stopPropagation();
        return false;
    }).click(function() {
    $('*').unbind('mouseenter mouseleave mouseover mouseout');
    $('*').removeClass("highlighting-mouse-over-element");//css('border', 'none');
    //$('*').unbind('hover');
    });
}

function xpathArray(parent, exp) {
    if (! parent ) { return parent };
        if (parent != document && exp.match("^\\/")) {
            console.error('path', exp, 'should be relative to a specific parent but seems to be absolute. Did you forget a starting dot?');
        }
    var it = document.evaluate(exp, parent, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var a = [];
    var i = it.iterateNext();
    while (i != null) {
        a.push(i);
        i = it.iterateNext();
    }
    //console.debug("xpathArray:", parent, exp, a);
    return a;
}

function start_highlight(xpath) {
    console.log("xpath in highlight");
    console.log(xpath);
    $("<style type='text/css'> .highlighting-selected-elements{ background-color: rgba(0, 0, 255, 0.4);;} </style>").appendTo("head");
    $("<style type='text/css'> .highlighting-negative-elements{ background-color: rgba(255, 0, 0, 0.6);;} </style>").appendTo("head");
    var elements_iter = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null); 
    var el = elements_iter.iterateNext();
    var elements = [];
    while (el) {
        elements.push(el);
        el = elements_iter.iterateNext();
    }
    for (i in elements) {
        elements[i].className += " highlighting-selected-elements";
    }
    
}

function stop_highlight() {
    $('*').removeClass("highlighting-selected-elements");
    $('*').removeClass("highlighting-negative-elements");
}


