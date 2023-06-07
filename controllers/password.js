const Sib = require('sib-api-v3-sdk');
require('dotenv').config();



const resetPassword = async (req,res) =>{
    try{
        const email=req.body.email;
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey= process.env.API_KEY ;
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender={
            email:'kishanms99@gmail.com'
        }
        const receivers=[{
            email:email
        }]

        await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'Dummy Email',
            textContent:'This is a dummy email to check if this works'
        })
        return res.status(201).json({message:'Mail sent to your email id'})
    } catch(err){
        res.status(500).json(err)
    }
}

module.exports={
    resetPassword
}