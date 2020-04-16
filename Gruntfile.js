/*global module:false*/
module.exports = function (grunt) {
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        // sourceMap: true,
      },
      dist: {
        files: [
          {
            expand: true,
            src: ['src/**/*.js'], //所有js文件
            dest: '.tmp_build/', //输出到此临时目录下
          },
        ],
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
        ignores: ['.tmp_build/src/base/*.js', '.tmp_build/src/parse/*.js'],
        jshintrc: '.jshintrc',
      },
      check: ['.tmp_build/**/*.js'],
    },

    // 临时目录清理
    clean: {
      files: ['.tmp_build'],
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

  // task list.
  grunt.registerTask('default', ['babel', 'jshint']);
  grunt.registerTask('build', ['babel', 'jshint', 'dependence:replace', 'concat:full', 'uglify:minimize', 'clean']);
};
