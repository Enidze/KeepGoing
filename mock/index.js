const express = require('express')
const fs = require('fs')
const url = require('url')
const bodyParser = require('body-parser')
const app = express()
const Token = require('./token')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
let mysql = require('mysql')
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'KeepGoing',
  port: 3306,
  encoding: 'utf8'
})

let multer = require('multer')
let temp = multer({ dest: 'uploads/temp/' })  // 中间文件夹，所有的文件先传到这个文件夹中

let sql = ''
let param = ''

app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

/*从数据库删除没有对应文件的数据*/
let initDate = async () => {
  sql = 'SELECT * FROM articles_info'
  let result = await operateSql('articles_info', sql)
  for(let index in result){
    fs.access(`uploads/articleFiles/${result[index].sort}/${result[index].fileName}.docx`,async err => {
      if (err && err.code === 'ENOENT'){
        sql = `DELETE FROM articles_info WHERE fileName = '${result[index].fileName}'`
        await operateSql('articles_info',sql)
        // console.log(`uploads/articleFiles/${result[index].sort}/${result[index].fileName}`)
      }else {
        console.log('exists')
      }
    })
  }
}

app.all('*', async function(req, res, next) {
  // await initDate()
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.get('/', (req, res, next) => {
  res.send({
    success: true
  })
})

/*
* 操作数据库方法
* params:
*   1 baseName:数据表名
*   2 sql:SQL语句
*   3 operation:操作（insert，select，delete，update）
*/
let operateSql = (baseName, sql) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, function(err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
          connection.release()
        })
      }
    })
  })
}

/*
* 提取param的key、value
*/
let forObject = (param) => {
  let insertKey = []
  let insertValue = []
  let updateKeyAndValue = []
  for (let key in param) {
    if (!param.hasOwnProperty(key)) continue
    if (key === 'id') continue
    insertKey.push(key)
    insertValue.push(`'${param[key]}'`)
    updateKeyAndValue.push(`${key}='${param[key]}'`)
  }
  return {
    insertKey: insertKey.toString(),
    insertValue: insertValue.toString(),
    updateKeyAndValue: updateKeyAndValue.toString()
  }
}

app.post('/userConfirm', async (req, res) => {
  param = JSON.parse(req.body.data)
  sql = `UPDATE users SET applyDate='${param.applyDate}',
                            applyDeadline='${param.applyDeadline}',
                            applyId='${param.applyId}' WHERE username='${param.username}'`
  let result = await operateSql('users', sql, 'update')
  res.end(JSON.stringify(result))
})

app.post('/userApply', async (req, res) => {
  param = JSON.parse(req.body.data)
  sql = `UPDATE users SET applyName='${param.applyName}',
                           applyDuration='${param.applyDuration}',
                           applyIsCoach='${param.applyIsCoach}',
                           applyCoach='${param.applyCoach}',
                           applyCoachCourse='${param.applyCoachCourse}',
                           applyDate=${null},
                           applyDeadline=${null},
                           applyCost='${param.applyCost}' WHERE username='${param.username}'`
  console.log(sql)
  let result = await operateSql('users', sql, 'update')
  res.end(JSON.stringify(result))
})

app.post('/userCollect', async (req, res) => {
  param = JSON.parse(req.body.data)
  let collectSort = req.query.collectSort
  sql = `UPDATE users SET ${collectSort}='${param.id}' WHERE username='${param.username}'`
  let result = await operateSql('users', sql, 'update')
  res.end(JSON.stringify(result))
})

app.post('/userInfo', async (req, res) => {
  param = JSON.parse(req.body.data)
  let operation = req.query.operation
  if (operation === 'select') {
    sql = `SELECT * FROM users WHERE username='${param.username}'`
  } else if (operation === 'update') {
    sql = `UPDATE users SET username='${param.username}',
                            gender='${param.gender}',
                            height='${param.height}',
                            weight='${param.weight}',
                            picture='${param.picture}',
                            birth='${param.birth}' WHERE id=${param.id}`
  } else if (operation === 'systemSelect') {
    sql = `SELECT * FROM users`
  } else if (operation === 'systemSelectByName') {
    sql = `SELECT * FROM users WHERE applyName like '%${param.applyName}%'`
  }
  let result = await operateSql('users', sql, operation)
  res.end(JSON.stringify(result))
})

