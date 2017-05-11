import Dygraph, { WithSyncedDygraphs } from "./Dygraph"
import { Container, Row, Col } from "react-grid-system"


export default class AppDataGraphs extends WithSyncedDygraphs {
  render = () => (
    <Container>
      <Row>
        <Col md={6}>
          <Dygraph
            ref="graph.rps"
            data={this.props.data[0]}
            title="HP Throughput"
            labels={["x", "rps"]}
            ylabel="Reqs / s" />
        </Col>
        <Col md={6}>
          <Dygraph
            ref="graph.latency"
            data={this.props.data[1]}
            title="HP Latency"
            labels={["x", "latency"]}
            ylabel="secs" />
        </Col>
      </Row>
    </Container>
  )
}
