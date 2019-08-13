function normalizeRect(rect) {
    let x = rect.p1.x
    let y = rect.p1.y
    let width = rect.p2.x - x
    let height = rect.p2.y - y
    if(width < 0) {
        x = rect.p2.x
        width = -width
    }
    if(height < 0) {
        y = rect.p2.y
        height = -height
    }
    return {x: x, y: y, width: width, height: height}
}

class RectCreator {
    constructor(shapeType) {
        this.shapeType = shapeType
        this.rect = {
            p1: {x: 0, y: 0},
            p2: {x: 0, y: 0}
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
    }
    buildShape() {
        let rect = this.rect
        let r = normalizeRect(rect)
        switch (this.shapeType) {
            case "line":
                return new Line(rect.p1, rect.p2, view.style)
            case "rect":
                return new Rect(r, view.style)
            case "ellipse":
                let rx = r.width / 2
                let ry = r.height / 2
                return new Ellipse(r.x + rx, r.y + ry, rx, ry, view.style)
            case "circle":
                let rc = Math.sqrt(r.width * r.width + r.height * r.height)
                return new Ellipse(rect.p1.x, rect.p1.y, rc, rc, view.style)
            default:
                alert("unknown shapeType: " + this.shapeType)
                return null
        }
    }

    onmousedown(event) {
        this.rect.p1 = view.getMousePos(event)
        this.started = true
    }
    onmousemove(event) {
        if (this.started) {
            this.rect.p2 = view.getMousePos(event)
            invalidate(this.rect)
        }
    }
    onmouseup(event) {
        if (this.started) {
            this.rect.p2 = view.getMousePos(event)
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
