Solo = window.Solo || {};
Solo.View = function() {
    this.container = null;
};

Solo.View.prototype = {
    deflate: function() {}
};

Solo = window.Solo || {};

Solo.Module = function() {
    this.container = null;
    this.name = null;
    this.objectClass = null;
    this.controller = null;
    this.view = null;
};

Solo.modules = {};

Solo.defineModule = function(container, moduleName) {
    if (container) {
        var module = new Solo.Module();
        var objectClass = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        if (!Solo.modules[moduleName]) {
            module.container = container;
            module.name = moduleName;
            module.objectClass = objectClass;
            Solo.modules[moduleName] = module;
        }
    } else {
        throw ("Specified container does not exist");
    }
};

Solo.loadModule = function(moduleName) {

    var module = Solo.modules[moduleName];

    var controllerClass = module.objectClass + "Controller";
    var viewClass = module.objectClass + "View";
    if (module.container[controllerClass] && !module.controller) {
        module.controller = new module.container[controllerClass]();
    }
    if (module.container[viewClass] && !module.view) {
        module.view = new module.container[viewClass]();
    }

    module.container.instance[moduleName] = module.controller;
    module.controller.module = module;
};

Solo.JSONData = function() {
    this.cache = null;
    this.dataArray = [];
};

Solo.JSONData.prototype = {
    initWithCache: function(cache) {
        this.cache = cache;
    },

    fetch: function(url, callback) {
        var self = this;
        var cacheCallback = function(data, status) {
            self.dataArray = data;
            if (self.afterFetch) {
                self.dataArray = self.afterFetch(self.dataArray);
            }
            callback(self.dataArray);
        };

        var uncachedCallback = function(data) {
            self.dataArray = data;
            if (self.afterFetch) {
                self.dataArray = self.afterFetch(self.dataArray);
            }
            callback(self.dataArray);
        };

        this.cache ? this.cache.read(url, cacheCallback) : jQuery.getJSON(url, uncachedCallback);
    },

    load: function(data) {
        this.dataArray = data;
    },

    count: function() {
        return this.dataArray.length;
    }

};

Solo = window.Solo || {};
Solo.Controller = function() {
    this.view = null;
    this.data = null;
};

Solo.Controller.prototype = {
    deflate: function() {
        this.view.deflate();
    };
};

Solo.BasicModel = function() {
    this.rawData = null;
};

Solo.BasicModel.prototype = {
    init: function(data) {
        this.rawData = data;
        for (var name in data) {
            if (!this[name]) {
                this[name] = (function(name) {
                    return function() {
                        return this.rawData[name];
                    };
                })(name);
            }
        }
    }
};

Solo.PageIndicator = function() {
    this.total = 0;
    this.currentItem = 0;
    this.container = null;
    this.grid = jQuery("<table><tr><td class='left'></td><td class='center'></td><td class='right'></td></tr></table>");
    this.left = jQuery("<div class='pageLeftIndicator'></div>");
    this.right = jQuery("<div class='pageRightIndicator'></div>");
    this.circles = jQuery("<div class='pageCirclesContainer'></div>");
};

Solo.PageIndicator.prototype = {
    init: function(container) {
        this.container = container;
        this.container.empty();
        this.container.append(this.grid);
        this.grid.find(".left").append(this.left).end().find(".center").append(this.circles).end().find(".right").append(this.right);
    },

    setTotal: function(total) {
        this.total = total;
        this.render();
    },

    setCurrentItem: function(num) {
        this.currentItem = num;
        this.render();
    },

    render: function() {
        var emptyCircle = "&#9675;";
        var fullCircle = "&#9679;";
        this.circles.empty();
        this.left.css("opacity", "0.3");
        this.right.css("opacity", "0.3");
        if (this.total > 1) {
            for (var i = 0, len = this.total; i < len; i++) {
                if (i == this.currentItem) {
                    this.circles.append(fullCircle);
                } else {
                    this.circles.append(emptyCircle);
                }
            }
            if (this.currentItem > 0) {
                this.left.css("opacity", "1.0");
            }
            if (this.currentItem < (this.total - 1)) {
                this.right.css("opacity", "1.0");
            }
        }
    }
};

ResizedContainedElement = function(interiorNode, containerNode) {
    containerNode = jQuery(containerNode);
    interiorNode = jQuery(interiorNode);

    var containerWidth = containerNode.width();
    var containerHeight = containerNode.height();

    var interiorHeight = interiorNode.height();
    var interiorWidth = interiorNode.width();

    var adjustedInteriorHeight = interiorHeight;
    var adjustedInteriorWidth = interiorWidth;

    var horizontalPadding = 0;
    var verticalPadding = 0;

    this.apply = function() {
        var currentHeight, currentWidth, adjusted = false;
        while (tooTall() || tooWide()) {
            if (tooTall()) {
                currentHeight = adjustedInteriorHeight
                adjustedInteriorHeight = containerHeight - verticalPadding;
                adjustedInteriorWidth = adjustedInteriorWidth * (adjustedInteriorHeight / currentHeight);
                adjusted = true;
                continue;
            }

            if (tooWide()) {
                currentWidth = adjustedInteriorWidth;
                adjustedInteriorWidth = containerWidth - horizontalPadding;
                adjustedInteriorHeight = adjustedInteriorHeight * (adjustedInteriorWidth / currentWidth);
                adjusted = true;
                continue;
            }
        }

        adjusted && interiorNode.css({"height": pixels(adjustedInteriorHeight),"width": pixels(adjustedInteriorWidth)});
    };

    this.addVerticalPadding = function(padding) {
        horizontalPadding = padding;
    };

    this.addHorizontalPadding = function(padding) {
        verticalPadding = padding;

    };

    function tooTall() {
        return adjustedInteriorHeight + verticalPadding > containerHeight;
    }

    function tooWide() {
        return adjustedInteriorWidth + horizontalPadding > containerWidth;
    }

};

