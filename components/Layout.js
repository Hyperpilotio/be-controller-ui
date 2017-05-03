import { Component } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import MenuItem from "material-ui/MenuItem"


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

export default ({ children }) => (
  <MuiThemeProvider>
    <div>
      <AppBar style={stylesheet.appBar} />
      <Drawer open={true}>
        <AppBar
          style={stylesheet.drawerAppBar}
          showMenuIconButton={false}
          title="Controller UI" />
        <MenuItem
          primaryText="Nodes"
          primaryTogglesNestedList={true}
          open={true}
          nestedItems={[
            <MenuItem primaryText="Node 1" />,
            <MenuItem primaryText="Node 2" />,
            <MenuItem primaryText="Node 3" />,
          ]} />
      </Drawer>
      <div style={stylesheet.appContainer}>{children}</div>
    </div>
  </MuiThemeProvider>
)
