module.exports = function (grunt) {

    grunt.initConfig({

        shell: {
            dev: {
                command: 'node server.js'
            }
            // запуск сервера через скрипт shell'a https://www.npmjs.com/package/grunt-shell
        },

        watch: {
            // запуск watcher'a, который следит за изенениями файлов  templates/*.xml
            // и если они изменяются, то запускает таск сборки шаблонов (grunt fest)
            scripts: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    spawn: false, //Setting this option to false speeds up the reaction time of the watch
                                  //(usually 500ms faster for most) and allows subsequent task runs to share the same context.
                    interrupt: true, //As files are modified this watch task will spawn tasks in child processes.
                                     //Set the interrupt option to true to terminate the previous process and spawn a new one upon later changes.
                    atBegin: true, //This option will trigger the run of each specified task at startup of the watcher.
                },
            },

            server: {
                files: [
                    'public_html/js/**/*.js',
                    'public_html/css/**/*.css'
                ],
                options: {
                    livereload: true //If enabled a live reload server will be started with the watch task per target.
                    //Then after the indicated tasks have run, the live reload server will be triggered with the modified files.
                }
            }
        },


        // одновременный запуска shell'a и watcher'a https://www.npmjs.com/package/grunt-concurrent
        concurrent: {
            target: {
                tasks: ['shell:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        qunit: {
            all: ['./public_html/tests/index.html']
        },

        fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public_html/js/tmpl'
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'define(function () { return <%= contents %> ; });',
                            {data: data}
                        );
                    }
                }
            }
        }

    });

    // подключть все необходимые модули
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['qunit:all']);
    grunt.registerTask('default', ['concurrent:target']);
};
