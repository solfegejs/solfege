import chai from "chai"
import Application from "../src/Application"

const expect = chai.expect;
const should = chai.should;

/**
 * Test application
 */
describe("Application", () => {
    /**
     * Test "setParameter()" method
     */
    describe("#setParameter()", () => {
        /**
         * Add a symbol
         */
        it("should successfully set a parameter", function *() {
            let application = new Application();
            let symbol = Symbol();

            expect(() => {
                application.setParameter("foo", symbol);
            }).to.not.throw(Error);
        });

        /**
         * Parameter name should be a string
         */
        it("should fail if the parameter name is not a string", function *() {
            let application = new Application();
            let symbol = Symbol();

            expect(() => {
                application.setParameter(symbol, 42);
            }).to.throw(Error);
        });
    });

    /**
     * Test "getParameter()" method
     */
    describe("#getParameter()", () => {
        /**
         * Get a symbol
         */
        it("should successfully retrieve a parameter previously set", function *() {
            let application = new Application();
            let bar = Symbol();

            // Set parameter and get the same name
            application.setParameter("foo", bar);
            let fetched = application.getParameter("foo");

            // Test
            expect(fetched).to.equal(bar);
        });
    });

    /**
     * Test "addBundle()" method
     */
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
