const express = require('express')
const Note = require('../model/note')
const router = express.Router()

// 1. 获取所有note：GET: /api/notes    req: count=10                        res: {status: 0, message: 'success', data: [{},{}]}
// 2. 创建一个note：POST /api/notes/add  req: {note: 'content'}          res: {status: 0, message: 'success'}
// 3. 修改一个note: POST: /api/notes/edit req: {note: 'new content', id: xxx}  res: {status: 0, message: 'success'}
// 4. 删除一个note: POST: /api/notes/delete req: {id: xxx}  res: {status: 0, message: 'success'}




/* GET users listing. */
router.get('/notes', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.send({ status: 1, message: 'should login first'})
  }
  const opts = { raw: true }
  opts.where = { uid: req.session.user.id }
  Note.findAll(opts)
    .then(notes => {
      res.send({status: 0, data: notes})
    })
    .catch(() => {
      res.send({ status: 1, message: 'Errors in database'})
    })
})
router.post('/notes/add', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.send({ status: 1, message: 'should login first'})
  }
  if (!req.body.note) {
    return res.send({ status: 1, message: 'content should not be empty' })
  }
  const opts = {
    content: req.body.note,
    uid: req.session.user.id
  }
  Note.create(opts)
    .then(() => {
      res.send({ status: 0 })
    })
    .catch(() => {
      res.send({ status: 1, message: 'errors in database' })
    })
})

router.post('/notes/edit', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.send({ status: 1, message: 'should login first' })
  }
  const content = req.body.note
  const noteId = req.body.id
  const uid = req.session.user.id

  Note.update({ content }, { where: { id: noteId, uid } })
    .then(items => {
      if (items[0] === 0) {
        return res.send({ status: 1, message: 'exceed authority' })
      }
      res.send({ status: 0 })
    })
    .catch(() => {
      res.send({ status: 1, message: 'errors in database' })
    })
})

router.post('/notes/delete', (req, res) => {
  if(!req.session || !req.session.user){
    return res.send({status: 1, errorMsg: '请先登录'})
  }

  const noteId = req.body.id
  const uid = req.session.user.id
  Note.destroy({ where: { id: noteId, uid } })
    .then(() => {
      res.send({ status: 0 })
    })
    .catch(() => {
      res.send({ status: 1, message: 'errors in database' })
    })
})


module.exports = router