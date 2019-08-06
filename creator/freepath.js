class FreePathCreator {
    constructor() {
        this.points = []
        this.fromPos = {x: 0, y: 0}
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
        this.points = []
        this.started = false
        invalidate(null)
    }

    buildShape() {
        let points = [{x: this.fromPos.x, y: this.fromPos.y}]
        for(let i in this.points){
            points.push(this.points[i])
        }
        return new Path(points, this.close, view.lineStyle)
    }

    onmousedown(event) {
        this.fromPos = view.getMousePos(event)
        this.started = true
    }
    onmousemove(event) {
        if(this.started) {
            this.points.push(view.getMousePos(event))
            invalidate(null)
        }
    }
    onmouseup(event) {
        if(this.started) {
            view.doc.addShape(this.buildShape())
            this.reset()
        }
    }
    onkeydown(event) {
        if(event.keyCode == 27) { // keyEsc
            this.reset()
        }
    }

    onpaint(ctx) {
        if(this.started) {
            let props = view.properties
            ctx.lineWidth = props.lineWidth
            ctx.strokeStyle = props.lineColor
            ctx.beginPath()
            ctx.moveTo(this.fromPos.x, this.fromPos.y)
            for(let i in this.points) {
                ctx.lineTo(this.points[i].x, this.points[i].y)
            }
            ctx.stroke()
        }
    }
}

view.registerController("FreePathCreator", function() {
    return new FreePathCreator()
})
