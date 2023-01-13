const canvasEl = document.createElement('canvas');
canvasEl.height = window.innerHeight - 3.01;
canvasEl.width = window.innerWidth + 0.999;

let canvas = canvasEl.getContext('2d')
document.body.appendChild(canvasEl);

const field = {
  width: canvasEl.width,
  height: canvasEl.height,
  draw: function() {
    canvas.fillStyle = "#286047";
    canvas.fillRect(0, 0, this.width, this.height);
  }
};

const line = {
  draw: function() {
    canvas.fillStyle = '#fff'
    canvas.fillRect(field.width / 2 - 5 / 2, 0, 5, field.height);
  }
};

const player = {
  posY: field.height / 2 - 75,
  height: 125,
  draw: function () {
    canvas.fillStyle = '#fff';
    canvas.fillRect(7, this.posY, 5, this.height);
  }
};

const computer = {
  height: player.height,
  posY: field.height / 2 - 75,
  veloPosY: 5,
  changeVeloPosY: function(numb) {this.veloPosY = this.veloPosY + numb},
  _move: function() {
    if(this.posY + this.height / 2 < ball.posY)
      this.posY += this.veloPosY;
    else
      this.posY -= this.veloPosY;
  },
  draw: function() {
    canvas.fillStyle = '#fff';
    canvas.fillRect(field.width - 7 - 5, this.posY, 5, this.height)

    this._move();
  }
};

const scores = {
  player: 0,
  computer: 0,
  increasePlayer: function() {this.player++},
  increaseComputer: function() {this.computer++},
  draw: function() {
    canvas.font = 'bold 72px Arial';
    canvas.textAlign = 'center';
    canvas.textBaseline = 'top';
    canvas.fillStyle = '#01341D';
    canvas.fillText(this.player, field.width / 4, 50);
    canvas.fillText(this.computer, field.width / 4 + field.width / 2, 50);
  }
};

const ball = {
  posX: field.width / 2,
  posY: field.height / 2,
  veloDefault: 0.1,
  veloPosX: 3 ,
  veloPosY: 0,
  eficVeloPosY: 0,
  difPosY: 0.1,
  _detectDot: function() {
    if(this.posX < 7 + 5) 
      if(
        this.posY > player.posY &&
        this.posY < player.posY + player.height
      ) {
        this.veloPosX = -this.veloPosX;
        this.eficVeloPosY = this.posY - (player.posY + player.height / 2);
        this.veloPosY = this.eficVeloPosY * (this.difPosY + (+this.veloPosY / 100));
        this.veloPosX = this.veloPosX + 0.5;
        }

        else {
          scores.increaseComputer();
          computer.changeVeloPosY(-0.1)
          this.posY = field.height / 2;
          this.posX = field.width / 2;
          this.veloPosX = -this.veloDefault;
          this.veloPosY = 0;
        }

    else if(this.posX > field.width - 7 - 5)
        if(
          this.posY > computer.posY &&
          this.posY < computer.posY + computer.height
        ) {
          this.veloPosX = -this.veloPosX;
          this.eficVeloPosY = this.posY - (computer.posY + computer.height / 2);
          this.veloPosY = this.eficVeloPosY * (this.difPosY + (+this.veloPosY / 100));
          this.veloPosX = this.veloPosX - 0.5;
        }

        else {
          scores.increasePlayer();
          computer.changeVeloPosY(0.3)
          this.posY = field.height / 2;
          this.posX = field.width / 2;
          this.veloPosX = this.veloDefault;
          this.veloPosY = 0;
        }
  },
  _detectHall: function () {
    if(this.posY < 0 + 15 && this.veloPosY < 0)
      this.veloPosY = -this.veloPosY - 0.5;

    else if(this.posY > field.height - 16 && this.veloPosY > 0)
      this.veloPosY = -this.veloPosY + 0.5;
  },
  _move: function() {
    this.posX += this.veloPosX;
    this.posY += this.veloPosY
  },
  draw: function() {
    canvas.fillStyle = '#ff5';
    canvas.beginPath();
    canvas.arc(this.posX, this.posY, 15, 0, 2 * Math.PI, false);
    canvas.fill();

    this._detectDot();
    this._detectHall();
    this._move();
  }
}

function draw() {
  field.draw();
  line.draw();
  player.draw();
  computer.draw();
  scores.draw();
  ball.draw();
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {window.setTimeout(callback, 1000, 60)}
 )
})();

function main() {
  window.animateFrame(main);
  draw();
};

main();

canvasEl.addEventListener('mousemove', (even) => player.posY = even.y - player.height / 2)