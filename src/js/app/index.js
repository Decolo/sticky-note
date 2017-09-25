
import Event from '../modules/event'
import '../../style/style.scss'
import NoteManager from '../modules/noteManager'
import Note from '../modules/note'
import WaterFall from '../modules/waterFall'
import $ from 'jquery'

NoteManager.loadNotes()

$('.add-note').on('click', function() {
  NoteManager.createNewNote()
})
// new Note()
// new Note()
// new Note()
// new Note()
// new Note()
// new Note()
// new Note()

Event.on('waterfall', function(){
  WaterFall.init($('#note-container'))
})
