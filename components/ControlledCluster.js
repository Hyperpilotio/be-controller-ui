import { Component } from "react"
import fetch from "isomorphic-fetch"
import _ from "lodash"
import { Container, Row, Col } from "react-grid-system"
import Paper from "material-ui/Paper"
import Subheader from "material-ui/Subheader"
import ControlledNode from "./ControlledNode"


let stylesheet = {
  container: {
    top: "100px"
  },
  nodeRow: {
    marginBottom: "15px"
  }
}

export default class ControlledCluster extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  async refreshData() {
    let res = await fetch("/apis/controller-log")
    let data = await res.json()
    this.setState({ data })
  }

  render() {
    const byHostname = _.groupBy(this.state.data, "hostname");
    return <Container style={stylesheet.container}>
      {_.map(byHostname, (controllers, hostname) => (
        <Row style={stylesheet.nodeRow} key={hostname}>
          <Col sm={12}>
            <Paper zDepth={2}>
              <Subheader>Node: {hostname}</Subheader>
              <ControlledNode data={_.keyBy(controllers, "controller")} />
            </Paper>
          </Col>
        </Row>
      ))}
    </Container>
  }

}
