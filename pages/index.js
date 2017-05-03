import ClusterContainer from "../containers/ClusterContainer"
import Layout from "../components/Layout"
import "../components/tap_event"


const App = ({ initialData }) => (
  <Layout>
    <ClusterContainer initialData={initialData} />
  </Layout>
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
