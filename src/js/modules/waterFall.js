import $ from 'jquery'
var WaterFall = (function(){
  let $container
  function render($element){
    // console.log('trigger')
    $container = $element
    const $items = $container.children()

    let nodeWidth = $items.outerWidth(true),
      colNum = parseInt($(window).width()/nodeWidth),
      colSumHeight = []

    for(let i = 0; i<colNum; i++){
      colSumHeight[i] = 0
    }
    $items.each(function(){
      let $item = $(this),
        minSumHeight = Math.min.apply(null, colSumHeight),
        minIndex = colSumHeight.indexOf(minSumHeight)

      $item.css({
        left: nodeWidth * minIndex,
        top: minSumHeight
      })

      colSumHeight[minIndex] += $item.outerHeight(true)
      $container.height(colSumHeight[minIndex])
    })
  }


  $(window).on('resize', function(){
    render($container)
  })

  return {
    init: render
  }
})()

export default WaterFall





