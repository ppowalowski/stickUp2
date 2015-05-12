'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'src',
        dist: 'dist/',
        sass: {
            options: {
                includePaths: ['<%= app %>/bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'extended'
                },
                files: {
                    '<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
                }
            }
        },
        markdown: {
            all: {
                options: {
                    template: '<%= app %>/index.tpl.html'
                    /*preCompile: function(src, context) {},
                    postCompile: function(src, context) {},
                    templateContext: {},
                    contextBinder: false,
                    contextBinderMark: '@@@',
                    autoTemplate: true,
                    autoTemplateFormat: 'jst',
                    markdownOptions: {
                       gfm: true,
                       highlight: 'manual',
                       codeLines: {
                       before: '<span>',
                       after: '</span>'
                       }
                    }*/
                },
                files: [
                    {
                        expand: true,
                        src: '<%= app %>/stickUp/*.md',
                        dest: '<%= app %>',
                        ext: '.html',
                        rename: function(dest, src) {
//                          grunt.log.writeln(dest);
//                          grunt.log.writeln(src);
//                          grunt.log.writeln(dest + src.replace('app/stickUp/README','/index'));
                          return dest + src.replace('src/stickUp/README','/index');
                        }
                    }
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= app %>/js/**/*.js'
            ]
        },
        clean: {
            dist: {
                src: ['<%= dist %>*']
            }
        },
        copy: {
            dist: {
                files: [{
                        expand: true,
                        cwd: '<%= app %>/',
                        src: ['fonts/**', '**/*.html', '!**/*.scss', '!**/*.tpl.html', '!bower_components/**', '!stickUp/**'],
                        dest: '<%= dist %>'
                    }]
            },
            ghPages: {
                files: [{
                        expand: true,
                        cwd: '<%= dist %>',
                        src: ['**'],
                        dest: ''
                    }]
            }
        },
        imagemin: {
            target: {
                files: [{
                        expand: true,
                        cwd: '<%= app %>/images/',
                        src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                        dest: '<%= dist %>images/'
                    }]
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false
            }
        },
        useminPrepare: {
            html: ['<%= app %>/index.html'],
            options: {
                dest: '<%= dist %>'
            }
        },
        usemin: {
            html: ['<%= dist %>**/*.html', '!<%= app %>/bower_components/**'],
            css: ['<%= dist %>css/**/*.css'],
            options: {
                dirs: ['<%= dist %>']
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['markdown']
            },
            sass: {
                files: '<%= app %>/scss/**/*.scss',
                tasks: ['sass']
            },
            markdown: {
                files: ['<%= app %>/**/*.md','<%= app %>/**/*.tpl.html'],
                tasks: ['markdown']
            },
            livereload: {
                files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            app: {
                options: {
                    port: 9000,
                    base: '<%= app %>/',
                    open: true,
                    livereload: true,
                    hostname: '0.0.0.0'
                }
            },
            dist: {
                options: {
                    port: 9001,
                    base: '<%= dist %>',
                    open: true,
                    keepalive: true,
                    livereload: false,
                    hostname: '127.0.0.1'
                }
            }
        },
        wiredep: {
            target: {
                src: [
                    '<%= app %>/**/*.html','!<%= app %>/**/*.tpl.html'
                ],
                exclude: [
                    'modernizr',
                    'jquery-placeholder',
                    'foundation'
                ]
            }
        }

    });


    grunt.registerTask('compile-sass', ['sass']);
    grunt.registerTask('bower-install', ['wiredep']);

    grunt.registerTask('default', ['compile-sass', 'markdown', 'bower-install', 'connect:app', 'watch']);
    grunt.registerTask('validate-js', ['jshint']);
    grunt.registerTask('server-dist', ['connect:dist']);

    grunt.registerTask('publish', ['compile-sass', 'clean:dist', 'markdown', 'validate-js', 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin','copy:ghPages']);
};
