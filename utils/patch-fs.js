// utils/patch-fs.js
import fs from 'fs';

// Define the default (read-only) cache path and the writable path.
const defaultCachePrefix = '/var/task/node_modules/@xenova/transformers/.cache';
const writableCachePrefix = '/tmp/xenova-cache';

// Helper: Redirect a given path if it starts with the default cache prefix.
function redirectPath(path) {
  if (typeof path === 'string' && path.startsWith(defaultCachePrefix)) {
    const newPath = path.replace(defaultCachePrefix, writableCachePrefix);
    console.log(`Redirecting path from ${path} to ${newPath}`);
    return newPath;
  }
  return path;
}

// Patch fs.mkdir and fs.mkdirSync
const originalMkdir = fs.mkdir;
fs.mkdir = function(path, options, callback) {
  const newPath = redirectPath(path);
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return originalMkdir.call(fs, newPath, options, callback);
};

const originalMkdirSync = fs.mkdirSync;
fs.mkdirSync = function(path, options) {
  return originalMkdirSync.call(fs, redirectPath(path), options);
};

// Patch fs.open and fs.openSync
const originalOpen = fs.open;
fs.open = function(path, flags, mode, callback) {
  const newPath = redirectPath(path);
  if (typeof mode === 'function') {
    callback = mode;
    mode = undefined;
  }
  return originalOpen.call(fs, newPath, flags, mode, callback);
};

const originalOpenSync = fs.openSync;
fs.openSync = function(path, flags, mode) {
  return originalOpenSync.call(fs, redirectPath(path), flags, mode);
};

// Patch fs.writeFile and fs.writeFileSync
const originalWriteFile = fs.writeFile;
fs.writeFile = function(path, data, options, callback) {
  const newPath = redirectPath(path);
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return originalWriteFile.call(fs, newPath, data, options, callback);
};

const originalWriteFileSync = fs.writeFileSync;
fs.writeFileSync = function(path, data, options) {
  return originalWriteFileSync.call(fs, redirectPath(path), data, options);
};

// Optionally, patch fs.createWriteStream
const originalCreateWriteStream = fs.createWriteStream;
fs.createWriteStream = function(path, options) {
  return originalCreateWriteStream.call(fs, redirectPath(path), options);
};

// Ensure the base writable cache directory exists
if (!fs.existsSync(writableCachePrefix)) {
  fs.mkdirSync(writableCachePrefix, { recursive: true });
}
