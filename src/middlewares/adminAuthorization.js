const adminRoutes= (req,res, next)=>{
    if (!req.session.admin) {
        return res.redirect('/products')
    }
    next()
}
export default adminRoutes