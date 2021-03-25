# @nzws/homebridge-mqtt-smartlock

## Install

```
npm install --global @nzws/homebridge-mqtt-smartlock
```

## Config

```json
{
  "accessory": "MQTTLocker",
  "name": "Room Lock",
  "mqtt": {
    "host": "localhost",
    "port": 1883,
    "username": "",
    "password": ""
  },
  "degrees": {
    "locked": [170, 83],
    "unlocked": [0, 83]
  },
  "degreesInterval": 500
}
```

- `mqtt`: MQTT Broker address.
- `degrees`: Set the angle for unlocking/locking.
  - example `[170, 83]`: set angle to 170 → wait (degreesInterval)ms → set angle to 83
