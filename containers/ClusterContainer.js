import { Component } from "react"
import _ from "lodash"
import fetchControllerLogs from "../apis/controller-log"
import ControlledCluster from "../components/ControlledCluster"


export default class ClusterContainer extends Component {

  constructor(props) {
    super(props)
    this.state = { data: props.initialData }

    if (typeof window !== "undefined") {
      let timeoutFunc = async () => {
        await this.refreshData()
        setTimeout(timeoutFunc, 10 * 1000)
      }
      setTimeout(timeoutFunc, 10 * 1000)
    }
  }

  async refreshData() {
    let data = await fetchControllerLogs()
    this.setState({ data })
  }

  render() {
    return <ControlledCluster data={this.state.data} />
  }

}
