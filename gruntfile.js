module.exports = function(grunt) {
	grunt.initConfig({
		appConfig: grunt.file.readJSON('bower.json') || {},
		sass: {
			dist: {
				options: {
					style: 'expanded',
					noCache: true
				},
				files: [
					{'./dist/weather-widget.css': './src/weather-widget.sass'}
				]
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'./dist/weather-widget.min.js': './src/weather-widget.js'
				}
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '/*\n * jQuery Weather Widget\n' +
					' * <%= grunt.template.today("yyyy") %> <%= appConfig.authors[0] %> \n' +
					' * License: <%= appConfig.license %>\n */\n '
				},
				files: {
					src: ['dist/weather-widget.min.js', 'dist/weather-widget.js']
				}
			}
		},
		copy: {
			main: {
				src: 'src/weather-widget.js',
				dest: 'dist/weather-widget.js'
			}
		},
		watch: {
			scripts: {
				files: ['./src/**/*.js', './src/**/*.sass'],
				tasks: ['sass', 'copy', 'uglify', 'usebanner']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass', 'copy', 'uglify', 'usebanner']);

};