import { Component } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import IconButton from "material-ui/IconButton"
import NavigationClose from "material-ui/svg-icons/navigation/close"
import { List, ListItem, makeSelectable } from "material-ui/List"
import MenuItem from "material-ui/MenuItem"
import Link from "next/link"


let SelectableList = makeSelectable(List)

let stylesheet = {
  appBar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0
  },
  appBarTitle: {
    marginLeft: 250
  },
  drawerAppBar: {
    marginBottom: 10
  },
  titleLink: {
    color: "white",
    textDecoration: "none"
  },
  appContainer: {
    position: "absolute",
    top: 80,
    width: "100%"
  }
}

export default class Layout extends Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.setOpen = this.setOpen.bind(this)
  }

  handleToggle() {
    this.setState({ open: !this.state.open })
  }

  setOpen(open) {
    this.setState({ open })
  }

  render() {
    let { handleSelectNode, nodes, title, selectedItem, children } = this.props
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={title}
            titleStyle={stylesheet.appBarTitle}
            onLeftIconButtonTouchTap={this.handleToggle}
            style={stylesheet.appBar} />
          <Drawer
            open={this.state.open}
            docked={false}
            onRequestChange={this.setOpen}>

            <AppBar
              style={stylesheet.drawerAppBar}
              onLeftIconButtonTouchTap={() => this.setOpen(false)}
              iconElementLeft={<IconButton><NavigationClose /></IconButton>} />

            <SelectableList
              value={selectedItem}
              onChange={(e, node) => {
                handleSelectNode(node)
                this.setOpen(false)
              }}>

              <ListItem
                primaryText="Nodes"
                primaryTogglesNestedList={true}
                open={true}
                nestedItems={nodes.map((node, i) => (
                  <ListItem primaryText={node} value={`/node/${node}`} key={i} />
                ))} />

            </SelectableList>

          </Drawer>

          <div style={stylesheet.appContainer}>{children}</div>
        </div>
      </MuiThemeProvider>
    )
  }

}
