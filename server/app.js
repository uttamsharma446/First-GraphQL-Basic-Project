require('dotenv').config()
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
//graphqlHTTP
const {graphqlHTTP}=require("express-graphql");
const schema =require("./Schema/schema")
const app=express();
app.use(cors());
///connecting to mongodb with db_uri

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if(!err)
    {
        console.log("connected to database")
    }
    else{
        console.log(err)
    }

});


app.use("/graphql",graphqlHTTP({
    schema,graphiql:true
}));

app.listen(4000,()=>{
    console.log("server started on port 4000");
})
