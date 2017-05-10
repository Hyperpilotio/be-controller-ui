import { Component } from "react"
import Router from "next/router"
import _ from "lodash"
import apis from "../apis/client"
import AppDataGraphs from "../components/AppDataGraphs"
import RefreshIndicator from "material-ui/RefreshIndicator"


export default class NetPanelContainer extends Component {
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
    let data = await apis.appData()
    data = data.map(series => (
      series.map( ([time, value]) => [ new Date(time), value ] )
    ))
    this.setState({ data })
  }

  render() {
    if (this.state.data === null) {
      return <RefreshIndicator left={180} top={180} status="loading" />
    } else {
      return <AppDataGraphs data={this.state.data} />
    }
  }
}
