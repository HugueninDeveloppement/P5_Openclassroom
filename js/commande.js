// Recupération du numero de commande dans l'url avec searchParams 
const getOrderIdInUrl =()=>{
    const parameter = (new URL (document.location)).searchParams;
    const orderId = parameter.get('orderId')
    return orderId; 
}

// Recupération du prix total dans l'url avec searchParams
const getTotalPriceInUrl =()=>{
    const parameter = (new URL (document.location)).searchParams;
    const totalPrice = parameter.get('totalPrice')
    return totalPrice; 
}

//Récuperation des commandes déja passé dans le localstorage
const getAndParseRegisteredOrder = () => {
    let registeredOrder = localStorage.getItem('registeredOrder');
    registeredOrder = JSON.parse(registeredOrder);
    return registeredOrder;
}

// Affichage des commandes 
const displayValidationCommande =()=>{
    const commandeContainer = document.getElementById('commande_list');
    const registeredOrder = getAndParseRegisteredOrder();
    if (registeredOrder) {
        Object.values(registeredOrder).map( command =>{
        commandeContainer.innerHTML += `
        <div class="command col-11 text-center">
            <span class="commandCostValue col-2">${command.totalPrice},00€</span>
            <span class="commandNumberValue col-6">${command.orderId}</span>
            <span class="commandStatutValue col-4">${command.statut}</span>
        </div>
        `
        })
    } else {
        commandeContainer.innerHTML =  `
        <div class="command col-11 text-center">
            <h2>Aucune commande en cours</h2>
        </div>
        `
    }    
}

//affichage du nombre d'article dans le header
const showQuantityProductsInCard=()=>{
    let nbrArticleSelectionnes = localStorage.getItem('nbrProductsInCard');
    let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrArticleSelectionnes){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
  }else{    
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }
}

displayValidationCommande();
showQuantityProductsInCard();