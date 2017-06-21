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
          ref="graph.egress"
          data={this.props.data.map( row => row.slice(0, 5) )}
          title="Net Egress (mbps)"
          labels={["x", "HP", "BE", "Total", "BE Limit"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.ingress"
          data={this.props.data.map( row => [row[0], ...row.slice(5, 9)] )}
          title="Net Ingress (mbps)"
          labels={["x", "HP", "BE", "Total", "BE Limit"]} />
      </Row>
    </Container>
  )
}
