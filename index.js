'use strict';

var through     = require('through2');
var gutil       = require('gulp-util');
var mson2json   = require('mson2json');
var path = require('path');
var PluginError = gutil.PluginError;

module.exports = function () {
  function replaceExtension(path, ext) {
    return gutil.replaceExtension(path, ext);
  }

  function transformFile(file, cb) {
    mson2json(file.path.toString(), function (json) {
      file.contents = new Buffer(json);
      file.path = replaceExtension(file.path, '.md');
      cb(); // this transforms but doesn't pass on to the next job
    });

    // cb(); // this fails to transform but passes on to next job succesffully
  }

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-coffee', 'Streaming not supported'));

    var self = this;

    transformFile(file, function() {
      self.push(file);
      cb(null, file);
    });
  }

  return through.obj(transform);
}