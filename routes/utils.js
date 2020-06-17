module.exports.isLogined = (req, res) =>{
    if(req.user){
        return true;
    }else{
        return false;
    }
};

