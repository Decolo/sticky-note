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
      .done(function(reponse){
        if(reponse.status == 0){
          $.each(reponse.data, function(idx, article) {
            new Note({
              id: article.id,
              context: article.text
            })
          })
          // 瀑布流布局
          Event.fire('waterfall')
        }else{
          Toast(reponse.errorMsg)
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