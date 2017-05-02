import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import AppBar from "material-ui/AppBar"
import ClusterContainer from "../containers/ClusterContainer"
import "../components/tap_event"

let stylesheet = {
  appBar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0
  }
}


const App = ({ initialData }) => (
  <MuiThemeProvider>
    <div>
      <AppBar title="Controller UI" style={stylesheet.appBar} />
      <ClusterContainer initialData={initialData} />
    </div>
  </MuiThemeProvider>
)

App.getInitialProps = async ({ req }) => {
  if (req !== undefined) {
    const controllerLogApi = require("../apis/controller-log")
    let context = { body: null };
    await controllerLogApi(context)
    return { initialData: context.body }
  }
}

export default App
