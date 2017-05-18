# Hyperpilot Controller UI


### Development

- Requirement: Node.js 7.x, yarn (recommended)
- `$ yarn`
- `$ yarn run dev`

### Kubernetes
- `$ kubectl create -f deploy.yaml`

### Docker
- `$ docker build -t {image_name} .`
- Built image: `$ docker pull adrianliaw/be-controller-ui`

### Env
- `INFLUXDB_HOST`: InfluxDB host, default `influxsrv`
- `INFLUXDB_PORT`: InfluxDB port, default `8086`
- `INFLUXDB_USER`: InfluxDB username, default `root`
- `INFLUXDB_PASS`: InfluxDB password, default `root`
