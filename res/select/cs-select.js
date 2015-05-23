System.register(['aurelia-framework', '../ddl/ddl', '../chs'], function (_export) {
    'use strict';

    var inject, customElement, bindable, bindingMode, DDL, chs, CsSelect;

    var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
            customElement = _aureliaFramework.customElement;
            bindable = _aureliaFramework.bindable;
            bindingMode = _aureliaFramework.bindingMode;
        }, function (_ddlDdl) {
            DDL = _ddlDdl.DDL;
        }, function (_chs) {
            chs = _chs;
        }],
        execute: function () {
            CsSelect = (function () {
                var _instanceInitializers = {};

                function CsSelect(el, ddl) {
                    _classCallCheck(this, _CsSelect);

                    _defineDecoratedPropertyDescriptor(this, 'src', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'disabled', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'renderItemFn', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'renderResultFn', _instanceInitializers);

                    this.element = el;
                    this.ddl = ddl;
                    this.isOpen = false;
                    this.lastInput = '';
                }

                var _CsSelect = CsSelect;

                _createDecoratedClass(_CsSelect, [{
                    key: 'src',
                    decorators: [bindable],
                    initializer: function () {
                        return null;
                    },
                    enumerable: true
                }, {
                    key: 'disabled',
                    decorators: [bindable],
                    initializer: function () {
                        return false;
                    },
                    enumerable: true
                }, {
                    key: 'renderItemFn',
                    decorators: [bindable],
                    initializer: function () {
                        return null;
                    },
                    enumerable: true
                }, {
                    key: 'renderResultFn',
                    decorators: [bindable],
                    initializer: function () {
                        return null;
                    },
                    enumerable: true
                }, {
                    key: 'bind',
                    value: function bind(bindingContext) {
                        var _this = this;

                        var el = this.element;

                        this.contentEl = el.querySelector('.cs-select-content');
                        el.classList.add('cs-ctrl');
                        el.classList.add('cs-select');

                        this.savedTabIndex = el.tabIndex < 0 ? 0 : el.tabIndex;
                        this.required = el.hasAttribute('required');
                        this.minChars = parseInt(el.getAttribute('min-chars')) || 0;
                        this.textProp = el.getAttribute('text-prop') || 'text';
                        this.idProp = el.getAttribute('id-prop') || 'id';
                        if (!this.disabled) {
                            el.tabIndex = this.savedTabIndex;
                        }

                        if (Array.isArray(this.src)) {
                            this.delay = parseInt(el.getAttribute('delay')) || 0;
                        } else {
                            this.delay = parseInt(el.getAttribute('delay')) || 200;
                        }

                        this.clickHandler = function (e) {
                            return _this.onClick(e);
                        };
                        this.focusHandler = function (e) {
                            return _this.onFocus(e);
                        };
                        this.blurHandler = function (e) {
                            return _this.onBlur(e);
                        };
                        this.keydownHandler = function (e) {
                            return _this.onKeyDown(e);
                        };

                        el.addEventListener('click', this.clickHandler);
                        el.addEventListener('focus', this.focusHandler);
                        el.addEventListener('blur', this.blurHandler);
                        el.addEventListener('keydown', this.keydownHandler);

                        this.renderContent();
                    }
                }, {
                    key: 'unbind',
                    value: function unbind() {
                        var el = this.element;
                        el.removeEventListener('click', this.clickHandler);
                        el.removeEventListener('focus', this.focusHandler);
                        el.removeEventListener('blur', this.blurHandler);
                        el.removeEventListener('keydown', this.keydownHandler);
                    }
                }, {
                    key: 'onClick',
                    value: function onClick(evt) {
                        if (this.disabled) {
                            return;
                        }

                        if (chs.closest(evt.target, '.cs-select-clear')) {
                                this.clear();return;
                            }
                        this.ddl.open(this);
                    }
                }, {
                    key: 'onFocus',
                    value: function onFocus() {
                        if (this.disabled) {
                            this.onBlur();return;
                        }
                        this.element.classList.add('focused');
                    }
                }, {
                    key: 'onBlur',
                    value: function onBlur() {
                        this.element.classList.remove('focused');
                    }
                }, {
                    key: 'onKeyDown',
                    value: function onKeyDown(evt) {
                        if (this.disabled) {
                            return;
                        }

                        if (evt.keyCode === chs.keyCode.UP || evt.keyCode === chs.keyCode.DOWN || chs.isAlphaNumericKey(evt.keyCode)) {
                            this.ddl.open(this);
                        }
                    }
                }, {
                    key: 'disabledChanged',
                    value: function disabledChanged(newVal) {
                        var el = this.element;
                        if (newVal) {
                            el.classList.add('disabled');
                            el.tabIndex = -1;
                        } else {
                            el.classList.remove('disabled');
                            el.tabIndex = this.savedTabIndex;
                        }
                    }
                }, {
                    key: 'valueChanged',
                    value: function valueChanged(newVal) {
                        this.renderContent();
                    }
                }, {
                    key: 'clear',
                    value: function clear() {
                        this.value = null;
                        this.renderContent();
                    }
                }, {
                    key: 'setOpenState',
                    value: function setOpenState(b) {
                        this.isOpen = b;

                        if (b) {
                            this.element.classList.add('open');
                        } else {
                            this.element.classList.remove('open');
                        }
                    }
                }, {
                    key: 'addSelectedResult',
                    value: function addSelectedResult(o) {
                        this.value = o;
                        this.renderContent();
                    }
                }, {
                    key: 'renderContent',
                    value: function renderContent() {
                        var markup,
                            obj = this.value,
                            id,
                            txt;
                        if (obj) {
                            id = obj[this.idProp], txt = obj[this.textProp];
                        }

                        if (this.renderItemFn) {
                                markup = this.renderItemFn(obj, id, txt);
                            } else {
                                markup = obj ? chs.encodeHtml(txt) : '';
                            }
                        this.contentEl.innerHTML = markup;
                    }
                }], null, _instanceInitializers);

                CsSelect = bindable({ name: 'value',
                    attribute: 'value',
                    changeHandler: 'valueChanged',
                    defaultBindingMode: bindingMode.twoWay,
                    defaultValue: undefined
                })(CsSelect) || CsSelect;
                CsSelect = customElement('cs-select')(CsSelect) || CsSelect;
                CsSelect = inject(Element, DDL)(CsSelect) || CsSelect;
                return CsSelect;
            })();

            _export('CsSelect', CsSelect);
        }
    };
});
//# sourceMappingURL=../../res/select/cs-select.js.map