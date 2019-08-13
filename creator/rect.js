class RectCreator {
    constructor(shapeType) {
        this.shapeType = shapeType
        this.rect = {
            pt1: {x: 0, y: 0},
            pt2: {x: 0, y: 0}
        }
        this.started = false
        let ctrl = this
        view.onmousedown = function(event) { ctrl.onmousedown(event) }
        view.onmousemove = function(event) { ctrl.onmousemove(event) }
        view.onmouseup = function(event) { ctrl.onmouseup(event) }
        view.onkeydown = function(event) { ctrl.onkeydown(event) }
    }

    stop() {
        view.onmousedown = null
        view.onmousemove = null
        view.onmouseup = null
        view.onkeydown = null
    }
    reset() {
        this.started = false
        invalidate(this.rect)
        view.fireControllerReset()
    }
    buildShape() {
        let rect = this.rect
        let r = normalizeRect(rect)
        let style = view.style.clone()
        switch (this.shapeType) {
            case "line":
                return new Line(rect.pt1, rect.pt2, style)
            case "rect":
                return new Rect(r, style)
            case "ellipse":
                let rx = r.width / 2
                let ry = r.height / 2
                return new Ellipse(r.x + rx, r.y + ry, rx, ry, style)
            case "circle":
                let rc = Math.sqrt(r.width * r.width + r.height * r.height)
                return new Ellipse(rect.pt1.x, rect.pt1.y, rc, rc, style)
            default:
                alert("unknown shapeType: " + this.shapeType)
                return null
        }
    }

    onmousedown(event) {
        this.rect.pt1 = view.getMousePos(event)
        this.started = true
    }
    onmousemove(event) {
        if (this.started) {
            this.rect.pt2 = view.getMousePos(event)
            invalidate(this.rect)
        }
    }
    onmouseup(event) {
        if (this.started) {
            this.rect.pt2 = view.getMousePos(event)
            view.doc.addShape(this.buildShape())
            this.reset()
        }
    }
    onkeydown(event) {
        if (event.keyCode == 27) { // keyEsc
            this.reset()
        }
    }

    onpaint(ctx) {
        if (this.started) {
            this.buildShape().onpaint(ctx)
        }
    }
}

view.registerController("LineCreator", function() {
    return new RectCreator("line")
})

view.registerController("RectCreator", function() {
    return new RectCreator("rect")
})

view.registerController("EllipseCreator", function() {
    return new RectCreator("ellipse")
})

view.registerController("CircleCreator", function() {
    return new RectCreator("circle")
})
