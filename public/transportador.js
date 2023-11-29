var position,
    lastPosition,
    canSlide = false,
    range = $(".range"),
    input = range.find("input"),
    maxPoints = input.attr("max"),
    minPoints = input.attr("min"),
    prevVal = input.attr("min");

var input = document.querySelector("#posicion");

range.on("mousedown touchstart", rangeSliderInit);
range.on("mousemove touchmove", rangeSliderUpdate);
range.on("mouseup touchend", rangeSliderStop);

function pointerEvents(e) {
    var pos = { x: 0, y: 0 };

    if (
        e.type == "touchstart" ||
        e.type == "touchmove" ||
        e.type == "touchend" ||
        e.type == "touchcancel"
    ) {
        var touch = e.changedTouches[0];
        pos.x = touch.pageX;
        pos.y = touch.pageY;
    } else if (
        e.type == "mousedown" ||
        e.type == "mouseup" ||
        e.type == "mousemove" ||
        e.type == "mouseover" ||
        e.type == "mouseout" ||
        e.type == "mouseenter" ||
        e.type == "mouseleave"
    ) {
        pos.x = e.pageX;
        pos.y = e.pageY;
    }

    return pos;
}

function rangeSliderInit() {
    canSlide = true;
}

function rangeSliderUpdate(e) {
    if (!canSlide || maxPoints == 0) return;

    var position = pointerEvents(e),
        dial = range.find(".dial"),
        dialRadius = dial.width() / 2,
        coords = {
            x: position.x - range.offset().left,
            y: position.y - range.offset().top,
        },
        radius = range.width() / 2;
    // var atan = Math.atan2(coords.x - radius, coords.y - radius);
    var atan = Math.atan2(coords.y - radius, coords.x - radius);
    // var deg = Math.ceil(-atan / (Math.PI / 180) + 180);
    var deg = prevVal;

    if (atan < 0 && atan > -Math.PI / 2)
        deg = 90 - Math.ceil((atan * 180) / Math.PI) * -1 + 90;

    if (atan < -Math.PI / 2 && atan > -Math.PI)
        deg = Math.ceil((atan * 180) / Math.PI) + 180;

    if (atan > 0 && atan < Math.PI / 2)
        deg = Math.ceil((atan * 180) / Math.PI) + 180;

    // console.log(coords.x - radius, coords.y - radius, atan, deg);

    if (prevVal <= 1 && lastPosition - position.x >= 0) deg = 0;
    if (prevVal >= 359 && lastPosition - position.x <= 0) deg = 360;

    var x =
            Math.ceil((radius - 5) * Math.sin((deg * Math.PI) / 180)) +
            radius +
            "px",
        y =
            Math.ceil((radius - 5) * -Math.cos((deg * Math.PI) / 180)) +
            radius +
            "px",
        points = Math.ceil((deg * maxPoints) / 360);

    //move dial
    dial.css({ transform: "translate(" + x + "," + y + ")" });

    //show range progress
    if (deg <= 180) {
        range
            .find(".right .blocker")
            .css({ transform: "rotate(" + deg + "deg)" });
        range.find(".left .blocker").css({ transform: "rotate(0)" });
    } else {
        range.find(".right .blocker").css({ transform: "rotate(180deg" });
        range
            .find(".left .blocker")
            .css({ transform: "rotate(" + (deg - 180) + "deg)" });
    }

    //show value
    range.find(".count").text(`${points} °`).val(points);
    input.value = points;

    let api = "http://localhost:3000/serial";
    const response = fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            dato: points,
        }),
    });

    prevVal = deg;
    lastPosition = position.x;
}

function rangeSliderStop() {
    canSlide = false;
}
