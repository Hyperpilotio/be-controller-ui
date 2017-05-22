import { Component } from "react"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import IconButton from "material-ui/IconButton"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import NavigationClose from "material-ui/svg-icons/navigation/close"
import { grey300, grey500, fullWhite } from "material-ui/styles/colors"
import Subheader from "material-ui/Subheader"
import Paper from "material-ui/Paper"
import Divider from "material-ui/Divider"
import { Container, Row, Col } from "react-grid-system"
import _ from "lodash"
import Settings from "./Settings"
import Layout from "../components/Layout"
import AppDataGraphs from "../containers/AppDataContainer"


let stylesheet = {
  subHeader: {
    color: grey500,
    background: grey300,
    fontSize: 18,
    fontWeight: "bold"
  },
  appDataGraphs: {
    padding: "10px -10px"
  },
  divider: {
    marginTop: 7,
    marginBottom: 8
  },
  fluidContainerRow: {
    marginLeft: 10,
    marginRight: 10
  }
}


export default class NodeViewLayout extends Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
    this.toggleSettings = this.toggleSettings.bind(this)
  }

  toggleSettings() {
    this.setState({ open: !this.state.open })
  }

  render() {
    let nodeId = _.first(_.filter(
      this.props.nodes,
      _.matches({ name: this.props.node })
    )).nodeId

    return (
      <Layout
        title={`Controller Dashboard (NODE-${nodeId} / ${this.props.node})`}
        nodes={this.props.nodes}
        rightIcon={<IconButton><SettingsIcon /></IconButton>}
        rightIconPress={this.toggleSettings}
        handleSelectNode={this.props.handleSelectNode}
        selectedItem={`/node/${this.props.node}`}>

        <Drawer open={this.state.open} width={450} openSecondary={true}>

          <AppBar
            title="Settings"
            showMenuIconButton={false}
            iconElementRight={<IconButton><NavigationClose /></IconButton>}
            onRightIconButtonTouchTap={this.toggleSettings} />

          <Container>

            <Settings
              settings={this.props.nodeSettings.settings}
              omit={["time", "controllers"]} />

            {this.props.nodeSettings.settings.controllers.map(
              ({name, settings}, i) => (
                <div key={i}>
                  <Divider style={stylesheet.divider} />
                  <Subheader style={stylesheet.subHeader}>{_.upperCase(name)}</Subheader>
                  <Settings settings={settings} omitHeader={true} />
                </div>
              )
            )}

          </Container>

        </Drawer>

        <Container fluid={true}>
          <Row style={stylesheet.fluidContainerRow}>
            <Paper style={stylesheet.appDataGraphs}>
              <Subheader style={stylesheet.subHeader}>App-level QoS</Subheader>
              <AppDataGraphs />
            </Paper>
          </Row>
          <Divider style={stylesheet.divider} />
          <Row style={stylesheet.fluidContainerRow}>
            {this.props.children}
          </Row>
        </Container>

      </Layout>
    )
  }

}
