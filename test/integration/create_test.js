var Code = require('code');
var Lab = require('lab');
var lab = (exports.lab = Lab.script());
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var dbmUtil = require('db-migrate-shared').util;

var rmdir = require('rimraf');

function wipeMigrations (callback) {
  var dir = path.join(__dirname, 'migrations');
  rmdir(dir, callback);
}

function dbMigrate () {
  var args = dbmUtil.toArray(arguments);
  var dbm = path.join(__dirname, '..', '..', 'bin', 'db-migrate');
  args.unshift(dbm);
  return cp.spawn('node', args, { cwd: __dirname });
}

lab.experiment('create', function () {
  lab.experiment('without a migration directory', function () {
    var exitCode;

    lab.before(function (done) {
      wipeMigrations(function (err) {
        Code.expect(err).to.be.null();
        dbMigrate('create', 'first migration').on('exit', function (code) {
          exitCode = code;
          done();
        });
      });
    });

    lab.test('does not cause an error', function (done) {
      Code.expect(exitCode).to.equal(0);
      done();
    });

    lab.test('will create a new migration directory', function (done) {
      var stats = fs.statSync(path.join(__dirname, 'migrations'));
      Code.expect(stats.isDirectory()).to.be.true();
      done();
    });

    lab.test('will create a new migration', function (done) {
      var files = fs.readdirSync(path.join(__dirname, 'migrations'));
      Code.expect(files.length).to.equal(1);
      var file = files[0];
      Code.expect(file).to.match(/first-migration\.js$/);
      done();
    });
  });

  lab.experiment(
    'with sql-file option set to true from config file',
    function () {
      var exitCode;

      lab.before(function (done) {
        var configOption = path.join(
          '--config=',
          __dirname,
          'database_with_sql_file.json'
        );

        wipeMigrations(function (err) {
          Code.expect(err).to.not.exist();
          dbMigrate('create', 'second migration', configOption).on(
            'exit',
            function (code) {
              exitCode = code;
              done();
            }
          );
        });
      });

      lab.test('does not cause an error', function (done) {
        Code.expect(exitCode).to.equal(0);
        done();
      });

      lab.test('will create a new migration', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var stats = fs.statSync(path.join(__dirname, 'migrations', file));
          if (stats.isFile()) { Code.expect(file).to.match(/second-migration\.js$/); }
        }

        done();
      });

      lab.test('will create a new migration/sqls directory', function (done) {
        var stats = fs.statSync(path.join(__dirname, 'migrations/sqls'));
        Code.expect(stats.isDirectory()).to.be.true();
        done();
      });

      lab.test('will create a new migration sql up file', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations/sqls'));
        Code.expect(files.length).to.equal(2);
        var file = files[1];
        Code.expect(file).to.match(/second-migration-up\.sql$/);
        done();
      });
    }
  );

  lab.experiment(
    'with sql-file option set to true as a command parameter',
    function () {
      var exitCode;

      lab.before(function (done) {
        var configOption = path.join('--sql-file');
        wipeMigrations(function (err) {
          Code.expect(err).to.not.exist();
          dbMigrate('create', 'third migration', configOption).on(
            'exit',
            function (code) {
              exitCode = code;
              done();
            }
          );
        });
      });

      lab.test('does not cause an error', function (done) {
        Code.expect(exitCode).to.equal(0);
        done();
      });

      lab.test('will create a new migration', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var stats = fs.statSync(path.join(__dirname, 'migrations', file));
          if (stats.isFile()) { Code.expect(file).to.match(/third-migration\.js$/); }
        }
        done();
      });

      lab.test('will create a new migration/sqls directory', function (done) {
        var stats = fs.statSync(path.join(__dirname, 'migrations/sqls'));
        Code.expect(stats.isDirectory()).to.be.true();
        done();
      });

      lab.test('will create a new migration sql up file', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations/sqls'));
        Code.expect(files.length).to.equal(2);
        var file = files[1];
        Code.expect(file).to.match(/third-migration-up\.sql$/);
        done();
      });
    }
  );

  lab.experiment(
    'with coffee-file option set to true from config file',
    function () {
      var exitCode;

      lab.before(function (done) {
        var configOption = path.join(
          '--config=',
          __dirname,
          'database_with_coffee_file.json'
        );

        wipeMigrations(function (err) {
          Code.expect(err).to.not.exist();
          dbMigrate('create', 'fourth migration', configOption).on(
            'exit',
            function (code) {
              exitCode = code;
              done();
            }
          );
        });
      });

      lab.test('does not cause an error', function (done) {
        Code.expect(exitCode).to.equal(0);
        done();
      });

      lab.test('will create a new coffeescript migration', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var stats = fs.statSync(path.join(__dirname, 'migrations', file));
          if (stats.isFile()) {
            Code.expect(file).to.match(/fourth-migration\.coffee$/);
          }
        }

        done();
      });
    }
  );

  lab.experiment(
    'with coffee-file option set to true as a command parameter',
    function () {
      var exitCode;

      lab.before(function (done) {
        var configOption = path.join('--coffee-file');
        wipeMigrations(function (err) {
          Code.expect(err).to.not.exist();
          dbMigrate('create', 'fifth migration', configOption).on(
            'exit',
            function (code) {
              exitCode = code;
              done();
            }
          );
        });
      });

      lab.test('does not cause an error', function (done) {
        Code.expect(exitCode).to.equal(0);
        done();
      });

      lab.test('will create a new coffeescript migration', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var stats = fs.statSync(path.join(__dirname, 'migrations', file));
          if (stats.isFile()) {
            Code.expect(file).to.match(/fifth-migration\.coffee$/);
          }
        }
        done();
      });
    }
  );

  lab.experiment(
    'with sql-file and a bad migration, causes an exit',
    function () {
      var exitCode;

      lab.before(function (done) {
        var configOption = path.join('--sql-file');
        wipeMigrations(function (err) {
          Code.expect(err).to.not.exist();
          dbMigrate('create', 'sixth migration', configOption).on(
            'exit',
            function () {
              var files = fs.readdirSync(path.join(__dirname, 'migrations'));

              for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var stats = fs.statSync(
                  path.join(__dirname, 'migrations', file)
                );

                if (stats.isFile() && file.match(/sixth-migration\.js$/)) {
                  fs.writeFileSync(
                    path.join(__dirname, 'migrations', file),
                    'asdfghij;'
                  );
                  dbMigrate('up').on('exit', function (code) {
                    exitCode = code;
                    done();
                  });
                }
              }
            }
          );
        });
      });

      lab.test('does cause an error', function (done) {
        Code.expect(exitCode).to.equal(1);
        done();
      });

      lab.test('did create the new migration', function (done) {
        var files = fs.readdirSync(path.join(__dirname, 'migrations'));

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var stats = fs.statSync(path.join(__dirname, 'migrations', file));
          if (stats.isFile()) { Code.expect(file).to.match(/sixth-migration\.js$/); }
        }

        done();
      });

      lab.after(function (done) {
        cp.exec('rm -r ' + path.join(__dirname, 'migrations'), done);
      });
    }
  );
});
