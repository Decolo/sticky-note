import Toast from './toast'
import Note from './note'
import Event from './event'
import $ from 'jquery'


/*
***模块模式
*/
const NoteManager = (function(){
  function loadNotes() {
    $.get('/api/notes')
      .done(function(response){
        if(response.status == 0){
          $.each(response.data, (index, item) => {
            new Note({
              id: item.id,
              content: item.content
            })
          })
          // 瀑布流布局
          Event.trigger('waterfall')
        }else{
          Toast(response.errorMsg)
        }
      })
      .fail(function(){
        Toast('网络异常')
      })
  }

  function createNewNote(){
    new Note()
  }

  return {
    loadNotes,
    createNewNote
  }
})()

export default NoteManager