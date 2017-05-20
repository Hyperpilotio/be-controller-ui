import { Container, Row, Col } from "react-grid-system"
import Subheader from "material-ui/Subheader"
import VerticalDivider from "../components/VerticalDivider"
import NetPanelContainer from "../containers/NetPanelContainer"
import CpuPanelContainer from "../containers/CpuPanelContainer"
import StoragePanelContainer from "../containers/StoragePanelContainer"
import NodeViewLayoutContainer from "../containers/NodeViewLayoutContainer"
import apis from "../apis/client"
import Head from "next/head"
import "../components/tap_event"


let stylesheet = {
  left: {
    paddingRight: 5,
    paddingLeft: 0
  },
  middle: {
    paddingLeft: 5,
    paddingRight: 5
  },
  right: {
    paddingLeft: 5,
    paddingRight: 0
  },
  containerRow: {
    marginLeft: -15,
    marginRight: -15
  },
  mainContainer: {
    fontFamily: "Roboto, sans-serif"
  }
}

const NodePage = ({ nodeSettings, nodes, node }) => (
  <div>
    <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.0.0/dygraph.css" />
      <title>NODE: { node }</title>
    </Head>
    <NodeViewLayoutContainer
      node={node}
      nodes={nodes}
      nodeSettings={nodeSettings}>

      <Container fluid={true} style={stylesheet.mainContainer}>
        <Row style={stylesheet.containerRow}>
          <Col md={3.99} style={stylesheet.left}>
            <CpuPanelContainer />
          </Col>
          <VerticalDivider height={600} />
          <Col md={3.99} style={stylesheet.middle}>
            <NetPanelContainer />
          </Col>
          <VerticalDivider height={600} />
          <Col md={3.99} style={stylesheet.right}>
            <StoragePanelContainer />
          </Col>
        </Row>
      </Container>

    </NodeViewLayoutContainer>
  </div>
)

NodePage.getInitialProps = async ({ req, query }) => {
  let node = query.id
  let nodeSettings = await apis.getSettings({ node })
  let nodes = (await apis.getNodes()).nodes
  return { nodeSettings, nodes, node }
}

export default NodePage
