require('dotenv').config()

const express = require('express')
const app = express()

const pg = require('pg')
const dburl = process.env.DBURL

const port = process.env.PORT

app.get('/', (request, response) => {
  response.redirect('/index')
})
app.get('/index', (request, response) => {
  response.sendfile('index.html')
})

app.get('/connect', (request, response) => {
  const client = new pg.Client(dburl)
  client.connect()

  let qrystr = request.query.query.trim()
  const find = ' '
  const regex = new RegExp(find, 'g')

  let txtqry = qrystr.includes(' ') ? ('\'' + qrystr.replace(regex, ' & ') + '\'') : ('\'' + qrystr + ':*' + '\'')
  const stmt = 'SELECT name as applicant, email FROM applicants WHERE to_tsvector(\'English\',name) @@ to_tsquery(' + txtqry + ')'
  console.log(stmt)
  const query = client.query(stmt)

  query.on('row', function (row, result) {
    result.addRow(row)
  })

  query.on('end', function (result) {
    client.end()
    response.json(result.rows)
  })
})

app.listen(port, () => {
  console.log(`listening on port ${ port }`)
})