Solo = window.Solo || {};

Solo.Columnizer = function(options) {
    jQuery.extend(this, options || {});
};

Solo.Columnizer.prototype = {

    max_height: 400,
    column_width: 300,
    column_gap: 30,

    supports_css_columns: false,

    init: function(container) {
        this.container = jQuery(container).get(0);
        this.testColumnSupport();
        if (!this.supports_css_columns) {
            this.redraw = this.legacyRedraw;
        }
    },

    testColumnSupport: function() {
        var rules = ["columnWidth", "webkitColumnWidth", "MozColumnWidth"];
        for (var i = 0, rule; rule = rules[i]; ++i) {
            if (rule in this.container.style) {
                this.supports_css_columns = true;
                this.prefix = rule.match(/^[wM][a-z]+/) || "";
            }
        }
    },

    redraw: function() {
        this.scaleHardCodedWidths();
        this.applyColumnStyles();
        while (this.container.offsetHeight > this.max_height) {
            width = this.container.offsetWidth;
            this.container.style.width = width + this.column_width + "px";
        }
    },

    legacyRedraw: function() {
        this.scaleHardCodedWidths();
        this.prepareForColumnization();
        while (this.hasUncolumnizedContent()) {
            this.createNextColumn();
        }
        this.displayColumnContainer();
        this.cleanUpColumnization();
    },

    scaleHardCodedWidths: function() {
        jQuery("[width]", this.container).each(function(index, element) {
            var width = parseInt(element.getAttribute("width"), 10);
            if (width > this.column_width) {
                var height = parseInt(element.getAttribute("height"), 10);
                if (height > 0) {
                    var scale = this.column_width / width;
                    element.setAttribute("height", height * scale);
                }
                element.setAttribute("width", this.column_width);
            }
        }.bind(this));
    },

    applyColumnStyles: function() {
        if (this.column_width)
            this.setColumnStyle("width", this.column_width);
        if (this.column_gap)
            this.setColumnStyle("gap", this.column_gap);
    },

    setColumnStyle: function(rule, value) {
        var upcased = rule.slice(0, 1).toUpperCase() + rule.slice(1, rule.length);
        rule = this.prefix ?
        (this.prefix + "Column" + upcased) :
        "column" + upcased;
        this.container.style[rule] = value + "px";
    },

    prepareForColumnization: function() {
        this.columns = [];
        this.content = this.container.innerHTML;
        this.column_container = this.container.cloneNode(false);
        jQuery(this.column_container).css({
            position: "absolute",
            zIndex: -999,
            visibility: "hidden"
        });
        this.container.parentNode.appendChild(this.column_container);
    },

    hasUncolumnizedContent: function() {
        this.content = this.content.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        return this.content.length;
    },

    createNextColumn: function() {

        // Revamped columnize.js
        // Original: http://13thparallel.com/archive/column-script/

        var cursor = 0, max = this.content.length, mid,
        too_long = true,
        column = this.createColumnElement();
        this.column_container.appendChild(column);
        column.innerHTML = this.content;
        this.open_tags = [];

        if (column.offsetHeight <= this.max_height) {
            cursor = this.content.length;
            too_long = false;
        }

        while (too_long) {
            mid = Math.round((max - cursor) / 2);
            cursor += mid;
            if (mid <= 1) {
                too_long = false;
            }
            column.innerHTML = this.content.substr(0, cursor);
            if (column.offsetHeight > this.max_height) {
                max = cursor;
                cursor -= mid;
            }
        }

        var tmp = this.content.substr(0, cursor);
        if (tmp != this.content) {
            var last_space = tmp.lastIndexOf(" ");
            var last_tag_end = tmp.lastIndexOf(">");
            var last_tag_start = tmp.lastIndexOf("<");
            if (last_space > last_tag_end && (last_tag_start < 0 || last_tag_end > last_tag_start)) {
                cursor = last_space + 1;
            } else if (last_tag_start > last_tag_end) {
                cursor = last_tag_start;
            } else if (last_tag_end > -1) {
                cursor = last_tag_end + 1;
            }
        }

        var tags = tmp.split("<");
        tags.shift();

        for (var i = 0, tag, name; tag = tags[i]; ++i) {
            tag = tag.split(">")[0];
            if (tag.charAt(tag.length - 1) == "/") {
                continue;
            }
            if (tag.charAt(0) != "/") {
                name = tag.split(" ")[0];
                if (!name.match(/^br|img|hr|input|!--/i)) {
                    this.open_tags.push(tag);
                }
            } else {
                this.open_tags.pop();
            }
        }

        this.content = this.content.slice(tmp.length);

        for (var i = 0, open; open = this.open_tags[i]; ++i) {
            tmp += "</" + open.split(" ")[0] + ">";
            if (this.content.length) {
                this.content = "<" + open + ">" + this.content;
            }
        }

        column.innerHTML = tmp;
        this.columns.push(column);

    },

    createColumnElement: function() {
        var column = document.createElement("div");
        jQuery(column).css({
            border: 0,
            padding: 0,
            marginRight: this.column_gap + "px",
            width: this.column_width + "px",
            cssFloat: "left"
        });
        return column;
    },

    displayColumnContainer: function() {
        jQuery(this.column_container).css({
            position: "static",
            visibility: "visible",
            zIndex: 999,
            width: ((this.column_width + this.column_gap) * this.columns.length) + "px"
        });
        jQuery(this.container).hide();
    },

    cleanUpColumnization: function() {
        this.content = this.column_container = null;
    }

};
/*
    http://www.JSON.org/json2.js
    2008-11-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function() {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function(key) {

            return this.getUTCFullYear() + '-' +
            f(this.getUTCMonth() + 1) + '-' +
            f(this.getUTCDate()) + 'T' +
            f(this.getUTCHours()) + ':' +
            f(this.getUTCMinutes()) + ':' +
            f(this.getUTCSeconds()) + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = { // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
    rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
        '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' :
        '"' + string + '"';
    }


    function str(key, holder) {
        // Produce a string from holder[key].

        var i,  // The loop counter.
        k,  // The member key.
        v,  // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
        typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                    partial.join(',\n' + gap) + '\n' +
                    mind + ']' :
                    '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
            (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
            test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
})();

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, p) {
    var i, m = Array.prototype.slice, r = decodeURIComponent, a = $.param, c, l, v, b = $.bbq = $.bbq || {}, q, u, j, e = $.event.special, d = "hashchange", A = "querystring", D = "fragment", y = "elemUrlAttr", g = "location", k = "href", t = "src", x = /^.*\?|#.*$/g, w = /^.*\#/, h, C = {};
    function E(F) {
        return typeof F === "string"
    }
    function B(G) {
        var F = m.call(arguments, 1);
        return function() {
            return G.apply(this, F.concat(m.call(arguments)))
        }
    }
    function n(F) {
        return F.replace(/^[^#]*#?(.*)$/, "$1")
    }
    function o(F) {
        return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1")
    }
    function f(H, M, F, I, G) {
        var O, L, K, N, J;
        if (I !== i) {
            K = F.match(H ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/);
            J = K[3] || "";
            if (G === 2 && E(I)) {
                L = I.replace(H ? w : x, "")
            } else {
                N = l(K[2]);
                I = E(I) ? l[H ? D : A](I) : I;
                L = G === 2 ? I : G === 1 ? $.extend({}, I, N) : $.extend({}, N, I);
                L = a(L);
                if (H) {
                    L = L.replace(h, r)
                }
            }
            O = K[1] + (H ? "#" : L || !K[1] ? "?" : "") + L + J
        } else {
            O = M(F !== i ? F : p[g][k])
        }
        return O
    }
    a[A] = B(f, 0, o);
    a[D] = c = B(f, 1, n);
    c.noEscape = function(G) {
        G = G || "";
        var F = $.map(G.split(""), encodeURIComponent);
        h = new RegExp(F.join("|"), "g")
    };
    c.noEscape(",/");
    $.deparam = l = function(I, F) {
        var H = {}, G = {"true": !0,"false": !1,"null": null};
        $.each(I.replace(/\+/g, " ").split("&"), function(L, Q) {
            var K = Q.split("="), P = r(K[0]), J, O = H, M = 0, R = P.split("]["), N = R.length - 1;
            if (/\[/.test(R[0]) && /\]$/.test(R[N])) {
                R[N] = R[N].replace(/\]$/, "");
                R = R.shift().split("[").concat(R);
                N = R.length - 1
            } else {
                N = 0
            }
            if (K.length === 2) {
                J = r(K[1]);
                if (F) {
                    J = J && !isNaN(J) ? +J : J === "undefined" ? i : G[J] !== i ? G[J] : J
                }
                if (N) {
                    for (; M <= N; M++) {
                        P = R[M] === "" ? O.length : R[M];
                        O = O[P] = M < N ? O[P] || (R[M + 1] && isNaN(R[M + 1]) ? {} : []) : J
                    }
                } else {
                    if ($.isArray(H[P])) {
                        H[P].push(J)
                    } else {
                        if (H[P] !== i) {
                            H[P] = [H[P], J]
                        } else {
                            H[P] = J
                        }
                    }
                }
            } else {
                if (P) {
                    H[P] = F ? i : ""
                }
            }
        });
        return H
    };
    function z(H, F, G) {
        if (F === i || typeof F === "boolean") {
            G = F;
            F = a[H ? D : A]()
        } else {
            F = E(F) ? F.replace(H ? w : x, "") : F
        }
        return l(F, G)
    }
    l[A] = B(z, 0);
    l[D] = v = B(z, 1);
    $[y] || ($[y] = function(F) {
        return $.extend(C, F)
    })({a: k,base: k,iframe: t,img: t,input: t,form: "action",link: k,script: t});
    j = $[y];
    function s(I, G, H, F) {
        if (!E(H) && typeof H !== "object") {
            F = H;
            H = G;
            G = i
        }
        return this.each(function() {
            var L = $(this), J = G || j()[(this.nodeName || "").toLowerCase()] || "", K = J && L.attr(J) || "";
            L.attr(J, a[I](K, H, F))
        })
    }
    $.fn[A] = B(s, A);
    $.fn[D] = B(s, D);
    b.pushState = q = function(I, F) {
        if (E(I) && /^#/.test(I) && F === i) {
            F = 2
        }
        var H = I !== i, G = c(p[g][k], H ? I : {}, H ? F : 2);
        p[g][k] = G + (/#/.test(G) ? "" : "#")
    };
    b.getState = u = function(F, G) {
        return F === i || typeof F === "boolean" ? v(F) : v(G)[F]
    };
    b.removeState = function(F) {
        var G = {};
        if (F !== i) {
            G = u();
            $.each($.isArray(F) ? F : arguments, function(I, H) {
                delete G[H]
            })
        }
        q(G, 2)
    };
    e[d] = $.extend(e[d], {add: function(F) {
            var H;
            function G(J) {
                var I = J[D] = c();
                J.getState = function(K, L) {
                    return K === i || typeof K === "boolean" ? l(I, K) : l(I, L)[K]
                };
                H.apply(this, arguments)
            }
            if ($.isFunction(F)) {
                H = F;
                return G
            } else {
                H = F.handler;
                F.handler = G
            }
        }})
})(jQuery, this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, i, b) {
    var j, k = $.event.special, c = "location", d = "hashchange", l = "href", f = $.browser, g = document.documentMode, h = f.msie && (g === b || g < 8), e = "on" + d in i && !h;
    function a(m) {
        m = m || i[c][l];
        return m.replace(/^[^#]*#?(.*)$/, "$1")
    }
    $[d + "Delay"] = 100;
    k[d] = $.extend(k[d], {setup: function() {
            if (e) {
                return false
            }
            $(j.start)
        },teardown: function() {
            if (e) {
                return false
            }
            $(j.stop)
        }});
    j = (function() {
        var m = {}, r, n, o, q;
        function p() {
            o = q = function(s) {
                return s
            };
            if (h) {
                n = $('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;
                q = function() {
                    return a(n.document[c][l])
                };
                o = function(u, s) {
                    if (u !== s) {
                        var t = n.document;
                        t.open().close();
                        t[c].hash = "#" + u
                    }
                };
                o(a())
            }
        }
        m.start = function() {
            if (r) {
                return
            }
            var t = a();
            o || p();
            (function s() {
                var v = a(), u = q(t);
                if (v !== t) {
                    o(t = v, u);
                    $(i).trigger(d)
                } else {
                    if (u !== t) {
                        i[c][l] = i[c][l].replace(/#.*/, "") + "#" + u
                    }
                }
                r = setTimeout(s, $[d + "Delay"])
            })()
        };
        m.stop = function() {
            if (!n) {
                r && clearTimeout(r);
                r = 0
            }
        };
        return m
    })()
})(jQuery, this);

