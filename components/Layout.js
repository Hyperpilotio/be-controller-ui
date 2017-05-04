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
  drawerAppBar: {
    marginBottom: 10
  },
  appContainer: {
    position: "absolute",
    top: 80,
    left: 260
  }
}

export default ({ handleSelectNode, nodes, children, selectedItem = "/" }) => (
  <MuiThemeProvider>
    <div>
      <AppBar style={stylesheet.appBar} />
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
