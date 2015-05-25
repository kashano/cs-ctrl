System.register([], function (_export) {
    'use strict';

    _export('configure', configure);

    function configure(aurelia) {
        aurelia.globalizeResources(['res/select/cs-select', 'res/mselect/cs-mselect']);
    }

    return {
        setters: [],
        execute: function () {}
    };
});
//# sourceMappingURL=../res/index.js.map