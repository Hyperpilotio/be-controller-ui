import LayoutContainer from "../containers/LayoutContainer"
import { Container, Row, Col } from "react-grid-system"
import Paper from "material-ui/Paper"
import Subheader from "material-ui/Subheader"
import Settings from "../components/Settings"
import ControllersContainer from "../containers/ControllersContainer"
import NetPanelContainer from "../containers/NetPanelContainer"
import CpuPanelContainer from "../containers/CpuPanelContainer"
import { grey300, grey500, fullWhite } from "material-ui/styles/colors"
import apis from "../apis/client"
import Router from "next/router"
import _ from "lodash"
import "../components/tap_event"


let stylesheet = {
  bodySection: {
    marginBottom: 20
  },
  subHeader: {
    color: grey500,
    background: grey300
  }
}

const NodePage = ({ nodeSettings, nodes, node, controller }) => (
  <LayoutContainer
    title={`Node: ${node}`}
    nodes={nodes}
    selectedItem={`/node/${node}`}>
    <Container>
      <Row>
        <Container>
          <Paper style={stylesheet.bodySection}>
            <Subheader style={stylesheet.subHeader}>NODE SETTINGS</Subheader>
            <Settings
              settings={nodeSettings.settings}
              cols={2}
              omit={["controllers", "time"]} />
          </Paper>
        </Container>
      </Row>
      <Row>
        <Container>
          <Paper zDepth={2} style={stylesheet.bodySection}>
            <Subheader style={stylesheet.subHeader}>CONTROLLERS</Subheader>
            <ControllersContainer
              controllers={nodeSettings.settings.controllers}
              selected={controller}
              controllerPanel={{
                net: <NetPanelContainer />,
                cpu_quota: <CpuPanelContainer />
              }} />
          </Paper>
        </Container>
      </Row>
    </Container>
  </LayoutContainer>
)

NodePage.getInitialProps = async ({ req, query }) => {
  let node = query.id
  let controller = _.get(query, "controller")
  let nodeSettings = await apis.getSettings({ node })
  let nodes = (await apis.getNodes()).nodes
  return { nodeSettings, nodes, node, controller }
}

export default NodePage
