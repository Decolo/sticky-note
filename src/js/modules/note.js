import  Toast from './toast'
import Event from './event'
import $ from 'jquery'

export default class Note {
  constructor(opts){
    this.defaultOpts = {
      id: '', //note的id
      $ct: $('#note-container').length > 0 ? $('#note-container') : $('body'),
      placeholderText: 'Write down your note here',
      content: ''
    }
    this.opts = Object.assign({}, this.defaultOpts, opts)
    this.id = this.opts.id
    this.$note = null
    this.createNote()
    this.layout()
    this.bindEvent()
  }

  createNote() {
    const date = new Date()
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const template = `
      <div class="note">
        <div class="note-head">${dateStr}<span class="delete">&times;</span></div>
        <div class="note-content" contenteditable="true"></div>
      </div>
    `
    this.$note = $(template)
    if (!this.id) {
      // 设置placeholder
      this.$note.find('.note-content').html(this.opts.placeholderText)
    } else {
      this.$note.find('.note-content').html(this.opts.content)
    }
    
    
    // if (!this.id) {
    //   this.$note.css('bottom', 10)
    // }
  }

  layout() {
    // 函数节流
    if (this.clockId) {
      clearTimeout(this.clockId)
    }
    this.clockId = setTimeout(() => {
      this.opts.$ct.append(this.$note)
      Event.trigger('waterfall')
    }, 100)
  }

  bindEvent() {
    const $noteContent = this.$note.find('.note-content'),
      $delete = this.$note.find('.delete')

    $delete.on('click', () => {
      this.delete()
    })

    $noteContent
      .on('focus', () => {
        if ($noteContent.html() === this.opts.placeholderText) {
          $noteContent.html('')
        }
        // 保存改动之前的值
        $noteContent.data('before', $noteContent.html)
      })
      .on('blur paste', () => {
        // 比较输入完或粘贴完后前后的内容有没有变化
        if ($noteContent.data('before') !== $noteContent) {
          $noteContent.data('before', $noteContent.html())
          // 前后内容有变化，重绘
          this.layout()
          if (this.id) {
            this.edit($noteContent.html())
          } else {
            this.add($noteContent.html())
          }
        }
      })
  }

  delete() {
    $.post('/api/notes/delete', {
      id: this.id
    }).done((ret) => {
      if(ret.status === 0){
        Toast('delete success')
        this.$note.remove()
        Event.trigger('waterfall')
      }else{
        Toast(ret.errorMsg)
      }
    })
  }

  edit(message) {
    $.post('/api/notes/edit', {
      id: this.id,
      note: message
    }).done(ret => {
      if (ret.status === 0) {
        Toast('update success')
      } else {
        Toast(ret.errorMsg)
      }
    })
  }

  add(message) {
    $.post('/api/notes/add', {
      note: message
    }).done(ret => {
      console.log(ret)
      if (ret.status === 0) {
        Toast('add success')
      } else {
        this.$note.remove()
        Event.trigger('waterfall')
        Toast('ret.errorMsg')
      }
    })
  }

}

