'use strict';

var log = require('db-migrate-shared').log;

function loadConfig (config, internals) {
  console.log('loadConfig config', config);
  console.log('loadConfig internals', internals);
  var out;
  var currentEnv = internals.currentEnv || internals.argv.env;
  console.log('currentEnv', currentEnv);

  if (internals.configObject) {
    out = config.loadObject(internals.configObject, currentEnv);
  } else {
    out = config.loadFile(internals.argv.config, currentEnv, internals.plugins);
  }
  if (internals.verbose) {
    var current = out.getCurrent();
    var s = JSON.parse(JSON.stringify(current.settings));

    if (s.password) s.password = '******';

    log.info('Using', current.env, 'settings:', s);
  }

  return out;
}

module.exports = loadConfig;
