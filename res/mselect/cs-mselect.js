System.register(['aurelia-framework', '../ddl/ddl', '../chs'], function (_export) {
    'use strict';

    var inject, customElement, bindable, ObserverLocator, DDL, chs, CsMselect;

    var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

    function getItemMarkup(ctrl, obj) {
        var id = obj[ctrl.idProp];
        var text = obj[ctrl.textProp];
        var itemContent = ctrl.renderItemFn ? ctrl.renderItemFn(obj, id, text) : chs.encodeHtml(text);

        return '<li class=\'cs-mselect-item\' data-id=\'' + id + '\'><div class=\'cs-mselect-item-content\'>' + itemContent + '</div><div class=\'cs-mselect-item-x\'>x</div></li>';
    }
    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
            customElement = _aureliaFramework.customElement;
            bindable = _aureliaFramework.bindable;
            ObserverLocator = _aureliaFramework.ObserverLocator;
        }, function (_ddlDdl) {
            DDL = _ddlDdl.DDL;
        }, function (_chs) {
            chs = _chs;
        }],
        execute: function () {
            CsMselect = (function () {
                var _instanceInitializers = {};

                function CsMselect(el, ddl, observerLocator) {
                    _classCallCheck(this, _CsMselect);

                    _defineDecoratedPropertyDescriptor(this, 'src', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'values', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'disabled', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'renderItemFn', _instanceInitializers);

                    _defineDecoratedPropertyDescriptor(this, 'renderResultFn', _instanceInitializers);

                    this.observerLocator = observerLocator;

                    this.element = el;
                    this.ddl = ddl;
                    this.isOpen = false;
                    this.lastInput = '';
                }

                var _CsMselect = CsMselect;

                _createDecoratedClass(_CsMselect, [{
                    key: 'src',
                    decorators: [bindable],
                    initializer: function () {
                        return null;
                    },
                    enumerable: true
                }, {
                    key: 'values',
                    decorators: [bindable],
                    initializer: function () {
                        return [];
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

                        this.contentEl = el.querySelector('.cs-mselect-items');
                        el.classList.add('cs-ctrl');
                        el.classList.add('cs-mselect');
                        if (el.hasAttribute('vertical')) {
                            el.classList.add('cs-mselect-vertical');
                        }

                        this.savedTabIndex = el.tabIndex < 0 ? 0 : el.tabIndex;
                        this.maxCount = parseInt(el.getAttribute('max-count')) || 0;
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

                        this.disposeValuesSubscription = this.observerLocator.getArrayObserver(this.values).subscribe(function () {
                            return _this.valuesChanged();
                        });

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

                        this.disposeValuesSubscription();
                    }
                }, {
                    key: 'onClick',
                    value: function onClick(evt) {
                        if (this.disabled) {
                            return;
                        }

                        var xClicked = chs.closest(evt.target, '.cs-mselect-item-x');
                        if (xClicked) {
                                var item = chs.closest(evt.target, '.cs-mselect-item');
                                var id = parseInt(item.dataset.id);

                                this.values.chsRemoveWithProperty(this.idProp, id);
                                this.renderContent();
                                return;
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
                    key: 'valuesChanged',
                    value: function valuesChanged(newVal) {
                        this.renderContent();
                    }
                }, {
                    key: 'clear',
                    value: function clear() {
                        this.values.length = 0;
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
                        if (this.maxCount === 0 || this.values.length < this.maxCount) {
                            this.values.push(o);
                            this.renderContent();
                        }
                    }
                }, {
                    key: 'renderContent',
                    value: function renderContent() {
                        var markup = '';

                        for (var i = 0; i < this.values.length; i++) {
                            markup += getItemMarkup(this, this.values[i]);
                        }
                        this.contentEl.innerHTML = markup;
                    }
                }], null, _instanceInitializers);

                CsMselect = customElement('cs-mselect')(CsMselect) || CsMselect;
                CsMselect = inject(Element, DDL, ObserverLocator)(CsMselect) || CsMselect;
                return CsMselect;
            })();

            _export('CsMselect', CsMselect);
        }
    };
});
//# sourceMappingURL=../../res/mselect/cs-mselect.js.map