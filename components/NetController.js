import Dygraph, { SyncHandler } from "./Dygraph"
import { Component } from "react"
import { findDOMNode } from "react-dom"
import { Container, Row } from "react-grid-system"
import Paper from "material-ui/Paper"


let stylesheet = {
  dygraphWrapper: {
    margin: "5px 15px",
    padding: 10
  }
}


export default class NetController extends Component {

  sync = null

  componentDidMount() {
    this.sync = new SyncHandler([
      this.refs.be_bw,
      this.refs.hp_bw.graph
    ], {range: false})
  }

  componentWillUnmount() {
    this.sync.detach()
  }

  render = () => (
    <Container>
      <Row>
        <Paper style={stylesheet.dygraphWrapper}>
          <Dygraph
            ref="be_bw"
            data={this.props.data.slice(1).map(row => [row[0], row[1]])}
            title="be_bw"
            labels={["x", "be_bw"]} />
        </Paper>
      </Row>
      <Row>
        <Paper style={stylesheet.dygraphWrapper}>
          <Dygraph
            ref="hp_bw"
            data={this.props.data.slice(1).map(row => [row[0], row[2]])}
            title="hp_bw"
            labels={["x", "hp_bw"]} />
        </Paper>
      </Row>
    </Container>
  )

}
