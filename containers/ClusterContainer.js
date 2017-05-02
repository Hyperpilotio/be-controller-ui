import { Component } from "react"
import _ from "lodash"
import fetchControllerLogs from "../apis/controller-log"
import ControlledCluster from "../components/ControlledCluster"


export default class ClusterContainer extends Component {

  constructor(props) {
    let data = _.get(props, "initialData", {})
    super(_.omit(props, "initialData"))
    this.state = { data }
  }

  async refreshData() {
    let data = await fetchControllerLogs()
    this.setState({ data })
  }

  render() {
    return <ControlledCluster data={this.state.data} />
  }

}
