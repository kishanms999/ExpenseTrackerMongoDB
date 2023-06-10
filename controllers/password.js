const  uuid=require('uuid');
const bcrypt = require("bcrypt"); 
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const User = require('../models/User');
const Forgotpassword = require('../models/forgotpassword');

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key'];
apiKey.apiKey= process.env.API_KEY ;


const forgotPassword = async (req,res) =>{
    try{
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sendEmail = { 
            to: [{ email: email }], 
            sender: { 
              email: "kishanms99@gmail.com", 
              name: "Kishan", 
            }, 
            subject: "Reset Your Password", 
            htmlContent: `<p>Hello,</p> 
                          <p>Please click the following link to reset your password:</p> 
                          <p><a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a></p> 
                          <p>If you did not request a password reset, please ignore this email.</p> 
                          <p>Thank you!</p>`, 
          }; 
        await tranEmailApi.sendTransacEmail(sendEmail);
        return res.status(200).json({message:'Mail sent to your email id',success:true})
        } else{
            throw new Error("User doesn't exist");
        }
    } catch(err){
        res.status(500).json({message:err,success:false})
    }
}

const resetPassword = async (req, res) => { 
    try { 
      const id = req.params.id; 
      const forgotpasswordrequest = await Forgotpassword.findOne({ 
        where: { id }, 
      }); 
      if (forgotpasswordrequest) { 
        forgotpasswordrequest.update({ active: false }); 
        res.status(200).send(`<!DOCTYPE html> 
          <html> 
          <head> 
          </head> 
          <body> 
              <form action="/password/updatepassword/${id}" method="get"> 
                  <label for="newpassword">Enter New Password</label> 
                  <input name="newpassword" type="password" required> 
                  <button>Reset Password</button> 
              </form> 
          </body> 
          </html> 
          `); 
        res.end(); 
      } 
    } catch (error) { 
      console.log({ password_controller: error }); 
    } 
  }; 

  const updatePassword = async (req, res) => { 
    try { 
      const { newpassword } = req.query; 
      const { resetpasswordid } = req.params; 
      resetpasswordrequest = await Forgotpassword.findOne({ 
        where: { id: resetpasswordid }, 
      }); 
      const user = await User.findOne({ 
        where: { id: resetpasswordrequest.userId }, 
      }); 
      if (user) { 
        const saltRounds = 10; 
        bcrypt.genSalt(saltRounds, function (err, salt) { 
          if (err) { 
            console.log(err); 
            throw new Error(err); 
          } 
          bcrypt.hash(newpassword, salt, function (err, hash) { 
            if (err) { 
              console.log(err); 
              throw new Error(err); 
            } 
            user.update({ password: hash }).then(() => { 
              res 
                .status(201) 
                .json({ message: "Successfuly update the new password" }); 
            }); 
          }); 
        }); 
      } else { 
        return res.status(404).json({ error: "No user Exists", success: false }); 
      } 
    } catch (error) { 
      return res.status(403).json({ error, success: false }); 
    } 
  }; 


module.exports={
    forgotPassword,
    resetPassword,
    updatePassword
}