// 初始化按钮
function installControllers() {
    document.getElementById("menu").innerHTML = `
    <input type="button" id="PathCreator" value="Create Path" style="visibility:hidden">
    <input type="button" id="FreePathCreator" value="Create FreePath" style="visibility:hidden">
    <input type="button" id="LineCreator" value="Create Line" style="visibility:hidden">
    <input type="button" id="RectCreator" value="Create Rect" style="visibility:hidden">
    <input type="button" id="EllipseCreator" value="Create Ellipse" style="visibility:hidden">
    <input type="button" id="CircleCreator" value="Create Circle" style="visibility:hidden">`

    for(let gkey in view.controllers) {
        let key = gkey
        let elem = document.getElementById(key)
        elem.style.visibility = "visible"
        elem.onclick = function() {
            if(view.currentKey != ""){
                document.getElementById(view.currentKey).removeAttribute("style")
            }
            elem.style.borderColor = "blue"
            elem.blur()
            view.invokeController(key)
        }
    }
}

// 选择线条宽度
function onLineWidthChanged() {
    let elem = document.getElementById("LineWidth")
    elem.blur()
    let val = parseInt(elem.value)
    if(val > 0) {
        view.properties.lineWidth = val
    }
}

// 选择颜色
function onLineColorChanged() {
    let elem = document.getElementById("LineColor")
    elem.blur()
    view.properties.lineColor = elem.value
}

// 初始化选择器
function installPropSelectors() {
    document.getElementById("menu").insertAdjacentHTML("afterend", `<br><div id="properties">
    <label for="LineWidth">LineWidth: </label>
    <select id="LineWidth" onchange="onLineWidthChanged()">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="9">9</option>
        <option value="11">11</option>
    </select>&nbsp;
    <label for="LineColor">LineColor: </label>
    <select id="LineColor" onchange="onLineColorChanged()">
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
