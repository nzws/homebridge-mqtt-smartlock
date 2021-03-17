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
    "locked": 170,
    "unlocked": 0,
    "free": 83
  }
}
```

- `mqtt`: MQTT Broker address.
- `degrees`: Set the angle for unlocking/locking.
  - `free`: It will move to this angle after 500ms of control. (Optional)
