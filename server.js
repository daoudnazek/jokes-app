'use strict';

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
const methodOverride = require('method-override');
const { request, query } = require('express');

require('dotenv').config();
const port = process.env.PORT || 3100;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);



app.get('/', (req, res) => {
    let url = 'https://official-joke-api.appspot.com/jokes/programming/ten'
    superagent.get(url).then(result => {
        let jokesList = result.body.map(joke => new Jokes(joke))
        res.render('index', { jokes: jokesList });
    })
});

app.get('/random', (req,res) => {
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url).then(result => {
        let joke = new Jokes(result);
        res.render('rand', {joke : joke});
    })
})

app.get('/fav', (req, res) => {
    let sql = 'SELECT * FROM jokeslist'
    client.query(sql).then(result => {
        if (result.rowCount >0){
            let jokes = result.rows;
            res.render('favjokes', { jokes: jokes })
        } 
        
    })
})


app.post('/detail:id', (req, res) => {
    let joke = req.body;
    let sql = 'INSERT INTO jokeslist (type , setup, punchline) VALUES ($1 $2 $3)'
    let values = [joke.type, joke.setup , joke.punchline]
    client.query(sql, values).then(result => {
        let joke = result.row[0];
        res.render('detail', {jokes : joke} );
    })
})

app.put('/detail:id', (req, res) => {
    let joke = req.body;
    let id = query.params.id;
    let sql = `UPDATE jokeslist SET type=$1, setup=$2, punchline = $3 WHERE id =${id}`;
    let values = [joke.type, joke.setup, joke.punchline];
    client.query(sql, values).then(result => {
        res.redirect('/fav');
    })
})

app.delete('/detail:id', (req, res)=>{
    let id = query.params.id;
    let sql = `DELETE FROM jokeList WHERE id=${id}`;
    client.query(sql).then(result =>{
        res.redirect('/fav')
    })
})

app.get('/random', (req,res) => {
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url).then(result => {
        let joke = new Jokes(result);
        res.render('rand', {joke : joke});
    })
})

client.connect().then(()=>{
    app.listen((PORT) => {
        console.log(`The app is listening to port ${port}`);
    })
    })

function Jokes(data) {
    this.type = data.type
    this.setup = data.setup
    this.punchline = data.punchline
}