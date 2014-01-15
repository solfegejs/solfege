module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Generate documentation
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    extension: '.js',
                    paths: 'lib/',
                    outdir: 'documentation/'
                }
            }
        },

        // Watch file modifications
        watch: {
            files: ['lib/*.js', 'lib/**/*.js'],
            tasks: ['yuidoc']
        }
    });



    // Available tasks

    // Task - Watch and compile typescript files
    grunt.registerTask('default', ['watch']);

    // Task - Generate the documentation
    grunt.registerTask('documentation', ['yuidoc']);
};
