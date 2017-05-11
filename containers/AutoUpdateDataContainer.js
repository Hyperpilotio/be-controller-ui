import { Component } from "react"
import RefreshIndicator from "material-ui/RefreshIndicator"


export default class AutoUpdateDataContainer extends Component {

  refreshInterval = 10000
  component = null

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      currentTimeout: null
    }
  }

  componentDidMount() {
    let timeoutFunc = async () => {
      let data = await this.updateData()
      let currentTimeout = setTimeout(timeoutFunc, this.refreshInterval)
      this.setState({ data, currentTimeout })
    }
    setTimeout(timeoutFunc, 0)
  }

  componentWillUnmount() {
    clearTimeout(this.state.currentTimeout)
  }

  render() {
    if (this.state.data === null) {
      return <RefreshIndicator left={180} top={180} status="loading" />
    } else {
      return <this.component data={this.state.data} />
    }
  }
}
