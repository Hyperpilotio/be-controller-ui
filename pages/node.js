import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import { apis } from "../apis"
import "../components/tap_event"


const NodePage = ({ initialData, url }) => {
  return <LayoutContainer nodes={initialData.map(h => h.hostname)} selectedItem={`/node/${url.query.id}`}>
    <ClusterContainer node={url.query.id} initialData={initialData} />
  </LayoutContainer>
}

NodePage.getInitialProps = async ({ req, query }) => {
  let initialData = await apis.controllerLog()
  return { initialData }
}

export default NodePage
