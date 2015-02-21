'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			public: {
				files: {
					'public/styles/main.css': 'public/styles/main.scss'
				}
			}
		},
		jade: {
			compile: {
				options: {
					client: false,
					pretty: true,
					data: {
						debug: false
					}
				},
				files: [{
					cwd: 'public/views/jade',
					src: '*.jade',
					dest: 'public/views/partials',
					expand: true,
					ext: '.html'
				}, {
					cwd: 'public/views/directives/widgets',
					src: '*.jade',
					dest: 'public/views/directives/widgets',
					expand: true,
					ext: '.html'
				}]
			}
		},
		watch: {
			styles: {
				files: ['public/styles/main.scss'],
				tasks: ['sass']
			},
			jade: {
	          files: ['public/views/jade/*.jade', 'public/views/directives/**/*.jade'],
	          tasks: ['jade']
	        }
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');

};