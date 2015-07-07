var solfege = require('../../../lib-es5/solfege');
var mochaSetup = require('../../mochaSetup');
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
    before(function*()
    {
        // Initialize the application
        application = new Application(__dirname);

        // Start the application
        application.start();
    });


    /**
     * Test the addBundle() function
     */
    describe('#addBundle()', function()
    {
        // Add a basic bundle
        it('should add a bundle', function*()
        {
            application.addBundle('a', true);
            var result = application.getBundle('a');
            expect(result).to.be.true;

            var bundle = {};
            application.addBundle('hello', bundle);
            result = application.getBundle('hello');
            expect(result).to.equal(bundle);
        });

        // Invalid name: it must start by a letter
        it('should reject the bundle if the name does not start by a letter', function*()
        {
            should.Throw(function() {
                application.addBundle('1', true);
            });
        });

        // Invalid name: it must contain only letters, digits and dashes
        it('should reject the bundle if the name contains characters other than letters, digits or dashes', function*()
        {
            should.Throw(function() {
                application.addBundle('a-b!', true);
            });
        });

        // Invalid name: it cannot contain 2 consecutive dashes
        it('should reject the bundle if the name contains 2 consecutive dashes', function*()
        {
            should.Throw(function() {
                application.addBundle('a--b', true);
            });
        });

        // Invalid name: it cannot end by a dash
        it('should reject the bundle if the name ends by a dash', function*()
        {
            should.Throw(function() {
                application.addBundle('a-b-', true);
            });
        });

        // No arguments
        it('should throw an error if the method is called without arguments', function*()
        {
            should.Throw(function() {
                application.addBundle();
            });
        });
    });

    /**
     * Test the parseSolfegeUri() function
     */
    describe('#parseSolfegeUri()', function()
    {
        // Find the bundle id
        it('should find the bundle id', function*()
        {
            var result = application.parseSolfegeUri('@a');
            expect(result.bundleId).to.equal('a');

            result = application.parseSolfegeUri('@foo.bar');
            expect(result.bundleId).to.equal('foo');

            result = application.parseSolfegeUri('@lorem.ipsum.dolor');
            expect(result.bundleId).to.equal('lorem');

            result = application.parseSolfegeUri('@tic.tac.toe:a/b/c.txt');
            expect(result.bundleId).to.equal('tic');
        });

        // Find the bundle
        it('should find the bundle instance', function*()
        {
            var bundle = {};
            application.addBundle('a', bundle);

            var result = application.parseSolfegeUri('@a');
            expect(result.bundle).to.equal(bundle);
        });

        // Find the object path
        it('should find the object path', function*()
        {
            var result = application.parseSolfegeUri('@a.b.c.d');
            expect(result.objectPath).to.equal('b.c.d');

            result = application.parseSolfegeUri('@lorem.ipsum.dolor:my/files/*.png');
            expect(result.objectPath).to.equal('ipsum.dolor');

            result = application.parseSolfegeUri('@hello');
            expect(result.objectPath).to.be.undefined;
        });

        // Find the object
        it('should find the object instance', function*()
        {
            var bundle = {
                hello: {
                    world: 'huhu'
                }
            };
            application.addBundle('moo', bundle);

            var result = application.parseSolfegeUri('@moo.hello.world');
            expect(result.object).to.equal('huhu');

            result = application.parseSolfegeUri('@moo');
            expect(result.object).to.equal(bundle);
        });

        // Find the file pattern
        it('should find the file pattern', function*()
        {
            var result = application.parseSolfegeUri('@hello.world:my/files-*.xml');
            expect(result.filePattern).to.equal('my/files-*.xml');
        });

        // Object that does not have __dirname property
        it('should fail to find a file in an object without __dirname property', function*()
        {
            var bundle = {
                arf: {}
            };
            application.addBundle('foo', bundle);

            should.Throw(function() {
                var result = application.parseSolfegeUri('@foo.arf:a.txt');
            });
        });

        // Find the file path
        it('should find the file', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.parseSolfegeUri('@foo:a.txt');
            expect(result.filePath).to.equal(__dirname + '/bundleTest/a.txt');
            expect(result.relativeFilePath).to.equal('a.txt');
        });

        // Find the file paths
        it('should find the files', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.parseSolfegeUri('@foo:*.txt');
            expect(result.filePaths).to.deep.equal([
                __dirname + '/bundleTest/a.txt',
                __dirname + '/bundleTest/b.txt',
                __dirname + '/bundleTest/c.txt'
            ]);
            expect(result.relativeFilePaths).to.deep.equal([
                'a.txt',
                'b.txt',
                'c.txt'
            ]);
        });

    });

    /**
     * Test the isSolfegeUri() function
     */
    describe('#isSolfegeUri()', function()
    {
        // Bundle name with only lower case letters
        it('should detect bundle name with only lower case letters', function*()
        {
            var result = application.isSolfegeUri('@hello');
            expect(result).to.be.true;
        });

        // Bundle name with only upper case letters
        it('should detect bundle name with only upper case letters', function*()
        {
            var result = application.isSolfegeUri('@HELLO');
            expect(result).to.be.true;
        });

        // Bundle name with lower and upper case letters
        it('should detect bundle name with lower and upper case letters', function*()
        {
            var result = application.isSolfegeUri('@helloWorld');
            expect(result).to.be.true;
        });

        // Bundle name should start by a letter
        it('should detect only bundle name starts by a letter', function*()
        {
            application.isSolfegeUri('@h').should.be.true;
            application.isSolfegeUri('@W').should.be.true;
            application.isSolfegeUri('@3').should.be.false;
        });

        // String that not start by a @
        it('should reject string that not start by a @', function*()
        {
            var result = application.isSolfegeUri('hello');
            expect(result).to.be.false;
        });
    });



    /**
     * Test the resolveSolfegeUri() function
     */
    describe('#resolveSolfegeUri()', function()
    {

        // Find the file path
        it('should return file path', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.resolveSolfegeUri('@foo:a.txt');
            expect(result).to.equal(__dirname + '/bundleTest/a.txt');
        });

        // Find the file paths
        it('should return file paths', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.resolveSolfegeUri('@foo:*.txt');
            expect(result).to.deep.equal([
                __dirname + '/bundleTest/a.txt',
                __dirname + '/bundleTest/b.txt',
                __dirname + '/bundleTest/c.txt'
            ]);
        });

        // Find an object instance
        it('should return object instance', function*()
        {
            var bar = {
                a: 1,
                b: 2,
                c: {
                    d: '4',
                    e: 42
                }
            };
            application.addBundle('foo', bar);

            var result = application.resolveSolfegeUri('@foo');
            expect(result).to.equal(bar);

            result = application.resolveSolfegeUri('@foo.c');
            expect(result).to.equal(bar.c);
        });
    });


    /**
     * Test the getBundleFromSolfegeUri() function
     */
    describe('#getBundleFromSolfegeUri()', function()
    {

        // The target is a file
        it('should return the bundle instance if the URI targets a file', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.getBundleFromSolfegeUri('@foo:a.txt');
            expect(result).to.equal(bundle);
        });

        // The target are files
        it('should return the bundle instance if the URI targets files', function*()
        {
            var bundle = {
                __dirname: __dirname + '/bundleTest'
            };
            application.addBundle('foo', bundle);

            var result = application.getBundleFromSolfegeUri('@foo:*.txt');
            expect(result).to.equal(bundle);
        });

        // The target is an object
        it('should return the bundle instance if the URI targets an object', function*()
        {
            var bar = {
                a: 1,
                b: 2,
                c: {
                    d: '4',
                    e: 42
                }
            };
            application.addBundle('foo', bar);

            result = application.getBundleFromSolfegeUri('@foo.c');
            expect(result).to.equal(bar);
        });
    });


});