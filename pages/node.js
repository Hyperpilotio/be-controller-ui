import ClusterContainer from "../containers/ClusterContainer"
import LayoutContainer from "../containers/LayoutContainer"
import { apis } from "../apis"
import "../components/tap_event"


const NodePage = ({ initialData, nodes, url }) => {
  return <LayoutContainer nodes={nodes} selectedItem={`/node/${url.query.id}`}>
    <ClusterContainer node={url.query.id} initialData={initialData} />
  </LayoutContainer>
}

NodePage.getInitialProps = async ({ req, query }) => {
  let initialData = await apis.controllerLog()
  let nodes = (await apis.getNodes()).nodes
  return { initialData, nodes }
}

export default NodePage
