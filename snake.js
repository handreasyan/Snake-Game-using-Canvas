
		const canvas = document.querySelector("canvas");
		const context = canvas.getContext("2d");

		const backgroundImg = document.createElement("img");
		backgroundImg.src = "https://store-images.s-microsoft.com/image/apps.38570.13510798886639967.009adcbf-6b4e-4171-9aea-4da61a3ee34e.7226174a-ee68-4b21-a447-8638f9cc7a9f?mode=scale&q=90&h=1080&w=1920";
		
		const appleimg = document.createElement("img");
		appleimg.src = "https://icons.iconarchive.com/icons/bingxueling/fruit-vegetables/256/apple-red-icon.png";
		
		const snakeImg = document.createElement("img");
		snakeImg.src = "https://pngimg.com/uploads/snake/snake_PNG4072.png";

		const stabAudio = document.createElement("audio");
		stabAudio.src = "http://tastyspleen.net/~quake2/baseq2/sound/world/ra.wav";

		const loseAudio = document.createElement("audio");
		loseAudio.src = "http://www.superluigibros.com/downloads/sounds/SNES/SMRPG/wav/smrpg_mario_sleep.wav";
		

		let UP = "up";
		let DOWN = "down";
		let LEFT = "left";
		let RIGHT = "right";

		let SIZE = 30;

		function Apple(){
			this.x = random(0,canvas.width - SIZE);
			this.y = random(0,canvas.height - SIZE);
			this.width = SIZE;
			this.height = SIZE;
			this.color = appleimg;
			this.name = "apple";
		}

		function Snake(){
			this.body = [
						 { x:0, y:2 * SIZE},
						 { x:0, y:1 * SIZE},
						 { x:0, y:0 * SIZE},
						];
			this.name = "snake";
			this.xDelta = 0;
			this.yDelta = SIZE;
			this.color = snakeImg;
			this.direction = DOWN;
			this.drawSnake = function(color){
				this.body.forEach((val) =>  {	
					draw(val,this.color);
				});
			}

		}

		function draw(object,color){
			if(object.name === "apple" ){
				context.drawImage(object.color,object.x,object.y,SIZE,SIZE);
			}else{
				context.drawImage(color,object.x ,object.y,SIZE ,SIZE);
			/*	context.fillStyle = object.color ? object.color : color;
				context.fillRect(object.x,object.y,SIZE,SIZE);*/
			}

		}

		function SnakeGame(){

			this.snake = new Snake();
			this.apple = new Apple();
			this.reset = false;
			this.food = false;
			this.score = 0;
			this.bScore = 0;

			this.drawBoard = function(){

				context.clearRect(0,0,canvas.width,canvas.height);
				context.drawImage(backgroundImg,0,0,canvas.width,canvas.height);
				if(this.food === false){
					draw(this.apple);
					this.food = false;
				}

				this.snake.drawSnake();

				context.font = "16px serif";
				context.strokeText("Score : " + this.score + "                                              Best Score : " + this.bScore, 130, 15);

			}

			this.moveSnake = function(){
				game.foodEat();

				switch (this.snake.direction) {
					case UP:
						this.snake.xDelta = 0;
						this.snake.yDelta = -SIZE;
						break;
					case DOWN:
						this.snake.xDelta = 0;
						this.snake.yDelta = SIZE;
						break;
					case RIGHT:
						this.snake.xDelta = SIZE;
						this.snake.yDelta = -0;
						break;
					case LEFT:
						this.snake.xDelta = -SIZE;
						this.snake.yDelta = 0;
						break;
				}


				const head = {
					x: this.snake.body[0].x + this.snake.xDelta,
					y: this.snake.body[0].y + this.snake.yDelta
				}

				this.snake.body.unshift(head);
			

				if(this.foodEat()){
					this.apple = new Apple();
					this.score ++;
					stabAudio.currentTime = 0;
					stabAudio.play();
					if(this.bScore < this.score){
						this.bScore  ++;
					}
				} else{
					this.snake.body.pop();
				}

			}

			this.isGameOver = function(){

				if(this.snake.body[0].y > canvas.height || this.snake.body[0].y < 0 || this.snake.body[0].x > canvas.width || this.snake.body[0].x < 0){
					this.reset = true;
					loseAudio.currentTime = 0;
					loseAudio.play();
					alert("Game Over");
					this.score = 0;
				}

			}

			this.resetGame = function(){
				this.snake = new Snake();
				this.apple = new Apple();
				this.reset = false;
			}

			this.foodEat = function(){
				return this.snake.body[0].x === this.apple.x && this.snake.body[0].y === this.apple.y;
			}

		}

		let game = new SnakeGame();
		let updated = 0;

		function loop(now){
			requestAnimationFrame(loop);

			if(!game.reset){	
				if(now - updated > 300){
					game.drawBoard();
					game.moveSnake();
					updated = now;
				}
				game.isGameOver();
			}else{
				game.resetGame();
			}
		}	

		loop();

		document.addEventListener("keydown",function(e){
			if(e.code === "ArrowUp" && game.snake.direction !== DOWN){	
				console.log(UP);
				game.snake.direction = UP;
				
			} else if(e.code === "ArrowDown" && game.snake.direction !== UP){	
				console.log(DOWN);
				game.snake.direction = DOWN;
				
			} else if(e.code === "ArrowLeft" && game.snake.direction !== RIGHT){
				console.log(LEFT);
				game.snake.direction = LEFT;
				
			} else if(e.code === "ArrowRight" && game.snake.direction !== LEFT){
					console.log(RIGHT);
					game.snake.direction = RIGHT;
			}
		})



		function random (min,max){
			let rand =  Math.floor(Math.random() * (max - min)) + min;
			rand += (SIZE - rand % SIZE);

			return rand;
		}