Solo.TouchEventManager = function() {
    this.fingerIsDown = false;
    this.yOrigin = null;
    this.xOrigin = null;
    this.xCurrent = null;
    this.yCurrent = null;
    this.primaryOrientation = null;
    this.gestureType = null;
    this.touchLocked = false;
    self = this;

    this.init = function() {
        this.supported = "ontouchmove" in window;
        if (this.supported) {
            load();
        }
    };

    this.listen = function(event, data) {
        switch (event) {
            case "block gestures":
                this.touchLocked = true;
                break;

            case "unblock gestures":
                this.touchLocked = false;
        }
    };

    function fingerDistance(event) {
        var x1 = event.touches[0].pageX;
        var y1 = event.touches[0].pageY;
        var x2 = event.touches[1].pageX;
        var y2 = event.touches[1].pageY;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance;
    }

    function startTouch(event) {
        if (event.touches.length == 1) {
            this.yOrigin = event.touches ? event.touches[0].pageY : event.pageY;
            this.xOrigin = event.touches ? event.touches[0].pageX : event.pageX;
            this.xDiff = 0;
            this.yDiff = 0;
            this.target = jQuery(event.target);
            jQuery("body").addClass("touchDevice");
            notify("swipe started", this);
        } else if (event.touches.length == 2) {
            notify("pinch started", this);
            this.xyInit = fingerDistance(event);
        }
    }

    function doTouch(event) {
        if (self.touchLocked) {
            event.preventDefault();
        }
        if (event.touches.length == 1) {
            this.yCurrent = event.touches ? event.touches[0].pageY : event.pageY;
            this.xCurrent = event.touches ? event.touches[0].pageX : event.pageX;
            notify("touch moved");
            this.xDiff = this.xCurrent - this.xOrigin;
            this.yDiff = this.yCurrent - this.yOrigin;

            if (!this.primaryOrientation && Math.abs(this.xDiff) > 20) {
                this.primaryOrientation = "horizontal";
            } else if (!this.primaryOrientation && Math.abs(this.yDiff) > 20) {
                this.primaryOrientation = "vertical";
            }

            if (this.primaryOrientation == "horizontal") {
                notify("horizontal swipe", this);
                if (this.xDiff < 0) {
                    this.xDiff -= 20;
                    notify("swiping left", this);
                } else {
                    this.xDiff += 20;
                    notify("swiping right", this);
                }
            } else if (this.primaryOrientation == "vertical") {
                notify("vertical swipe", this);
                if (this.yDiff < 0) {
                    this.yDiff += 20;
                    notify("swiping up", this);
                } else {
                    this.yDiff -= 20;
                    notify("swiping down", this);
                }
            }
        }
    }

    function endTouch(event) {
        notify("touch stopped", this);
        if (this.xDiff !== null) {
            notify("swipe stopped", this);

            if (this.primaryOrientation == "horizontal") {
                notify("end horizontal swipe", this);
                this.xDiff < 0
                ? notify("end left swipe", this)
                : notify("end right swipe", this);
            } else if (this.primaryOrientation == "vertical") {
                notify("end vertical swipe", this);
                this.yDiff < 0
                ? notify("end up swipe", this)
                : notify("end down swipe", this);
            }

            if (event.touches.length == 1 && this.xDiff > 10) {
                event.preventDefault();
                return false;
            }
            this.primaryOrientation = null;
            this.xDiff = null;
        } else if (this.xyDiff !== null) {
            notify("end pinch", this);
            if (this.xyDiff < -20) {
                notify("end pinch in", this);
            } else if (this.xyDiff > 20) {
                notify("end pinch out", this);
            }
            this.xyDiff = null;
        }
    }

    function startGesture(event) {
        this.target = jQuery(event.target);
    }

    function doGesture(event) {
        this.scale = event.scale;
        notify("pinching", this);
        if (event.scale > 1) {
            notify("pinching out", this);
        } else {
            notify("pinching in", this);
        }
        event.preventDefault();
    }

    function endGesture(event) {
        notify("end pinch", this);
        if (event.scale > 1) {
            notify("end pinch out", this);
        } else {
            notify("end pinch in", this);
        }
    }

    function load() {
        try {
            document.addEventListener("touchstart", startTouch, false);
            document.addEventListener("touchmove", doTouch, false);
            document.addEventListener("touchend", endTouch, false);
        } catch (e) {
        }
    }

};

