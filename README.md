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
    "locked": 90,
    "unlocked": 0
  }
}
```
