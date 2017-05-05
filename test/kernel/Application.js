import chai from "chai"
import Application from "../../src/kernel/Application"

const expect = chai.expect;
const should = chai.should;


describe("Application", () => {
    describe("#addBundle()", () => {
        it("should successfully add a valid bundle", function *() {
            let application = new Application;
            let fakeBundle = {
                getPath: () => {}
            };

            // Call the method should not throw an error
            expect(() => {
                application.addBundle(fakeBundle);
            }).to.not.throw(Error);

            // The bundle instance is in the list
            expect(Array.from(application.getBundles())).to.contain(fakeBundle);
        });

        it("should throw an error with an invalid bundle", function *() {
            let application = new Application;
            let fakeBundle = {};

            // Call the method should throw an error
            expect(() => {
                application.addBundle(fakeBundle);
            }).to.throw(Error);
        });
    });

    describe("#getBundleDirectoryPath()", () => {
        it("should return directory path of the bundle", function *() {
            let application = new Application;
            let fakeBundle = {
                getPath: () => { return "foo" }
            };

            expect(application.getBundleDirectoryPath(fakeBundle)).to.equal("foo");
        });
    });

    describe("#start()", () => {
        it("should run the application", function (done) {
            let application = new Application;
            application.on(Application.EVENT_START, function *() {
                done();
            });

            application.start();
        });
    });
});
