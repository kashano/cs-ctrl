System.register([], function (_export) {
    'use strict';

    var App;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [],
        execute: function () {
            App = (function () {
                function App() {
                    _classCallCheck(this, App);
                }

                _createClass(App, [{
                    key: 'configureRouter',
                    value: function configureRouter(config, router) {
                        this.router = router;

                        config.title = 'cs-ctrl';
                        config.map([{ route: ['', 'welcome'], moduleId: '../welcome/welcome', nav: true, title: 'Welcome' }, { route: ['select'], moduleId: '../select/select', nav: true, title: 'cs-select' }, { route: ['mselect'], moduleId: '../mselect/mselect', nav: true, title: 'cs-mselect' }, { route: ['menu'], moduleId: '../menu/menu', nav: true, title: 'cs-menu' }]);

                        var nav = this.router.navigation;
                        nav = null;
                    }
                }]);

                return App;
            })();

            _export('App', App);
        }
    };
});
//# sourceMappingURL=../../ui/app/app.js.map