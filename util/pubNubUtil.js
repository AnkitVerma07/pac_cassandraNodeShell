/**
 * Created by Ankit Verma on 06/18/17.
 */
var PubNub = require('pubnub');
const Promise = require('bluebird');

const pubNubUtil = function(constants) {

  const self = this;

  var pubnub = new PubNub({
    subscribeKey: constants.PUBNUB_KEYS.subscribeKey,
    publishKey: constants.PUBNUB_KEYS.publishKey,
    secretKey: constants.PUBNUB_KEYS.secretKey,
    ssl: true
  });


  self.publishChannel = function(myChannel, messageObj){
    let data = {
      message: messageObj,
      channel: myChannel,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        "cool": "meta"
      }   // publish extra meta with the request
    };
    return new Promise( function(resolve, reject){
      return pubnub.publish(data, function (status, response) {
          if (status.error) {
            return reject(status.error);
          }
          return resolve(response.timetoken);
        }
      );
    });

  };

  self.pushNotification = (pushObj) => {
    let pushPayload = {
      pn_apns: {
        aps : {
          alert: {
            title: pushObj.title,
            body: pushObj.body,
            'action-loc-key': pushObj.action
          },
          badge: pushObj.badge,
          sound: 'default'
        },
        type: pushObj.pushType,
        data: pushObj.customData,
      },
    };
    return pubnub.publish({ message: pushPayload, channel: pushObj.channelKey}).then( (res)=> {
      return res;
    });
  };


  return self;
};

pubNubUtil.$inject = ['constants'];

module.exports = pubNubUtil;


