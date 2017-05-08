# Hyperpilot Controller UI


### Development

- Requirement: Node.js 7.x, yarn (recommended)
- `$ yarn`
- `$ yarn run dev`


### Docker
- `$ docker build -t {image_name} .`

### Env
- `INFLUXDB_HOST`: InfluxDB host, default `influxsrv`
- `INFLUXDB_PORT`: InfluxDB port, default `8086`
- `INFLUXDB_USER`: InfluxDB username, default `root`
- `INFLUXDB_PASS`: InfluxDB password, default `root`
- `INFLUXDB_NAME_CONTROLLER`: InfluxDB database name for controller logs, default `be_controller`
