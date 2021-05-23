// Vérifie qu'il y a des articles dans le panier (booléen)
const checkIfLocalstorage = () => getItemsInLocalStorage() ? true : false;

// Récupere les article dans le localstorage (.json)
const getItemsInLocalStorage = () =>{
   const items =localStorage.getItem('productsInCard');   
   return items;    
} 

//Récupere le nombre d'article dans le panier (number)
const getNbrItemsInLocalStorage =() =>{
    const nbrItems =localStorage.getItem('nbrProductsInCard');
    return nbrItems; 
} 

//parse la liste des articles
const parseItems = () => {
    const itemsJson = getItemsInLocalStorage();
    const items = JSON.parse(itemsJson);
    return items
}

//renvoie la liste des article pour l'affichage 
const parseAndFormatProductsInCard =()=>{
    const itemsParse = parseItems();
    const items = Object.values(itemsParse);
    return items;
}
// function pour l'affichage du nombre d'article total present dans le panier
const showQuantityProductsInCard=()=>{
    const nbrArticleSelectionnes = getNbrItemsInLocalStorage();
    let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrArticleSelectionnes){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
  }else{    
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }
}


//function d'affichage des produits selectionnés sur la page panier
const showPanier = () => { 
    const panierContainer = document.getElementById('articlesPanier');   
    const items = parseAndFormatProductsInCard();
    if (checkIfLocalstorage) {      
      items.forEach(product => {        
        panierContainer.innerHTML += `    
        <div class="article"  id="${product.id}">
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
}

//recupere les elements du DOM 
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

//vide le localstorage sans effacer les anciennes commandes
const clearLocalstorage = ()=>{
    localStorage.removeItem('nbrProductsInCard');
    localStorage.removeItem('productsInCard');
}

//function pour augmenter la quantite d'une reference
const stepUp = () => {
    if (checkIfLocalstorage) {
    const btnUp = takeDomElement().btnUp;
    for (g = 0; g < btnUp.length; g++) {
        //on cible un article
        const btnUpClick = btnUp[g];
        //addListener
        btnUpClick.addEventListener('click', function (event) {
            const idProduct = btnUpClick.parentElement.parentElement.getAttribute('id');            
            let items = JSON.parse(getItemsInLocalStorage());
            const item = items[idProduct];
            const nbrPanierContainer = btnUpClick.previousElementSibling;
            const itemCostContainer = btnUpClick.parentElement.nextElementSibling.firstElementChild;
            let nbrProductsInCard = getNbrItemsInLocalStorage();

            //on met a jours la quantite sur la reference pour le localStorage
            item.panier += 1;

            //on met a jours la quantite sur la reference pour l'affichage
            nbrPanierContainer.textContent = item.panier;

            //on met a jours la quantite pour l'affichage du panier
            nbrProductsInCard = parseInt(nbrProductsInCard);
            nbrProductsInCard += 1;

            itemCostContainer.textContent = item.panier * item.price + ',00€';
            localStorage.setItem('productsInCard', JSON.stringify(items));

            console.log(nbrProductsInCard)
            localStorage.setItem('nbrProductsInCard', nbrProductsInCard);
            totalcost.textContent = totalCost() + ',00€';
            showQuantityProductsInCard();
        }
        )
        }
    }
}

// function pour supprimer une reference du panier
const removeProduct = () => {
    if (checkIfLocalstorage) {
        const removeBtn = takeDomElement().removeBtn;

        for (i = 0; i < removeBtn.length; i++) {
            const removeClick = removeBtn[i];
            removeClick.addEventListener('click', function (event) {
                const idProduct = removeClick.parentElement.parentElement.getAttribute('id');
                const productContainer = removeClick.parentElement.parentElement;
                let items = JSON.parse(getItemsInLocalStorage());
                //on recupere et on modifie le nbr d'article present dans le panier
                let nbrProductsInCard = parseInt(getNbrItemsInLocalStorage());

                nbrProductsInCard -= items[idProduct].panier;

                delete items[idProduct];
                console.log(items)
                //on retire l'article à l'affichage 
                productContainer.remove();

                //on geres le cas si le nombre de produit present dans le panier est 0
                if (nbrProductsInCard == 0) {
                    clearLocalstorage();
                    window.location.reload();
                } else {
                    localStorage.setItem('productsInCard', JSON.stringify(items));
                    localStorage.setItem('nbrProductsInCard', nbrProductsInCard);
                    totalcost.textContent = totalCost() + ',00€';
                }
                showQuantityProductsInCard();
            })
        }
    }
}

//function pour diminuer la quantite d'une reference
const stepDown = () => {
    if (checkIfLocalstorage) {
        const btnDown = takeDomElement().btnDown;

        for (d = 0; d < btnDown.length; d++) {
            //on cible un article
            const btnDownClick = btnDown[d];
            //addListener
            btnDownClick.addEventListener('click', function (event) {
                const idProduct = btnDownClick.parentElement.parentElement.getAttribute('id');
                let items = JSON.parse(getItemsInLocalStorage());
                const nbrPanierContainer = btnDownClick.nextElementSibling;
                const itemCostContainer = btnDownClick.parentElement.nextElementSibling.firstElementChild;
                let nbrProductsInCard = parseInt(getNbrItemsInLocalStorage());

                if (items[idProduct].panier === 1) {
                    const productContainer = btnDownClick.parentElement.parentElement;
                    nbrProductsInCard -= 1;
                    delete items[idProduct];
                    //on retire l'article à l'affichage 
                    productContainer.remove();
                } else {
                    items[idProduct].panier -= 1;
                    btnDownClick.nextElementSibling.textContent = items[idProduct].panier;
                    

                    nbrProductsInCard = parseInt(nbrProductsInCard);
                    nbrProductsInCard -= 1;
                }

                if (nbrProductsInCard == 0) {
                    clearLocalstorage();
                    window.location.reload();
                } else {
                    //on met a jours la quantite sur la reference pour l'affichage
                    nbrPanierContainer.textContent = items[idProduct].panier;

                    itemCostContainer.textContent = items[idProduct].panier * items[idProduct].price + ',00€';

                    localStorage.setItem('productsInCard', JSON.stringify(items));
                    localStorage.setItem('nbrProductsInCard', nbrProductsInCard);
                    totalcost.textContent = totalCost() + ',00€';
                }
                showQuantityProductsInCard();
            })

        }
    }
    
}

//fonction d'ecoute de la validation de commande qui renvoie si ok au formulaire
const validationCommand = () => {
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

//affiche selon le resultat du localstorage
if (checkIfLocalstorage()) {
    showPanier();
    removeProduct();
    stepUp();
    stepDown();
    validationCommand();
    }else{
    panierContainer.innerHTML +='<div id="emptyCard"><span class="text-white"> vous n\'avez aucun article dans votre panier. </span></div>';
    }

showQuantityProductsInCard();





/** Check si localstorage.length > 0
 si Localsotrage => recuperer et afficher elements
 si !localStorage => panier vide
 Modifier local storage
 recueilir info user
 envoyer commande a l'api*/