System.register([], function (_export) {
    "use strict";

    var DateEx;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            DateEx = (function () {
                function DateEx() {
                    _classCallCheck(this, DateEx);

                    this.setDateToXMas();
                }

                _createClass(DateEx, [{
                    key: "setDateToToday",
                    value: function setDateToToday() {
                        this.selectedDt = new Date();
                    }
                }, {
                    key: "setDateToXMas",
                    value: function setDateToXMas() {
                        this.selectedDt = new Date(2015, 11, 25);
                    }
                }]);

                return DateEx;
            })();

            _export("DateEx", DateEx);
        }
    };
});
//# sourceMappingURL=../../ui/date/date-ex.js.map