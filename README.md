# Welcome to HOMR-REACT

![MainView](Screen-MainView.png)

HOMR-REACT is a small html5 app that provides simple status displays and switches for **smart home applications**. It connects direct to a **MQTT** server to communicate with other home automation components, such as Homematic or Philipps Hue. Please have a look at the [mqtt-smarthome](https://github.com/mqtt-smarthome/mqtt-smarthome/) architecture from [Oliver Wagner](https://github.com/owagner) (✝ 2016) to get a idea how is works.

![HOMR-REACT on Nexus 7](photo-hmr-nexus7.jpg)

## Installation

Unzip the distribution in the web root of your web server.

If you use [mosquitto](https://mosquitto.org) as your mqtt server, you can use the build-in HTTP service.

## Security!

Be aware that HOMR-REACT is **ABSOLUTLY INSECURE** by design. You have to restrict the access by yourself. For example you can use basic authentication in your web server to deliver the app. It is strictly recommended to use some sort of VPN (like [OpenVPN](https://openvpn.net/)) to access the app from outside of your local network. **Don't use a simple port forward in your router**.

## Design goals

* Lightweight
* client only, no special server component required
* simulate real hardware components, like a bunch of push buttons with status LEDs talking direct with mqtt
* responsive design to make it easier to use it on different device sizes
* Open Source
* Platform independent, the only requirement should be a modern web browser
* no polling, just react on received messages

The app is inspired by the [Homestatus Android app](http://homestatus.de/) that I have used a couple of months.

## Configuration

![Config](Screen-Config.png)

At first you will see the **configuration view** when you open the app in your favorite web browser on a new device (desktop, smartphone or tablet or whatever). There is only one configuration parameter, the **'Configuration URL'**. The Configuration URL must return a JSON with the following structure (please remove the comments or use the file hmr-config-demo.json):

    {
      "config": {
        // Id/Name of the component
        "clientid": "hmr1",
        // topic prefix to receive message
        "statusprefix": "hmr1/status/",
        // topic prefix to send messages
        "setprefix": "hmr1/set/",
        // the mqtt host and port to connect
        "mqttHost": "<your hostname or IP>",
        "mqttPort": 9001
      },
      // you can have defaults for all status buttons
      "defaults": {
          // Configure the standard bootstrap grid system of 12 columns,
          // for responsive design
          // The number of columns you wish to span for Extra small devices Phones (<768px)
          "xs": 4,
          // The number of columns you wish to span for Small devices Tablets (≥768px)
          "sm": 3,
          // The number of columns you wish to span for Medium devices Desktops (≥992px)
          "md": 2,
          // The color to display, while waiting for the next message
          "waitingcolor": "grey"
      },
      // The views to display
      // Every member here produces an menu entry to display the view
      "views": {
          "main": {
              "title": "Main View",
              // Defaults for the hole view
              "defaults": {
                  // Colors: for- and background
                  "color": "#000000",
                  "backcolor": "#c0c0c0"
              },
              // Every row in a view is displayed in a collapsable Bootstrap panel
              "rows": [
              {
                // Defaults for the row
                "defaults": {
                    // Color for val > 0
                    "oncolor": "orange",
                    // Color for val == 0
                    "offcolor": "#c0c0c0",
                    // Override Grid configuration
                    "xs": 2,
                    "sm": 2,
                    "md": 1
                },
                // Title for the row panel
                "title": "Alarm",
                // The columns of the row
                // Each entry represents a 'StatusButton', that can receive and send messages
                // and displays a text. For- and background color can be controlled via messages
                // A StatusButton can display a image from a surveillance camera for example and
                // update it in a changeable interval.
                "cols":
                [
                    {
                        // The id must be unique per view
                        // It is used to build the topics to control the status and send messages, for example:
                        // status: hmr1/status/main/outdoor-monitor
                        // send: hmr1/set/main/outdoor-monitor
                        // The status topic should be published retained to keep it between restarts.
                        // You need to publish a JSON structure to the status topic to change the
                        // the StatusButton state (for example { "val": 1, "backcolor": "red" })
                        //
                        // The send topic is used on a button click or touch. On such an event the
                        // complete JSON structure of the StatusButton is published.
                        // This is a difference to the mqtt-smarthome architecture.
                        //
                        // The Button has an on/off semantic, that means, that the val property is
                        // automaticly negated on each click (val = val > 0 ? 0 : 1)
                        "id": "outdoor-monitor",
                        // The initial text to display
                        "text": "Outdoor",
                        // The initial value
                        "val": 0
                    },
                    {
                        "id": "alarm-status",
                        "text": "ALARM",
                        // The default text when val == 0
                        "offtext": "KEIN ALARM",
                        "val": 0,
                        "xs": 10,
                        "sm": 10,
                        "md": 11,
                        // The default color, when val > 0
                        "oncolor": "red",
                        // The button is not clickable
                        "readonly": 1
                    }
                ]
              },
              // Next row
              {
                "title": "Windows",
                "cols":
                [
                    {
                        "id": "open-windows",
                        "text": "Windows",
                        "val": 0,
                        "oncolor": "cyan",
                        "offcolor": "#c0c0c0",
                        // override
                        "xs": 12,
                        "sm": 12,
                        "md": 12,
                        "readonly": 1,
                        // Default text when val == 0
                        "offtext": "All closed"
                    }
                ]
              }
            ]
          },
          // Second view for camera images
          "cam": {
              "title": "Cam View",
              "defaults": {
                  "color": "#000000",
                  "backcolor": "#808080",
                  "xs": 12,
                  "sm": 12,
                  "md": 6
              },
              "rows": [
              {
                "title": "Cameras",
                "cols":
                [
                  {
                      "id": "cam-entrance",
                      "text": "Cam entrance",
                      // Rerender time interval in ms
                      "interval": 2000,
                      "val": 0,
                      // URL to fetch the image
                      "imgurl": "http://<web-cam-ip>/path/to/image.jpg"
                  },
                  {
                      "id": "cam-garden",
                      "text": "Cam garden",
                      "interval": 2000,
                      "val": 0,
                      "imgurl": "http://<web-cam-ip>/path/to/image.jpg"
                  }
                ]
              }
            ]
          }
       }
    }

You can use the **same configuration on different devices**. Or you can provided special configurations for different devices sizes or use cases.

When you hit the **save button**, the configuration URL will be saved in local storage of the web browser on your device. From now on you will see the first configured view, when you start the app on this device.

It is even possible to generate the configuration **dynamically**. For example: I use almost the same configuration for my tablets in the local WLAN and over low bandwidth/VPN connections on my smartphone. But I don't want to display webcam images on my main view. There is an URL parameter (lean=1) to control this configuration difference. Btw the hole configuration is delivered by a [Node Red](https://nodered.org) http-in node, a very simple way to provide a webservice.

![MainView](Screen-CamView.png)

## Monitoring

Actually there is a monitoring view in the app to see what is happening on the mqtt bus. But this should be separated in an other app.

## To Do

* Num block to perform security relevant tasks e.g. to turn off an alarm.
* Icons.
* Remove the monitoring view and create an separate monitoring app.
* Charts to visualize historical data.
* Support http basic authentication to fetch the configuration.

## Some further ideas

* A cooler design, may be like Windows Metro
* A cordova wrapper app to put in the app stores
* Other controls like sliders, switches etc.
* Switch the current view with messages
* Play audio files
* Support authentication for mqtt.

## Interesting Links

* [Node Red](https://nodered.org/) - Visual development of smart home logic.

It is possible to use any progamming language or framework to implement the smarthome logic to feed yout mqtt broker of your choice. [logic4mqtt](https://github.com/owagner/logic4mqtt) is such a framework. I prefer Node Red that is using a mix of visual components an JavaScript code.

![NodeRed](Screen-NodeRed.png)

* [mqtt-smarthome Software](https://github.com/mqtt-smarthome/mqtt-smarthome/blob/master/Software.md) - Many mqtt bindings and more
* [awesome-mqtt](https://github.com/hobbyquaker/awesome-mqtt) - All about mqtt
* [mosquitto](https://mosquitto.org) - MQTT Broker
* [hm2mqtt](https://github.com/owagner/hm2mqtt) - Homematic MQTT integration
* [CouchDB](http://couchdb.apache.org) - Archiving messages
* [Telegram](https://telegram.org) - Push Notifications via Telegram Bot API

## Development

You need [Node.js](https://nodejs.org) to develop and build the software.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You will find some information on how to perform common tasks  [here](https://github.com/facebookincubator/create-react-app/blob/master/template/README.md).

### Commands

To start the development mode use:

    npm start

To build the destribution use:

    npm run build

### Libraries

* [React](https://facebook.github.io/react/) - UI development
* [React-Bootstrap](https://react-bootstrap.github.io/) - The most popular front-end framework, rebuilt for React
* [Eclipse Paho JavaScript Client](https://eclipse.org/paho/clients/js/)
* [dateformat](https://www.npmjs.com/package/dateformat)

## BSD-like-licence

HOMR-REACT is open source, please have look at the LICENCE file.
