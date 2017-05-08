import { Component } from "react"
import Router from "next/router"
import _ from "lodash"
import apis from "../apis/client"
import CpuQuotaController from "../components/CpuQuotaController"
import RefreshIndicator from "material-ui/RefreshIndicator"


export default class CpuPanelContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      currentTimeout: null
    }
  }

  componentDidMount() {
    let timeoutFunc = async () => {
      await this.updateData()
      this.setState({
        currentTimeout: setTimeout(timeoutFunc, 10000)
      })
    }
    setTimeout(timeoutFunc, 0)
  }

  componentWillUnmount() {
    clearTimeout(this.state.currentTimeout)
  }

  async updateData() {
    let data = await apis.cpuQuotaData({ node: Router.query.id })
    data = data.map( ([time, ...row]) => [ new Date(time), ...row ] )
    this.setState({ data })
  }

  render() {
    if (this.state.data === null) {
      return <RefreshIndicator left={180} top={180} status="loading" />
    } else {
      return <CpuQuotaController data={this.state.data} />
    }
  }
}
