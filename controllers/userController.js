import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()
export function saveUser(req,res){


   if(req.body.role=="admin") {

if(req.user==null){

res.status(403).json({

message:"please login as admin before creating admin account"


});
return;

}


if(req.user.role!="admin"){
res.status(403).json({

message:"you are not authorized to create admin account"
});
return;
}

   }




const hashPassword=bcrypt.hashSync(req.body.password,10)



const user=new User ({
    email:req.body.email,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    password:hashPassword,
    role:req.body.role,
   


});

user.save().then(

()=>{

res.json({

    message:"user saved successfully"
})

}

).catch(

()=>{


res.status(500).json({

message:"user not saved"

}
)
}

)

}

export function loginUsers(req,res){

const email=req.body.email;
const password=req.body.password;

User.findOne({

email:email


}).then(

(user)=>{

if(user==null){

res.status(404).json({

message:"Invalid email"

})


}

else{

const isPasswordCorrect=bcrypt.compareSync(password,user.password)

if(isPasswordCorrect){

{
const useData={

email:user.email,
firstName:user.firstName,
lastName:user.lastName,
role:user.role,
phone:user.phone,
isDisable:user.isDisable,
isEmailVerified:user.isEmailVerified


}

const token=jwt.sign(useData,process.env.JWT_KEY)

res.json({
message:"login successfully",
token:token,
user:useData

});

}


}
else{

res.status(403).json({

message:"invalid password"

})


}


}

}

)

}


export async function googleLogin(req, res) {
    const accessToken = req.body.accessToken;
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });

        const user = await User.findOne({ email: response.data.email });

        const userData = {
            email: response.data.email,
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            role: user?.role || "user",
            isEmailVerified: true,
            password: user?.password || accessToken,
            isDisable: user?.isDisable || false,
            phone: user?.phone || "not given"
        };

        // If user does not exist, save it
        if (user == null) {
            const newUser = new User({
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                isEmailVerified: true,
                password: accessToken
            });
            await newUser.save();
        }

        const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "48h" });
        return res.json({
            message: "Login successful",
            token,
            user: userData
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Google login failed" });
    }
}


export function getCurrentUser(req, res) {
  if (req.user == null) {
    return res.status(401).json({
      message: "unauthorized"
    });
  }

  res.json({ user: req.user });  // ✅ Wrap in `user` key
  console.log("ppppp ", req.user);
}


export function getAllUsers(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  // Include 'role' in the selected fields
  User.find({}, "firstName lastName email role")
    .then((users) => {
      res.status(200).json({ users }); // ✅ Wrap in `users` key
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching users",
        error: error.message,
      });
    });
}

export default {
    saveUser,
    loginUsers,
    googleLogin,
    getCurrentUser,
    getAllUsers,
};

