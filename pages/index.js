import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import { apis } from "../apis"
import "../components/tap_event"


const App = ({ initialData }) => (
  <LayoutContainer nodes={initialData.map(h => h.hostname)}>
    <ClusterContainer initialData={initialData} />
  </LayoutContainer>
)

App.getInitialProps = async ({ req }) => {
  if (req !== undefined) {
    let initialData = await apis.controllerLog()
    return { initialData }
  }
}

export default App
