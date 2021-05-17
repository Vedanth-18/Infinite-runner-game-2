var PLAY = 1;
var END = 0;
var gameState = PLAY;

var fox, fox_running, fox_collided, fox_jumping;
var ground, invisibleGround, groundImage;
var restart, gameOver;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var taro, taroImg;
var score;
var coucbImg;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var foxGroup, taroGroup;
var bgImg, bgImg2, bgImg3, bgImg4;
var bg;

function preload(){
  fox_running = loadImage("fox.gif");
  fox_collided = loadImage("fox_collided.png");
  //fox_jumping=loadImage("");
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.gif");
  obstacle2 = loadImage("obstacle2.gif");
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  taroImg = loadImage("taro.gif");
  couchImg = loadImage("fox.png");
  bgImg = loadImage("bg2.jpg");
  bgImg2 = loadImage("bg3.jpg");
  bgImg3 = loadImage("bg4.png");
  bgImg4 = loadImage("bg5.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  bg = createSprite(displayWidth/2, displayHeight/2, displayWidth*1.4, displayHeight);
  bg.velocityX=-1;
  bg.visible=false;
  fox = createSprite(displayWidth/10,displayHeight/2,displayWidth/40,50);
  fox.scale = 1;
  fox.addImage("running", fox_running);
  fox.addImage("collided" ,fox_collided);
  fox.addImage("couch", couchImg);
  //fox.addImage();
  ground = createSprite(displayWidth/2,(displayHeight/-8+displayHeight)-10,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  gameOver = createSprite(displayWidth/2,displayHeight/2);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth/2,gameOver.y+130);
  restart.addImage(restartImg);
  gameOver.scale = 1;
  restart.scale = 1;
  invisibleGround = createSprite(displayWidth/2,(displayHeight/-8+displayHeight)+5,displayWidth,10);
  invisibleGround.visible = false;
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  // console.log("Hello" + 5);
  //fox.setCollider("circle",0,0,40);
  fox.setCollider("rectangle",0,20,200, 100);
  //fox.debug = true
  score = 0;
  foxGroup = new Group();
  taroGroup = new Group();
}

function draw() {
  
  background("BLACK");
    imageMode(CENTER);
    image(bgImg4, bg.x, bg.y, bg.width, displayHeight);
  //  console.log("Background position- x: " + bg.x);
  //  console.log("Display Height: " + displayHeight);
    if(bg.x<displayWidth/3){
     bg.x=displayWidth/2;
    }
    //bgImg4, bg.x, bg.y, displayWidth*1.4, displayHeight
  //displaying score
  push();
  textStyle(BOLD);
  fill("BLACK");
  textSize(50);
  textFont("Verdana");
  text("Score: "+ score, displayWidth/1.3,displayHeight/15);
  pop();
  //console.log("Display Height: " + displayHeight/1.736170212765957);
  text(mouseX + "," + mouseY, mouseX, mouseY);
  //console.log("this is ",gameState)
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score%100===0 && score>0) {
      checkPointSound.play();
     } 
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    console.log("X position: " + bg.x);
    console.log("Display Width: " + displayWidth);
    // if (bg.x < 0){
    //   bg.x = bg.x/2;
    // }
    //jump when the space key is pressed
    //Adjusting camera position....
    fox.x=camera.position.x-displayWidth/4;
    camera.position.y=displayHeight/2;
    if(keyDown("space") && fox.y >= (displayHeight/-8+displayHeight)-165) {
        fox.velocityY = -17;
        jumpSound.play();
    }
    if(keyWentDown(DOWN_ARROW)) {
       fox.changeAnimation("couch", couchImg);
       fox.collide(invisibleGround);
       //fox.debug=true;
       fox.setCollider("circle",0,0,12);
       
       }
    if(keyWentUp(DOWN_ARROW)) {
          fox.changeAnimation("running", fox_running);
          fox.setCollider("circle",0,0,40);
          }
    console.log(fox.y);
    //add gravity
    fox.velocityY = fox.velocityY +0.65;
  
    //spawn the clouds

  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(fox.isTouching(taroGroup)) {
       gameState=END;
       // gameOver.visible=true;
       // restart.visible=true;
       // ground.velocity=0;
       // taroGroup.setVelocityXEach(0);
       // dieSound.play();
      
       }
    if(score>=120) {
       spawnTaro();
       }
    
    if(obstaclesGroup.isTouching(fox) || fox.isTouching(taroGroup)){
        gameState = END;
        dieSound.play();
        //debug
        //developer mode
        // fox.debug=true;
        // fox.velocityY = -12;
        // jumpSound.play();
    }
  }
   else if (gameState === END) {
     //console.log("...................")
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      fox.velocityY = 0
      taroGroup.setVelocityXEach(0);
      bg.x=displayWidth/2;
      //change the fox animation
      fox.changeAnimation("collided", fox_collided);
     if(mousePressedOver(restart)) {
        gameEnd();
        }
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
   }
  
 
  //stop fox from falling down
  fox.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 86 === 0){
   var obstacle = createSprite(displayWidth,(displayHeight/-8+displayHeight)-45,displayWidth/40,displayHeight-(displayHeight));
   //obstacle.scale=4;
   obstacle.setCollider("rectangle", 0,0, 100, 200);
   //obstacle.debug=true;
   obstacle.velocityX = -(8);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=-4;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=-4; 
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function gameEnd() {
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  restart.visible=false;
  gameOver.visible=false;
  score=0;
  fox.changeAnimation("running", fox_running);
  taroGroup.destroyEach();
  ground.x=ground.width /2;
  ground.velocityX=0;
}
function spawnTaro() {
  if(frameCount%random(160, 190)===0) {
     taro = createSprite(displayWidth, Math.round(random(displayHeight/3.62, displayHeight/2)),10,10);
     taro.addImage("taro1", taroImg);
     taro.scale=0.8;
     //taro.debug=true;
     taro.setCollider("rectangle", 0,15, 100, 40);
     taro.velocityX=-10;
     taroGroup.add(taro);
     }
}