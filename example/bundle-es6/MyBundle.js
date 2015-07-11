import solfege from "../../lib/solfege";
let Application = solfege.kernel.Application;

export default class MyBundle
{
    constructor()
    {
        this.woot = "W00t";
    }

    // Implement this method to access the solfege application
    *setApplication(application:Application)
    {
        let bindGenerator = solfege.util.Function.bindGenerator;
        this.application = application;
        this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
    }

    *onApplicationStart()
    {
         console.log(this.woot, "SolfegeJS", solfege.version);
         console.log("configuration.foo =", this.application.configuration.parameters.foo);
    }
}

