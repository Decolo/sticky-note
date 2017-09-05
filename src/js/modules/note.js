import { Toast } from './toast'
import Event from './event'
import $ from 'jquery'

export default class Note {
  constructor(opts){
    this.defaultOpts = {
      id: '', //note的id
      $ct: $('#note-container').length > 0 ? $('#note-container') : $('body'),
      placeholderText: 'Write down your note here'
    }
    this.opt = Object.assign({}, this.defaultOpts, opts)
    this.id = this.opt.id
    this.$note = null
    this.createNote()
    // this.layout()
    this.bindEvent()
  }

  createNode() {
    const date = new Date()
    const dateStr = `${date.getFullYear()}／${date.getMonth() + 1}／${date.getDate()}`
    const template = `
      <div class="note">
        <div class="note-head">${dateStr}<span class="delete">&times;</span></div>
        <div class="note-content" contenteditable="true"></div>
      </div>
    `
    this.$note = $(template)
    // 设置placeholder
    this.$note.find('.note-content').html(this.opts.placeholderText)
    this.opt.$ct.append(this.$note)
    if (!this.id) {
      this.$note.css('bottom', 10)
    }
  }

  // layout() {
  //   // 函数节流
  //   if (this.clockId) {
  //     clearTimeout(this.clockId)
  //   }
  //   this.clockId = setTimeout(() => {
  //     Event.trigger('waterfall')
  //   }, 100)
  // }

  bindEvent() {
    const $note = this.$note,
      $noteHead = this.$note.find('.note-head'),
      $noteContent = this.$note.find('.note-content'),
      $delete = this.$note.find('.delete')

    $delete.on('click', () => {
      this.delete()
    })

    $noteContent
      .on('focus', () => {
        if ($noteContent.html() === this.opt.placeholderText) {
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
          // this.layout()
          if (this.id) {
            this.edit($noteContent.html())
          } else {
            this.add($noteContent.html())
          }
        }
      })
    
    let innerPosition
    $noteHead
      .on('mousedown', event => {
        this.$note.addClass('draggable')
        // this.$note.css({
        //   position: 'relatve',
        //   cursor: 'move',
        //   opacity: .8
        // })
        // 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
        let eventInnerX = event.pageX - $note.offset().left
        let eventInnerY = event.pageY - $note.offset().top
        innerPosition = {
          eventInnerX,
          eventInnerY
        }
      })
      .on('mouseup', () => {
        this.$note.removeClass('draggable')
      })
    $('body').on('mousemove', event => {
      let positionX = event.pageX - innerPosition['noteX'],
        positionY = event.pageY - innerPosition['noteY']
      $('.draggable').css({
        top: positionX,
        left: positionY
      })
    })
  }

  delete() {
    $.post('/api/notes/delete', {
      id: this.id
    }).done(function(ret){
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


// function Note(opts){
//   this.initOpts(opts)
//   this.createNote()
//   this.setStyle()
//   this.bindEvent()
// }
// Note.prototype = {
//   colors: [
//     ['#ea9b35','#efb04e'], // headColor, containerColor
//     ['#dd598b','#e672a2'],
//     ['#eee34b','#f2eb67'],
//     ['#c24226','#d15a39'],
//     ['#c1c341','#d0d25c'],
//     ['#3f78c3','#5591d2']
//   ],

//   defaultOpts: {
//     id: '',   //Note的 id
//     $ct: $('#content').length>0?$('#content'):$('body'),  //默认存放 Note 的容器
//     context: 'input here'  //Note 的内容
//   },

//   initOpts: function (opts) {
//     this.opts = $.extend({}, this.defaultOpts, opts||{});
//     if(this.opts.id){
//        this.id = this.opts.id;
//     }
//   },

//   createNote: function () {
//     var tpl =  '<div class="note">'
//               + '<div class="note-head"><span class="delete">&times;</span></div>'
//               + '<div class="note-ct" contenteditable="true"></div>'
//               +'</div>';
//     this.$note = $(tpl);
//     this.$note.find('.note-ct').html(this.opts.context);
//     this.opts.$ct.append(this.$note);
//     if(!this.id)  this.$note.css('bottom', '10px');  //新增放到右边
//   },

//   setStyle: function () {
//     var color = this.colors[Math.floor(Math.random()*6)];
//     this.$note.find('.note-head').css('background-color', color[0]);
//     this.$note.find('.note-ct').css('background-color', color[1]);
//   },

//   setLayout: function(){
//     var self = this;
//     if(self.clk){
//       clearTimeout(self.clk);
//     }
//     self.clk = setTimeout(function(){
//       Event.fire('waterfall');
//     },100);
//   },

//   bindEvent: function () {
//     var self = this,
//         $note = this.$note,
//         $noteHead = $note.find('.note-head'),
//         $noteCt = $note.find('.note-ct'),
//         $delete = $note.find('.delete');

//     $delete.on('click', function(){
//       self.delete();
//     })

//     //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
//     $noteCt.on('focus', function() {
//       if($noteCt.html()=='input here') $noteCt.html('');
//       $noteCt.data('before', $noteCt.html());
//     }).on('blur paste', function() {
//       if( $noteCt.data('before') != $noteCt.html() ) {
//         $noteCt.data('before',$noteCt.html());
//         self.setLayout();
//         if(self.id){
//           self.edit($noteCt.html())
//         }else{
//           self.add($noteCt.html())
//         }
//       }
//     });

//     //设置笔记的移动
//     $noteHead.on('mousedown', function(e){
//       var evtX = e.pageX - $note.offset().left,   //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
//           evtY = e.pageY - $note.offset().top;
//       $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
//     }).on('mouseup', function(){
//        $note.removeClass('draggable').removeData('pos');
//     });

//     $('body').on('mousemove', function(e){
//       $('.draggable').length && $('.draggable').offset({
//         top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
//         left: e.pageX-$('.draggable').data('evtPos').x
//       });
//     });
//   },

//   edit: function (msg) {
//     var self = this;
//     $.post('/api/notes/edit',{
//         id: this.id,
//         note: msg
//       }).done(function(ret){
//       if(ret.status === 0){
//         Toast('update success');
//       }else{
//         Toast(ret.errorMsg);
//       }
//     })
//   },

//   add: function (msg){
//     console.log('addd...');
//     var self = this;
//     $.post('/api/notes/add', {note: msg})
//       .done(function(ret){
//         if(ret.status === 0){
//           Toast('add success');
//         }else{
//           self.$note.remove();
//           Event.fire('waterfall')
//           Toast(ret.errorMsg);
//         }
//       });
//     //todo
//   },

//   delete: function(){
//     var self = this;
//     $.post('/api/notes/delete', {id: this.id})
//       .done(function(ret){
//         if(ret.status === 0){
//           Toast('delete success');
//           self.$note.remove();
//           Event.fire('waterfall')
//         }else{
//           Toast(ret.errorMsg);
//         }
//     });

//   }

// };
// module.exports.Note = Note;
