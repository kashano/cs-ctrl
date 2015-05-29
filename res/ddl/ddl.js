System.register(["../chs"], function (_export) {
    "use strict";

    var chs, ResultClass, FocusClass, DDL;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function getIndexOfNode(nodeList, node) {
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i] === node) {
                return i;
            }
        }
        return -1;
    }

    function isInView(container, el, fullyInView) {
        var containerTop = container.scrollTop,
            containerBottom = containerTop + container.offsetHeight,
            elTop = chs.jqOffset(el).top + containerTop;

        if (container !== window) {
            elTop -= chs.jqOffset(container).top;
        }

        var elBottom = elTop + el.offsetHeight;
        if (fullyInView) {
            return containerTop <= elTop && containerBottom >= elBottom;
        }
        return elBottom >= containerTop && elTop <= containerBottom;
    }
    return {
        setters: [function (_chs) {
            chs = _chs;
        }],
        execute: function () {
            ResultClass = "cs-ddl-result";
            FocusClass = "cs-focus";

            DDL = (function () {
                function DDL() {
                    var _this = this;

                    _classCallCheck(this, DDL);

                    this.curCtrl = null;
                    this.queryTimerID = 0;
                    var doc = document;
                    this.ddlEl = doc.createElement("div");
                    this.inputEl = doc.createElement("input");
                    this.inputElWrap = doc.createElement("div");
                    this.inputIco = doc.createElement("div");
                    this.resultsEl = doc.createElement("ul");
                    this.ddlElMsg = doc.createElement("div");
                    this.ddlEl.className = "cs-ddl cs-hidden";
                    this.inputEl.className = "cs-ddl-input";
                    this.inputElWrap.className = "cs-ddl-input-wrap";
                    this.inputIco.className = "cs-ddl-input-ico";
                    this.resultsEl.className = "cs-ddl-results";
                    this.ddlElMsg.className = "cs-ddl-msg";

                    this.inputElWrap.appendChild(this.inputEl);
                    this.inputElWrap.appendChild(this.inputIco);
                    this.ddlEl.appendChild(this.inputElWrap);
                    this.ddlEl.appendChild(this.resultsEl);
                    this.ddlEl.appendChild(this.ddlElMsg);

                    doc.body.appendChild(this.ddlEl);

                    this.inputEl.addEventListener("keydown", function (e) {
                        return _this.onInputKeyDown(e);
                    });
                    this.inputEl.addEventListener("keyup", function (e) {
                        return _this.onInputKeyUp(e);
                    });
                }

                _createClass(DDL, [{
                    key: "wireDocEvents",
                    value: function wireDocEvents() {
                        var self = this,
                            ddlEl = self.ddlEl;

                        if (self.wheelHandler) {
                            return;
                        }
                        self.wheelHandler = function (ev) {
                            if (!ddlEl.contains(ev.target)) {
                                    self.hideDDL();
                                }
                        };

                        self.mousedownHandler = function (ev) {
                            var ctrlEl = self.curCtrl.element,
                                target = ev.target;

                            if (ctrlEl.contains(target)) {
                                    self.focusInput();
                                } else if (ddlEl.contains(target)) {
                                    var clickedResult = chs.closest(target, "." + ResultClass);
                                    if (clickedResult) {
                                        self.resultsEl.querySelector("." + FocusClass).classList.remove(FocusClass);
                                        clickedResult.classList.add(FocusClass);
                                        self.addSelectedResult();
                                    } else {
                                        self.focusInput();
                                    }
                                } else {
                                self.hideDDL();
                            }
                        };

                        document.addEventListener("wheel", self.wheelHandler);
                        document.addEventListener("mousedown", self.mousedownHandler);
                    }
                }, {
                    key: "removeDocEvents",
                    value: function removeDocEvents() {
                        var self = this;
                        document.removeEventListener("wheel", self.wheelHandler);
                        document.removeEventListener("mousedown", self.mousedownHandler);
                        self.wheelHandler = null;
                        self.mousedownHandler = null;
                    }
                }, {
                    key: "open",
                    value: function open(ctrl) {
                        if (ctrl !== this.curCtrl) {
                                if (this.curCtrl !== null) {
                                        this.curCtrl.setOpenState(false);
                                    }
                                this.curCtrl = ctrl;
                                this.clearDDL();
                            }

                        if (!this.curCtrl.disabled) {
                            this.queryIfAllowedAndEnsureDDLVisible();
                        }
                    }
                }, {
                    key: "focusInput",
                    value: function focusInput() {
                        var _this2 = this;

                        setTimeout(function () {
                            return _this2.inputEl.focus();
                        }, 1);
                    }
                }, {
                    key: "clearDDL",
                    value: function clearDDL() {
                        var c = this.curCtrl;
                        this.resultsEl.innerHTML = "";
                        this.inputEl.value = "";
                        if (c) {
                            c.lastInput = "";
                            c.filteredResults = null;
                        }
                    }
                }, {
                    key: "showDDL",
                    value: function showDDL() {
                        this.ddlEl.classList.remove("cs-hidden");
                        this.positionDDL();
                        this.curCtrl.setOpenState(true);
                        this.focusInput();
                        this.wireDocEvents();
                    }
                }, {
                    key: "hideDDL",
                    value: function hideDDL() {
                        this.ddlEl.classList.add("cs-hidden");
                        if (this.curCtrl) {
                            this.curCtrl.setOpenState(false);
                        }
                        this.removeDocEvents();
                    }
                }, {
                    key: "positionDDL",
                    value: function positionDDL() {
                        var ctrlEl = this.curCtrl.element,
                            ctrlPos = chs.jqOffset(ctrlEl),
                            borderTop = false,
                            ddl = this.ddlEl,
                            ctrlHeight = ctrlEl.offsetHeight,
                            y = ctrlPos.top + ctrlHeight,
                            wh = window.innerHeight,
                            topSpace = ctrlPos.top,
                            botSpace = wh - y,
                            maxSpace = Math.max(botSpace, topSpace);
                        ddl.style.left = ctrlPos.left + "px";
                        ddl.style.width = ctrlEl.offsetWidth + "px";

                        var scrollHeight = maxSpace - 45;
                        this.resultsEl.style.maxHeight = scrollHeight + "px";

                        if (y + ddl.offsetHeight > wh) {
                            if (topSpace > botSpace) {
                                    borderTop = true;
                                    y = ctrlPos.top - ddl.offsetHeight - 1;
                                }
                        }

                        ddl.style.top = y + "px";

                        if (borderTop) {
                            ddl.style.borderTopStyle = "solid";
                            ddl.style.borderBottomStyle = "none";
                        } else {
                            ddl.style.borderBottomStyle = "solid";
                            ddl.style.borderTopStyle = "none";
                        }
                    }
                }, {
                    key: "setMsg",
                    value: function setMsg(markup) {
                        this.ddlElMsg.innerHTML = markup;
                    }
                }, {
                    key: "showBusy",
                    value: function showBusy(b) {
                        if (b) {
                            this.inputElWrap.classList.add("cs-busy");
                        } else {
                            this.inputElWrap.classList.remove("cs-busy");
                        }
                    }
                }, {
                    key: "queryIfAllowedAndEnsureDDLVisible",
                    value: function queryIfAllowedAndEnsureDDLVisible() {
                        var _this3 = this;

                        if (this.canQuery()) {
                            this.queryTimerID = setTimeout(function () {
                                return _this3.doQuery();
                            }, this.curCtrl.delay);
                        }
                        if (!this.curCtrl.isOpen) {
                            this.showDDL();
                        }
                    }
                }, {
                    key: "canQuery",
                    value: function canQuery() {
                        var charsNeeded = this.curCtrl.minChars - this.inputEl.value.length;

                        this.cancelQuery();

                        if (charsNeeded > 0) {
                            this.setMsg("Enter " + charsNeeded + " more character(s)");
                            return false;
                        }

                        this.showBusy(true);
                        return true;
                    }
                }, {
                    key: "cancelQuery",
                    value: function cancelQuery() {
                        this.setMsg("");
                        if (this.queryTimerID) {
                            clearTimeout(this.queryTimerID);
                        }
                    }
                }, {
                    key: "doQuery",
                    value: function doQuery() {
                        var searchTxt = this.inputEl.value,
                            lcSearchTxt = searchTxt.toLowerCase(),
                            c = this.curCtrl,
                            results;

                        var isFunc = chs.isFunc(c.src);
                        results = isFunc ? c.src(searchTxt) : c.src;
                        if (!results.then) {
                            results = Promise.resolve(results);
                        }
                        c.filteredResults = null;
                        this.renderResults();

                        var self = this;

                        results.then(function (r) {
                            if (isFunc) {
                                    c.filteredResults = r;
                                } else {
                                    c.filteredResults = [];
                                    for (var i = 0; i < r.length; i++) {
                                        if (r[i][c.textProp].containsWords(lcSearchTxt)) {
                                            c.filteredResults.push(r[i]);
                                        }
                                    }
                                }
                            self.renderResults();
                        });
                    }
                }, {
                    key: "renderResults",
                    value: function renderResults() {
                        var _this4 = this;

                        var c = this.curCtrl,
                            d = c.filteredResults,
                            markup,
                            i = 1;

                        if (!this.canQuery()) {
                            return;
                        }

                        setTimeout(function () {
                            return _this4.positionDDL();
                        }, 0);

                        if (!d) {
                            this.showBusy(true);
                            return;
                        }

                        this.setMsg("");
                        this.resultsEl.innerHTML = "";
                        this.showBusy(false);

                        if (c.values) {
                            d.chsRemoveMatchingElements(c.idProp, c.values);
                        }

                        if (d.length < 1) {
                            this.setMsg("No matches");return;
                        }

                        markup = "<li class='cs-ddl-result cs-focus' data-id='" + d[0][c.idProp] + "'><div class='cs-ddl-result-content'>" + this.renderResultContent(this, c, d[0]) + "</div></li>";

                        for (; i < d.length; i++) {
                            markup += "<li class='cs-ddl-result' data-id='" + d[i][c.idProp] + "'><div class='cs-ddl-result-content'>" + this.renderResultContent(this, c, d[i]) + "</div></li>";
                        }
                        this.resultsEl.innerHTML = markup;
                    }
                }, {
                    key: "renderResultContent",
                    value: function renderResultContent(ddl, ctrl, obj) {
                        var highlightedMarkup = ddl.getHighlightedMarkup(obj[ctrl.textProp]);

                        if (ctrl.renderResultFn) {
                            return ctrl.renderResultFn(ddl, ctrl, obj, highlightedMarkup);
                        }
                        return highlightedMarkup;
                    }
                }, {
                    key: "getHighlightedMarkup",
                    value: function getHighlightedMarkup(txt) {
                        var searchTxt = this.inputEl.value.toLowerCase(),
                            searchLen = searchTxt.length,
                            matchIx = txt.toLowerCase().indexOf(searchTxt),
                            markup;

                        if (matchIx < 0 || searchTxt.length < 1) {
                            return chs.encodeHtml(txt);
                        }

                        markup = chs.encodeHtml(txt.substring(0, matchIx)) + "<span class='cs-ddl-result-highlight'>" + chs.encodeHtml(txt.substring(matchIx, matchIx + searchLen)) + "</span>" + chs.encodeHtml(txt.substring(matchIx + searchLen));

                        return markup;
                    }
                }, {
                    key: "onInputKeyDown",
                    value: function onInputKeyDown(evt) {
                        var c = this.curCtrl,
                            isOpen = c.isOpen,
                            resultsEl = this.resultsEl,
                            results,
                            selectedResult,
                            ix,
                            newRes;

                        switch (evt.keyCode) {
                            case 40:
                                if (isOpen) {
                                    results = resultsEl.querySelectorAll("." + ResultClass);
                                    if (!results.length) {
                                        return false;
                                    }

                                    selectedResult = resultsEl.querySelector("." + FocusClass);
                                    selectedResult.classList.remove(FocusClass);

                                    ix = getIndexOfNode(results, selectedResult) + 1;
                                    if (ix >= results.length) {
                                        ix = 0;
                                    }

                                    newRes = results[ix];
                                    newRes.classList.add(FocusClass);

                                    if (!isInView(resultsEl, newRes, true)) {
                                            resultsEl.scrollTop = newRes.offsetTop - resultsEl.offsetTop + (newRes.offsetHeight - resultsEl.offsetHeight);
                                        }

                                    return false;
                                }
                                c.lastInput = "";
                                return;

                            case 38:
                                if (isOpen) {
                                    results = resultsEl.querySelectorAll("." + ResultClass);
                                    if (!results.length) {
                                        return false;
                                    }

                                    selectedResult = resultsEl.querySelector("." + FocusClass);
                                    selectedResult.classList.remove(FocusClass);

                                    ix = getIndexOfNode(results, selectedResult) - 1;
                                    if (ix < 0) {
                                        ix = results.length - 1;
                                    }

                                    newRes = results[ix];
                                    newRes.classList.add(FocusClass);

                                    if (!isInView(resultsEl, newRes, true)) {
                                            resultsEl.scrollTop = newRes.offsetTop - resultsEl.offsetTop;
                                        }

                                    return false;
                                }
                                return;

                            case 27:
                                if (isOpen) {
                                    this.hideDDL();c.element.focus();
                                    return false;
                                }
                                return;

                            case 13:
                                if (isOpen) {
                                    this.addSelectedResult();return false;
                                }
                                return;

                            case 9:
                                evt.preventDefault();
                                this.hideDDL();
                                this.curCtrl.element.focus();
                                return false;
                        }
                    }
                }, {
                    key: "onInputKeyUp",
                    value: function onInputKeyUp(evt) {
                        var currentInput = this.inputEl.value;

                        switch (evt.keyCode) {
                            case 9:
                            case 13:
                            case 27:
                                return;
                        }

                        if (this.curCtrl.lastInput !== currentInput) {
                                this.curCtrl.lastInput = currentInput;
                                this.queryIfAllowedAndEnsureDDLVisible();
                            }
                    }
                }, {
                    key: "addSelectedResult",
                    value: function addSelectedResult() {
                        var result = this.resultsEl.querySelector("." + FocusClass),
                            id = Number(result.dataset.id),
                            obj = null,
                            c = this.curCtrl,
                            filteredResults = c.filteredResults;

                        for (var i = 0; i < filteredResults.length; i++) {
                            if (filteredResults[i][c.idProp] === id) {
                                obj = filteredResults[i];break;
                            }
                        }

                        if (obj === null) {
                            return;
                        }

                        this.hideDDL();
                        c.addSelectedResult(obj);

                        setTimeout(function () {
                            return c.element.focus();
                        }, 1);
                    }
                }]);

                return DDL;
            })();

            _export("DDL", DDL);
        }
    };
});
//# sourceMappingURL=../../res/ddl/ddl.js.map