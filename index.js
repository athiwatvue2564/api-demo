const express = require('express')
const cors = require('cors')
const knex = require('knex')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'ctc',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})

app.get('/list', async (req, res) => {
  console.log(req.query.user)
  try {
    let row = await db('users_student')
      .where({student_id: req.query.user || 0 })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('User/pass ไม่ถูกต้อง')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    res.send({
      status: 0,
      error: e.message,
    })
  }
})

app.listen(7001, () => {
  console.log('ready:7001')
})