app.post('/register', async (req, res) => {
  param = JSON.parse(req.body.data)
  sql = `SELECT * FROM users WHERE username='${param.username}'`
  let result = await operateSql('users', sql)
  if (!result.length) { /*要注册的账号不存在，可以注册*/
    sql = `INSERT INTO users(username,password) VALUES ('${param.username}','${param.password}') `
    let result = await operateSql('users', sql)
    if (result) {
      res.end(JSON.stringify('success'))
    }

  } else {
    res.end(JSON.stringify('exist'))
  }
})

app.post('/login', async (req, res) => {
  const param = JSON.parse(req.body.data) /*bug1 operateSql后 param被改变了 原因不明*/
  // 先判断id对应的用户是否存在
  if (param.id) {
    sql = `SELECT * FROM users WHERE id=${param.id}`
    let result = await operateSql('users', sql)
    if (result.length) {
      // 判断token是否还存在
      if (param.token !== null) {
        let token = await new Token(param).verifyToken()
        if (token === 'success') {
          // 删除原来的token，存入一个新的
          // new Token(param).clearToken();
          let token = new Token({ id: param.id }).createToken()
          let back = {
            id: param.id,
            token: token,
            username: result[0].username
          }
          console.log(`自动登录生成的数据:${JSON.stringify(back)},原先的token：${param.token}`)
          res.end(JSON.stringify(back))
        }
      }
    }
  } else {
    // 手动登录
    sql = `SELECT * FROM users WHERE username='${param.username}' AND password='${param.password}'`
    let result = await operateSql('users', sql)
    if (result.length) {
      let id = result[0].id.toString()
      // 将用户id传入并生成token
      let token = new Token({ id: id }).createToken()
      let back = {
        id: id,
        username: result[0].username,
        token: token
      }
      console.log(`手动登录生成的数据:id:${JSON.stringify(back)}`)
      res.end(JSON.stringify(back))
    } else {
      res.end(JSON.stringify('error'))
    }
  }
  res.end(JSON.stringify('error'))
})

app.post('/exit', async (req, res) => {
  param = JSON.parse(req.body.data)
  let token = await new Token({ id: param.id }).clearToken()
  if (token === 'success') {
    res.end(JSON.stringify(token))
  } else {
    res.end(JSON.stringify('error'))
  }
})

