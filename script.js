// event handlers

var cycle = 1500;
var timeoutID;

var smallSize = document.getElementById('smallSize');
var mediumSize = document.getElementById('mediumSize');
var largeSize = document.getElementById('largeSize');
var slowPace = document.getElementById('slowPace');
var mediumPace = document.getElementById('mediumPace');
var fastPace = document.getElementById('fastPace');

smallSize.addEventListener('click', function(e) {
    if (mediumSize.classList.contains('active')) {
        mediumSize.classList.remove('active');
    }
    if (largeSize.classList.contains('active')) {
        largeSize.classList.remove('active');
    } else {
        smallSize.classList.remove('active');
    }
    smallSize.classList.add('active');
    grid.innerHTML = '';
    clearTimeout(timeoutID);
    buildEvolution(5);
});

mediumSize.addEventListener('click', function(e) {
    if (smallSize.classList.contains('active')) {
        smallSize.classList.remove('active');
    }
    if (largeSize.classList.contains('active')) {
        largeSize.classList.remove('active');
    } else {
        mediumSize.classList.remove('active');
    }
    mediumSize.classList.add('active');
    grid.innerHTML = '';
    clearTimeout(timeoutID);
    buildEvolution(10);
});


largeSize.addEventListener('click', function(e) {
    if (mediumSize.classList.contains('active')) {
        mediumSize.classList.remove('active');
    }
    if (smallSize.classList.contains('active')) {
        smallSize.classList.remove('active');
    } else {
        largeSize.classList.remove('active');
    }
    largeSize.classList.add('active');
    grid.innerHTML = '';
    clearTimeout(timeoutID);
    buildEvolution(32);
});

slowPace.addEventListener('click', function(e) {
    if (slowPace.classList.contains('active')) {
        return;
    }
    slowPace.classList.add('active');
    if (mediumPace.classList.contains('active')) {
        mediumPace.classList.remove('active');
    } else {
        fastPace.classList.remove('active');
    }
    cycle = 1500;
});

mediumPace.addEventListener('click', function(e) {
    if (mediumPace.classList.contains('active')) {
        return;
    }
    mediumPace.classList.add('active');
    if (fastPace.classList.contains('active')) {
        fastPace.classList.remove('active');
    } else {
        slowPace.classList.remove('active');
    }
    cycle = 250;
});

fastPace.addEventListener('click', function(e) {
    if (fastPace.classList.contains('active')) {
        return;
    }
    fastPace.classList.add('active');
    if (mediumPace.classList.contains('active')) {
        mediumPace.classList.remove('active');
    } else {
        slowPace.classList.remove('active');
    }
    cycle = 1;
});

function buildEvolution(rows) {

    var areas = rows * rows;
    var grid = document.getElementById('grid');
    grid.style.backgroundColor = 'white';
    grid.style.gridTemplate = `repeat(${rows}, 1fr) / repeat(${rows}, 1fr)`;
    var sqrs = document.getElementsByClassName('sqr');
    var field;
    for (var a = 0; a < areas; a++) {
        field = document.createElement('div');
        field.classList.add('sqr');
        field.setAttribute('id', + a);
        grid.appendChild(field);
    }

    function randomRGB() {
        var a = [];
        for (var i = 0; i < 3; i++) {
            a.push(Math.floor(Math.random() * 256));
        }
        return `rgb(${a[0]}, ${a[1]}, ${a[2]})`;
    }

    for (var i = 0; i < sqrs.length; i++) {
        sqrs[i].style.height = 75 / rows + 'vh';
        sqrs[i].style.width = 75 / rows + 'vh';
        sqrs[i].style.backgroundColor = randomRGB();
        sqrs[i].style.boxShadow = 4 / rows + 'vh ' + 4 / rows + 'vh ' + 4 / rows + 'vh ' + 'gray';
    }

    // action

    function indexPredator() {
        return + Math.floor(Math.random() * areas);
    }

    function indexPrey(n) {
        var v = Number(n);
        var arr = [v-rows-1, v-rows, v-rows+1, v-1, v+1, v+rows-1, v+rows, v+rows+1];
        var random = fn();
        function fn() {
            r = Math.floor(Math.random() * 8);
            if (arr[r] < 0 || areas - 1 < arr[r]) {
                fn();
            } else if (v % rows === 0 && arr[r] % rows === rows - 1) {
                fn();
            } else if (v % rows === rows - 1 && arr[r] % rows === 0) {
                fn();
            }
            return r;
        }
        return + arr[random];
    }

    function attack() {
        var predator = document.getElementById(indexPredator());
        var prey = document.getElementById(indexPrey(predator.id));

        if (rows > 10) {
            predator.style.boxSizing = 'border-box';
            prey.style.boxSizing = 'border-box';
        }

        if (cycle > 200) {
            predator.style.border = Math.max(7 / rows, .7) + 'vh solid red';
            prey.style.border = Math.max(7 / rows, .7) + 'vh solid blue';

            predator.style.zIndex = '100';

            setTimeout(function() {
                if (Number(predator.id) - Number(prey.id) === rows + 1) {
                    predator.style.transform = 'translate(-50%, -50%)'
                } else if (Number(predator.id) - Number(prey.id) === rows) {
                    predator.style.transform = 'translate(0, -50%)'
                } else if (Number(predator.id) - Number(prey.id) === rows - 1) {
                    predator.style.transform = 'translate(50%, -50%)'
                } else if (Number(predator.id) - Number(prey.id) === 1) {
                    predator.style.transform = 'translate(-50%, 0)'
                } else if (Number(predator.id) - Number(prey.id) === - 1) {
                    predator.style.transform = 'translate(50%, 0)'
                } else if (Number(predator.id) - Number(prey.id) === - rows + 1) {
                    predator.style.transform = 'translate(-50%, 50%)'
                } else if (Number(predator.id) - Number(prey.id) === - rows) {
                    predator.style.transform = 'translate(0, 50%)'
                } else {
                    predator.style.transform = 'translate(50%, 50%)'
                }
                prey.style.backgroundColor = predator.style.backgroundColor;
            }, cycle / 2);

            setTimeout(function() {
                predator.style.border = 0;
                prey.style.border = 0;
                predator.style.zIndex = '0';
                predator.style.transform = 'translate(0)'
            }, cycle);
        } else {
            prey.style.backgroundColor = predator.style.backgroundColor;
        }

        timeoutID = setTimeout(function() {
            attack();
        }, cycle);

        monoColorStop();
    }

    setTimeout(function() {
        attack();
    }, 500);

    function monoColorStop() {
        var a = [];
        for (var i = 0; i < sqrs.length; i++) {
            if (a[0] !== sqrs[i].style.backgroundColor)
            a.push(sqrs[i].style.backgroundColor);
        }
        if (a.length > 1) {
            return;
        }
        clearTimeout(timeoutID);
        grid.style.backgroundColor = a[0];
    }
}

buildEvolution(5);
