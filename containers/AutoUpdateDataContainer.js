import { Component } from "react"
import RefreshIndicator from "material-ui/RefreshIndicator"
import _ from "lodash"

const SECOND = 1000
const MINUTE = SECOND * 60

export default class AutoUpdateDataContainer extends Component {

  refreshInterval = 10 * SECOND
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

    // Append updates to the original data
    this.dataStore = this.dataStore.concat(data)

    // Find index for the first data point to show on the graph
    this.headIndex = _.findIndex(
      this.dataStore,
      r => r[0] > new Date() - (5 * MINUTE),
      this.headIndex
    )

    return this.dataStore.slice(this.headIndex)
  }

  getAfterParam() {
    return _.invoke(_.last(this.dataStore), "0.getTime")
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

    // Append updates to the original data
    this.dataStore = _
      .zip(this.dataStore, data)
      .map( _.spread(_.concat) )

    // Find index for the first data point to show on the graph
    this.headIndices = _
      .zip(this.dataStore, this.headIndices)
      .map(([series, idx]) =>
        _.findIndex( series, r => r[0] > new Date() - (5 * MINUTE), idx )
      )

    let displayedData = _
      .zip(this.dataStore, this.headIndices)
      .map( _.spread(_.slice) )

    // Collect timestamps for filling empty values later
    let allTimestamps = _.bindAll(new Set(), "add")
    displayedData.forEach(
      // Converting to numerical timestamps because of the behaviour of Set
      series => _.map(series, "0.getTime").forEach( allTimestamps.add )
    )
    allTimestamps = Array.from(allTimestamps)

    // Fill missing timestamps of each series to avoid graph resizing
    displayedData = displayedData.map(series => {
      let patches = []
      if (!_.isEmpty(series)) {
        patches = _
          .difference(allTimestamps, _.map(series, "0.getTime"))
          .map(ts => [
            new Date(ts),
            // Fill the rest with nulls
            ..._.times( _.last(series).length - 1, _.constant(null) )
          ])
      }
      return _.concat(patches, series)
    })

    return displayedData
  }

  getAfterParam() {
    // Using min to avoid mis-fetching data
    return _.min(this.dataStore.map(
      srs => _.invoke(_.last(srs), "0.getTime")
    ))
  }

}
