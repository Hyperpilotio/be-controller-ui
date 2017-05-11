import { Component } from "react"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import IconButton from "material-ui/IconButton"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import NavigationClose from "material-ui/svg-icons/navigation/close"
import { grey300, grey500, fullWhite } from "material-ui/styles/colors"
import Subheader from "material-ui/Subheader"
import { Container } from "react-grid-system"
import _ from "lodash"
import Settings from "./Settings"
import LayoutContainer from "../containers/LayoutContainer"


let stylesheet = {
  subHeader: {
    color: grey500,
    background: grey300
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
    return (
      <LayoutContainer
        title={`Controller Dashboard (Node: ${this.props.node})`}
        nodes={this.props.nodes}
        rightIcon={<IconButton><SettingsIcon /></IconButton>}
        rightIconPress={this.toggleSettings}
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
                  <Subheader style={stylesheet.subHeader}>{_.upperCase(name)}</Subheader>
                  <Settings settings={settings} omitHeader={true} />
                </div>
              )
            )}
          </Container>

        </Drawer>

        {this.props.children}
      </LayoutContainer>
    )
  }

}
