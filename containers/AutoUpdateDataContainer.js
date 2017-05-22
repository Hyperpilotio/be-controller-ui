import { Component } from "react"
import RefreshIndicator from "material-ui/RefreshIndicator"
import _ from "lodash"


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
    this.setState({ currentTimeout: setTimeout(timeoutFunc, 0) })
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


export class FetchUpdateManager extends AutoUpdateDataContainer {

  dataStore = []
  headIndex = 0
  dataAlready = false

  async updateData() {
    let data = await this.fetchLatestUpdate()

    if (this.dataAlready === false && !_.isEmpty(data))
      this.dataAlready = true

    if (_.some(_.last(data), _.isNull))
      data = data.slice(0, data.length - 1)

    this.dataStore = this.dataStore.concat(data)

    while (_.get(this.dataStore[this.headIndex], 0) < new Date() - (1000 * 60 * 5))
      this.headIndex++

    return this.dataStore.slice(this.headIndex)
  }

}
