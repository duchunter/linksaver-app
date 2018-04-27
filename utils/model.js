'use strict'

export { readFile, writeFile };

function handleError(err) {
  if (err.code == 1) {
    alert('Cannot open file: ' + JSON.stringify(err));
  } else {
    alert(err);
    alert(JSON.stringify(err));
  }
}

function writeFile(filename, content, msg = "Write file complete") {
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

function readFile(filename, outputObj) {
  window.resolveLocalFileSystemURL(
    cordova.file.externalDataDirectory,
    function (dir) {
      dir.getFile(
        filename,
        {},
        function (fileEntry) {
          fileEntry.file(function (file) {
            let reader = new FileReader();
            // Read complete callback
            reader.onloadend = function (e) {
              try {
                let pack = JSON.parse(this.result);
                alert('Import: ' + pack.length);
                if (filename == 'main.json') {
                  outputObj.mainLinks = pack;
                }

                if (filename == 'temp.json') {
                  outputObj.tempLinks = pack;
                }
              } catch (e) {
                alert(e);
              }
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
