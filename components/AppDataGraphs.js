import Dygraph, { WithSyncedDygraphs } from "./Dygraph"
import { Container, Row, Col } from "react-grid-system"


let stylesheet = {
  left: {
    paddingRight: 5,
    paddingLeft: -5
  },
  middle: {
    paddingLeft: 5,
    paddingRight: 5
  },
  right: {
    paddingLeft: 5,
    paddingRight: -5
  },
  mainContainer: {
    margin: 10
  }
}


export default class AppDataGraphs extends WithSyncedDygraphs {
  render = () => (
    <Container fluid={true} style={stylesheet.mainContainer}>
      <Row>
        <Col md={4} style={stylesheet.left}>
          <Dygraph
            ref="graph.rps"
            data={this.props.data[0]}
            title="Throughput"
            labels={["x", "rps"]}
            legend="always" />
        </Col>
        <Col md={4} style={stylesheet.middle}>
          <Dygraph
            ref="graph.latency"
            data={this.props.data[1]}
            title="Latency"
            labels={["x", "latency"]}
            connectSeparatedPoints={true}
            threshold={1.0}
            legend="always" />
        </Col>
        <Col md={4} style={stylesheet.right}>
          <Dygraph
            ref="graph.slack"
            data={this.props.data[2]}
            title="Slack"
            legend="always"
            labels={["x", "slack"]} />
        </Col>
      </Row>
    </Container>
  )
}
