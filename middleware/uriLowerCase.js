export default async function uriLowerCase(req, res, next) {
    const lcUrl = req.url.toLocaleLowerCase()
    if (req.url !== lcUrl)
        return res.redirect(lcUrl)
    next()
}