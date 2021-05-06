const checkIfLocalstorage  = () => localStorage.length > 0 ? true : false;
const getItemsInLocalStorage = () =>{
   const items =localStorage.getItem('productsInCard');
   return items; 
} 

const getNbrItemsInLocalStorage =() =>{
    const nbrItems =localStorage.getItem('nbrProductsInCard');
    return nbrItems; 
} 

const getProductsInCard =()=>{
    const itemsJson = localStorage.getItem('productsInCard');
    return itemsJson;
}

const parseAndFormatProductsInCard =()=>{
    const itemsJson = getProductsInCard();
    const items =Object.values(JSON.parse(itemsJson));
    return items;
}
// function pour l'affichage du nombre d'article total presesent dans le panier
function nbrCard (){
    const nbrItems = getNbrItemsInLocalStorage();
    const nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrItems){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrItems;
  }else if (nbrItems == 0) {
      nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
      localStorage.removeItem('nbrProductsInCard');
  } else {    
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }

}


//function d'affichage des produits selectionnés sur la page panier
function showPanier() {  
    const panierContainer = document.getElementById('articlesPanier');   
    const itemsJson = getProductsInCard();
    if (itemsJson) {
      const items = parseAndFormatProductsInCard();
      items.forEach(product => {        
        panierContainer.innerHTML += `    
        <div class="article"  id="${product.name}">
            <div class="imagepanier">
                <img class="imagearticle" src="${product.img}"> 
            </div>
            <div class="titrepanier">${product.name}</div>
            <div class="prixpanier">${product.price},00€ </div> 
            <div class="compteurarticle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-square-fill" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6H4z"/>
                </svg>
                <span class="nbrPanier"> ${product.panier}</span>    
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-square-fill" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 9h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5A.5.5 0 0 0 4 11z"/>
                </svg>
            </div>
            <div class="totalarticle">
                <span class="totalitem">${product.price * product.panier},00€</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-excel-fill" viewBox="0 0 16 16">
                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.884 4.68 8 7.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 8l2.233 2.68a.5.5 0 0 1-.768.64L8 8.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 8 5.116 5.32a.5.5 0 1 1 .768-.64z"/>
                </svg>
            </div>
        </div>`
      });
    }
    panierContainer.innerHTML += `
            <div class="commandeTotalContainer d-flex justify-content-between">
              <button type="button" id="confirmPanier" class="btn btn-secondary text-white btn-sm col-4">confirmer la commande</button>
              <div class="totalcommande  text-center">
                <span class="commandeTotalContainerTitre">Total de la commande :</span>
                <span id="totalcost">,00€</span> 
              </div>            
            </div>
          `    
    totalcost.textContent = totalCost() +',00€';
}

const takeDomElement = () =>{
    const nbrPanier = document.getElementsByClassName('nbrPanier');
    const totalcost = document.getElementById('totalcost');
    const totalarticle = document.getElementsByClassName('totalitem');
    const btnDown = document.getElementsByClassName('bi bi-caret-down-square-fill');
    const btnUp = document.getElementsByClassName('bi bi-caret-up-square-fill');
    const removeBtn = document.getElementsByClassName('bi bi-file-excel-fill');
    return {nbrPanier,
    totalcost,
    totalarticle,
    btnDown,
    btnUp,
    removeBtn};
}

//function qui gere la mise a jours du total de la commande
const totalCost = ()=>{
    let totalCost =0 ;
    items = parseAndFormatProductsInCard();
    items.forEach(item => {
        totalCost += item.panier * item.price;        
    })
    return totalCost;   
}

//function pour augmenter la quantite d'une reference
function stepDown() {
    const btnDown = takeDomElement().btnDown;

    for (d = 0; d < btnDown.length; d++) {
        //on cible un article
        const btnDownClick = btnDown[d];
        //addListener
        btnDownClick.addEventListener('click', function (event){            
            let items = parseAndFormatProductsInCard();
            const productContainer = btnDownClick.parentElement.parentElement;
            console.log(productContainer);
            const nameProduct = btnDownClick.parentElement.previousElementSibling.previousElementSibling.textContent;           
            const item = items.find(product => product.name === nameProduct);
            const nbrPanierContainer = btnDownClick.previousElementSibling;
            const itemCostContainer = btnDownClick.parentElement.nextElementSibling.firstElementChild;
            let nbrProductsInCard = getNbrItemsInLocalStorage();
            
            if (item.panier == 1) {
                nbrProductsInCard -= 1;
                items = items.filter(product=> product.name !== nameProduct);
                productContainer.remove();
            } else {
            item.panier -=1 ;
            btnDownClick.nextElementSibling.textContent = item.panier;            
            nbrProductsInCard = parseInt(nbrProductsInCard);
            nbrProductsInCard -= 1;
            }

            if(nbrProductsInCard == 0){
                localStorage.clear();
                }else{
                localStorage.setItem('productsInCard',JSON.stringify(items));
                localStorage.setItem('nbrProductsInCard',nbrProductsInCard);                
            }
            nbrCard ();
            document.location.reload();
        })        
    }
}

