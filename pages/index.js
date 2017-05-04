import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import "../components/tap_event"


const App = ({ initialData }) => (
  <LayoutContainer nodes={initialData.map(h => h.hostname)}>
    <ClusterContainer initialData={initialData} />
  </LayoutContainer>
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
