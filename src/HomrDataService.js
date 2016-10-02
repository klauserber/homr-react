import { Paho } from 'paho-mqtt';

export class HomrDataService {
  constructor() {
    this.confData = {
      viewConfigs: {
        mainView: {
          title: "Main View",
          type: "status"
        },
        camView: {
          title: "Cam View",
          type: "status"
        },
        monitor: {
          title: "Monitor",
          type: "monitor"
        },
        config: {
          title: "Configuration",
          type: "config",
          mqttHost: "r2d2:1883"
        }
      }
    };
  }

  getViewConfig(key) {
    return this.confData.viewConfigs[key];
  }

}
