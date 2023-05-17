/*
a simplified fungus starts in the center of the screen, randomly
growing out. Periodically it splits in two. After it reaches 
a certain age, the branch dies.
Use 'p' key to pause/continue the growth, 
or any other key to restart the process.
A more rigorous scientific simulation would involve
tons of research into fungal growth, etc, but even
this version, more "inspired by" natural phenomena
than simulating it, produces exciting and varied
visual output.
As a further addition, we can look at improving the code by:
1. Can I make the tendrils change color as they
   get older? 
2. Could I add a random "bloom" that periodically
   gets added to the tendril?
*/

let maxAge = 1000;   // tendrils older than this will be removed 
let fungi;          // list of objects
let pause = false;  // use 'p' to pause/un-pause


function setup() {
  createCanvas(windowHeight, windowHeight);

  // draw the background in setup(), since after that every frame draws on top of the previous

  background(255,245,235);
  strokeWeight(1.5);

  // create a bunch of Fungus objects growing from the center
  fungi = [];
  for (let i=0; i<3; i++) {
    let f = new Fungus(width/2, height/2);
    fungi.push(f);
  }
  frameRate(50); //how slow or fast the tendrils will form
}


function draw() {
  // if not paused 
  if (!pause) {

    // go through all Fungus objects
    // must be in reverse so we can delet eobjects as we go 
    for (let i=fungi.length-1; i>=0; i-=1) {

      // get the current object
      let f = fungi[i];

      // update and, if it has reached a
      // certain radius or is too old, remove it
      f.update();
      if (f.distFromCenter >= height/2.5 || f.age > maxAge) {
        fungi.splice(i, 1);  // '1' means remove one element
      }

      // draw it onscreen
      f.display();
    }

    // if the simulation starts to bog down,
    // start over automatically
    if (frameRate() < 5) {
      setup();
    }

  }
}


function keyPressed() {
  // p = pause/un-pause
  if (key == 'p') {
    pause = !pause;
  }

  // all other keys resets
  // the sketch
  else {
    // add soft disappear
    setup();
  }
}



class Fungus {
  constructor(x, y, angle) {

    // values common to all Fungus objects
    this.angleChangeAmt = radians(2);    //increasing this makes more swiggly lines
    this.speed =          1;  //decreasing this makes broccoli like structures
    this.chanceSplit =    2.5; //makes it denser or more spreadout
    this.splitAngle =     radians(16); 

    // if specified, use angle argument otherwise its random value
    this.angle = angle || random(0, TWO_PI);

    // variables set when instantiated and/or updated every frame
    this.x =     x;
    this.y =     y;
    this.prevX = x;
    this.prevY = y;
    this.distFromCenter;
    this.age = 0;
  }  

  update() {

    // increase age of this tendril
    this.age += 1;

    // calculate the distance from the center of
    // the sketch using the Pythagorean theorem
    this.distFromCenter = sqrt(pow(width/2-this.x, 2) + pow(height/2-this.y, 2));

    // move in a random direction
    this.angle += random(-this.angleChangeAmt, this.angleChangeAmt);
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;    

    // randomly split into two Fungus objects
    // new one will split off in one direction,
    // current splits in the opposite direction
    if (random(130) < this.chanceSplit) {
      let f = new Fungus(this.x,this.y, this.angle + this.splitAngle);
      fungi.push(f);
      this.angle -= this.splitAngle;
    }
  } 

  // not much here!
  // display function is doing the drawing commands
  display() {    
    stroke(240,240, 30, 50);
    line(this.prevX,this.prevY, this.x,this.y);
  }
}
