
import 'paho-mqtt';

export class HomrDataService {
  constructor(messageCallback, onConfigLoaded) {
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
      if(message.payloadString !== "") {
        var data = JSON.parse(message.payloadString);
        this.onMessage(data, message.destinationName);
      }
    };

    // connect the client
    this.mqtt.connect({ onSuccess: () => {
        this.onConnect(config.statusprefix);
      }
    });
  }

  // called when the client connects
  onConnect(prefix) {
    // Once a connection has been made, make a subscription and send a message.
    this.mqtt.subscribe(prefix + "#");
    console.log("mqtt connected");
  }

  sendMessage(topic, msg) {
    var message = new Paho.MQTT.Message(JSON.stringify(msg));
    message.destinationName = topic;
    this.mqtt.send(message);
    //console.log("Message sent to: " + topic);
  }


}