Solo.TouchEventManager.prototype = {

    loadEvents: function(conf) {
        for (var eventType in conf.events) {
            for (var selector in conf.events[eventType]) {
                jQuery(selector).live(eventType, conf.events[eventType][selector]);
            }
        }
        for (var selector in conf.mousemoveActions) {
            this.move(selector, conf.mousemoveActions[selector]);
        }
        for (var selector in conf.mousemoveShiftActions) {
            this.moveWithShift(selector, conf.mousemoveShiftActions[selector]);
        }
    },

    touchStart: function(fn) {

    },

    touchMove: function(fn) {

    },

    touchEnd: function(fn) {

    }
};




Solo = window.Solo || {};
Solo.MouseEventManager = function() { };

Solo.MouseEventManager.prototype = {
    loadEvents: function(conf) {
        for (var eventType in conf.events) {
            for (var selector in conf.events[eventType]) {
                if (eventType == "click") {
                    jQuery(selector).live(eventType, conf.events[eventType][selector]);
                } else {
                    jQuery(selector).live(eventType, conf.events[eventType][selector]);
                }
            }
        }

        for (var selector in conf.mousemoveActions) {
            this.move(selector, conf.mousemoveActions[selector]);
        }

        for (var selector in conf.mousemoveShiftActions) {
            this.moveWithShift(selector, conf.mousemoveShiftActions[selector]);
        }
    },

    update: function(message) { },

    move: function(node, fn) {
        jQuery(node).live("mousemove", function(evt) {
            if (!evt.shiftKey) {
                fn(evt.target);
            }
        });
    },

    moveWithShift: function(node, fn) {
        jQuery(node).live("mousemove", function(evt) {
            if (evt.shiftKey) {
                fn(evt.target);
            }
        });
    }
};

