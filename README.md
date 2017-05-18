# Hyperpilot Controller UI


### Development

- Requirement: Node.js 7.x, yarn (recommended)
- `$ yarn`
- `$ yarn run dev`

### Kubernetes
- `$ kubectl create -f deploy.yaml`
- `$ kubectl port-forward $(kubectl get pods -n hyperpilot | grep be-controller-ui | awk '{print $1;}') 3000:3000 -n hyperpilot`

### Docker
- `$ docker build -t {image_name} .`
- Built image: `$ docker pull adrianliaw/be-controller-ui`

### Env
- `INFLUXDB_HOST`: InfluxDB host, default `influxsrv`
- `INFLUXDB_PORT`: InfluxDB port, default `8086`
- `INFLUXDB_USER`: InfluxDB username, default `root`
- `INFLUXDB_PASS`: InfluxDB password, default `root`
