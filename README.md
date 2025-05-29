# 🔥 homebridge-virtual-smoke-sensor-loop

Virtual smoke sensor with an optional switch to activate a fire alarm loop every 5 seconds. Works with HomeKit via Homebridge.

## 🚀 Features

- Virtual smoke sensor visible in Apple Home
- Optional switch to turn alarm loop on/off
- Fire alarm is triggered every 5 seconds when turned on
- Great for testing, automation, or AI fire detection bridge

## 🔧 Configuration (in `config.json`)

```json
"platforms": [
  {
    "platform": "VirtualSmokeSensor",
    "sensors": [
      {
        "name": "Báo cháy AIglobal"
      }
    ]
  }
]
```

## 📦 Installation

```bash
sudo npm install -g homebridge-virtual-smoke-sensor-loop
```

Then restart Homebridge and configure as shown above.
