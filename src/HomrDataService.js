
import 'paho-mqtt';

export class HomrDataService {
  constructor() {
    this.confData = {
      viewConfigs: {
        mainView: {
          id: "main",
          title: "Main View",
          type: "status"
        },
        camView: {
          id: "cam",
          title: "Cam View",
          type: "status"
        },
        monitor: {
          title: "Monitor",
          type: "monitor"
        },
        config: {
          clientid: "homrreact",
          title: "Configuration",
          type: "config",
          mqttHost: "r2d2",
          mqttPort: 9001
        }
      }
    };
  }

  mqttConnect() {
    var c = this.confData.viewConfigs.config;
    // Create a client instance
    /*global Paho*/
    /*eslint no-undef: "error"*/
    this.mqtt = new Paho.MQTT.Client(c.mqttHost, c.mqttPort, c.clientid);

    // set callback handlers
    this.mqtt.onConnectionLost = (responseObject) => {
      console.log("ConnectionLost");
      if (responseObject.errorCode !== 0) {
        console.log("response: " + responseObject.errorMessage);
      }
    };
    this.mqtt.onMessageArrived = (message) => {
      console.log("onMessageArrived " + message.destinationName + ": " + message.payloadString);
    };

    // connect the client
    this.mqtt.connect({onSuccess: this.onConnect.bind(this)});
  }

  // called when the client connects
  onConnect() {
    var c = this.confData.viewConfigs.config;
    // Once a connection has been made, make a subscription and send a message.
    this.mqtt.subscribe("hmr/status/" + c.clientid + "/#");
    console.log("mqtt connected");
    //message = new Paho.MQTT.Message("Hello");
    //message.destinationName = "/World";
    //client.send(message);
  }

  getViewConfig(key) {
    return this.confData.viewConfigs[key];
  }

}