Solo.KeyEventManager = function() {
    var self = this;

    this.disabled = false;

    this.disableKeys = function() {
        this.disabled = true;
        this.enableDefaults();
    };

    this.enableKeys = function() {
        this.disabled = false;
        this.disableDefaults();
    };


    this.disableDefaults = function() {
        jQuery(document).keypress(function(evt) {
            if (evt.ctrlKey || evt.metaKey || evt.target.nodeName == "TEXTAREA")
                return;
            if (!evt.metaKey) {
                evt.preventDefault();
            }
        });
    };

    this.enableDefaults = function() {
        jQuery(document).unbind("keypress");
    };

    this.loadEvents = function(conf) {
        jQuery(document).keyup(function(evt) {
            if (self.disabled) {
                console.log("Ignoring configured keys");
                return;
            }
            var keyCode = evt.which || evt.keyCode;
            switch (keyCode) {
                case 37:
                    notify("left arrow", evt);
                    break;
                case 39:
                    notify("right arrow", evt);
                    break;
                case 38:
                    notify("up arrow", evt);
                    break;
                case 40:
                    notify("down arrow", evt);
                    break;
                case 32:
                    notify("space bar", evt);
                    break;
                case 27:
                    notify("escape key", evt);
                    break;
                case 9:
                    notify("tab key", evt);
                    evt.preventDefault();
                    break;
                case 13:
                    notify("return key", evt);
                    break;
                case 191:
                    notify("backslash key", evt);
                    break;
                default:
                    var char = String.fromCharCode(keyCode);
                    notify("keycode " + keyCode);
                    notify("key " + char, evt);
            }
            ;
        });
    };
};

Function.prototype.bind = Function.prototype.bind || function() {
    var method = this, args = [].slice.call(arguments), source = args.shift();
    return function() {
        return method.apply(source, args.concat([].slice.call(arguments)));
    };
};

function soloQuery(request) {
    if (Solo.receivers.get(request)) {
        return Solo.receivers.get(request);
    } else if (Solo.config.get(request)) {
        return Solo.config.get(request);
    } else if (Solo.mainApplication.applicationController.handleAppQuery) {
        var result = Solo.mainApplication.applicationController.handleAppQuery(request);
        if (result !== null) {
            return result;
        } else {
            console.error("ERROR: Could not find useful resolution for " + request);
        }
    }
}
;

function notify(event, data) {
    soloQuery("notifier").notify(event, data);
}

function notifyLater() {
    if (arguments.length == 2) {
        var event = arguments[0];
        var delay = arguments[1];
        setTimeout(function() {
            notify(event);
        }, delay);
    } else if (arguments.length == 3) {
        var event = arguments[0];
        var data = arguments[1];
        var delay = arguments[2];
        setTimeout(function() {
            notify(event, data);
        }, delay);
    }
}

function defineReceiver(className, label) {
    Solo.receivers.define(className, label);
}

var clone = (function() {
    function F() {
    }
    return function(parent) {
        F.prototype = parent;
        return new F;
    };
})();

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
}

function pixels(num) {
    return num + "px";
}

function ems(num) {
    return num + "em";
}

function numeric(cssString) {
    if (!isNaN(cssString)) {
        return cssString;
    }
    if (cssString) {
        return parseInt(cssString.replace(/[a-zA-Z]*/g, ""), 10);
    } else {
        return 0;
    }
}

