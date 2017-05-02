import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import AppBar from "material-ui/AppBar"
import ControlledCluster from "../components/ControlledCluster"
import "../components/tap_event"

let stylesheet = {
  appBar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0
  }
}


const App = ({ data }) => (
  <MuiThemeProvider>
    <div>
      <AppBar title="Controller UI" style={stylesheet.appBar} />
      <ControlledCluster data={data} />
    </div>
  </MuiThemeProvider>
)

App.getInitialProps = async ({ req }) => {
  if (req !== undefined) {
    const controllerLogApi = require("../apis/controller-log")
    let context = { body: null };
    await controllerLogApi(context)
    return { data: context.body }
  }
}

export default App
