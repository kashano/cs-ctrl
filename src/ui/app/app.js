export class App 
{
    configureRouter(config, router)
    {
        this.router = router;

        config.title = 'cs-ctrl';
        config.map([
            { route: ['','welcome'], moduleId: '../welcome/welcome', nav: true, title:'Welcome'},
            { route: ['select'],     moduleId: '../select/select',   nav: true, title:'cs-select'},
            { route: ['mselect'],    moduleId: '../mselect/mselect', nav: true, title:'cs-mselect'},
            { route: ['date'],       moduleId: '../date/date-ex',    nav: true, title:'cs-date'},
            { route: ['menu'],       moduleId: '../menu/menu',       nav: true, title:'cs-menu'}
        ]);
        
        var nav = this.router.navigation;
        nav = null;
    }
}