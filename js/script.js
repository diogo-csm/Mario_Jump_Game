

const mario =document.querySelector('.mario') //traz a imagem do HTML p/ o JS
const pipe =document.querySelector('.pipe') 


//function to Add a class jump na img do Mario.
const jump = () =>{
    mario.classList.add('jump'); 

    setTimeout(() => {
        mario.classList.remove('jump'); 
    }, 500);
}


//function que cria um loop para verificar quando o mario bate no pipe
const loop = setInterval(() => {
    
    //acessa a propriedade left do mario 
    const pipePosition = pipe.offsetLeft;
    //acessar a propriedade bottom do mario  
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px',' '); //metodo replace foi usado pq retorna uma string. Entao usou-se o replace para replace o px por nada e adicionou o simbolo de + no inicio para converter para numeral

    //Verificacao -> 1 verifica se o pipe encostou do mario, depois verifica se o pipe passou do mario e por ultimo verifica se o mario pulo na altura necessaria
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80){

        //cancela a animacao do pipe caso nao passe em uma das verificacoes
        pipe.style.animation = 'none'; 
        //faz o pipe parar aonde bateu
        pipe.style.left = `${pipePosition}px` 


        mario.style.animation = 'none'; 
        mario.style.bottom = `${marioPosition}px` 

        //troca a imagem do mario para a imagem de derrota
        mario.src = './img/game-over.png'
        mario.style.width = '75px'
        mario.style.left = '50px'
        
        //para o loop
        clearInterval(loop)
    }



}, 10);

//Ativa a funcao JUMP com qlqr tecla do teclado
document.addEventListener('keydown', jump); 