(function(global) {

    var testNode = document.createElement("div");

    jQuery.fn.moveNode = function(rules, duration) {
        var cssTransitionsSupported = false;

        (function() {
            var div = document.createElement('div');
            div.innerHTML = '<div style="-webkit-transition:color 1s linear;-moz-transition:color 1s linear;"></div>';
            cssTransitionsSupported = (div.firstChild.style.webkitTransition !== undefined) || (div.firstChild.style.MozTransition !== undefined);
            delete div;
        })();

        return this.each(function() {
            node = jQuery(this);
            if (cssTransitionsSupported) {
                return node.css(rules);
            } else {
                return node.animate(rules, duration);
            }
        });
    };
})(this);

if (!window.console) {
    console = {
        log: function() { },
        error: function() { },
        warn: function() { }
    };
}


Solo.Template = function() {
    this.templateContent = null;
};

Solo.Template.prototype = {
    init: function(content) {
        this.templateContent = content;
    },
    render: function(data) {
        var markup = tmpl(this.templateContent, data);
        return markup;
    }
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

        new Function('obj',
        'var p=[], print=function(){p.push.apply(p,arguments);};' +
        "with(obj){p.push('" +
        str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
        + "');}return p.join('');");
        return data ? fn(data) : fn;
    };
})();

Solo.TemplateManager = function() {
    this.templates = {};

    this.load = function(name, template) {
        this.templates[name] = template;
    };

    this.get = function(name) {
        var template = new Solo.Template();
        template.init(this.templates[name]);
        return template;
    };
};
Solo.templates = new Solo.TemplateManager();

Solo.ApplicationSettings = function() {

    this.load = function(name, path) {
        this.appName = name;
        this.cookiePath = path;
        var cookieData = jQuery.cookie(this.appName);
        if (cookieData) {
            this.storedSettings = JSON.parse(cookieData);
        } else {
            this.storedSettings = null;
        }
        if (!this.storedSettings) {
            this.storedSettings = {};
        }
    };

    this.setDefault = function(name, value) {
        if (!this.storedSettings[name]) {
            this.storedSettings[name] = value;
            this.write();
        }
    };

    this.read = function(name) {
        return this.storedSettings[name];
    };

    this.set = function(name, value) {
        this.storedSettings[name] = value;
        this.write();
    };

    this.write = function() {
        var cookieString = JSON.stringify(this.storedSettings);
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        jQuery.cookie(this.appName, cookieString, {path: this.cookiePath,expires: date});
    };
};

/*
 * Depends on JSON2
 *
 */

