module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    declaration: false
                }
            }
        },
        watch: {
            files: ['src/*.ts', 'src/**/*.ts'],
            tasks: ['typescript']
        }
    });

    grunt.registerTask('default', ['watch']);
};