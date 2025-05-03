import dashboardCtrl from './dashboardCtrl.js'
import hotelCtl from './hotelCtrls.js'
import roomCtrl from './roomCtrl.js'
import transactionCtrl from './transactionCtrl.js'



export default {
    ...dashboardCtrl, ...hotelCtl, ...roomCtrl, ...transactionCtrl
}
