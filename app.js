require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const cors = require("cors");
const Datastore = require("nedb");
const db = new Datastore({filename:"./database.json"});
db.loadDatabase();

app.listen(PORT,()=>console.log("listening on port ",PORT));

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

app.get('/',(req,res)=>res.send("this is the home route!"));

app.post("/sendData",(req,res)=>{
	db.insert(req.body,(err,newDoc)=>{
		if(!err){
			res.send(newDoc);
		}else{
			res.sendStatus(500);
			return;
		}
	});
});

app.get("/getallTodos",(req,res)=>{
	db.find({},(err,docs)=>{
		if(!err){
			res.send(docs);
		}else{
			res.sendStatus(500);
		}
	});
});


app.post('/deleteTodo',(req,res)=>{
	let id = req.body.id;
	db.remove({_id:id},{},(err,numRemoved)=>{
		if(!err){
			res.send({
				numRemoved
			});
		}else{
			res.sendStatus(500);
		}
	});
});


app.post('/updateTodo',(req,res)=>{
	db.update({_id:req.body.id},{$set : {"data.state": req.body.state }} ,function(err,numReplaced){
		if(!err){
			res.send(req.body.id);
		}else{
			res.sendStatus(500);
		}
	});
})












