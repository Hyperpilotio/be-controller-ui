import { Tabs, Tab } from "material-ui/Tabs"
import { Row, Col } from "react-grid-system"
import Settings from "./Settings"


export default ({ controllers, selectedController, select, controllerPanel }) => (
  <Tabs value={selectedController} onChange={select}>
    {controllers.map(({name, settings}) => (
      <Tab label={name} value={name} key={name}>
        <Row>
          <Col sm={7}>{_.get(controllerPanel, name)}</Col>
          <Col sm={5}>
            <Settings settings={settings} />
          </Col>
        </Row>
      </Tab>
    ))}
  </Tabs>
)
