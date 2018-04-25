'use strict'

export { readFile, writeFile };

function handleError(err) {
  alert(JSON.stringify(err));
}

function writeFile(filename, content, msg = "Write complete") {
  window.resolveLocalFileSystemURL(
    cordova.file.externalDataDirectory,
    dir => {
      dir.getFile(
        filename,
        { create: true },
        fileEntry => {
          fileEntry.createWriter(fileWriter => {
            // Write complete callback
            fileWriter.onwriteend = e => {
              alert(msg);
            }

            // Handle error callback
            fileWriter.onerror = handleError;

            // Write file
            let blob = new Blob([content], {type: 'text/plain'});
            fileWriter.write(blob);
          }, handleError);
        },
        handleError
      );
    },
    handleError
  );
}

function readFile(filename, outputArr) {
  window.resolveLocalFileSystemURL(
    cordova.file.externalDataDirectory,
    dir => {
      dir.getFile(
        filename,
        {},
        fileEntry => {
          fileEntry.file(file => {
            let reader = new FileReader();
            // Read complete callback
            reader.onloadend = e => {
              outputArr = JSON.parse(this.result);
            }

            // Read file
            reader.readAsText(file);
          }, handleError);
        },
        handleError
      );
    },
    handleError
  );
}
