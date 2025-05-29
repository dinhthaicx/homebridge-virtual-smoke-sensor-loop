let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerPlatform("homebridge-virtual-smoke-sensor-loop", "VirtualSmokeSensor", VirtualSmokeSensorPlatform);
};

class VirtualSmokeSensorPlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config || {};
    this.sensors = this.config.sensors || [];
    this.api = api;
    this.accessories = [];

    this.api.on('didFinishLaunching', () => {
      this.sensors.forEach(sensorConfig => {
        const accessory = new VirtualSmokeSensorAccessory(this.log, sensorConfig, this.api);
        this.accessories.push(accessory);
      });
    });
  }
}

class VirtualSmokeSensorAccessory {
  constructor(log, config, api) {
    this.log = log;
    this.name = config.name || "Virtual Smoke Sensor";
    this.fireOn = false;
    this.service = new Service.SmokeSensor(this.name);
    this.switchService = new Service.Switch(this.name + " Switch");

    this.service
      .getCharacteristic(Characteristic.SmokeDetected)
      .onGet(() => this.fireOn ? Characteristic.SmokeDetected.SMOKE_DETECTED : Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);

    this.switchService
      .getCharacteristic(Characteristic.On)
      .onSet(this.setOn.bind(this))
      .onGet(() => this.fireOn);

    this.timer = null;
  }

  setOn(value) {
    this.fireOn = value;
    if (value) {
      this.loopFire();
    } else {
      clearTimeout(this.timer);
    }
  }

  loopFire() {
    if (!this.fireOn) return;
    this.service
      .getCharacteristic(Characteristic.SmokeDetected)
      .updateValue(Characteristic.SmokeDetected.SMOKE_DETECTED);

    setTimeout(() => {
      this.service
        .getCharacteristic(Characteristic.SmokeDetected)
        .updateValue(Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);
    }, 1000);

    this.timer = setTimeout(() => {
      this.loopFire();
    }, 5000);
  }

  getServices() {
    return [this.service, this.switchService];
  }
}
