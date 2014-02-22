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

        // Add a fake bundle to test the Solfege URI
        application.addBundle('fake', {
        });

        // Start the application
        application.start();
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
