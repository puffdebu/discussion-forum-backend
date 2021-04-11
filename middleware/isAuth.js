const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeaders = req.get('Authorization');
    if(!authHeaders){
        const error = new Error('Not Authorized to access the resource!');
        error.statusCode = 403;
        throw error;
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token,'Diss-Kusion-FOUR-UMMM',(err,decodedToken) => {
        if(err){
            const error = new Error('Authorization failed.');
            error.statusCode = 403;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    })
};
