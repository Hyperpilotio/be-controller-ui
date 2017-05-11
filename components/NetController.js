import { WithSyncedDygraphs, DygraphPaper } from "./Dygraph"
import { Container, Row } from "react-grid-system"


export default class NetController extends WithSyncedDygraphs {
  render = () => (
    <Container>
      <Row>
        <DygraphPaper
          ref="graph.be_bw"
          data={this.props.data.map( row => [row[0], row[1]] )}
          title="BE egress"
          labels={["x", "be_bw"]} />
      </Row>
      <Row>
        <DygraphPaper
          ref="graph.hp_bw"
          data={this.props.data.map( row => [row[0], row[2]] )}
          title="HP egress"
          labels={["x", "hp_bw"]} />
      </Row>
    </Container>
  )
}
