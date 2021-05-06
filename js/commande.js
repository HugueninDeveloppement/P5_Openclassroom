// Recupération des variables dans l'url avec searchParams 
const getOrderIdInUrl =()=>{
    const parameter = (new URL (document.location)).searchParams;
    const orderId = parameter.get('orderId')
    return orderId; 
}

const getTotalPriceInUrl =()=>{
    const parameter = (new URL (document.location)).searchParams;
    const totalPrice = parameter.get('totalPrice')
    return totalPrice; 
}

const getAndParseRegisteredOrder =()=>{
    let registeredOrder = localStorage.getItem('registeredOrder');
    registeredOrder =JSON.parse(registeredOrder);
    return registeredOrder;
}

const saveOrderInLocalstorage =()=>{
    let registeredOrder = getAndParseRegisteredOrder();    
    const totalPrice = getTotalPriceInUrl();
    const orderId = getOrderIdInUrl();
    const statut = "En cours, Merçi pour votre commande";
    const saveCommand = {
            totalPrice,
            orderId,
            statut};

    if(registeredOrder){        
        registeredOrder = {
            ...registeredOrder,
            [saveCommand.orderId]:saveCommand
        };
    }else{
    registeredOrder = {[saveCommand.orderId]:saveCommand};
    }
    localStorage.setItem('registeredOrder',JSON.stringify(registeredOrder));
}



const displayValidationCommande =()=>{
    const commandeContainer = document.getElementById('commande_list');
    const registeredOrder = getAndParseRegisteredOrder();
    Object.values(registeredOrder).map( command =>{
        commandeContainer.innerHTML += `
        <div class="command col-11 text-center">
            <span class="commandCostValue col-2">${command.totalPrice},00€</span>
            <span class="commandNumberValue col-6">${command.orderId}</span>
            <span class="commandStatutValue col-4">${command.statut}</span>
        </div>
        `
        })
}

const nbrProductInCard=()=>{
    let nbrArticleSelectionnes = localStorage.getItem('nbrProductsInCard');
    let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrArticleSelectionnes){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
  }else{    
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }
}

saveOrderInLocalstorage();
displayValidationCommande();
nbrProductInCard();