/*global module:false*/
module.exports = function (grunt) {
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // npm模块处理
    browserify: {
      dist: {
        files: {
          'dist/npmBundle.js': ['dev-lib/npmEntry.js'],
        },
      },
    },
    copy: {
      image: {
        files: [
          {
            expand: true,
            src: [
              'assets/images/**/*.{png,jpg,jpeg,gif,svg}',
              'assets/images/*.{png,jpg,jpeg,gif,svg}',
              'resource/*'
            ],
            dest: 'dist/',
          },
        ],
      },
      lib: {
        files: [
          {
            expand: true,
            cwd: 'lib/',
            src: ['*.js'],
            dest: 'dist/',
          },
        ],
      },
    },

    babel: {
      dev: {
        options: {
          sourceMap: true,
        },
        files: [
          {
            expand: true,
            src: ['src/**/*.js'], //所有js文件
            dest: '.tmp_build/', //输出到此临时目录下
          },
        ],
      },
      prod: {
        options: {
          // sourceMap: true,
        },
        files: [
          {
            expand: true,
            src: ['src/**/*.js'], //所有js文件
            dest: '.tmp_build/', //输出到此临时目录下
          },
        ],
      },
    },

    less: {
      compile: {
        files: [
          {
            expand: true,
            src: ['assets/styles/**/*.less'],
            dest: 'dist/',
            ext: '.css',
          },
        ],
      },
    },
    cssmin: {
      options: {
        stripBanners: true, //合并时允许输出头部信息
        banner:
          '/*!<%= pkg.file %> - <%= pkg.version %>-' +
          '<%=grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        src: 'dist/assets/styles/**/*.css', //压缩
        dest: 'dist/assets/styles/theme/index.min.css', //dest 是目的地输出
      },
    },

    // 最终代码合并
    concat: {
      full: {
        options: {
          banner:
            '/*!\n' +
            ' * ====================================================\n' +
            ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * GitHub: <%= pkg.repository.url %> \n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
            ' * ====================================================\n' +
            ' */\n\n' +
            '(function () {\n',

          footer: '})();',
        },

        dest: 'dist/' + getFileName(),
        src: ['.tmp_build/kf.tmp.js', 'dev-lib/exports.js'],
      },
    },

    // 压缩
    uglify: {
      options: {
        banner:
          '/*!\n' +
          ' * ====================================================\n' +
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * GitHub: <%= pkg.repository.url %> \n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
          ' * ====================================================\n' +
          ' */\n',

        beautify: {
          ascii_only: true,
        },
      },

      minimize: {
        dest: 'dist/' + getFileName(true),
        src: 'dist/' + getFileName(),
      },
    },

    // 模块依赖合并
    dependence: {
      replace: {
        options: {
          base: '.tmp_build/src',
          entrance: 'kf.start',
        },

        files: [
          {
            src: ['.tmp_build/**/*.js', 'dev-lib/start.js'],
            dest: '.tmp_build/kf.tmp.js',
          },
        ],
      },
    },

    // hint检查
    jshint: {
      options: {
        ignores: [
          '.tmp_build/src/base/*.js',
          '.tmp_build/src/parse/*.js',
          '.tmp_build/src/ui/ui-impl/**/*.js',
        ],
        jshintrc: '.jshintrc',
      },
      check: ['.tmp_build/**/*.js'],
    },

    // 临时目录清理
    clean: {
      temp: {
        src: ['.tmp_build'],
      },
      dist: {
        src: ['dist'],
      },
    },
  });

  function getFileName(isMin) {
    var pkg = grunt.file.readJSON('package.json');

    return (
      pkg.name.replace(/[A-Z]/g, function (match, index) {
        if (index === 0) {
          return match.toLowerCase();
        } else {
          return '-' + match.toLowerCase();
        }
      }) + (isMin ? '.all.min.js' : '.all.js')
    );
  }

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-module-dependence');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');

  // task list.
  grunt.registerTask('default', ['browserify', 'copy', 'less', 'cssmin']);
  grunt.registerTask('build', [
    'browserify',
    'copy',
    'less',
    'cssmin',
    'babel',
    'jshint',
    'dependence:replace',
    'concat:full',
    'uglify:minimize',
    'clean:temp',
  ]);
};
