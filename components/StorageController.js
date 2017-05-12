// import Dygraph, { WithSyncedDygraphs } from "./Dygraph"
import { Component } from "react"
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

export default class StorageController extends Component {
  render = () => (
    <Container fluid={true}>
      <Row>
        <Subheader style={stylesheet.subHeader}>STORAGE CONTROLLER</Subheader>
      </Row>
      <Row>
        <img src="http://placehold.it/400x300" />
      </Row>
      <Row>
        <img src="http://placehold.it/400x300" />
      </Row>
    </Container>
  )
}
