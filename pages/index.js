import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import Head from "next/head"
import apis from "../apis/client"
import "../components/tap_event"


const App = ({ initialData, nodes }) => (
  <div>
    <Head>
      <title>BE Controller</title>
    </Head>
    <LayoutContainer nodes={nodes}>
      <ClusterContainer initialData={initialData} />
    </LayoutContainer>
  </div>
)

App.getInitialProps = async ({ req }) => {
  let initialData = await apis.controllerLog()
  let nodes = (await apis.getNodes()).nodes
  return { initialData, nodes }
}

export default App
