var solfege = require('../../lib/solfege.js');
var co = require('co');
var expect = require('chai').expect;
var should = require('chai').should();

/**
 * Test the Application class
 */
describe('Application', function()
{
    var Application = solfege.kernel.Application;
    var application;

    /**
     * Initialize the test suite
     */
    before(co(function*()
    {
        // Initialize the application
        application = new Application(__dirname);

        // Start the application
        application.start();
    }));


    /**
     * Test the addBundle() function
     */
    describe('#addBundle()', co(function*()
    {
        // Add a basic bundle
        it('should add a bundle', co(function*()
        {
            application.addBundle('a', true);
            var result = application.getBundle('a');
            expect(result).to.be.true;

            var bundle = {};
            application.addBundle('hello', bundle);
            result = application.getBundle('hello');
            expect(result).to.equal(bundle);
        }));

        // Invalid name: it must start by a letter
        it('should reject the bundle if the name does not start by a letter', co(function*()
        {
            should.Throw(function() {
                application.addBundle('1', true);
            });
        }));

        // Invalid name: it must contain only letters, digits and dashes
        it('should reject the bundle if the name contains characters other than letters, digits or dashes', co(function*()
        {
            should.Throw(function() {
                application.addBundle('a-b!', true);
            });
        }));

        // Invalid name: it cannot contain 2 consecutive dashes
        it('should reject the bundle if the name contains 2 consecutive dashes', co(function*()
        {
            should.Throw(function() {
                application.addBundle('a--b', true);
            });
        }));

        // Invalid name: it cannot end by a dash
        it('should reject the bundle if the name ends by a dash', co(function*()
        {
            should.Throw(function() {
                application.addBundle('a-b-', true);
            });
        }));

    }));


    /**
     * Test the isSolfegeUri() function
     */
    describe('#isSolfegeUri()', co(function*()
    {
        // Bundle name with only lower case letters
        it('should detect bundle name with only lower case letters', co(function*()
        {
            var result = application.isSolfegeUri('@hello');
            expect(result).to.be.true;
        }));

        // Bundle name with only upper case letters
        it('should detect bundle name with only upper case letters', co(function*()
        {
            var result = application.isSolfegeUri('@HELLO');
            expect(result).to.be.true;
        }));

        // Bundle name with lower and upper case letters
        it('should detect bundle name with lower and upper case letters', co(function*()
        {
            var result = application.isSolfegeUri('@helloWorld');
            expect(result).to.be.true;
        }));

        // Bundle name should start by a letter
        it('should detect only bundle name starts by a letter', co(function*()
        {
            application.isSolfegeUri('@h').should.be.true;
            application.isSolfegeUri('@W').should.be.true;
            application.isSolfegeUri('@3').should.be.false;
        }));



        // String that not start by a @
        it('should reject string that not start by a @', co(function*()
        {
            var result = application.isSolfegeUri('hello');
            expect(result).to.be.false;
        }));
    }));
});
