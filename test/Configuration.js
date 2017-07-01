import chai from "chai"
import Configuration from "../src/Configuration"

const expect = chai.expect;
const should = chai.should;

/**
 * Test configuration class
 */
describe("Configuration", () => {
    /**
     * Test "addProperties()" method
     */
    describe("#addProperties()", () => {
        /**
         *
         */
        it("should add properties", () => {
            let config = new Configuration;
            let properties = {
                foo: "bar"
            };

            config.addProperties(properties);
        });
    });
});
