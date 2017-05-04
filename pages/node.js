import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import "../components/tap_event"


const NodePage = ({ initialData, url }) => {
  return <LayoutContainer nodes={initialData.map(h => h.hostname)} selectedItem={`/node/${url.query.id}`}>
    <ClusterContainer node={url.query.id} initialData={initialData} />
  </LayoutContainer>
}

NodePage.getInitialProps = async ({ req, query }) => {
  const controllerLogApi = require("../apis/controller-log")
  if (req !== undefined) {
    let context = { body: null };
    await controllerLogApi(context)
    return { initialData: context.body }
  } else {
    let initialData = await controllerLogApi()
    return { initialData }
  }
}

export default NodePage
