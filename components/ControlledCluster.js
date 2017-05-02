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

export default ({ data }) => {
  return <Container style={stylesheet.container}>
    {data.map((host, i) => (
      <Row style={stylesheet.nodeRow} key={i}>
        <Col sm={12}>
          <Paper zDepth={2}>
            <Subheader>Node: {host.hostname}</Subheader>
            <ControlledNode data={host.controllers} />
          </Paper>
        </Col>
      </Row>
    ))}
  </Container>
}
