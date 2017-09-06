const express = require('express')
const Note = require('../model/note')
const router = express.Router()

// 1. 获取所有note：GET: /api/notes    req: count=10                        res: {status: 0, message: 'success', data: [{},{}]}
// 2. 创建一个note：POST /api/notes/add  req: {note: 'content'}          res: {status: 0, message: 'success'}
// 3. 修改一个note: POST: /api/notes/edit req: {note: 'new content', id: xxx}  res: {status: 0, message: 'success'}
// 4. 删除一个note: POST: /api/notes/delete req: {id: xxx}  res: {status: 0, message: 'success'}




/* GET users listing. */
router.get('/notes', (req, res, next) => {
  Note.findAll({ raw: true }).then(notes => {
    res.send({status: 0, data: notes})
  })
})
router.post('/notes/add', (req, res, next) => {
  Note.create({ content: req.body.note })
    .then(() => {
      res.send({ status: 0 })
    })
    .catch(() => {
      res.send({ status: 1, message: '数据库错误' })
    })
})
router.post('/notes/edit', (req, res, next) => {
  Note.update({ content: req.body.note }, { where: { id: req.body.id } })
    .then(() => {
      res.send({ status: 0 })
    })
})
router.post('/notes/delete', (req, res, next) => {
  Note.destroy({ where: { id: req.body.id } })
    .then(() => {
      res.send({ status: 0 })
    })
})


module.exports = router