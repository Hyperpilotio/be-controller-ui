import Router from "next/router"
import apis from "../apis/client"
import StorageController from "../components/StorageController"
import AutoUpdateDataContainer from "./AutoUpdateDataContainer"


export default class StoragePanelContainer extends AutoUpdateDataContainer {
  component = StorageController

  async updateData() {
    let data = await apis.blkioData({ node: Router.query.id })
    data = data.map( ([time, ...row]) => [ new Date(time), ...row ] )
    return data
  }
}
