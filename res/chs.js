System.register([], function (_export) {
    'use strict';

    var _matchesFn, keyCode;

    _export('encodeHtml', encodeHtml);

    _export('isAlphaNumericKey', isAlphaNumericKey);

    _export('isFunc', isFunc);

    _export('copy', copy);

    _export('closest', closest);

    _export('jqOffset', jqOffset);

    _export('extend', extend);

    _export('getSiblings', getSiblings);

    function getMatchFn() {
        var arrMatch = ['matches', 'msMatchesSelector'];
        for (var i = 0; i < arrMatch.length; i++) {
            if (typeof document.body[arrMatch[i]] == 'function') {
                return arrMatch[i];
            }
        }
    }

    function encodeHtml(txt) {
        return txt.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function isAlphaNumericKey(keyCode) {
        var r = keyCode > 47 && keyCode < 58 || keyCode > 64 && keyCode < 91;
        return r;
    }

    function isFunc(obj) {
        return typeof obj == 'function' || false;
    }

    function copy(obj) {
        var myCopy;

        if (null === obj || 'object' != typeof obj) return obj;

        if (obj instanceof Date) {
            myCopy = new Date();
            myCopy.setTime(obj.getTime());
            return myCopy;
        }

        if (obj instanceof Array) {
            myCopy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                myCopy[i] = copy(obj[i]);
            }
            return myCopy;
        }

        if (obj instanceof Object) {
            myCopy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) myCopy[attr] = copy(obj[attr]);
            }
            return myCopy;
        }

        throw new Error('Unable to clone object. Its type isn\'t supported.');
    }

    function closest(el, selector) {
        var testEl = el;
        while (testEl !== null) {
            if (testEl[_matchesFn](selector)) {
                return testEl;
            }
            testEl = testEl.parentElement;
        }

        return null;
    }

    function jqOffset(el) {
        var rect = el.getBoundingClientRect();
        var offset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
        return offset;
    }

    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) {
                continue;
            }

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    }

    function getSiblings(el, filter) {
        var sibs = [];
        el = el.parentNode.firstChild;
        do {
            if (!filter || filter(el)) {
                sibs.push(el);
            }
        } while (el = el.nextSibling);
        return sibs;
    }

    return {
        setters: [],
        execute: function () {
            _matchesFn = getMatchFn();
            keyCode = {
                BACKSPACE: 8,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            };

            _export('keyCode', keyCode);

            if (!isFunc(String.prototype.containsWords)) {
                String.prototype.containsWords = function (searchTxt) {
                    var str = this.toLowerCase(),
                        lcSearch = searchTxt.toLowerCase();

                    var searchWords = lcSearch.split(' ');
                    if (searchWords.length === 0) {
                        return true;
                    }

                    for (var i = 0; i < searchWords.length; i++) {
                        if (str.indexOf(searchWords[i]) === -1) {
                            return false;
                        }
                    }
                    return true;
                };
            }

            if (!isFunc(Array.prototype.chsRemoveMatchingElements)) {
                Array.prototype.chsRemoveMatchingElements = function (fieldToTest, arr) {
                    var i,
                        x = 0;

                    for (; x < arr.length; x++) {
                        for (i = this.length - 1; i >= 0; i--) {
                            if (this[i][fieldToTest] === arr[x][fieldToTest]) {
                                this.splice(i, 1);
                            }
                        }
                    }
                    return this;
                };
            }

            if (!isFunc(Array.prototype.chsRemoveWithProperty)) {
                Array.prototype.chsRemoveWithProperty = function (fieldToTest, val) {
                    for (var i = this.length - 1; i >= 0; i--) {
                        if (this[i][fieldToTest] === val) {
                            this.splice(i, 1);
                        }
                    }

                    return this;
                };
            }
        }
    };
});
//# sourceMappingURL=../res/chs.js.map