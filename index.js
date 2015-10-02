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

  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-coffee', 'Streaming not supported'));

    var mson = new Buffer(file.contents);
    var self = this;

    mson2json(mson.toString(), function (json) {
      file.contents = new Buffer(json);
      file.path     = replaceExtension(file.path, '.md');

      self.push(file);
      cb(null, file);
    });
  }

  return through.obj(transform);
}