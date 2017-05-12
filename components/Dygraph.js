import { Component } from "react"
import { findDOMNode } from "react-dom"
import { renderToStaticMarkup } from "react-dom/server"
import _ from "lodash"
import Paper from "material-ui/Paper"


let stylesheet = {
  dygraphWrapper: {
    margin: "5px 15px",
    padding: 10
  }
}

export default class DygraphContainer extends Component {

  graph = null

  componentDidMount() {
    const Dygraph = require("dygraphs")

    let { data, threshold } = this.props
    let props = _.omit(this.props, "data", "threshold")

    // Defaults
    props = _.extend({ height: 270 }, props)

    // Add-ons
    props = _.extend(props, {

      underlayCallback(context, area, graph) {
        // Fix zoom issue with synchronised graphs
        if (this.readyFired_ !== true)
          graph.hasResetZoom_ = true

        if (graph.hasResetZoom_)
          graph.dateWindow_ = null

        // Make threshold
        if (threshold !== undefined) {
          let range = this.xAxisRange()
          context.save()
          context.beginPath()
          context.lineWidth = 2.0
          context.strokeStyle = "orangered"
          context.moveTo(...this.toDomCoords(range[0], threshold))
          context.lineTo(...this.toDomCoords(range[1], threshold))
          context.closePath()
          context.stroke()
          context.restore()
        }
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


export class DygraphPaper extends Component {
  graph = null
  componentDidMount() {
    this.graph = this.refs.graph.graph
  }
  render = () => (
    <Paper style={_.assign({}, stylesheet.dygraphWrapper, this.props.paperStyle)}>
      <DygraphContainer ref="graph" {..._.omit(this.props, "paperStyle")} />
    </Paper>
  )
}


export class SyncHandler {

  constructor(graphs, options) {
    const Dygraph = window.Dygraph = require("dygraphs")
    require("dygraphs/src-es5/extras/synchronizer")

    this.graphs = []
    for (let g of graphs) {
      if (!(g instanceof Dygraph)) {
        g = g.graph
      }
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


export class WithSyncedDygraphs extends Component {

  sync = null
  dygraphOptions = { range: false }

  componentDidMount() {
    let graphs = []
    for (let key of _.keys(this.refs)) {
      if (_.startsWith(key, "graph."))
        graphs.push(this.refs[key])
    }
    this.sync = new SyncHandler(graphs, this.dygraphOptions)
  }

  componentWillUnmount() {
    this.sync.detach()
  }

}
