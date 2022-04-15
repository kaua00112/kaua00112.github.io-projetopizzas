let cart = [];
let modalQt = 1;
let modalKey = 0;//
//função anonima utilizando arrow, mesma coisa de uma função normal, só que com bem menos codigo.
const c = (el)=>document.querySelector(el); //crio uma variavel chamada c, que retorna o parametro document.queryselector, pra mim poder usar no codigo, sem ter que comando document...
 const cs = (el)=>document.querySelectorAll(el);//memsma coisa esse




pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//clono o modelo de pizzas/comando c no inicio substituindo document.queryselector
    //preencher as informações em pizzaitem

    //seleciona a div com o nome da pizza e subistituo com o objeto name que estou requisantando de pizza.js, no caso uma api
    //mesmo caso das outras informações, desc e price
    //no caso de price, formatei para aparecer os dois algarismos depois da virgula, usando o toFixed
    pizzaItem.setAttribute('data-key', index);  //comando para identificar o id da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;//não usei o c, pois queryselector vai procurar o elementro dentro de pizzaItem, ja o comando c é global
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{//comando que previne a pagina de atualizar ao clicar nas pizzas para fazer aparecer o modal
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');//irá procurar o item pizza-item e pegar o atributo data-key dele, no caso o a identificação do pizza que está definida no json como id
        modalQt = 1;
        //como eu ja posso identificar as pizzas usando o data key, agr só coloco as informações dentr do modal
        modalKey = key;//variavel pra identificar a pizza fora do modal, para adicionar no carrinho
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;//pegando do meu json o preço das pizza e jogando no modal, usando o pizzaJson[key]
        c('.pizzaInfo--size.selected').classList.remove('selected');//removo o selected
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{//pegando o tamanhos da pizza e jogando no modal

            if(sizeIndex == 2 ){
                size.classList.add('selected');//condição para manter a pizza grande selecionada
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];//pegando o tamanho das pizzas
        })
            c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity= 0;//animação pra aparecer o modal
        c('.pizzaWindowArea').style.display='flex';//o modal esta setado como display none no css, esse comando seta como flex ao clicar na pizza assim faz o modal aparecer
        setTimeout(()=>{//animação
            c('.pizzaWindowArea').style.opacity= 1;
        }, 100);
    });
    

    c('.pizza-area').append(pizzaItem); //adiciono as pizza com append. Não uso innerHTML por que ele substituiria as pizza, o append adiciona
});


        //EVENTOS DO MODAL, FECHAR MODAL

function closeModal() {
    c('.pizzaWindowArea').style.opacity= 0; 
    setTimeout(() => {
        c('.pizzaWindowArea').style.display= 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
});

    //ADICIONAR E REMOVER PIZZAS MODAL
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1 ){//condição para não ficar com pizzas negativas, 
        modalQt--
        c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
            c('.pizzaInfo--qt').innerHTML = modalQt;
        });
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{//adicionar pizzas
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{//pego os tamanhos das pizzas
    size.addEventListener('click', (e)=>{//evento de click
        c('.pizzaInfo--size.selected').classList.remove('selected');//removo o selected do item selecionado
        size.classList.add('selected');//adiciono o selected no item que selecionei
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{//FUNÇÃO ADICIONAR ITENS AO CARRINHO
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));//pra saber o tamanho, crio uma variavel size e pego o elemento html que possui o atributo data-key no html, que identifica o tamanho das pizzas
        
    //lógica para organizar o carrinho
    let identifier = pizzaJson[modalKey].id+'@'+size;//variavel identifier, vai definir no array o sabor e tamanho da pizza escolhida

    let key = cart.findIndex((item)=>item.identifier == identifier);//vai procurar dentro do array o item identifier, se ja tiver irá fazer a condição abaixo
    if(key > -1 ) {//se ele acho o identifier, ou seja, key > -1, ele aumenta a quantidade
            cart[key].qt +=modalQt
    }else{//se não, ele adiciona mais um novo item executando o codigo abaixo
        cart.push({ //PUSH EU VOU "EMPURRAR AS INFORMAÇÕES PRA DENTRO DO ARRAY"
            identifier,
            id:pizzaJson[modalKey].id,//identificar pizza usando a variavel modalKey que eu criei la emcima
            size,//identificar o tamanho da pizza
            qt:modalQt//identificar a quantidade de pizza
        });

    }
    updateCart();//função que irá mostra o carrinho ao adicionar pizzas
    closeModal();

});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0 ){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'; 
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;//carrinho mobile

    if(cart.length > 0) { //quando o array cart possui um item ou mais 
        c('aside').classList.add('show');//irá mostrar o carrinho
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);//identificar as pizzas dentro do carrinho
            subtotal += pizzaItem.price * cart[i].qt;
           
           
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            //tamanhos das pizzas
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;//nome das pizzas e tamanho dentro de uma variavel só
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;//mostrar a quantidade de pizzas dentro do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{//função de adicionar pizzas direto de dentro do carrinho
                if(cart[i].qt > 1) {//condição para não deixar items negativos dentro do carrinho, igual no modal
                   cart[i].qt--;
                   updateCart(); 
                }else {
                    cart.splice(i, 1); 
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
            
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}