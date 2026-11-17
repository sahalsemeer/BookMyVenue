const authorize = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.user.role);
        if(!req.user){
            return res.status(401).json({message:"Authentication required!"})
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'You do not have permission to perform this action'})
        }
        next()

    }
}


module.exports = {authorize}