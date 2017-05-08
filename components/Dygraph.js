import { Component } from "react"
import { findDOMNode } from "react-dom"
import _ from "lodash"


export default class DygraphContainer extends Component {

  graph = null

  componentDidMount() {
    const Dygraph = require("dygraphs").default

    this.graph = new Dygraph(
      findDOMNode(this),
      this.props.data,
      _.extend(_.omit(this.props, "data"), {

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
    )
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
    const Dygraph = window.Dygraph = require("dygraphs").default
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
