System.register([], function (_export) {
    "use strict";

    var Select;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            Select = (function () {
                function Select() {
                    _classCallCheck(this, Select);

                    this.fruits = [{ id: 1, text: "Apple" }, { id: 2, text: "Banana" }, { id: 3, text: "Grape" }, { id: 4, text: "Kiwi" }, { id: 5, text: "Orange" }, { id: 6, text: "Kumquat" }, { id: 7, text: "Watermelon" }];

                    this.selectedFruit = null;

                    this.people = [{ id: 1, text: "Adam", sex: "m" }, { id: 2, text: "Beth", sex: "f" }, { id: 3, text: "Carol", sex: "f" }, { id: 4, text: "John", sex: "m" }];
                    this.selectedPerson = this.people[0];
                }

                _createClass(Select, [{
                    key: "renderPersonItem",
                    value: function renderPersonItem(obj, id, txt) {
                        var color = obj.sex === "m" ? "blue" : "red";
                        return "<span style='color:" + color + "'>" + txt + "</span>";
                    }
                }, {
                    key: "renderPersonResult",
                    value: function renderPersonResult(ddl, ctrl, obj, highlightedMarkup) {
                        return highlightedMarkup;
                    }
                }]);

                return Select;
            })();

            _export("Select", Select);
        }
    };
});
//# sourceMappingURL=../../ui/select/select.js.map