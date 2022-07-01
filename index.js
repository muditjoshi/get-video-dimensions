
var exec = require('mz/child_process').execFile;
var assert = require('assert');

module.exports = function (filename) {
  return exec('ffprobe', [
    '-v', 'error',
    '-of', 'flat=s=_',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=height,width:side_data=rotation',
    '-of', 'default=nw=1:nk=1',
    filename
  ]).then(function (out) {
    let stdout = out[0].toString('utf8');
    stdout = stdout.split('\n');
    let width = parseInt(stdout[0]);
    let height = parseInt(stdout[1]);
    let rotation = parseInt(stdout[2]);
    assert(width && height, 'No dimensions found!');
    if (rotation && rotation%90===0 && rotation%180===0){
      [width, height] = [height, width];
    }
    return {
      width: width,
      height: height,
    };
  });
}
