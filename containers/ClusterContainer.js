import { Component } from "react"
import _ from "lodash"
import { apis } from "../apis"
import ControlledCluster from "../components/ControlledCluster"


export default class ClusterContainer extends Component {

  constructor(props) {
    super(props)
    this.state = { data: props.initialData, node: props.node }

    if (typeof window !== "undefined") {
      let timeoutFunc = async () => {
        await this.refreshData()
        this.setState({currentTimeout: setTimeout(timeoutFunc, 10 * 1000)})
      }
      this.state.currentTimeout = setTimeout(timeoutFunc, 10 * 1000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.currentTimeout)
  }

  async refreshData() {
    let data = await apis.controllerLogs()
    this.setState({ data })
  }

  render() {
    let { node } = this.props
    let { data } = this.state
    return <ControlledCluster data={node ? data.filter(h => h.hostname === node) : data} />
  }

}
