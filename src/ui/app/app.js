export class App 
{
    configureRouter(config, router)
    {
        this.router = router;

        config.title = 'cs-ctrl';
        config.options.pushState = true; //No hash routes
        config.map([
            { route: ['','home'], moduleId: '../home/home', title:'Home'}
        ]);
    }
}