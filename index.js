
const app = require("express")();

// is a middleware to transform the body of every request
const bodyParser = require("body-parser")

//this package is used for data validation
const Joi = require("joi");
const nodemon = require("nodemon");
const morgan = require("morgan")
const mongoose = require("mongoose")
const mongoURI = "mongodb+srv://usertest:1234@cluster0.8o1xo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(mongoURI,{useNewUrlParser:true,useUnifiedTopology:true}).then((result)=>
    console.log("connected to database")
).catch(err=>{
    console.log("error")
})
const Name = require("./models/Name")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// bech nbadloha b DB : SQL // NoSQL 

//List 
const names = [
    {id:1,name:"Motez"},
    {id:2,name:"aziz"},
    {id:3,name:"meher"}
]


// READ 
// READ the collection [ Motez,Aziz,Meher]
app.get('/api/names',(req,res)=>{
    const sayed = Name.findOne({ name:"sayed" }).then((result)=>{
        console.log(result)}).catch((err)=>{console.log(err)}
        )
})
//READ 
// Read names Details by id 
app.get('/api/names/:id',(req,res)=>{
   const id= req.params.id
    // bech trajaali el nom mel liste of names 
   const name  = names.find((n=>{if (n.id == id){return n}})) 
   if (!name){
       res.status(404).send({"error":"name not found"})
   }
   res.status(200).send(JSON.stringify(name))
})

app.post("/api/names/",(req,res)=>{
    //validation of data;
    const nameSchema = Joi.object({
        name: Joi.string().min(4).max(16).required()
    })
    const validation = nameSchema.validate(req.body)
    // ken thama mochkla 
    // bech yarj3ou fi object esmou error
    if (validation.error){
        res.status(400).send(JSON.stringify({"msg":validation.error.details[0].message}))
    }
    // nekhou aka body => body.name 
    // nlawej ala id lel instance jdida
    // nzidou fel liste
    // nrajaa response feha status code 201 el element url 
    const name  = {
        id:names.length+1,
        name:req.body.name
    }
    names.push(name)
    //Schema : moule pour mes données {body } validili ? mriguel : lé 
   res.status(201).send(JSON.stringify({...name,url:`http://localhost:3000/api/names/${name.id}`}))
})

app.delete("/api/names/:id",(req,res)=>{
    const id = req.params.id
    // bech nparcouri liste nlawej al id mawjoud ou non
    const indiceName = names.map((n)=>{
        {
            return n.id
        }
    }).indexOf(parseInt(id))
    
    if (indiceName==-1){
        res.status(404).send(JSON.stringify({"error":"name not found"}))
    }
    //kol chay mché shih
    names.splice(indiceName,1)
    res.status(204)
})

app.put("/api/names/:id",(req,res)=>{
    const id = parseInt(req.params.id)
    
    //validation of my data
    const nameSchema = Joi.object({
        name: Joi.string().min(4).max(16).required()
    })
    const validation = nameSchema.validate(req.body)
    // ken thama mochkla 
    // bech yarj3ou fi object esmou error
    if (validation.error){
        res.status(400).send(JSON.stringify({"msg":validation.error.details[0].message}))
    }
    names.map((n)=>{
        if (id == n.id)
        {
           n.name = req.body.name
        }
    })
    res.status(200).send(JSON.stringify(names))
    
})
// Un APIrest CRUD 

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`running on port ${port}...`)
})