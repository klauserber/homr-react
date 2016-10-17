
import 'paho-mqtt';

export class HomrDataService {
  constructor(messageCallback) {
    this.config = {
      clientid: "hmr1",
      statusprefix: "hmr1/status/",
      setprefix: "hmr1/set/",
      mqttHost: "r2d2",
      mqttPort: 9001
    };

    this.uniqueClientid = this.config.clientid + "-" + new Date().getTime();

    this.data = {
      defaults: {
          xs: 4,
          sm: 3,
          md: 2,
          waitingcolor: "grey"
      },
      views: {
          main: {
              title: "Main View",
              defaults: {
                  color: "#000000",
                  backcolor: "#c0c0c0"
              },
              rows: [
                {
                  defaults: {
                      oncolor: "orange",
                      offcolor: "#c0c0c0",
                      xs: 2,
                      sm: 2,
                      md: 1,
                  },
                  title: "Alarm",
                  cols:
                  [
                      {
                          id: "var-aussen-ueberwachung",
                          text: "Außen Überw.",
                          val: 0,
                          xs: 4,
                          sm: 3,
                          md: 2
                      },
                      {
                          id: "var-alarm-status",
                          text: "ALARM",
                          offtext: "KEIN ALARM",
                          val: 0,
                          xs: 8,
                          sm: 9,
                          md: 10,
                          oncolor: "red",
                          readonly: 1
                      },
                      {
                          id: "var-alarm-aussen",
                          text: "Außen",
                          val: 0
                      },
                      {
                          id: "var-alarm-innen",
                          text: "Innen",
                          val: 0
                      },
                      {
                          id: "var-alarm-timo-zimmer",
                          text: "Timo",
                          val: 0
                      },
                      {
                          id: "var-alarm-ole-zimmer",
                          text: "Ole",
                          val: 0
                      },
                      {
                          id: "var-alarm-malzimmer",
                          text: "Malzm.",
                          val: 0
                      },
                      {
                          id: "var-alarm-schlafzimmer",
                          text: "Schlaf.",
                          val: 0
                      },
                  ]
                },
                {
                  title: "Fenster",
                  cols:
                  [
                      {
                          id: "fenster-auf",
                          text: "Fenster",
                          val: 0,
                          oncolor: "cyan",
                          offcolor: "#c0c0c0",
                          xs: 12,
                          sm: 12,
                          md: 12,
                          readonly: 1,
                          offtext: "Alle zu"
                      }
                  ]
                },
                {
                  defaults: {
                      oncolor: "red",
                      offcolor: "green",
                  },
                  title: "System / Zisterne",
                  cols:
                  [
                      {
                          id: "var-alarm-wartung",
                          text: "Wartung",
                          ontext: "Wartung an",
                          offtext: "Wartung aus",
                          val: 0
                      },
                      {
                          id: "Servicemeldungen",
                          text: "Servicemeld.:",
                          readonly: 1,
                          val: 0
                      },
                      {
                          id: "zisterne",
                          text: "Zisterne",
                          readonly: 1,
                          val: 0
                      }
                  ]
                },
                {
                  defaults: {
                      oncolor: "yellow",
                      offcolor: "#c0c0c0",
                      xs: 2,
                      sm: 2,
                      md: 1
                  },
                  title: "Licht",
                  cols:
                  [
                      {
                          id: "sc-flur-oben-licht-1",
                          text: "Flur oben",
                          val: 0
                      },
                      {
                          id: "sc-flur-unten-licht-1",
                          text: "Flur unten",
                          val: 0
                      },
                      {
                          id: "sc-flur-unten-eingang-licht-1",
                          text: "Ein- gang",
                          val: 0
                      },
                      {
                          id: "sc-aussenfluter-1",
                          text: "Fluter Außen",
                          val: 0
                      },
                      {
                          id: "sc-aussen-steckdosen-1",
                          text: "Außen Steckd.",
                          interval: 1000,
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
                          interval: 1000,
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
    this.mqtt = new Paho.MQTT.Client(c.mqttHost, c.mqttPort, this.uniqueClientid);

    // sset callback handlers
    this.mqtt.onConnectionLost = (responseObject) => {
      console.log("ConnectionLost");
      if (responseObject.errorCode !== 0) {
        console.log("response: " + responseObject.errorMessage);
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
  }

  sendMessage(topic, msg) {
    var message = new Paho.MQTT.Message(JSON.stringify(msg));
    message.destinationName = topic;
    this.mqtt.send(message);
    console.log("Message sent to: " + topic);
  }


}
