import {Router} from 'express'
import isAuth from '../../middleware/isAuth.js'
import isAdmin from '../../middleware/isAdmin.js'

const router = Router()

router.use([isAuth, isAdmin])

router.get('/get-admin',(req,res,next)=>{
    res.status(200).json('success !')
})

export default router