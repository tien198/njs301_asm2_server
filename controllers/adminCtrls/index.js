import dashboard, { getRevenueTotal, getTransactionsTotal, getUsersTotal } from './dashboard.js'
import hotelManagement, { getHotelCount } from './hotelManagement.js'

export { getRevenueTotal, getTransactionsTotal, getUsersTotal, getHotelCount }
export default { ...dashboard, ...hotelManagement }
