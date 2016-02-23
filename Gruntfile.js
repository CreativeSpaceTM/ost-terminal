module.exports = function(grunt) {
	"use strict";

	var path = require('path');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-webpack');

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
			static: {
				entry: './static/js/app.js',
				output: { path: path.join(__dirname, "/dist"), filename: 'bundle.js' },
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
			}
		}
	});

	grunt.registerTask("start", ["webpack", "watch"]);
};
