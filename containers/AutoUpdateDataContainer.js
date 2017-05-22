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

  getAfterParam() {
    return _.last(this.dataStore)[0].getTime()
  }

}

export class MultiSeriesFetchUpdateManager extends AutoUpdateDataContainer {

  dataStore = null
  headIndices = null
  dataAlready = false

  async updateData() {
    let data = await this.fetchLatestUpdate()

    if (this.dataAlready === false) {
      this.dataStore = _.times(data.length, _.constant([]))
      this.headIndices = _.times(data.length, _.constant(0))
      this.dataAlready = true
    }

    data = data.map(series => (
      _.some(_.last(series), v => v === 0 || _.isNull(v))
        ? series.slice(0, data.length - 1)
        : series
    ))

    this.dataStore = _.zip(this.dataStore, data).map(_.spread(_.concat))

    this.headIndices =
      _.zip(this.dataStore, this.headIndices).map(([series, idx]) => {
        while (_.get(series[idx], 0) < new Date() - (1000 * 60 * 5)) idx++
        return idx
      })

    return _.zip(this.dataStore, this.headIndices).map(_.spread(_.slice))
  }

  getAfterParam() {
    return _.min(this.dataStore.map(srs => _.invoke(_.last(srs), "0.getTime")))
  }

}
