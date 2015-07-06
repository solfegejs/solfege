import solfege from "../../lib-es5/solfege";

export default class MyBundle
{
    constructor()
    {
        this.woot = "W00t";
    }

    *setApplication(application)
    {
        var bindGenerator = solfege.util.Function.bindGenerator;
        application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
    }

    *onApplicationStart()
    {
         console.log(this.woot, "SolfegeJS", solfege.version);
    }
}

