import dashboardCtrl from './dashboardCtrl.js'
import hotelCtl from './hotelCtrls.js'
import roomCtrl from './roomCtrl.js'
import typeCtrl from './typeCtrl.js'



export default { ...dashboardCtrl, ...hotelCtl, ...roomCtrl, ...typeCtrl }
