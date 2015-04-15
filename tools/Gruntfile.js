module.exports = function(grunt) {
	
	var srcFiles = [
        '<%= dirs.src %>/Header.js',
        '<%= dirs.src %>/Traviso.js',
        '<%= dirs.src %>/MapMethods.js',
        '<%= dirs.src %>/Calculations.js',
        '<%= dirs.src %>/MoveEngine.js',
        '<%= dirs.src %>/PathFinding.js',
        '<%= dirs.src %>/map/ObjectView.js',
        '<%= dirs.src %>/map/TileView.js',
        '<%= dirs.src %>/EngineView.js',
        '<%= dirs.src %>/Footer.js'
    ],
    banner = [
        '/**',
        ' * @license',
        ' * <%= pkg.name %> - v<%= pkg.version %>',
        ' * Copyright (c) 2015, <%= pkg.author %>',
        ' * <%= pkg.url %>',
        ' *',
        ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
        ' *',
        ' * <%= pkg.name %> is licensed under the <%= pkg.license %> License.',
        ' * <%= pkg.licenseUrl %>',
        ' */',
        ''
    ].join('\n');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg : grunt.file.readJSON('package.json'),
    dirs: {
        build: '../bin',
        examples: '../examples/js',
        docs: '../docs',
        src: '../src/traviso',
        test: '../test'
    },
    files: {
        srcBlob: '<%= dirs.src %>/**/*.js',
        testBlob: '<%= dirs.test %>/**/*.js',
        // testConf: '<%= dirs.test %>/karma.conf.js',
        build: '<%= dirs.build %>/traviso.dev.js',
        buildMin: '<%= dirs.build %>/traviso.js'
    },
    
    // Task configuration.
    concat: {
        options: {
            banner: banner
        },
        dist: {
            src: srcFiles,
            dest: '<%= files.build %>'
        }
    },
    uglify: {
        options: {
            banner: banner
            // sourceMap: false,
            // sourceMapName: '../js/sourcemap.map',
            // drop_console: false,
            // beautify: false,
            // mangle: {toplevel: true},
            // squeeze: {dead_code: false}
        },
        dist: {
            src: '<%= files.build %>',
            dest: '<%= files.buildMin %>'
        }
    },
	copy: {
	  main: {
	  	files: [
	    	{ expand: true, cwd: '../src/pixi/', src: ['**'], dest: '<%= dirs.build %>/' },
	    	{ expand: true, cwd: '<%= dirs.build %>/', src: ['**'], dest: '<%= dirs.examples %>/' }
	    ]
	  },
	},
	jshint: {
        options: {
            jshintrc: './.jshintrc'
        },
        source: {
            src: srcFiles.concat('Gruntfile.js'),
            options: {
                ignores: '<%= dirs.src %>/**/{Header,Footer,Traviso}.js'
            }
        },
        test: {
            src: ['<%= files.testBlob %>'],
            options: {
                ignores: '<%= dirs.test %>/lib/resemble.js',
                jshintrc: undefined, //don't use jshintrc for tests
                expr: true,
                undef: false,
                camelcase: false
            }
        }
    },
    yuidoc: {
        compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.url %>',
            logo: '<%= pkg.logo %>',
            options: {
                paths: '<%= dirs.src %>',
                outdir: '<%= dirs.docs %>',
                themedir: 'yuidoc-theme-blue'
            }
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // tasks
  grunt.registerTask('default', ['build']);
  
  grunt.registerTask('build', ['concat', 'uglify', 'copy']);
  
  grunt.registerTask('build-hint', ['jshint:source', 'concat', 'uglify', 'copy']);
  
  grunt.registerTask('docs', ['yuidoc']);

};