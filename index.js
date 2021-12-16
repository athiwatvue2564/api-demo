const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bodyParser = require('body-parser')
const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'vaccine',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send({ ok: 1 })
})

try {
  app.post('/save', async (req, res) => {
    console.log('data=', req.body)
    let row = await db('register').insert({
      fullname: req.body.username,
      bacount: req.body.bacount,
      tel: req.body.mobile,
      email: req.body.email,
      passwd: req.body.passwd,
    })
    res.send({
      status: 1,
    })
  })
} catch (e) {
  console.log('NOT SUCCEES')
  console.log(e.message)
  res.send({
    status: 0,
    error: e.message,
  })
}

app.get('/list', async (req, res) => {
  console.log(req.query.user)
  console.log(req.query.pass)
  try {
    let row = await db('users_student')
      .where({ student_id: req.query.user, major_id: req.query.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user/pass ไม่ถูกต้อง')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})
app.listen(7001, () => {
  console.log('ready:7001')
})
