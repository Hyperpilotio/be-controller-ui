import _ from "lodash"

import NodeViewLayout from "../components/NodeViewLayout"
import LayoutContainer from "./LayoutContainer"
import RefreshIndicator from "material-ui/RefreshIndicator"

export default class NodeViewLayoutContainer extends LayoutContainer {

  render = () => (
    <NodeViewLayout
      handleSelectNode={this.handleSelectNode}
      {..._.omit(this.props, "children")}>

      {this.state.loading ?
        <RefreshIndicator size={60} left={200} top={100} status="loading" />
        : this.props.children}

    </NodeViewLayout>
  )
}
