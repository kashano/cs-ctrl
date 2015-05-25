System.register([], function (_export) {
    "use strict";

    var Mselect;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            Mselect = function Mselect() {
                _classCallCheck(this, Mselect);

                this.people = [{ id: 1, text: "Adam" }, { id: 2, text: "Beth" }, { id: 3, text: "Carol" }, { id: 4, text: "John" }];

                this.selectedPeople = [this.people[1]];

                this.sports = [{ id: 1, text: "Baseball" }, { id: 2, text: "Basketball" }, { id: 3, text: "Gold" }, { id: 4, text: "Football" }, { id: 5, text: "Soccer" }, { id: 6, text: "Tennis" }, { id: 7, text: "Hearthstone" }];

                this.selectedSports = [];
            };

            _export("Mselect", Mselect);
        }
    };
});
//# sourceMappingURL=../../ui/mselect/mselect.js.map