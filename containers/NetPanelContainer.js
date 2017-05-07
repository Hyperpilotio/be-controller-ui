import { Component } from "react"
import Router from "next/router"
import _ from "lodash"
import apis from "../apis/client"
import NetController from "../components/NetController"


export default class NetPanelContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [[new Date(), 0, 0]],
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
    let data = await apis.netData({ node: Router.query.id })
    data = [
      data[0],
      ...data.slice(1).map(([time, ...row]) => [ new Date(time), ...row ])
    ]
    console.log(data)
    this.setState({ data })
  }

  render() {
    return <NetController data={this.state.data} />
  }
}
