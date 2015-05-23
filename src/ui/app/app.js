export class App 
{
    configureRouter(config, router)
    {
        this.router = router;

        config.title = 'cs-ctrl';
        config.map([
            { route: ['','home'], moduleId: '../home/home', title:'Home'}
        ]);
    }
}