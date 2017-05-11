import { WithSyncedDygraphs, DygraphPaper } from "./Dygraph"
import { Container, Row } from "react-grid-system"


export default class CpuQuotaController extends WithSyncedDygraphs {
  render = () => (
    <Container>
      <Row>
        <DygraphPaper
          ref="graph.slack"
          data={this.props.data.map( row => [row[0], row[1]] )}
          title="Slack"
          labels={["x", "slack"]} />
      </Row>
      <Row>
        <DygraphPaper
          ref="graph.be_quota"
          data={this.props.data.map( row => [row[0], row[2]] )}
          title="BE Quota"
          labels={["x", "be_quota"]} />
      </Row>
    </Container>
  )
}
