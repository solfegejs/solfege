import chai from "chai"
import Configuration from "../src/Configuration"
import util from "util"

const expect = chai.expect;
const should = chai.should;

/**
 * Test configuration class
 */
describe("Configuration", () => {
    /**
     * Test "set()" method
     */
    describe("#set()", () => {
        /**
         * Set a property
         */
        it("should set a property", () => {
            let config = new Configuration;

            // Test
            expect(() => {
                config.set("foo", Symbol());
            }).to.not.throw(Error);
        });

        /**
         * Property name should be a string
         */
        it("should fail if the property is not a string", () => {
            let config = new Configuration;

            // Test
            expect(() => {
                config.set(Symbol(), Symbol());
            }).to.throw(TypeError);
        });
    });

    /**
     * Test "addProperties()" method
     */
    describe("#addProperties()", () => {
        /**
         * Simple properties
         */
        it("should add properties", () => {
            let config = new Configuration;
            let properties = {
                foo: "bar",
                plop: Symbol()
            };

            // Test
            expect(() => {
                config.addProperties(properties);
            }).to.not.throw(Error);
        });

        /**
         * Properties should be an object
         */
        it("should fail if the argument is not an object", () => {
            let config = new Configuration;
            let properties = Symbol();

            // Test
            expect(() => {
                config.addProperties(properties);
            }).to.throw(TypeError);
        });

        /**
         * Override properties
         */
        it("should override properties", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: "bar",
                tic: 42
            });
            config.addProperties({
                tic: 1337
            });

            // Test
            let foo = config.get("foo");
            let tic = config.get("tic");
            expect(foo).to.equal("bar");
            expect(tic).to.equal(1337);
        });

        /**
         * Merge objects
         */
        it("should merge objects", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                a: {
                    b: {
                        foo: "bar"
                    },
                    c: 42
                }
            });
            config.addProperties({
                a: {
                    b: {
                        tic: "tac"
                    }
                }
            });

            // Test
            let foo = config.get("a.b.foo");
            let tic = config.get("a.b.tic");
            let c = config.get("a.c");
            expect(foo).to.equal("bar");
            expect(tic).to.equal("tac");
            expect(c).to.equal(42);
        });

        /**
         * Merge arrays
         */
        it("should merge arrays", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                a: [
                    "tic",
                    "tac"
                ]
            });
            config.addProperties({
                a: [
                    "toc"
                ]
            });

            // Test
            let a = config.get("a");
            expect(a).to.deep.equal(["tic", "tac", "toc"]);
        });

        /**
         * Merge object in array
         */
        it("should merge object in array", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                a: [
                    {
                        foo: "bar"
                    }
                ]
            });
            config.addProperties({
                a: [
                    {
                        tic: "tac"
                    },
                    42
                ]
            });

            // Test
            let a = config.get("a");
            expect(a).to.deep.equal([{foo: "bar", tic: "tac"}, 42]);
        });

        /**
         * Merge array in array
         */
        it("should merge object in array", () => {
            let config = new Configuration;
            let a = Symbol();
            let b = Symbol();

            // Add properties
            config.addProperties({
                foo: [
                    [
                        a
                    ]
                ]
            });
            config.addProperties({
                foo: [
                    [
                        b
                    ]
                ]
            });

            // Test
            let foo = config.get("foo");
            expect(foo).to.deep.equal([[a, b]]);
        });

        /**
         * Simple dependency
         */
        it("should resolve dependencies", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: "bar"
            });
            config.addProperties({
                tic: "%foo%"
            });

            // Test
            let tic = config.get("tic");
            expect(tic).to.equal("bar");
        });

        /**
         * Deep dependency
         */
        it("should resolve deep dependencies", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: "bar"
            });
            config.addProperties({
                tac: "%tic%",
                tic: "%foo%"
            });

            // Test
            let tac = config.get("tac");
            expect(tac).to.equal("bar");
        });

        /**
         * Detect infinite recursion
         */
        it("should throw an error if infinite recursion is detected", () => {
            let config = new Configuration;

            expect(() => {
                config.addProperties({
                    a: "%b%",
                    b: "%c%",
                    c: "%a%"
                });
            }).to.throw(Error);
        });
    });

    /**
     * Test "get()" method
     */
    describe("#get()", () => {
        /**
         * Get simple value
         */
        it("should retrieve parameter previously set", () => {
            let config = new Configuration;

            // Set and get parameter
            config.set("foo", "bar");
            let fetched = config.get("foo");

            // Test
            expect(fetched).to.equal("bar");
        });

        /**
         * Get a value in depth 1
         */
        it("should retrieve attribute of an object", () => {
            let config = new Configuration;

            // Set and get parameter
            config.addProperties({
                foo: {
                    bar: 42
                }
            });
            let fetched = config.get("foo.bar");

            // Test
            expect(fetched).to.equal(42);
        });

        /**
         * Non-existing value
         */
        it("should return undefined if the value does not exists", () => {
            let config = new Configuration;

            let fetched = config.get("foo");

            // Test
            expect(fetched).to.be.undefined;
        });
    });

    /**
     * Test "propertyHasDependency()" method
     */
    describe("#propertyHasDependency()", () => {
        /**
         * Non string value
         */
        it("should return false if the value is not a string", () => {
            let config = new Configuration;

            // Test
            let fooHasDependency = config.propertyHasDependency(42);
            expect(fooHasDependency).to.be.false;
        });

        /**
         * Value without dependency
         */
        it("should return fase if the property has no dependency", () => {
            let config = new Configuration;

            let fooHasDependency = config.propertyHasDependency("foo");

            // Test
            expect(fooHasDependency).to.be.false;
        });

        /**
         * Value with simple dependency
         */
        it("should return true if the property has a direct dependency", () => {
            let config = new Configuration;

            let fooHasDependency = config.propertyHasDependency("%foo%");

            // Test
            expect(fooHasDependency).to.be.true;
        });
    });

    /**
     * Test "resolvePropertyValue()" method
     */
    describe("#resolvePropertyValue()", () => {
        /**
         * Resolve number
         */
        it("should resolve number", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: 42
            });

            // Test
            let resolved = config.resolvePropertyValue("%foo%");
            expect(resolved).to.equal(42);
        });

        /**
         * Resolve string
         */
        it("should resolve string", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: "bar"
            });

            // Test
            let resolved = config.resolvePropertyValue("%foo%");
            expect(resolved).to.equal("bar");
        });

        /**
         * Resolve composed string
         */
        it("should resolve composed string", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: "bar",
                tic: "tac"
            });

            // Test
            let resolved = config.resolvePropertyValue("%foo%/%tic%");
            expect(resolved).to.equal("bar/tac");
        });

        /**
         * Resolve undefined value
         */
        it("should resolve undefined value", () => {
            let config = new Configuration;

            // Add properties
            config.addProperties({
                foo: undefined,
                tic: "tac"
            });

            // Test
            let resolved = config.resolvePropertyValue("%foo%/%tic%");
            expect(resolved).to.equal("/tac");
        });
    });

    /**
     * Test "inspect()" method
     */
    describe("#inspect()", () => {
        /**
         * Simple configuration
         */
        it("should return string output of the inspection", () => {
            let config = new Configuration;

            let output = util.inspect(config);

            // Test
            expect(output).to.equal("SolfegeJS/Configuration {}");
        });

        /**
         * Configuration with some properties
         */
        it("should return string output with some properties", () => {
            let config = new Configuration;
            config.addProperties({
                foo: "bar",
                tic: "%foo%"
            });

            let output = util.inspect(config);

            // Test
            expect(output).to.equal("SolfegeJS/Configuration {\n  \"foo\": \"bar\",\n  \"tic\": \"bar\"\n}");
        });
    });
});
