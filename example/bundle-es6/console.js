import solfege from "../../lib";

let application = solfege.factory();
let parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);
