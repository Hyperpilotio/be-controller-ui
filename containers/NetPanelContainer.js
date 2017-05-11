import Router from "next/router"
import apis from "../apis/client"
import NetController from "../components/NetController"
import AutoUpdateDataContainer from "./AutoUpdateDataContainer"


export default class NetPanelContainer extends AutoUpdateDataContainer {
  component = NetController

  async updateData() {
    let data = await apis.netData({ node: Router.query.id })
    data = data.map( ([time, ...row]) => [ new Date(time), ...row ] )
    return data
  }
}
