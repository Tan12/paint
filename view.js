class PaintView {
    constructor() {
        this.style = new ShapeStyle(1, 'black', 'white')
        this.controllers = {}
        this._currentKey = ""
        this._current = null
        this.onmousedown = null
        this.onmousemove = null
        this.onmouseup = null
        this.ondblclick = null
        this.onkeydown = null
        let drawing = document.getElementById("drawing")
        let view = this
        drawing.onmousedown = function(event) {
            event.preventDefault()
            if(view.onmousedown != null) {
                view.onmousedown(event)
            }
        }
        drawing.onmousemove = function(event) {
            event.preventDefault()
            if(view.onmousemove != null) {
                view.onmousemove(event)
            }
        }
        drawing.onmouseup = function(event) {
            event.preventDefault()
            if(view.onmouseup != null) {
                view.onmouseup(event)
            }
        }
        // 双击事件
        drawing.ondblclick = function(event) {
            event.preventDefault()
            if(view.ondblclick != null) {
                view.ondblclick(event)
            }
        }
        drawing.onkeydown = function(event) {
            switch (event.keyCode) {
                // Tab键
                case 9:
                // Enter键
                case 13:
                // Esc键
                case 27:
                    event.preventDefault()
            }
            if(view.onkeydown != null) {
                view.onkeydown(event)
            }
        }
        this.drawing = drawing
        this.doc = new PaintDoc()
    }

    get currentKey() {
        return this._currentKey
    }

    onpaint(ctx) {
        this.doc.onpaint(ctx)
        if(this._current != null){
            this._current.onpaint(ctx)
        }
    }

    getMousePos(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    invalidateRect(reserved) {
        let ctx = this.drawing.getContext("2d")
        let bound = this.drawing.getBoundingClientRect()
        ctx.clearRect(0, 0, bound.width, bound.height)
        this.onpaint(ctx)
    }

    registerController(name, controller) {
        if(name in this.controllers){
            alert("controller exists: " + name)
        } else {
            this.controllers[name] = controller
        }
    }
    invokeController(name) {
        this.stopController()
        if(name in this.controllers) {
            let controller = this.controllers[name]
            this._setCurrent(name, controller())
        }
    }
    stopController() {
        if(this._current != null){
            this._current.stop()
            this._setCurrent("", null)
        }
    }

    _setCurrent(name, ctrl) {
        this._current = ctrl
        this._currentKey = name
    }
}

var view = new PaintView()

function invalidate(reserved) {
    view.invalidateRect()
}
