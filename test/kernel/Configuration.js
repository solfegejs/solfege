import chai from "chai"
import Configuration from "../../src/kernel/Configuration"

const expect = chai.expect;
const should = chai.should;


describe("Configuration", () => {
    describe("#addProperties()", () => {
        it("should add properties", () => {
            let config = new Configuration;
            let properties = {
                foo: "bar"
            };

            config.addProperties(properties);
        });
    });
});
