const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

var db

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.listen(3000, function(){
	console.log("Listening");
});

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  console.log(req.body)

  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

   	console.log('saved to database')
    res.redirect('/')
    })

})

app.put('/quotes', (req, res) => {

  console.log(req.body)

  db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A Camilo quote got deleted')
  })
})

MongoClient.connect('mongodb://user1:pass1@ds155737.mlab.com:55737/tutorial-node-js', (err, database) => {
	if(err) return console.log(err);
	db = database;
	app.listen(3001, () => {
		console.log('Listening on 3001');
	})
})