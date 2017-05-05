import LayoutContainer from "../containers/LayoutContainer"
import { Container, Row, Col } from "react-grid-system"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table"
import RaisedButton from "material-ui/RaisedButton"
import { pink500, indigo500, fullWhite } from "material-ui/styles/colors"
import apis from "../apis/client"
import _ from "lodash"
import "../components/tap_event"


let stylesheet = {
  controllerButton: {
    width: "100%",
    height: 150,
    margin: 20
  },
  controllerTitle: {
    fontSize: 24,
    color: fullWhite
  },
  controllerColor: {
    net: pink500,
    cpu_quota: indigo500
  }
}

const NodePage = ({ nodeSettings, nodes, node }) => (
  <LayoutContainer
    title={`Node: ${node}`}
    nodes={nodes}
    selectedItem={`/node/${node}`}>
    <Container>
      <Row>
        <Col md={6}>
          {_.map(nodeSettings.settings.controllers, ({name, settings}) => (
            <RaisedButton
              key={name}
              label={`${name} controller`}
              backgroundColor={stylesheet.controllerColor[name]}
              style={stylesheet.controllerButton}
              labelStyle={stylesheet.controllerTitle} />
          ))}
        </Col>
        <Col md={6}>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Option</TableHeaderColumn>
                <TableHeaderColumn>Value</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {_.map(
                _.omit(nodeSettings.settings, "controllers", "time"),
                (val, key) => (
                  <TableRow key={key}>
                    <TableRowColumn>{key}</TableRowColumn>
                    <TableRowColumn>{_.toString(val)}</TableRowColumn>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Col>
      </Row>
    </Container>
  </LayoutContainer>
)

NodePage.getInitialProps = async ({ req, query }) => {
  let node = query.id
  let nodeSettings = await apis.getSettings({ node })
  let nodes = (await apis.getNodes()).nodes
  return { nodeSettings, nodes, node }
}

export default NodePage
