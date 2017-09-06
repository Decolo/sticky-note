
import Event from '../modules/event'
import '../../style/style.scss'
import NoteManager from '../modules/noteManager'
import WaterFall from '../modules/waterFall'
import $ from 'jquery'

NoteManager.loadNotes()

$('.add-note').on('click', function() {
  NoteManager.createNewNote()
})

Event.on('waterfall', function(){
  WaterFall.init($('#note-container'))
})
