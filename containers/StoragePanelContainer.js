import Router from "next/router"
import apis from "../apis/client"
import StorageController from "../components/StorageController"
import { MultiSeriesFetchUpdateManager } from "./AutoUpdateDataContainer"


export default class StoragePanelContainer extends MultiSeriesFetchUpdateManager {
  component = StorageController

  async updateData() {
    let query = { node: Router.query.id }
    if (this.dataAlready) query.after = this.getAfterParam()

    let data = await apis.blkioData(query)
    data = data.map( ([time, ...row]) => [ new Date(time), ...row ] )
    return data
  }
}
