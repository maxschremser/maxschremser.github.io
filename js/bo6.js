let data = {
    x: 0,
    y: 0,
    z: 0
}

let values = [0, 11, 10, 22, 21, 20];
let numbers = [0, 0, 0];

function calc() {
    document.getElementById('cx').innerText = n1();
    document.getElementById('cy').innerText = n2();
    document.getElementById('cz').innerText = n3();
}

function n1() {
    let x = values[data['x']];
    return (2*x) + 11;
}

function n2() {
    let y = values[data['y']];
    let z = values[data['z']];
    return (2*z + y) - 5;
}

function n3() {
    let x = values[data['x']];
    let y = values[data['y']];
    let z = values[data['z']];
    return Math.abs((y+z)-x);
}
function doClick(d) {
    data[d]++;
    data[d] %= 6;
    document.getElementById(d).src = "img/" + d.toUpperCase() + "-" + data[d] + ".png";
    calc();
}

