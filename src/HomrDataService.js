
import 'paho-mqtt';

export class HomrDataService {
  constructor(messageCallback) {
    this.onMessage = messageCallback;
  }

  loadConfig(configUrl) {
      return new Promise((resolve, reject) => {
        console.log("fetch now");
        fetch(configUrl).then(response => response.json())
          .then((json) => {
            resolve(json);
          }
        ).catch((err) => {
          reject(err);
        });
      });
  }


  mqttConnect(config) {
    var uniqueClientid = config.clientid + "-" + new Date().getTime();
    // Create a client instance
    /*global Paho*/
    /*eslint no-undef: "error"*/
    this.mqtt = new Paho.MQTT.Client(config.mqttHost, config.mqttPort, uniqueClientid);

    // set callback handlers
    this.mqtt.onConnectionLost = (responseObject) => {
      console.log("ConnectionLost");
      if (responseObject.errorCode !== 0) {
        console.log("response: " + responseObject.errorMessage);
      }
    };
    this.mqtt.onMessageArrived = (message) => {
      //var topic = message.destinationName;
      //console.log(topic);
      //console.log(message);

      var payload = message.payloadString;
      if(message.payloadString !== "") {
        var data;
        try {
          data = JSON.parse(message.payloadString);
        }
        catch(err) {
          data = payload;
        }
        this.onMessage(data, message.destinationName);
      }
    };

    // connect the client
    this.mqtt.connect({ onSuccess: () => {
        // Once a connection has been made, make a subscription and send a message.
        this.mqtt.subscribe("#");
        console.log("mqtt connected");
        this.sendRawMessage(config.clientid + "/connected", "1");
      }
    });
  }

  sendMessage(topic, msg, retained) {
    this.sendRawMessage(topic, JSON.stringify(msg), retained);
  }

  sendRawMessage(topic, msgString, retained) {
    var message = new Paho.MQTT.Message(msgString);
    message.destinationName = topic;
    message.retained = (retained === true);
    this.mqtt.send(message);
  }

  removeMessage(topic) {
    this.sendRawMessage(topic, "", true);
  }


}
