import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import apis from "../apis/client"
import "../components/tap_event"


const App = ({ initialData, nodes }) => (
  <LayoutContainer nodes={nodes}>
    <ClusterContainer initialData={initialData} />
  </LayoutContainer>
)

App.getInitialProps = async ({ req }) => {
  let initialData = await apis.controllerLog()
  let nodes = (await apis.getNodes()).nodes
  return { initialData, nodes }
}

export default App
