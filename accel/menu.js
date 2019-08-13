// 初始化按钮
function installControllers() {
    document.getElementById("menu").innerHTML = `
    <input type="button" id="PathCreator" value="Create Path" style="visibility:hidden">
    <input type="button" id="FreePathCreator" value="Create FreePath" style="visibility:hidden">
    <input type="button" id="LineCreator" value="Create Line" style="visibility:hidden">
    <input type="button" id="RectCreator" value="Create Rect" style="visibility:hidden">
    <input type="button" id="EllipseCreator" value="Create Ellipse" style="visibility:hidden">
    <input type="button" id="CircleCreator" value="Create Circle" style="visibility:hidden">
    <input type="button" id="ShapeSelector" value="Select Shape" style="visibility:hidden">`

    for(let gkey in view.controllers) {
      if(gkey == 'ShapeSelector') {
        continue
      }
      let key = gkey
      let elem = document.getElementById(key)
      elem.style.visibility = "visible"
      elem.onclick = function() {
          if(view.currentKey != "ShapeSelector"){
              document.getElementById(view.currentKey).removeAttribute("style")
          }
          elem.style.borderColor = "blue"
          elem.blur()
          view.invokeController(key)
      }
    }
    view.invokeController("ShapeSelector")
    view.onControllerReset = function() {
      document.getElementById(view.currentKey).removeAttribute("style")
      view.invokeController("ShapeSelector")
    }
}

function selection_setProp(key, val) {
  if(view.selection != null) {
    view.selection.setProp(key, val)
    invalidate(null)
  }
}

// lineColor/fillColor
function onPropChanged(key) {
  let elem = document.getElementById(key)
  let val = elem.value
  elem.blur()
  view.style[key] = val
  selection_setProp(key, val)
}

// lineWidth
function onIntPropChanged(key) {
  let elem = document.getElementById(key)
  elem.blur()
  let val = parseInt(elem.value)
  if(val > 0) {
    view.style[key] = val
    selection_setProp(key, val)
  }
}

function onSelectionChanged(old) {
  let selection = view.selection
  if(selecion != null){
    let style = selection.style
    view.style = selection.style
    document.getElementById("lineWidth").value = style.lineWidth
    document.getElementById("lineColor").value = style.lineColor
    document.getElementById("fillColor").value = style.fillColor
  }
}

// 初始化选择器
function installPropSelectors() {
    document.getElementById("menu").insertAdjacentHTML("afterend", `<br><div id="properties">
      <label for="lineWidth">LineWidth: </label>
      <select id="lineWidth" onchange="onIntPropChanged('lineWidth')">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="9">9</option>
        <option value="11">11</option>
      </select>&nbsp;
      <label for="lineColor">LineColor: </label>
      <select id="lineColor" onchange="onPropChanged('lineColor')">
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
      </select>&nbsp;

      <label for="fillColor">FillColor: </label>
      <select id="fillColor" onchange="onPropChanged('fillColor')">
        <option value="white">white</option>
        <option value="null">transparent</option>
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
      </select>
    </div>`)
}

// 初始化鼠标位置
function installMousePos() {
    document.getElementById("properties").insertAdjacentHTML("beforeend", `&nbsp;<span id="mousepos"></span>`)

    let old = view.drawing.onmousemove
    let mousepos = document.getElementById("mousepos")
    view.drawing.onmousemove = function(event) {
        let pos = view.getMousePos(event)
        mousepos.innerText = "MousePos: " + pos.x + ', ' + pos.y
        old(event)
    }
}

installControllers()
installPropSelectors()
installMousePos()
