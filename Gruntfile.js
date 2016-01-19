'use strict';
/**/

module.exports = function(grunt) {
	require('load-grunt-config')(grunt);
	var serveStatic = require('serve-static');
	var srcConfig = {
		host: 'localhost',
		src: require('./bower.json').srcPath || 'src',
		dist: 'dist',
		bowercomp: 'bower_components'
	};
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		yeoman: srcConfig,
		// The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              //connect.static('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/src/css',
                serveStatic('./src/css')
              ),
              serveStatic(srcConfig.dist)
            ];
          }
        }
      },
			dist: {
				options: {
					open: true,
					base: '<%= yeoman.dist %>',
					livereload: false
				}
			}
		},
		//include src
		includeSource: {
			options: {
				basePath: 'src',
				baseUrl: './',
				templates: {
					html: {
						js: '<script src="{filePath}"></script>',
						css: '<link rel="stylesheet" href="{filePath}" />'
					}
				}
			},
			debug: {
				files: {
					'<%= yeoman.dist %>/index.html': '<%= yeoman.src %>/index.tpl.html'
				}
			},
			dist: {
				files: {
					'<%= yeoman.dist %>/index.html': '<%= yeoman.src %>/index.tpl.html'
				}
			}
		},
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep:debug']
			},
			html: {
				files: [
					'<%= yeoman.src %>/modules/**/{,*/}*.html'
				],
				tasks: ['newer:copy:debug', 'newer:copy:dist'],
				options: {
					//livereload: '<%= connect.options.livereload %>'
				}
			},
			js: {
				files: [
					'<%= yeoman.src %>/js/{,*/}*.js',
					'<%= yeoman.src %>/i18n/{,*/}*.json',
					'<%= yeoman.src %>/modules/**/{,*/}*.js'
				],
				tasks: ['newer:copy:debug'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			styles: {
				files: ['<%= yeoman.src %>/css/{,*/}*.css'],
				tasks: ['newer:copy:debug']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			includeSource: {
				files: ['<%= yeoman.src %>/index.tpl.html'],
				tasks: ['includeSource:debug']
			}
		},
		//
		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			apps: {
				options: {
					jshintrc: '<%= yeoman.src %>/.jshintrc'
				},
				src: [
					'Gruntfile.js',
					'<%= yeoman.src %>/{,*/}*.js',
					'<%= yeoman.src %>/modules/core/{,*/}*.js',
					'<%= yeoman.src %>/modules/dashbord/{,*/}*.js',
					'<%= yeoman.src %>/modules/labprocess/{,*/}*.js',
					'<%= yeoman.src %>/modules/orders/{,*/}*.js',
					'<%= yeoman.src %>/modules/public/{,*/}*.js',
					'<%= yeoman.src %>/modules/qualitycontrol/{,*/}*.js',
					'<%= yeoman.src %>/modules/settings/{,*/}*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'tests/.jshintrc'
				},
				src: ['tests/spec/{,*/}*.js']
			}
		},
		//include bower components(vendors)
		wiredep: {
			debug: {
				src: ['<%= yeoman.dist %>/index.html'],
				ignorePath: '../',
				exclude: ['<%= yeoman.bowercomp %>/rome/', '<%= yeoman.bowercomp %>/jquery/',
					'<%= yeoman.bowercomp %>/requirejs/', '<%= yeoman.bowercomp %>/bootstrap/dist/js/']
			},
			dist: {
				src: ['<%= yeoman.dist %>/index.html'],
				//ignorePath: '/src',
				exclude: ['<%= yeoman.bowercomp %>/rome/', '<%= yeoman.bowercomp %>/jquery/',
					'<%= yeoman.bowercomp %>/requirejs/', '<%= yeoman.bowercomp %>/bootstrap/dist/js/']
			}
		},
		//
		useminPrepare: {
			html: '<%= yeoman.dist %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>',
				root: '<%= yeoman.src %>',
				flow: {
					html: {
						steps: {
							js: [
								'concat',
								'uglifyjs'
							],
							css: [
								'cssmin'
							]
						},
						post: {}
					}
				}
			}
		},
		//
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: [
					'<%= yeoman.dist %>',
					'<%= yeoman.dist %>/images'
				]
			}
		},
		// https://www.npmjs.com/package/grunt-angular-templates
		ngtemplates: {
			miniApp: {
				cwd: '<%= yeoman.src %>',
				src: 'modules/**/{,*/}*.html',
				dest: '<%= yeoman.dist %>/template.js',
				options: {
					module: 'miniApp',
					append: '<%= yeoman.dist %>',
					usemin: 'app.js',
					htmlmin: {
						collapseWhitespace: true,
						conservativeCollapse: true,
						removeScriptTypeAttributes: true,
						removeEmptyAttributes: true,
						removeComments: true
					}
				}
			}
		},
		concat: {
			options: {
				separator: '\n/*! <%= grunt.template.today("dd/mm/yyyy") %> */',
				stripBanners: true,
				banner: '\n/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
			}
		},
		cssmin: {
			options: {
				//keepBreaks: true
			}
		},
		uglify: {
			options: {}
		},
		ngAnnotate: {
			options: {
				singleQuotes: true
					//,regexp: '^(rome){0}'
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat',
					src: [
						'*.js'
					],
					dest: '.tmp/concat'
				}]
			}
		},
		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.src %>',
						dest: '<%= yeoman.dist %>',
						src: [
						'*.{ico,png,txt}',
						'.htaccess',
						//'modules/**/{,*/}*.html', // не треба бо ngtemplates
						'i18n/{,*/}*.*',
						'index2.html'
					]
				}, {
						expand: true,
						cwd: '<%= yeoman.bowercomp %>/font-awesome',
						src: 'fonts/*.*',
						dest: '<%= yeoman.dist %>'
				}, {
						expand: true,
						cwd: '<%= yeoman.src %>',
						src: ['images/{,*/}*.*', 'fonts/{,*/}*.*'],
						dest: '<%= yeoman.dist %>'
				}
				]
			},
			debug: {
				files: [
					{ //
						expand: true,
						cwd: '<%= yeoman.src %>',
						src: ['css/{,*/}*.*', 'modules/**/{,*/}*.*', 'js/{,*/}*.js', 'Guardfile'],
						dest: '<%= yeoman.dist %>'
					}
				]
			}
		},
		clean: {
			options: {
				force: true
			},
			temp: {
				src: ['.tmp']
			},
			dist: {
				src: ['<%= yeoman.dist %>', '.tmp']
			}
		},
		// replace
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: '$compileProvider.debugInfoEnabled(false);',
							replacement: '$compileProvider.debugInfoEnabled(false);'
						}
					],
					prefix: '//'
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ['.tmp/concat/app.js'],
						dest: '.tmp/concat/'
					}
				]
			}
		}
	});
	grunt.registerTask('build', [
		'clean:dist',
		'includeSource:dist',
		'wiredep:dist',
		'useminPrepare',
		'ngtemplates',
		'concat',
		'replace:dist',
		'ngAnnotate:dist',
		'copy:dist',
		'cssmin',
		'uglify',
		'usemin']);
	grunt.registerTask('debug', [
		'clean:dist',
		'includeSource:debug',
		'wiredep:debug',
		'copy:dist',
		'copy:debug',
		'connect:livereload',
		'watch']);
};
