module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Generate javascript files based from typescript files
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'build',
                options: {
                    module: 'Node',
                    target: 'ES5',
                    base_path: 'src',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: false,
                    comments: false
                }
            }
        },

        // Generate documentation
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    extension: '.ts',
                    paths: 'src/',
                    outdir: 'documentation/'
                }
            }
        },

        // Watch file modifications
        watch: {
            files: ['src/*.ts', 'src/**/*.ts'],
            tasks: ['typescript', 'yuidoc']
        }
    });

    // Available tasks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('compile', ['typescript']);
    grunt.registerTask('documentation', ['yuidoc']);
};