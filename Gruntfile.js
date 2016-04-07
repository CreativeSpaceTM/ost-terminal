module.exports = function(grunt) {
	"use strict";

	var path = require('path');

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		watch: {
			frontend: {
				files: [
					"static/js/**/*.*"
				],

				options: {
					livereload: true,
				},
			}
		},

		webpack: {
			dev: {
				entry: './static/js/app.js',
				output: { path: path.join(__dirname, "/dist"), filename: 'bundle.min.js' },
				watch: true,
				devtool: "eval-cheap-module-source-map",
				module: {
					loaders: [
						{
							test: /.js?$/,
							loader: 'babel-loader',
							exclude: /node_modules/,
							query: {
								presets: ['es2015', 'react']
							}
						}
					]
				}
			},
			deploy: {
				entry: './static/js/app.js',
				output: { path: path.join(__dirname, "/dist"), filename: 'bundle.js' },
				module: {
					loaders: [
						{
							test: /.js?$/,
							loader: 'babel-loader',
							exclude: /node_modules/,
							query: {
								presets: ['es2015', 'react']
							}
						}
					]
				}
			}
		},

		uglify: {
			static: {
				files: {
					'dist/bundle.min.js': ['dist/bundle.js']
				}
			}
		}
	});

	grunt.registerTask("build", ["webpack:deploy", "uglify"]);
	grunt.registerTask("look", ["webpack:dev", "watch:frontend"]);
};
