import { Component } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import { List, ListItem, makeSelectable } from "material-ui/List"
import MenuItem from "material-ui/MenuItem"


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
  appContainer: {
    position: "absolute",
    top: 80,
    left: 260
  }
}

export default ({ handleSelectNode, nodes, children, title, selectedItem = "/" }) => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title={title}
        titleStyle={stylesheet.appBarTitle}
        style={stylesheet.appBar} />
      <Drawer open={true}>
        <AppBar
          style={stylesheet.drawerAppBar}
          showMenuIconButton={false}
          title="Controller UI" />
        <SelectableList
          value={selectedItem}
          onChange={(e, node) => handleSelectNode(node)}>
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
