const express = require('express')
const app = express()
const bodyParser=require('body-parser')

 


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/book';
var db;var s;
MongoClient.connect( url, (err, database) => {
    if (err) return console.log(err)
    db=database.db('book')
    app.listen(3000,()=>{
      console.log('Connected to database ; listening to port 3000') 
    })
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
  db.collection('booklist').find().toArray((err,result)=>{
    if(err) return console.log(err)
    res.render('homepage.ejs',{data:result})
  })
});

app.get('/create', (req,res)=>{
  res.render('addnewbook.ejs')
})

app.get('/updatestock', (req,res)=>{
  res.render('update.ejs');
})

app.get('/deletebook', (req,res)=>{
  res.render('delete.ejs');
})

app.post('/AddData',(req,res)=>{
  db.collection('booklist').save(req.body, (err,result)=>{
    if(err) return console.log(err)
    res.redirect('/');
  })
})

app.post('/update', (req,res)=>{
  db.collection('booklist').find().toArray((err,result)=>{
    if(err)
      return console.log(err)
    for(var i=0;i<result.length; i++)
    {
        if(result[i].pid==req.body.id)
        {
          s=result[i].copies
          break
        }
      }
      db.collection('booklist').findOneAndUpdate({pid :parseInt(req.body.id)},{
        $set:{copies: parseInt(s) + parseInt(req.body.copies)}},{sort:{_id:-1}},
        (err,result)=>{
          if(err)
            return res.send(err)
          console.log(req.body.id+' stock updated')

          res.redirect('/')
        })
      })
    })

app.post('/delete',(req,res)=>{
  db.collection('booklist').findOneAndDelete({pid:req.body.id},(err,result)=>{
    if (err)
      return console.log(err)
    res.redirect('/')
  })
})