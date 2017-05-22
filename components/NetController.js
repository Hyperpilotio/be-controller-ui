import Dygraph, { WithSyncedDygraphs } from "./Dygraph"
import Subheader from "material-ui/Subheader"
import { grey500, fullWhite } from "material-ui/styles/colors"
import { Container, Row } from "react-grid-system"


let stylesheet = {
  subHeader: {
    color: fullWhite,
    background: grey500,
    fontSize: 18
  },
  graphContainer: {
    marginLeft: -20,
    marginTop: 20
  }
}

export default class NetController extends WithSyncedDygraphs {
  render = () => (
    <Container fluid={true}>
      <Row>
        <Subheader style={stylesheet.subHeader}>NETWORK CONTROLLER</Subheader>
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.bw"
          data={this.props.data.map( row => row.slice(0, 4) )}
          title="Net BW Usage (mbps)"
          labels={["x", "HP", "BE", "Total"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.limit"
          data={this.props.data.map( row => row.slice(0, 2) )}
          title="BE Net BW Limit (mbps)"
          labels={["x", "limit"]} />
      </Row>
    </Container>
  )
}
