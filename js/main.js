$(document).ready(function() {
    $('#start').show();
    // shows the start div when page loads
})

// startGame function
function startGame() {

    $('#start').hide();
    $('#gameover').hide();
    $('#instructions').hide();
    // hides all 3 divs when game starts (clears the canvas)

    // global variables
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var cw = 15;
    var d = "right";
    var food;
    var score;
    var color = "#008000";
    var speed = 130;
    var snakeArray;

    // initializer function
    function init() {
        createSnake();
        createFood();
        score = 0;

        // use a timer to call paint function
        if (typeof gameLoop != "undefined") clearInterval(gameLoop);
        gameLoop = setInterval(paint, speed);
    }

    init();
    // calls the init function to create the game

    // createSnake function
    function createSnake() {
        var length = 5;
        snakeArray = [];
        for (var i = length - 1; i >= 0; i--) {
            snakeArray.push({
                x: i,
                y: 0
            });
        }
    }

    // createFood function
    function createFood() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw),
        };
    }

    // paint function
    function paint() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, w, h);
        // paints the canvas black

        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;

        // check for collision with wall
        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || checkCollision(nx, ny, snakeArray)) {
            $('#final-score').html(score);
            // inserts final score if collision
            $('#gameover').fadeIn(300);
            // shows gameover div fadein
            return;
        }

        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
            createFood();
        } else {
            var tail = snakeArray.pop();
            tail.x = nx;
            tail.y = ny;
        }

        snakeArray.unshift(tail);

        for (var i = 0; i < snakeArray.length; i++) {
            var c = snakeArray[i];
            paintCell(c.x, c.y);
        }

        // paints food cell
        paintCell(food.x, food.y);

        // checks score
        checkScore(score);

        // current score
        $('#score').html('Your Score:<br><br>' + score);
    }

    // paintCell function
    function paintCell(x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    // checkCollision function
    function checkCollision(x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i.x == x && array[i].y == y])
                return true;
        }
        return false;
    }

    // checkScore function
    function checkScore(score) {
        if (localStorage.getItem('highscore') === null) {
            //If there is no high score
            localStorage.setItem('highscore', score);
        } else {
            //If there is a high score
            if (score > localStorage.getItem('highscore')) {
                localStorage.setItem('highscore', score);
            }
        }

        $('#high-score').html('High Score:<br><br>' + localStorage.highscore);
        // inserts score into high-score div and saves it into HTML5 local storage
    }

    // jquery keyboard function
    $(document).keydown(function(e) {
        var key = e.which;
        if (key == "37" && d != "right") d = "left";
        else if (key == "38" && d != "down") d = "up";
        else if (key == "39" && d != "left") d = "right";
        else if (key == "40" && d != "up") d = "down";
    });
}
// end of startGame function

function resetScore() {
    localStorage.highscore = 0;
    highscorediv = document.getElementById('high-score');
    highscorediv.innerHTML = 'High Score:<br><br> 0';
    // inserts "High Score: 0" when reset button pushed
}
