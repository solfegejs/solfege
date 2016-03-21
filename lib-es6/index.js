import description from "../package.json";
import Application from "./kernel/Application";
import ServiceContainer from "./bundles/ServiceContainer";

let application = new Application();
application.addBundle(new ServiceContainer);

export default application;

