'use strict'

export { readFile, writeFile };

function writeFile(filename, content) {
  return new Promise((resolve, reject) => {
    // Use this to handle all error callback
    let handleError = function (err) {
      reject(err.code == 1 ? `Cannot openfile: ${err}` : err);
    }
    // Access local file system and write file
    // Use arrow function here cause no need to use 'this'
    try {
      window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory,
        dir => {
          dir.getFile(filename, { create: true }, fileEntry => {
            fileEntry.createWriter(fileWriter => {
              // Write complete callback
              fileWriter.onwriteend = e => {
                resolve(`Write to ${filename} complete`);
              }
              // Handle error callback
              fileWriter.onerror = handleError;

              // Write file
              let blob = new Blob([content], {type: 'text/plain'});
              fileWriter.write(blob);

              // Put 3 error callback for 3 functions :v
            }, handleError);
          }, handleError);
        }, handleError);
    } catch (err) {
      handleError(err);
    }
  });
}

function readFile(filename) {
  return new Promise((resolve, reject) => {
    // Use this to handle all error callback
    let handleError = function (err) {
      reject(err.code == 1 ? `Cannot openfile: ${err}` : err);
    }
    // Access local file system and read file
    // Use 'function' instead of arrow function to avoid auto binding 'this'
    try {
      window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory,
        function (dir) {
          dir.getFile(filename, {}, function (fileEntry) {
            fileEntry.file(function (file) {
              let reader = new FileReader();

              // Read complete callback
              reader.onloadend = function (e) {
                resolve(JSON.parse(this.result));
              }
              // Read file
              reader.readAsText(file);

              // Put 3 error callback for 3 functions :v
            }, handleError);
          }, handleError);
      }, handleError);
    } catch (err) {
      handleError(err);
    }
  });
}
