'use strict';

// through2 is a thin wrapper around node transform streams
var through     = require('through2');
var gutil       = require('gulp-util');
var mson2json   = require('mson2json');
var path = require('path');
var PluginError = gutil.PluginError;

module.exports = function () {
  function replaceExtension(path) {
    return gutil.replaceExtension(path, '.md');
  }

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-coffee', 'Streaming not supported'));

    mson2json(file.path.toString(), function (json) {
      file.contents = new Buffer(json);
      file.path = replaceExtension(file.path);

      cb(null, file);
    });
  }

  return through.obj(transform);
}