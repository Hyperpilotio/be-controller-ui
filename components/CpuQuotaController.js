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

export default class CpuQuotaController extends WithSyncedDygraphs {
  render = () => (
    <Container fluid={true}>
      <Row>
        <Subheader style={stylesheet.subHeader}>CPU QUOTA CONTROLLER</Subheader>
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.usage"
          data={this.props.data[1]}
          title="CPU Utilization %"
          labels={["x", "HP", "BE", "Total"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.be_quota"
          data={this.props.data[0]}
          title="BE Quota"
          labelsKMB={true}
          labels={["x", "quota"]} />
      </Row>
    </Container>
  )
}
