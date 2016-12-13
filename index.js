require('dotenv').config();

const express = require('express');
const app = express();

const pg = require('pg');
const dburl = process.env.DBURL

const port = process.env.PORT;

app.get('/', (request, response) => {
  response.redirect('/index');
});
app.get('/index', (request, response) => {
  response.sendfile('index.html');
});

app.get('/connect', (request, response) => {
  const client = new pg.Client(dburl);
  client.connect()

   const query = client.query("SELECT email FROM applicants where email like '" + request.query.query +"%' limit 10");
   let results = []

    query.on('row', function(row,result) {
         result.addRow(row);
    });

    query.on('end', function(result) {
      client.end();
      response.json( result.rows);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});
