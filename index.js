const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
const PORT = process.env.PORT || 8080;

//mongodb connection
// console.log(process.env.MONGODB_URL)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection to Database");
  })
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});
const userModel = mongoose.model("user", userSchema);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("server is Running");
});
// signup
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  } catch (err) {
    console.log(err);
  }
});

// if(result){
//     res.send({message :"Email id is already register"})
// }
// else{
//     const data=userModel(req.body)
//     const save=data.save()
//     res.send({message:"Successfully sign up"})
// }

//login
app.post("/login",async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const userData = await userModel.findOne({ email: email });
     if (userData) {
       //console.log(userData)
      const dataSend={
        _id: userData._id,
        firstName: userData.firstName,
       lastName: userData.lastName,
       email: userData.email,
       image:userData.image,
      };
      
      res.send({ message: "Login is Successful", alert: true ,data:dataSend});
    }
     else {
        res.send({ message: "Email is not registered ,Please go into Sign up page", alert: false});
   
    }
  } catch (err) {
    console.log(err);
  }
});

//product list
const schemaProduct=mongoose.Schema({
     name:String,
    category:String,
    image:String,
    price:String,
    description:String
})

const productModel=mongoose.model("product",schemaProduct);

// upload in database mongodb
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body);
  const data=await productModel(req.body)
  const dataSave=await data.save() ;
  res.send({message:"Upload Sucessfully"})
})

// to get data
app.get("/product",async (re,res)=>{
  const data= await productModel.find({})
  res.send(JSON.stringify(data)) ;
})


if(process.env.NODE_ENV=="production"){
  app.use(express.static("frontend/build"));
}

app.listen(PORT, () => {
  console.log(`Connection is enable at ${PORT}`);
});
