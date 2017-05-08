import { SyncHandler, DygraphPaper } from "./Dygraph"
import { Component } from "react"
import { findDOMNode } from "react-dom"
import { Container, Row } from "react-grid-system"


export default class NetController extends Component {

  sync = null

  componentDidMount() {
    this.sync = new SyncHandler([
      this.refs.slack,
      this.refs.hp_shares,
      this.refs.be_shares
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
          ref="be_shares"
          data={this.props.data.map( row => [row[0], row[2]] )}
          title="BE shares"
          labels={["x", "be_shares"]} />
      </Row>
      <Row>
        <DygraphPaper
          ref="hp_shares"
          data={this.props.data.map( row => [row[0], row[3]] )}
          title="HP shares"
          labels={["x", "hp_shares"]} />
      </Row>
    </Container>
  )

}
