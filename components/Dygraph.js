import { Component } from "react"
import { findDOMNode } from "react-dom"
import { renderToStaticMarkup } from "react-dom/server"
import _ from "lodash"


let stylesheet = {
  title: {
    textAlign: "right",
    fontWeight: "bold"
  }
}

const Title = ({ children }) => <div style={stylesheet.title}>{children}</div>

export default class DygraphContainer extends Component {

  graph = null

  componentDidMount() {
    const Dygraph = require("dygraphs")

    let data = this.props.data
    let title = this.props.title || ""
    let props = _.omit(this.props, "data", "title")

    // Defaults
    props = _.extend({ height: 270 }, props)

    // Add-ons
    props = _.extend(props, {

      title: renderToStaticMarkup(<Title>{title}</Title>),

      underlayCallback(context, area, graph) {
        if (this.readyFired_ !== true)
          graph.hasResetZoom_ = true

        if (graph.hasResetZoom_)
          graph.dateWindow_ = null
      },

      zoomCallback(minX, maxX, yRanges) {
        let updatingGraphs = _.get(this, "_attachedSync.graphs", [this])
        let hasResetZoom_ = _.isEqual([minX, maxX], this.xAxisExtremes())
        let dateWindow_ = [minX, maxX]

        updatingGraphs.map(g => _.assign(g, { hasResetZoom_, dateWindow_ }))
        updatingGraphs.map(g => g.renderGraph_(false))
      }

    })

    this.graph = new Dygraph( findDOMNode(this), data, props )
  }

  componentWillUnmount() {
    this.graph.destroy()
  }

  componentWillReceiveProps(props) {
    if (_.hasIn(props, "data")) {
      let options = { file: props.data }
      this.graph.updateOptions(options)
    }
  }

  render = () => <div />
}


export class SyncHandler {

  constructor(graphs, options) {
    const Dygraph = window.Dygraph = require("dygraphs")
    require("dygraphs/src-es5/extras/synchronizer")

    this.graphs = []
    for (let g of graphs) {
      if (g instanceof DygraphContainer)
        g = g.graph
      g._attachedSync = this
      this.graphs.push(g)
    }

    this.sync = window.Dygraph.synchronize(...this.graphs, options)

    delete window.Dygraph
  }

  detach() {
    this.sync.detach()
  }

}
