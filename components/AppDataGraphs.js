import { SyncHandler, DygraphPaper } from "./Dygraph"
import { Component } from "react"
import { findDOMNode } from "react-dom"
import { Container, Row, Col } from "react-grid-system"


let stylesheet = {
  graphPaper: {
    margin: 5
  }
}


export default class AppDataGraphs extends Component {

  sync = null

  componentDidMount() {
    this.sync = new SyncHandler([
      this.refs.rps,
      this.refs.latency
    ], {range: false})
  }

  componentWillUnmount() {
    this.sync.detach()
  }

  render = () => (
    <Container>
      <Row>
        <Col md={6}>
          <DygraphPaper
            ref="rps"
            paperStyle={stylesheet.graphPaper}
            data={this.props.data[0]}
            title="HP Throughput ( Reqs / sec )"
            labels={["x", "rps"]} />
        </Col>
        <Col md={6}>
          <DygraphPaper
            ref="latency"
            paperStyle={stylesheet.graphPaper}
            data={this.props.data[1]}
            title="HP Latency"
            labels={["x", "latency"]} />
        </Col>
      </Row>
    </Container>
  )

}
