var request = require('request');

function createRequest(username) {
  return new Promise(function(resolve, reject) {
    request({url: 'https://nightfirec.at/realmeye-api/?player=' + username, json: true}, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
}

module.exports.player = async function(username) {
  let player = await createRequest(username).catch(function(err) {
    log.error(err);
  });

  var returnData = {};

  try {
    returnData.exists = (typeof(player.error) != undefined);
    returnData.username = player.player;
    returnData.fame = player.fame;
    returnData.charCount = player.characters.length;
    returnData.stars = player.rank;
  } catch {
    return null;
  }

  

  return returnData;
}