
import 'paho-mqtt';

export class HomrDataService {
  constructor(messageCallback) {
    this.config = {
      clientid: "hmr1",
      statusprefix: "hmr/status/hmr1/",
      setprefix: "hmr/set/hmr1/",
      mqttHost: "r2d2",
      mqttPort: 9001
    };

    this.data = {
      defaults: {
          xs: 4,
          sm: 3,
          md: 2
      },
      views: {
          main: {
              title: "Main View",
              defaults: {
                  color: "#000000",
                  backcolor: "#c0c0c0",
              },
              rows: [
                {
                  title: "System",
                  cols:
                  [
                      {
                          id: "wartung",
                          text: "Wartung",
                          val: 0
                      },
                      {
                          id: "system",
                          text: "System",
                          val: 0
                      },
                      {
                          id: "c3",
                          text: "C3",
                          val: 0
                      },
                      {
                          id: "c4",
                          text: "C4",
                          val: 0
                      },
                      {
                          id: "c5",
                          text: "C5",
                          val: 0
                      },
                      {
                          id: "c6",
                          text: "C6",
                          val: 0
                      }
                  ]
                },
                {
                  title: "Fenster",
                  cols:
                  [
                      {
                          id: "fenster1",
                          text: "Fenster 1",
                          val: 0
                      },
                      {
                          id: "fenster2",
                          text: "Fenster 2",
                          val: 0
                      }
                  ]
                }
              ]
          },
          cam: {
              title: "Cam View",
              defaults: {
                  color: "#000000",
                  backcolor: "#808080",
              },
              rows: [
                {
                  title: "Kameras",
                  cols:
                  [
                      {
                          id: "cameingang",
                          text: "Cam Eingang",
                          val: 0,
                      },
                      {
                          id: "camterasse",
                          text: "Cam Terasse",
                          val: 0
                      }
                  ]
                }
              ]
          }
      }
    }

    this.onMessage = messageCallback;

  }

  mqttConnect() {
    var c = this.config;
    // Create a client instance
    /*global Paho*/
    /*eslint no-undef: "error"*/
    this.mqtt = new Paho.MQTT.Client(c.mqttHost, c.mqttPort, c.clientid);

    // sset callback handlers
    this.mqtt.onConnectionLost = (responseObject) => {
      console.log("ConnectionLost");
      if (responseObject.errorCode !== 0) {
        //console.log("response: " + responseObject.errorMessage);
      }
    };
    this.mqtt.onMessageArrived = (message) => {
      var topic = message.destinationName;
      console.log(topic);
      //console.log(message);
      if(message.payloadString !== "") {
        var data = JSON.parse(message.payloadString);
        this.onMessage(data, message.destinationName);
      }
    };

    // connect the client
    this.mqtt.connect({onSuccess: this.onConnect.bind(this)});
  }

  // called when the client connects
  onConnect() {
    var c = this.config;
    // Once a connection has been made, make a subscription and send a message.
    this.mqtt.subscribe(c.statusprefix + "#");
    console.log("mqtt connected");
    //message = new Paho.MQTT.Message("Hello");
    //message.destinationName = "/World";
    //client.send(message);
  }

  sendMessage(topic, msg) {
    var message = new Paho.MQTT.Message(JSON.stringify(msg));
    message.destinationName = topic;
    this.mqtt.send(message);
    console.log("Message sent to: " + topic);
  }


}
