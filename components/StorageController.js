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

export default class StorageController extends WithSyncedDygraphs {
  render = () => (
    <Container fluid={true}>
      <Row>
        <Subheader style={stylesheet.subHeader}>STORAGE CONTROLLER</Subheader>
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.usage"
          data={this.props.data.map( row => row.slice(0, 4) )}
          title="Blkio Usage (iops)"
          labels={["x", "HP", "BE", "Total"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.limit"
          data={this.props.data.map( row => [row[0], ...row.slice(4, 6)] )}
          title="BE Blkio Limit (iops)"
          labels={["x", "Read", "Write"]} />
      </Row>
    </Container>
  )
}