app.post('/course', async (req, res) => {
  param = JSON.parse(req.body.data)
  let operation = req.query.operation
  sql = 'SELECT * FROM courses_info'
  let select = 'SELECT * FROM courses_info'
  switch (operation) {
    case 'select':
      sql = `SELECT * FROM courses_info`
      if (param) {
        if (param.name) sql = `${sql} WHERE name in (${param.name})`
        else if (param.id) sql = `${sql} WHERE id in (${param.id})`
        else if (param.data) sql = `${sql} WHERE name LIKE '%${param.data.replace(/'/g, '')}%'`
        else if (param.part) {
          if (typeof param.part === 'string') {
            sql = `${sql} WHERE part LIKE '%${param.part.replace(/'/g, '')}%' AND strong IN (${param.strong})`
          } else if (typeof param.part === 'object') {
            sql = `${sql} WHERE part IN (${param.part}) AND strong IN (${param.strong})`
          }
        }
      }
      sql = `${sql} ORDER BY name`
      break
    case 'insert':
      sql = `INSERT INTO courses_info (${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE courses_info SET ${forObject(param).updateKeyAndValue} WHERE id='${param.id}'`
      break
    case 'delete':
      sql = `DELETE FROM courses_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('courses_info', sql)
  res.end(JSON.stringify(result))
})

app.post('/course-date', async (req, res) => {
  // course date cost minute actions id
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    case 'select':
      sql = 'SELECT * FROM courses_dates_info'
      if (param) {
        if (param.id) sql = `${sql} WHERE id in (${param.id})`
        else if (param.data) sql = `${sql} WHERE course LIKE '%${param.data}%'`
        else if (param.actions) sql = `${sql} WHERE actions like '%${param.actions}%'`
        else if (param.course) sql = `${sql} WHERE course = '${param.course}'`
      }
      sql = `${sql} ORDER BY course`
      break
    case 'insert':
      sql = `INSERT INTO courses_dates_info(${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE courses_dates_info SET ${forObject(param).updateKeyAndValue} WHERE id=${param['id']}`
      break
    case 'delete':
      sql = `DELETE FROM courses_dates_info WHERE id in (${param['id']})`
      break
  }
  let result = await operateSql('courses_dates_info', sql, operation)
  res.end(JSON.stringify(result))
})

app.post('/action', async (req, res) => {
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    /*select 传入的可能 1 null 2 name 3 id 4 filter(level,type,mainMuscle,otherMuscle 5 searchData*/
    case 'select':
      sql = 'SELECT * FROM actions_info'
      if (param) {
        if (param.name) sql = `${sql} WHERE name in (${param.name})`
        else if (param.id) sql = `${sql} WHERE id in (${param.id})`
        else if (param.data) sql = `${sql} WHERE name like '%${param.data}%'`
        else if (param.type) {
          // 选择type、level、mainMuscle时，otherMuscle的值可能为多个
          let otherMuscleString = ''
          if (typeof param.otherMuscle === 'string') {
            otherMuscleString = `otherMuscle like '%${param.otherMuscle.replace(/'/g, '')}%'`
          } else if (typeof param.otherMuscle === 'object') {
            otherMuscleString = `otherMuscle in (${param.otherMuscle})`
          }
          sql = `${sql} WHERE type in (${param.type})
                               AND level in (${param.level})
                               AND mainMuscle in (${param.mainMuscle})
                               AND ${otherMuscleString}`
        }
      }
      sql = `${sql} ORDER BY name`
      break
    case 'insert':
      sql = `INSERT INTO actions_info (${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE actions_info SET ${forObject(param).updateKeyAndValue} WHERE id = ${param.id}`
      break
    case 'delete':
      sql = `DELETE FROM actions_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('actions_info', sql)
  res.end(JSON.stringify(result))
})

app.post('/articles', async (req, res) => {
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    case 'select':
      sql = 'SELECT * FROM articles_info'
      if (param) {
        if (param.sort) sql = `${sql} WHERE sort in (${param.sort})`
        else if (param.id) sql = `${sql} WHERE id in (${param.id})`
        else if (param.fileName) sql = `${sql} WHERE fileName like '%${param.fileName.replace(/'/g, '')}%'`
      }
      sql = `${sql} ORDER BY fileName`
      break
    case 'insert':
      /*上传文件后在数据库中插入文章数据 提取文章前200字节作为文章简介*/
      let mammoth = require('mammoth')
      mammoth.convertToHtml({ path: `./uploads/articleFiles/${param.fileName}.docx` })
        .then(async function(result) {
          let html = result.value
          param.inter = html.replace(/\t|\n| |<.*?>/g, '').replace(param.fileName, '').substring(0, 200)
          sql = `INSERT INTO articles_info(${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
          fs.renameSync(`./uploads/ArticleFiles/${param.fileName}.docx`, `./uploads/ArticleFiles/${param.sort}/${param.fileName}.docx`)
          console.log(sql)
          let result2 = await operateSql('articles_info', sql)
          res.end(JSON.stringify(result2))
        })
        .catch((err) => {
          console.log(err)
        })
      break
    case 'delete':
      sql = `DELETE FROM articles_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('articles_info', sql)
  res.end(JSON.stringify(result))
})

