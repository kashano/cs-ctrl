import {LogManager}      from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) 
{
    aurelia.use
      .defaultBindingLanguage()
      .defaultResources()
      .router()
      .eventAggregator()
      //.plugin('aurelia-animator-css')
      .plugin('./res/index');   //Install app's resources

    //Run app's init code
    init(aurelia);

    //Bootstrap Aurelia
    aurelia.start()
           .then(a => a.setRoot('ui/app/app', document.getElementById('app')));
}



function init(aurelia)
{
    //Not much to do
}