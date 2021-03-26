const AUTH = require('./authModel')
//const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')

module.exports = {
 signup: async (request,response)=>{
    const user =  await AUTH.find({email:request.headers.email}) 
    if (user.length >= 1){
        return response.json({message: "this email is existed "})
    }
     
              else {
                  bcrypt.hash(request.headers.password,15,async(err,hash)=>{
                   if (err){
                       return response.json({message: error in password})
                   } else {
                    const auth = await new AUTH ({
                    name:request.headers.name,
                    email:request.headers.email,
                    password:hash,
                    type:request.headers.type

                }).save();

                response.json({
                    message:"create user successfully",
                    email:auth.email,
                    password:auth.password,
                    type:auth.type

                })
            }
         })
    }  

 },

login:  async(request,response)=>{
    const user = await AUTH.find({"email": request.headers.email})
    console.log(user[0].password)
    if(user < 1) {
        return response.json({message: "email not found"})
            }
            else{
                bcrypt.compare(request.headers.password,user[0].password,async(error,result) => {
                    if (error){
                        console.log("error password")
                       response.json({
                           password:"you entred wrong password please try again "
                       })
                  }
                    if (result){
                        if(user[0].type==0){
                           const token=jwt.sign({email:user[0].email,name:user[0].name},"user")
                            return response.json({
                                message:"user has login successfully",
                                password:user[0].password,
                                type:user[0].type,
                                email:user[0].email,
                               token:token,
                                
                            })
                        }
                        else{
                           const token=jwt.sign({email:user[0].email,name:user[0].name},"admin")
                            return response.json({
                                message:"admin has login successfully",
                                type:user[0].type,
                                email:user[0].email,
                               token:token,
                                password:user[0].password,

                            })
                        }
                    }
                })
            }
},
getUsers :async(request,response)=>{

    const auth = await AUTH.find()
            
              const data = auth.map(res=>{
                    return   {
                        id:res.id,
                        name:res.name,
                        email:res.email,
                        type:res.type,

                    }
                })
        
              //console.log("data",data)
        
    
            response.status(200).send({
                results:data
           })
     

}
}