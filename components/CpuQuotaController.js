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
          ref="graph.slack"
          data={this.props.data.map( row => [row[0], row[1]] )}
          title="Slack"
          labels={["x", "slack"]} />
      </Row>
      <Row>
        <Dygraph
          style={stylesheet.graphContainer}
          ref="graph.be_quota"
          data={this.props.data.map( row => [row[0], row[2]] )}
          title="BE Quota"
          labelsKMB={true}
          labels={["x", "quota"]} />
      </Row>
    </Container>
  )
}
