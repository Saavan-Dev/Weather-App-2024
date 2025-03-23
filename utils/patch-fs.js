// utils/patch-fs.js
import fs from 'fs';

// Save original references
const originalMkdir = fs.mkdir;
const originalPromiseMkdir = fs.promises?.mkdir;

// Patch fs.mkdir
fs.mkdir = function (dir, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  // If the path is the default cache folder, redirect to /tmp
  if (dir.startsWith('/var/task/node_modules/@xenova/transformers/.cache')) {
    const newDir = dir.replace('/var/task/node_modules/@xenova/transformers/.cache', '/tmp/xenova-cache');
    console.log(`Redirecting mkdir from ${dir} to ${newDir}`);
    return originalMkdir.call(fs, newDir, options, callback);
  }
  return originalMkdir.call(fs, dir, options, callback);
};

// Patch fs.promises.mkdir
if (originalPromiseMkdir) {
  fs.promises.mkdir = async function (dir, options) {
    if (dir.startsWith('/var/task/node_modules/@xenova/transformers/.cache')) {
      const newDir = dir.replace('/var/task/node_modules/@xenova/transformers/.cache', '/tmp/xenova-cache');
      console.log(`Redirecting mkdir from ${dir} to ${newDir}`);
      return originalPromiseMkdir.call(fs.promises, newDir, options);
    }
    return originalPromiseMkdir.call(fs.promises, dir, options);
  };
}
