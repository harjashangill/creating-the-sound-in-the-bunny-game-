const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button,blower;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr,rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var blowerImg

function preload()
{
  // adding the sounds and the images
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');
  blowerImg = loadImage("balloon.png")

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  

  // making sure that the sad and eat animation is not playing throughout the game 
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  createCanvas(500,700);

  frameRate(80);

  // creating the background sound 
  bk_song.play();
  bk_song.setVolume(0.1);

  engine = Engine.create();
  world = engine.world;
  
  // creating the cut button
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //creating the mute button
  mute_btn = createImg('mute.png');
  mute_btn.position(420,30);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  //loading the classes
  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);

  //changing the speed of the blinks and the eating to make it look more natural
  blink.frameDelay = 20;
  eat.frameDelay = 20;
// crating the bunny sprite
  bunny = createSprite(430,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  //creatign the blower image 
blower = createImg('balloon.png')
blower.position(80,300)
blower.size(100,80)
blower.mouseClicked(airBlow)

// creating the fruit 
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,490,690);

  push();
  imageMode(CENTER);

  //making sure the fruit image is always on the circle
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  // if the fruit touches the bunny then the computer should play the eating sound and eating animation
  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play()
    eating_sound.setVolume(1)
  }

// if the fruit touches the groung then the bunny shoud change to the crying animation and the crying sound should play
  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    fruit=null;
    sad_sound.play()
    sad_sound.setVolume(1)
   }
   
}
// creating the mute function
function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop()
  }
  else{
  bk_song.play()
  }

}

//creating the drop function
function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
  cut_sound.play(
    cut_sound.setVolume(1)
  )
}

// detecting the collision between the bodies and the sprites
function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

//applying the force when the the blower is clicked on by the mouse 
function airBlow(){

  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.05,y:0})
  air.play()
}