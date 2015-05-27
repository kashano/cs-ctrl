System.register(['aurelia-framework', './calendar-popup', '../chs'], function (_export) {
    'use strict';

    var customElement, bindable, bindingMode, CalendarPopup, chs, MonthDays, CsDate;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function pad2(num) {
        var s = '0' + num;
        return s.substr(s.length - 2);
    }

    function parseDateStr(txt, fmt) {
        var year, month, day, parts, maxDays;

        if (!txt) {
            return null;
        }

        if (fmt == 'ISO') {
                if (txt.length != 10) {
                    return null;
                }
                year = Number(txt.substr(0, 4));
                month = Number(txt.substr(5, 2));
                day = Number(txt.substr(8, 2));
            } else {
                parts = txt.split(/[\/\.-]/);
                if (parts.length != 3) {
                    return null;
                }
                month = Number(parts[0]);
                day = Number(parts[1]);
                year = Number(parts[2]);
            }

        if (!(month > 0 && day > 0 && year > 0)) {
            return null;
        }
        if (month > 12) {
            return null;
        }
        maxDays = MonthDays[month - 1];
        if (month == 2) {
                if (year % 400 == 0 || year % 4 == 0 && year % 100 != 0) {
                        maxDays = 29;
                    }
            }
        if (day > maxDays) {
            return null;
        }

        return new Date(year, month - 1, day);
    }
    return {
        setters: [function (_aureliaFramework) {
            customElement = _aureliaFramework.customElement;
            bindable = _aureliaFramework.bindable;
            bindingMode = _aureliaFramework.bindingMode;
        }, function (_calendarPopup) {
            CalendarPopup = _calendarPopup.CalendarPopup;
        }, function (_chs) {
            chs = _chs;
        }],
        execute: function () {
            MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            CsDate = (function () {
                function CsDate(element, calendar) {
                    _classCallCheck(this, _CsDate);

                    this.element = element;
                    this.calendar = calendar;
                }

                var _CsDate = CsDate;

                _createClass(_CsDate, [{
                    key: 'bind',
                    value: function bind(bindingContext) {
                        var self = this,
                            el = self.element;
                        self.ops = chs.extend({}, CsDate.defaultOps);

                        self.ops.format = el.getAttribute('format') || self.ops.format;
                        self.ops.required = el.hasAttribute('required');

                        self.updateInputValue();
                    }
                }, {
                    key: 'unbind',
                    value: function unbind() {
                        console.log('Date unbound');
                    }
                }, {
                    key: 'valueChanged',
                    value: function valueChanged(newVal) {
                        console.log('Date value changed');
                        this.updateInputValue();
                    }
                }, {
                    key: 'onInput',
                    value: function onInput() {
                        console.log('Date inputValue changed');
                        var self = this,
                            txt = self.inputValue;

                        if (!txt) {
                                self.value = null;
                                return;
                            }

                        var dt = parseDateStr(txt, self.ops.format);
                        if (dt) {
                            self.value = dt;
                        }
                    }
                }, {
                    key: 'updateInputValue',
                    value: function updateInputValue() {
                        var self = this,
                            dt = self.value;
                        if (!self.value) {
                            self.inputValue = '';return;
                        }

                        if (this.ops.format == 'ISO') {
                            self.inputValue = dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
                        } else {
                                self.inputValue = dt.getMonth() + 1 + '/' + dt.getDate() + '/' + dt.getFullYear();
                            }
                    }
                }], [{
                    key: 'defaultOps',
                    value: {
                        format: 'ISO' },
                    enumerable: true
                }, {
                    key: 'inject',
                    value: [Element, CalendarPopup],
                    enumerable: true
                }]);

                CsDate = bindable({ name: 'value',
                    attribute: 'value',
                    changeHandler: 'valueChanged',
                    defaultBindingMode: bindingMode.twoWay,
                    defaultValue: null
                })(CsDate) || CsDate;
                CsDate = customElement('cs-date')(CsDate) || CsDate;
                return CsDate;
            })();

            _export('CsDate', CsDate);
        }
    };
});
//# sourceMappingURL=../../res/date/cs-date.js.map