import { API, HAP, Logging, AccessoryConfig, Service, Characteristic } from 'homebridge';
import mqtt, { Client } from 'mqtt';

let hap: HAP;

export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('MQTTLocker', MQTTLocker);
};

class MQTTLocker {
  private readonly log: Logging;
  private readonly config: AccessoryConfig;
  private readonly api: API;
  private readonly Service;
  private readonly Characteristic;

  private readonly currentStateCharacteristic: Characteristic;
  private readonly targetStateCharacteristic: Characteristic;
  private readonly informationService: Service;
  private readonly service: Service;

  private readonly client: Client;
  private status = true;

  /**
   * REQUIRED - This is the entry point to your plugin
   */
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.service = new hap.Service.LockMechanism(config.name);

    // create handlers for required characteristics
    this.currentStateCharacteristic = this.service.getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(this.handleLockCurrentStateGet.bind(this));

    this.targetStateCharacteristic = this.service.getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(this.handleLockTargetStateGet.bind(this))
      .onSet(this.handleLockTargetStateSet.bind(this));

    this.informationService = new this.Service.AccessoryInformation()
      .setCharacteristic(this.Characteristic.Manufacturer, 'nzws.me')
      .setCharacteristic(this.Characteristic.Model, 'MQTT Locker')
      .setCharacteristic(this.Characteristic.SerialNumber, 'ho-me-br-id-ge');

    const { mqtt: { host = 'localhost', port = 1883, username, password } } = this.config;
    this.client = mqtt.connect(`mqtt://${host}:${port}`, {
      username,
      password,
    });

    this.client.subscribe('toggle');
    this.updateStatus(this.getStatus());

    this.client.on('message', topic => {
      this.log.debug(topic);

      switch (topic) {
        case 'toggle':
          return this.updateStatus(!this.getStatus());
      }
    });
  }

  /**
   * REQUIRED - This must return an array of the services you want to expose.
   * This method must be named "getServices".
   */
  getServices() {
    return [this.informationService, this.service];
  }

  async handleLockCurrentStateGet() {
    this.log.debug('Triggered GET LockCurrentState');

    const { UNSECURED, SECURED } = this.Characteristic.LockCurrentState;

    const status = await this.getStatus();

    return status ? SECURED : UNSECURED;
  }

  async handleLockTargetStateGet() {
    this.log.debug('Triggered GET LockTargetState');

    const { UNSECURED, SECURED } = this.Characteristic.LockTargetState;

    const status = await this.getStatus();

    return status ? SECURED : UNSECURED;
  }

  async handleLockTargetStateSet(value) {
    this.log.debug('Triggered SET LockTargetState:', value);

    const { SECURED } = this.Characteristic.LockTargetState;

    await this.updateStatus(value === SECURED);
  }

  private updateStatus(next: boolean): void {
    const { degrees: { locked, unlocked } } = this.config;

    const degree = next ? locked : unlocked;
    this.client.publish('update', degree.toString());
    this.status = next;

    const { UNSECURED, SECURED } = this.Characteristic.LockCurrentState;
    this.currentStateCharacteristic.updateValue(next ? SECURED : UNSECURED);
    this.targetStateCharacteristic.updateValue(next ? SECURED : UNSECURED);

    return;
  }

  private getStatus(): boolean {
    return this.status;
  }
}
