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
        it("should successfully set a parameter", () => {
            let application = new Application();
            let symbol = Symbol();

            expect(() => {
                application.setParameter("foo", symbol);
            }).to.not.throw(Error);
        });

        /**
         * Parameter name should be a string
         */
        it("should fail if the parameter name is not a string", () => {
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
        it("should successfully retrieve a parameter previously set", () => {
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
        it("should successfully add a valid bundle", () => {
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

        it("should throw an error with an invalid bundle", () => {
            let application = new Application;
            let fakeBundle = {};

            // Call the method should throw an error
            expect(() => {
                application.addBundle(fakeBundle);
            }).to.throw(Error);
        });
    });

    describe("#getBundleDirectoryPath()", () => {
        it("should return directory path of the bundle", () => {
            let application = new Application;
            let fakeBundle = {
                getPath: () => { return "foo" }
            };

            expect(application.getBundleDirectoryPath(fakeBundle)).to.equal("foo");
        });
    });

    describe("#addConfigurationProperties()", () => {
        it("should add new properties to the configuration", () => {
            let application = new Application;

            application.addConfigurationProperties({foo: "bar"});
            application.addConfigurationProperties({tic: "tac"});

            expect(application.getConfiguration().get("foo")).to.equal("bar");
            expect(application.getConfiguration().get("tic")).to.equal("tac");
        });
    });

    describe("#start()", () => {
        it("should emit start event", function (done) {
            let application = new Application;

            application.on(Application.EVENT_START, async (app, parameters) => {
                expect(parameters).to.deep.equal(["a", "b"]);
                done();
            });

            application.start(["a", "b"]);
        });

        it("should emit end event", function (done) {
            let application = new Application;

            application.on(Application.EVENT_END, async (app) => {
                done();
            });

            application.start();
        });

        it("should fail if the configuration file does not exist", (done) => {
            let application = new Application;

            application.disableDefaultErrorListener();
            application.setConfigurationFile(`${__dirname}/configurationFiles/unknown.yml`);
            application.on(Application.EVENT_ERROR, (error) => {
                done();
            });
            application.start();
        });

        it("should load the configuration file if it exists", (done) => {
            let application = new Application;

            application.disableDefaultErrorListener();
            application.setConfigurationFile(`${__dirname}/configurationFiles/simple.yml`);
            application.on(Application.EVENT_END, (app) => {
                done();
            });
            application.start();
        });

        it("should install dependencies of the bundles", (done) => {
            let application = new Application;
            let fakeBundle = {
                getPath: () => {},
                installDependencies: (app) => {
                    done();
                },
            };
            application.addBundle(fakeBundle);
            application.start();
        });

        it("should initialize bundles", (done) => {
            let application = new Application;
            let fakeBundle = {
                getPath: () => {},
                initialize: (app) => {
                    done();
                },
            };
            application.addBundle(fakeBundle);
            application.start();
        });

        it("should emit event after bundle initializations", (done) => {
            let application = new Application;
            let order = [];
            let firstBundle = {
                getPath: () => {},
                initialize: (app) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            order.push("a");
                            resolve();
                        }, 10);
                    });
                },
            };
            let secondBundle = {
                getPath: () => {},
                initialize: (app) => {
                    order.push("b");
                },
            };
            application.addBundle(firstBundle);
            application.addBundle(secondBundle);
            application.on(Application.EVENT_BUNDLES_INITIALIZED, (app) => {
                expect(order).to.have.ordered.members(["a", "b"]);
                done();
            });
            application.start();
        });

        it("should boot bundles", (done) => {
            let application = new Application;
            let fakeBundle = {
                getPath: () => {},
                boot: (app) => {
                    done();
                },
            };
            application.addBundle(fakeBundle);
            application.start();
        });

        it("should emit event after bundle boots", (done) => {
            let application = new Application;
            let order = [];
            let firstBundle = {
                getPath: () => {},
                boot: (app) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            order.push("a");
                            resolve();
                        }, 10);
                    });
                },
            };
            let secondBundle = {
                getPath: () => {},
                boot: (app) => {
                    order.push("b");
                },
            };
            application.addBundle(firstBundle);
            application.addBundle(secondBundle);
            application.on(Application.EVENT_BUNDLES_BOOTED, (app) => {
                expect(order).to.have.ordered.members(["a", "b"]);
                done();
            });
            application.start();
        });


        it("should catch unknown error", (done) => {
            let application = new Application();

            let oldWrite = process.stderr.write;
            let err = "";
            process.stderr.write = function(chunk, encoding, callback) {
                err += chunk.toString();
            }
            application.on(Application.EVENT_START, (app, parameters) => {
                executeUnknownFunction();
            });
            application.on(Application.EVENT_ERROR, async (error) => {
                process.stderr.write = oldWrite;
                expect(err).to.contain("Solfege Error");
                done();
            });

            application.start();
        });
    });

    describe("#inspect()", () => {
        it("should return string format of the instance", () => {
            let application = new Application;

            expect(application.inspect()).to.not.be.empty;
        });
    });
});
