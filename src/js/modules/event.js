/*
***发布订阅模式
*/
const EventCenter = (function(){

  let events = {}

  function on(evt, handler){
    events[evt] = events[evt] || [] 

    events[evt].push({
      handler: handler
    })
  }

  function trigger(evt, args){
    if(!events[evt]){
      return
    }
    for(let i = 0; i < events[evt].length; i++){
      events[evt][i].handler(args)
    }   
  }

  return {
    on: on,
    trigger: trigger
  }
})()

export default EventCenter