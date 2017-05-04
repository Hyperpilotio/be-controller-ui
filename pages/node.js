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
import { apis } from "../apis"
import _ from "lodash"
import "../components/tap_event"


const NodePage = ({ nodeSettings, nodes, node }) => (
  <LayoutContainer
    title={`Node: ${node}`}
    nodes={nodes}
    selectedItem={`/node/${node}`}>
    <Container>
      <Row>
        <Col md={6}></Col>
        <Col md={6}>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Setting</TableHeaderColumn>
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
