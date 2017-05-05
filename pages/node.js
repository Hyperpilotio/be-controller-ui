import LayoutContainer from "../containers/LayoutContainer"
import { Container, Row, Col } from "react-grid-system"
import { Tabs, Tab } from "material-ui/Tabs"
import Paper from "material-ui/Paper"
import Subheader from "material-ui/Subheader"
import Settings from "../components/Settings"
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

const NodePage = ({ nodeSettings, nodes, node }) => (
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
          <Tabs>
            {nodeSettings.settings.controllers.map(({name, settings}) => (
              <Tab label={name} key={name}>
                <Row>
                  <Col sm={7}></Col>
                  <Col sm={5}>
                    <Settings settings={settings} />
                  </Col>
                </Row>
              </Tab>
            ))}
          </Tabs>
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
