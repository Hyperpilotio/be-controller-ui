import { SyncHandler, DygraphPaper } from "./Dygraph"
import { Component } from "react"
import { findDOMNode } from "react-dom"
import { Container, Row } from "react-grid-system"


export default class CpuQuotaController extends Component {

  sync = null

  componentDidMount() {
    this.sync = new SyncHandler([
      this.refs.slack,
      this.refs.be_quota
    ], {range: false})
  }

  componentWillUnmount() {
    this.sync.detach()
  }

  render = () => (
    <Container>
      <Row>
        <DygraphPaper
          ref="slack"
          data={this.props.data.map( row => [row[0], row[1]] )}
          title="Slack"
          labels={["x", "slack"]} />
      </Row>
      <Row>
        <DygraphPaper
          ref="be_quota"
          data={this.props.data.map( row => [row[0], row[2]] )}
          title="BE Quota"
          labels={["x", "be_quota"]} />
      </Row>
    </Container>
  )

}
