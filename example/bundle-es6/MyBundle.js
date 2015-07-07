import solfege from "../../lib/solfege";

export default class MyBundle
{
    constructor()
    {
        this.woot = "W00t";
    }

    *setApplication(application)
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

