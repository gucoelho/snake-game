$(document).ready(function(){

//Canvas stuff
var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();


	
//Pintar o canvas
ctx.fillStyle = "white";
ctx.fillRect(0,0,w,h);
    
	
//Variavel para guardar o a largura(width) da celula da snake   
var cw = 10;    

//Variavel que representa a direção da snake
var d;	

//Variavel da comida
var food;

//Variaveis de pontos
var score;

var time;
var mp;
	
	
var isPaused = false;
//Variavel que vai representar a snake em si
var snake_array; //um array para que o tamanho da mesma possa ser dinamico


function init(){
	d="right"; //Direita é a direção padrão em que a snake começa
	create_snake();
	create_food();
	score = 0;
	//Vamos fazer com que a função paint(que move a snake) seja execudata a cada 60ms
	if(typeof game_loop != "undefined") clearInterval(game_loop);{

		game_loop = setInterval(paint,time);
		
	}	
}
//init();	
//Função para criar a snake
function create_snake(){
    var length = 5; //tamanho da snake
    snake_array = []//Instancia o array 
     	for(var i = length-1; i>=0; i--)
		{
            //Isso vai criar uma snake na horizontal começando do topo na esquerda (top left)
			snake_array.push({x: i, y:0});
		}
 }
     
function create_food(){
	food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};

}
	
	
//Função para pintar a snake
//Lembrando que ela vai ser executada a cada frame do game
function paint(){
	if(!isPaused){
		$(".btnPlay").html("Pause");
	//para evitar que fique o rastro da snake precisa-se pintar o BG a cada frame
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
		
		
	//O codigo para o movimento da snake vem abaixo.
	//A lógica é
	//Tirar a ultima celular(a da calda) e colocar na frente da primeira (a cabeça)
		
	//Variaveis da posição da primeira celula(cabeça) da snake
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;
		
	//Vamos incrementar as posições para gerar uma nova posição para a primeira celula
	if(d == "right") nx++; //se for direita + 1 no eixo x (left)
	else if (d == "left") nx--; //se for esquerda -1 no eixo x (left)
	else if (d == "up") ny--; //se for cima -1 no eixo y (top)
	else if (d == "down") ny++; //se for cima +1 no eixo y (top)
		
	
	//Isso vai restartar o jogo caso a snake bata na parede.. 
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || 
		   check_collision(nx,ny,snake_array)) //..ou no prorio corpo
		{
			//Reseta o jogo
			init();
			return;
		}	
	
		//A logica para a snake comer a comida é
		//Se a posição da primeira celula (cabeça) coincidir com a posição da comida,
		//Cria uma nova cabeça em vez de mover a calda(ultima celula)

		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score += mp; //Adiciona os pontos
			//Cria uma nova "comida"
			create_food();	
		}
		else
		{
			var tail = snake_array.pop(); //Tira a ultima celula (calda).
			tail.x = nx; tail.y = ny;
		}
		//A snake agora pode comer a "comida"

		
	snake_array.unshift(tail); //..e coloca de volta na primeira
	
	for(var i = 0; i < snake_array.length; i++)
	{		
        var c = snake_array[i];
		paint_cell(c.x,c.y);
        
	}
		//Escreve o Score na tela	
		var score_text = "Score: " + score;

		$("#score").html(score_text);
	
	paint_cell(food.x, food.y);
	}else if(isPaused)
		$(".btnPlay").html("Play");
	
}
	//função generica para pintar células
	function paint_cell(x,y){
		//Aqui é para pintar as celulas com 10px(cw)
		ctx.fillStyle = "red";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		
	}
	
	//função para checar colisão
	function check_collision(x,y,array){
		//Essa função vai checar se as coordenadas(x,y)passadas(que são as da cabeça da snake)
		//existem em no array passado(que é o corpo todo da snake)
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	
	//Vamos adicionar os controles do teclado
	$(document).keydown(function(e){
		var key = e.which; //pega o numero da tecla apertada
		// o && é para não evitar que ela ande ao contrario
		if( key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	});

	//with jquery
	$(".btnPlay").click(function(e) {
    e.preventDefault();
	if(!isPaused){
		isPaused = true;
	}else if(isPaused)
		isPaused = false;
	});
	
	$(".button").click(function(){
		$("#menuBox").toggle();
		$("#backBox").toggle();
		$("#canvas").toggle();
		$("#score").toggle();
		$("#gameBtn").toggle();
		$("#gameArea").toggle();

		
		if($(this).html() == "Facil"){
			time = 90;
			mp = 5;
		}
		else if ($(this).html() == "Normal"){
			time = 50;
			mp = 10;
		}
		else if ($(this).html() == "Dificil")
			time = 30;
			mp = 15;
		init();
	});
});