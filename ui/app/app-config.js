System.register(['aurelia-framework', 'aurelia-logging-console'], function (_export) {
    'use strict';

    var LogManager, ConsoleAppender;

    _export('configure', configure);

    function configure(aurelia) {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator().plugin('./res/index');
        init(aurelia);

        aurelia.start().then(function (a) {
            return a.setRoot('ui/app/app', document.getElementById('app'));
        });
    }

    function init(aurelia) {}
    return {
        setters: [function (_aureliaFramework) {
            LogManager = _aureliaFramework.LogManager;
        }, function (_aureliaLoggingConsole) {
            ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
        }],
        execute: function () {

            LogManager.addAppender(new ConsoleAppender());
            LogManager.setLevel(LogManager.logLevel.debug);
        }
    };
});
//# sourceMappingURL=../../ui/app/app-config.js.map