Meteor.startup(function() {

    // process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    // Policy
    BrowserPolicy.framing.allowAll();
    // BrowserPolicy.content.allowInlineScripts();

    // const prerenderio = require("prerender-node");
    // const settings = Meteor.settings.PrerenderIO;

    // if ((settings || {}).token) {
    // 	console.log('Using PrerenderIO');
    //     prerenderio.set("prerenderToken", settings.token);
    //     // prerenderio.set("prerenderServiceUrl", settings.prerenderServiceUrl);
    //     WebApp.connectHandlers.use(prerenderio);
    // }

});
