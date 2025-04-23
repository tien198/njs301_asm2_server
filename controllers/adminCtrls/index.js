import dashboard, { getRevenueTotal, getTransactionsTotal, getUsersTotal } from './dashboard.js'
import hotelManagement, { getHotelCount, getHotels } from './hotelManagement.js'

export { getRevenueTotal, getTransactionsTotal, getUsersTotal, getHotelCount, getHotels }
export default { ...dashboard, ...hotelManagement }
