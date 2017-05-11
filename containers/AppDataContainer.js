import apis from "../apis/client"
import AppDataGraphs from "../components/AppDataGraphs"
import AutoUpdateDataContainer from "./AutoUpdateDataContainer"


export default class AppDataContainer extends AutoUpdateDataContainer {

  component = AppDataGraphs

  async updateData() {
    let data = await apis.appData()
    data = data.map(series => (
      series.map( ([time, value]) => [ new Date(time), value ] )
    ))
    return data
  }
}
