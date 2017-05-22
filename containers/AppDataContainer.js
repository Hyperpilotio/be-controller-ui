import apis from "../apis/client"
import AppDataGraphs from "../components/AppDataGraphs"
import { MultiSeriesFetchUpdateManager } from "./AutoUpdateDataContainer"


export default class AppDataContainer extends MultiSeriesFetchUpdateManager {

  component = AppDataGraphs

  async fetchLatestUpdate() {
    let query
    if (this.dataAlready)
      query = { after: this.getAfterParam() }

    let data = await apis.appData(query)

    data = data.map(series => (
      series.map( ([time, value]) => [ new Date(time), value ] )
    ))
    return data
  }
}