app.post('/food', async (req, res) => {
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    case 'select':
      sql = `SELECT * FROM foods_info`
      if (param) {
        if (param.data || param.name) sql = `${sql} WHERE name LIKE '%${param.data.replace(/'/g, '')}%'`
        else if (param.sort)
          if (typeof param.sort === 'string') sql = `${sql} WHERE sort LIKE '%${param.sort.replace(/'/g, '')}%'`
          else if (typeof param.sort === 'object') sql = `${sql} WHERE sort IN (${param.sort})`
      }
      sql = `${sql} ORDER BY name`
      break
    case 'insert':
      sql = `INSERT INTO foods_info (${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE foods_info SET ${forObject(param).updateKeyAndValue} WHERE id=${param.id}`
      break
    case 'delete':
      sql = `DELETE FROM foods_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('foods_info', sql)
  res.end(JSON.stringify(result))
})

app.post('/foodSort', async (req, res) => {
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    case 'select':
      sql = 'SELECT * FROM foodSorts_info'
      if (param && param.id) sql = `${sql} WHERE id = ${param.id}`
      sql = `${sql} ORDER BY sort`
      // console.log(sql);
      break
    case 'insert':
      sql = `INSERT INTO foodSorts_info (${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE foodSorts_info SET ${forObject(param).updateKeyAndValue} WHERE id=${param.id}`
      break
    case 'delete':
      sql = `DELETE FROM foodSorts_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('foodSorts_info', sql)
  res.end(JSON.stringify(result))
})


app.post('/coach', async (req, res) => {
  param = JSON.parse(req.body['data'])
  let operation = req.query.operation
  switch (operation) {
    case 'select':
      sql = 'SELECT * FROM coaches_info'
      if (param && param.courses) sql = `${sql} WHERE sort = ${param.courses}`
      sql = `${sql} ORDER BY name`
      break
    case 'insert':
      sql = `INSERT INTO coaches_info(${forObject(param).insertKey}) VALUES (${forObject(param).insertValue})`
      break
    case 'update':
      sql = `UPDATE coaches_info  SET ${forObject(param).updateKeyAndValue} WHERE id=${param.id}`
      break
    case 'delete':
      sql = `DELETE FROM coaches_info WHERE id in (${param.id})`
      break
  }
  let result = await operateSql('coaches_info', sql)
  res.end(JSON.stringify(result))

})

/*前端上传图片、视频到服务器*/
app.post('/uploader', temp.single('file'), (req, res) => {
  let ret = {}
  ret['code'] = 20000
  let file = req.file
  let fileDir = req.query.fileDir
  let filename = file.filename
  if (file) {
    let fileNameArr = file.originalname.split('.')
    let suffix = fileNameArr[fileNameArr.length - 1]
    if (suffix === 'docx') {
      filename = file.originalname.replace(`.${suffix}`, '')
    }
    fs.renameSync(`./uploads/temp/` + file.filename, `./uploads/${fileDir}/${filename}.${suffix}`)
    file['newFileName'] = `${file.filename}.${suffix}`
  }
  ret['file'] = file
  res.send(ret)
})

/*前端获取服务器的图片、视频、.docx文档*/
app.get('/getResources', (req, res) => {
  let fileName = req.query.url
  let fileDir = req.query.fileDir
  fileName ? res.sendFile(__dirname + `/uploads/${fileDir}/${fileName}`) : res.send({ success: false })
})

/*前端获取.docx文档*/
app.post('/articleFiles', (req, res) => {
  param = JSON.parse(req.body['data'])
  let mammoth = require('mammoth')
  mammoth.convertToHtml({ path: `./uploads/articleFiles/${param.sort}/${param.fileName}.docx` })
    .then(function(result) {
      let html = result.value // The generated HTML
      let messages = result.messages // Any messages, such as warnings during conversion
      res.end(html)
      // res.end(JSON.stringify(html));
    })
    .done()
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))