function stepUp() {
    const items = parseAndFormatProductsInCard();    
    const btnUp = takeDomElement().btnUp;
    for (g = 0; g < btnUp.length; g++) {
        //on cible un article
        const btnUpClick = btnUp[g];
        //addListener
        btnUpClick.addEventListener('click', function (event){

            const nameProduct = btnUpClick.parentElement.previousElementSibling.previousElementSibling.textContent;           
            const item = items.find(product => product.name === nameProduct);
            const nbrPanierContainer = btnUpClick.previousElementSibling;
            const itemCostContainer = btnUpClick.parentElement.nextElementSibling.firstElementChild;
            let nbrProductsInCard = getNbrItemsInLocalStorage();

            //on met a jours la quantite sur la reference pour le localStorage
            item.panier +=1 ;

            //on met a jours la quantite sur la reference pour l'affichage
            nbrPanierContainer.textContent = item.panier;

            //on met a jours la quantite pour l'affichage du panier
            nbrProductsInCard = parseInt(nbrProductsInCard);
            nbrProductsInCard += 1;
            
            itemCostContainer.textContent = item.panier*item.price+',00€';
            localStorage.setItem('productsInCard',JSON.stringify(items));
            localStorage.setItem('nbrProductsInCard',nbrProductsInCard);
            totalcost.textContent= totalCost()+',00€';
            nbrCard ();
        })      
    }
}





// function pour supprimer une reference du panier
function removeProduct(){       
    const removeBtn = takeDomElement().removeBtn;
    for (f = 0; f < removeBtn.length; f++) {
        //on cible un article
        const removeClick = removeBtn[f];
        //addListener
        removeClick.addEventListener('click', function (event) {
            let items = parseAndFormatProductsInCard(); 
            const nameProduct = removeClick.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const productContainer = removeClick.parentElement.parentElement;
            const item = items.find(product => product.name === nameProduct);

            //on recupere et on modifie le nbr d'article present dans le panier
            let nbrProductsInCard = getNbrItemsInLocalStorage();
            nbrProductsInCard -= item.panier;

            //on supprime l'article de la liste des article
            items = items.filter(product=> product.name !== nameProduct);
            
            console.log(items);
            //on retire l'article à l'affichage 
            productContainer.remove();

            //on geres le cas si le nombre de produit present dans le panier est 0
            if(nbrProductsInCard == 0){
            localStorage.clear();
            window.location.reload();
            }else{
            localStorage.setItem('productsInCard',JSON.stringify(items));
            localStorage.setItem('nbrProductsInCard',nbrProductsInCard);
            }
            totalcost.textContent= totalCost()+',00€';
            nbrCard ();
        })
        
    }
    
}


function validationCommand() {
    const btnConfirm = document.getElementById('confirmPanier');
    btnConfirm.addEventListener('click', function (event){
        let items = parseAndFormatProductsInCard();
        let id_array =[];
        items.forEach(product => {
            for (q = 0; q < product.panier; q++) {
                id_array.push(product.id);                
            }            
        })
        localStorage.setItem('arrayId',JSON.stringify(id_array));
        window.location.assign('formulaire.html')

    })
}


if (checkIfLocalstorage() === true) {

    showPanier();
    removeProduct();
    stepUp();
    stepDown();
    validationCommand();
    }else{
    panierContainer.innerHTML +='<div id="emptyCard"><span class="text-white"> vous n\'avez aucun article dans votre panier. </span></div>';
    }

nbrCard ();




// Check si localstorage.length > 0
// si Localsotrage => recuperer et afficher elements
// si !localStorage => panier vide
// Modifier local storage
// recueilir info user
// envoyer commande a l'api