RequestCache = function(cacheName, workerPath, settings) {
    var self = this,
    cache = {},
    queue = [],
    dbInitialized = false,
    worker = window.Worker ? new Worker(workerPath) : null,
    fastWorker = window.Worker ? new Worker(workerPath) : null,
    messageSplitter = settings.messageSplitter || ":!!:",
    prefix = settings.prefix || "",
    callbacks = {},
    expirationMinutes = settings.expirationMinutes || 10,
    storageDB;

    initializeCache();

    this.cache = function() {
        return cache;
    };

    this.read = function(uri, callback) {
        var record = cache[uri];
        if (record && self.useCache(uri)) {
            var now = timestamp();
            var minutesSinceUpdated = (now - record.timestamp) / (1000 * 60);
            if (minutesSinceUpdated < expirationMinutes) {
                //console.log("Cache Not Expired", minutesSinceUpdated," < ", expirationMinutes,settings);
                callback(record.data, "cached");
            } else {
                //console.log("Cache expired.", uri);
                var lastUpdate = new Date(record.timestamp);
                lastUpdate.setTime(record.timestamp);
                //console.warn("Hitting the network");
                fetch(uri, callback, fastWorker);
            }
        } else {
            fetch(uri, callback, fastWorker);
        }
    };

    this.load = function(uri, callback) {
        var record = cache[uri];
        if (record && self.useCache(uri)) {
            var now = timestamp();
            var minutesSinceUpdated = (now - record.timestamp) / (1000 * 60);
            if (minutesSinceUpdated < expirationMinutes) {
                callback(record.data, "cached");
            } else {
                var lastUpdate = new Date(record.timestamp);
                lastUpdate.setTime(record.timestamp);
                fetch(uri, callback, worker);
            }
        } else {
            fetch(uri, callback, worker);
        }
    };

    this.setPrefix = function(pre) {
        prefix = pre;
    };

    this.setFallback = function(fallback) {
        fallbackRequestMethod = fallback;
    };

    this.returnFromFallback = function(uri, data) {
        handleResponse(uri, data);
    };

    this.commit = function() {
        if (storageDB && storageDB.transaction) {
            count = 0;
            for (var url in cache) {
                if (cache.hasOwnProperty(url)) {
                    var data = cache[url];
                    var timestamp = data.timestamp;
                    var content = JSON.stringify(data.data);
                    storageDB.transaction((function(url, data, timestamp) {
                        return function(tx) {
                            tx.executeSql("SELECT * FROM entries WHERE url=?", [url],
                            function(tx, r) {
                                if (r.rows.length > 0) {
                                    tx.executeSql("UPDATE entries SET content=?, timestamp=? WHERE url=?", [data, timestamp, url],
                                    function(tx, r) {
                                    },
                                    function(tx, e) {
                                        console.log("Update failed", e)
                                    }
                                    );
                                } else {
                                    tx.executeSql("INSERT INTO entries (content, timestamp, url) VALUES(?,?,?)", [data, timestamp, url],
                                    function(tx, r) {
                                    },
                                    function(tx, e) {
                                        console.log("Insert failed: ", e)
                                    }
                                    );

                                }
                            });
                        };
                    })(url, content, timestamp)
                    );
                }
                count++;
            }
        }
    };

    this.isCached = function(uri) {
        return cache[uri];
    };

    this.allCached = function(set) {
        for (var i = 0, len = set.length; i < len; i++) {
            if (!this.isCached(set[i]))
                return false;
        }
        return true;
    };

    this.reset = function() {
        cache = {};
    };

    this.debug = function() {
        return cache;
        for (var url in cache) {
            var section = cache[url];
            var now = new Date().getTime();
            var lastUpdated = new Date(section.timestamp);
            var minutesSinceUpdate = (now - lastUpdated) / (60 * 1000);
        }
    };

    this.passThroughWorker = function(uri) {
        return true;
    };

    this.useCache = function(uri) {
        return true;
    };

    this.initialized = function() {
        return dbInitialized;
    };

    if (window.Worker && worker) {
        worker.onmessage = fastWorker.onmessage = function(e) {
            var parts = e.data.split(messageSplitter);
            var uri = parts[0];
            var dataJSON = parts[1];
            if (!dataJSON)
                dataJSON = "ERROR";
            var data = (dataJSON == "ERROR") ? dataJSON : JSON.parse(dataJSON);
            handleResponse(uri, data);
        };
    } else {
        console.error("Worker does not exist");
    }

    function handleResponse(uri, data) {
        var status = "new";
        if (data !== "ERROR") {
            if (cache[uri]) {
                status = dataSetChanged(data, cache[uri].data) ? "updated" : "cached";
            }
            write(uri, data);
            callbacks[uri](data, status);
        } else {
            callbacks[uri](cache[uri] && cache[uri].data, "cached");
        }
    }

    function dataSetChanged(oldData, newData) {
        var oldHeadlines = {};
        var newHeadlines = {};
        for (var i = 0; i < oldData.assets.length; i++) {
            oldHeadlines[oldData.assets[i].title] = 1;
        }

        for (i = 0; i < newData.assets.length; i++) {
            newHeadlines[newData.assets[i].title] = 1;
        }

        for (var title in newHeadlines) {
            if (!oldHeadlines[title]) {
                return true;
            }
        }
        return false;
    }

    function fetch(uri, callback, workerToUse) {
        callbacks[uri] = callback;
        if (workerToUse && self.passThroughWorker(uri)) {
            workerToUse.postMessage(prefix + messageSplitter + uri);
        } else {
            if (fallbackRequestMethod) {
                fallbackRequestMethod(uri);
            } else {
                throw ("You forgot to define a method for legacy browsers");
            }
        }
    }

    function write(uri, value) {
        if (cache[uri]) {
            cache[uri].data = value;
            cache[uri].timestamp = timestamp();
        } else {
            cache[uri] = {
                data: value,
                timestamp: timestamp()
            };
        }
    }

    function timestamp() {
        return new Date().getTime();
    }

    function initError(tx, e) {
        console.error("something unexpected happened", e);
        notify("cache loaded", "empty");
        cache = {};
        dbInitialized = true;
    }

    function initSuccess(tx, response) {
        var rows = response.rows;
        cache = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows.item(i);
            var item = {};
            item.timestamp = row.timestamp;
            item.data = JSON.parse(row.content);
            cache[row.url] = item;
        }
        dbInitialized = true;
        notify("cache loaded", "full");
    }

    function initializeCache() {
        self.cacheData = true;
        if (window.openDatabase) {
            try {
                storageDB = openDatabase(cacheName, '1.0', 'Stored content for ' + cacheName, 10 * 1024 * 1024);
                storageDB.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS entries(ID INTEGER PRIMARY KEY ASC, timestamp DATETIME, url TEXT, content TEXT)', []);
                });

                storageDB.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM entries', [], initSuccess, initError);
                });
            } catch (e) {
                storageDB = null;
                console.error(e);
            }
        } else {
            initError(null, null);
        }
    }

    function disableCacheing() {
        this.cacheData = false;
    }
};

Solo.ReceiverManager = function() {
    this.receiverDefinitions = {};
    this.loadedReceivers = {};
    this.receiverClassLookup = {};
    this.receiverCallbacks = [];

    this.init = function() {};

    this.defineReceivers = function(conf) {
        for (var label in conf) {
            this.define(conf[label], label);
        }
    };

    this.define = function(className, label) {
        if (!label) {
            label = className.charAt(0).toLowerCase() + className.slice(1);
        }
        this.receiverDefinitions[label] = className;
    };

    this.deactivate = function(label) {
        this.loadedReceivers[label] = null;
        delete this.loadedReceivers[label];
    };

    this.get = function(label) {
        return this.loadedReceivers[label];
    };

    this.load = function(label, receiverClass) {
        if (this.get(label)) {
            return
        }
        var receiver = (Solo[receiverClass]) ? new Solo[receiverClass]() : new window[receiverClass]();
        this.loadedReceivers[label] = receiver;
        this.receiverClassLookup[receiverClass] = label;
        if (label !== "notifier") {
            soloQuery("notifier").register(receiver);
        }
        if (!receiver.listen) {
            receiver.listen = function() {
            };
        }

        if (receiver.requiredMarkup) {
            var mountPoint = jQuery(".mainView");
            if (mountPoint.length == 0) {
                mountPoint = jQuery("body");
            }
            jQuery(receiver.requiredMarkup()).appendTo(mountPoint);
        }

        if (receiver.init) {
            this.receiverCallbacks.push(receiver);
        }
    };

    this.loadReceivers = function() {
        var set = arguments[0] || this.receiverDefinitions;
        for (var label in set) {
            var receiverClass = set[label];
            this.load(label, receiverClass);
        }
    };

    this.classLoaded = function(className) {
        return this.receiverClassLookup[className];
    };

    this.runReceiverInits = function() {
        for (var i = 0, len = this.receiverCallbacks.length; i < len; i++) {
            this.receiverCallbacks[i].init();
        }
    };
};

