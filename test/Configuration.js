import chai from "chai"
import Configuration from "../src/Configuration"

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
    });
});