Solo.receivers = new Solo.ReceiverManager();

NotificationManager = function() {
    this.observers = [];
    this.log = [];
    this.logging = false;

    this.enableLogging = function() {
        this.logging = true;
    };

    this.register = function(observer) {
        this.observers.push(observer);
    };

    this.unregister = function(observer) {
        var reduced = [];
        for (var i = 0, len = this.observers.length; i < len; i++) {
            if (this.observers[i] !== observer) {
                reduced.push(this.observers[i]);
            }
        }
        this.observers = reduced;
    };

    this.notify = function(event, data) {
        if (this.logging) {
            this.log.push(event);
        }
        for (var i = 0, observers = this.observers; i < observers.length; i++) {
            observers[i].listen && observers[i].listen(event, data)
        }
    };
};

Solo.LoadManager = function() {

    this.defaultReceivers = {
        "notifier": "NotificationManager",
        "state": "ApplicationState",
        "settings": "ApplicationSettings",
        "key": "KeyEventManager",
        "mouse": "MouseEventManager",
        "touch": "TouchEventManager"
    };

    /*
	 * Triggers launching of app.
	 * Loads the application Controller.
	 * Loads all core and application receivers.
	 * If any receivers have an init method, the method is called after all receivers are loaded.
	 * State values are initialized.
	 * Settings are initialized.
	 * Key and mouse events are read from the config.
	 */

    this.loadApp = function() {
        Solo.receivers.init();
        var appController = (window.ApplicationController)
        ? new ApplicationController()
        : new Object();
        Solo.mainApplication.applicationController = appController;
        var coreConf = Solo.config.get("coreReceivers")
        ? Solo.config.get("coreReceivers")
        : this.defaultReceivers;
        Solo.receivers.defineReceivers(coreConf);
        Solo.receivers.loadReceivers(coreConf);
        if (Solo.config.get("queryShortcut")) {
            window[Solo.config.get("queryShortcut")] = soloQuery;
        }
        this.registerStateValues();
        this.initializeSettings();
        Solo.config.get("appReceivers") && Solo.receivers.defineReceivers(Solo.config.get("appReceivers"));
        Solo.receivers.loadReceivers();
        Solo.receivers.get("key").disableDefaults();
        Solo.receivers.get("key").loadEvents(Solo.config.get("keyActions"));
        Solo.receivers.get("mouse").loadEvents(Solo.config.config);
        jQuery(window).resize(function(e) {
            notify("window resize");
        });
        Solo.receivers.runReceiverInits();
        if (appController.init) {
            appController.init();
        }
    };

    /*
	 *	Reads requested State values into the app from the config
	 */

    this.registerStateValues = function() {
        var flags = Solo.config.get("defaultState");
        if (Solo.receivers.classLoaded("ApplicationState") && flags) {
            var stateName = Solo.receivers.classLoaded("ApplicationState");
            for (var flagName in flags) {
                soloQuery(stateName).register(flagName, flags[flagName]);
            }
        }
    };

    /*
	 *	Sets default values for settings into config, writes to cookie of needed.
	 */

    this.initializeSettings = function() {
        var settings = Solo.receivers.get("settings");
        settings.load(Solo.config.get("settingsCookieName"), Solo.config.get("settingsCookiePath"));
        var defaults = Solo.config.get("defaultSettings");
        for (var settingName in defaults) {
            settings.setDefault(settingName, defaults[settingName]);
        }
    };
};

/*
 * Ensures namespaces are in place, and the application framework is ready for work.
 * Also ensures app loading runs on dom-ready.
 */

jQuery(function() {
    var app = new Solo.Application();
    Solo.mainApplication = app;
    Solo.loader.loadApp();
});


/*
 * Solo.Application creates the shell for containing all the application parts.
 * Mostly used by Solo internally.
 * The application mostly communicates with the Application Controller.
 */

Solo.Application = function() {
    this.applicationController = null;
};

Solo.Application.prototype = {
    instance: function() {
        return this.applicationController;
    }
};

Solo.loader = new Solo.LoadManager();

Solo.ConfigurationManager = function() {
    this.config = {};

    this.get = function(name) {
        return this.config[name];
    };

    this.getService = function(name) {
        return this.config["services"][name];
    };

    this.importGeneral = function(configBlock) {
        for (var configName in configBlock) {
            this.config[configName] = configBlock[configName];
        }
    };

    this.importServices = function(configBlock) {
        this.importGeneral({"services": configBlock});
    };

    this.importKeys = function(configBlock) {
        var config = {};
        for (var key in configBlock) {
            if (KEY[key]) {
                config[KEY[key]] = configBlock[key];
            } else {
                config[key] = configBlock[key];
            }
        }
        this.importGeneral({"keyActions": config});
    };

    this.importMouse = function(configBlock) {
        this.importGeneral({"events": configBlock});
    };
};
Solo.config = new Solo.ConfigurationManager();

Solo = window.Solo || {};
Solo.ApplicationState = function() {
    var state = {
    };

    this.register = function(name) {
        state[name] = arguments[1] || false;
    };

    this.activate = function(name) {
        state[name] = true;
    };

    this.deactivate = function(name) {
        state[name] = false;
    };

    this.query = function(name) {
        if (typeof state[name] == "undefined") {
            throw ("Requested undefined state value '" + name + "'");
            return false;
        } else {
            return state[name];
        }
    };
};
