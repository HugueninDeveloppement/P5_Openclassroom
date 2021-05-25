const formulaire = document.getElementById('costFormulaire');
const url ='http://localhost:3000/api/cameras/order'


// recupere les articles validés pour la commande et les retourne au format .json
const getProductsInCard =()=>{
  const itemsJson = localStorage.getItem('productsInCard');
  return itemsJson;
}


// formate le .json en objet javascript
const parseAndFormatProductsInCard =()=>{
  const itemsJson = getProductsInCard();
  const items =Object.values(JSON.parse(itemsJson));
  return items;
}

// Récupère la liste des ID en .json et retourne un tableau 
const getId_Array =()=>{
  let idArray = localStorage.getItem('arrayId');
  idArray = JSON.parse(idArray);
  return idArray;
}

//boucle les articles, et calcul le cout total de la commande
const totalCost = ()=>{
  let totalCost =0 ;
  items = parseAndFormatProductsInCard();
  items.forEach(item => {
      totalCost += item.panier * item.price;        
  })
  return totalCost;   
}

// Affiche le recap des article sous forme de liste
const displayRecapCost = () =>{  
  const panierContainer = document.getElementById('articlesPanier');   
  const itemsJson = getProductsInCard();
  const total = totalCost(); 
  if (itemsJson) {
    const items = parseAndFormatProductsInCard();
    const itemContainer = document.getElementById('recapitulatifCommande');
    items.forEach(product => {
      itemContainer.innerHTML += `
      <div class="article col-10"  id="${product.name}">
      <div class="imagepanier">
          <img class="imagearticle" src="${product.img}"> 
      </div>
      <div class="titrepanier">${product.name}</div> 
      <div class="compteurarticle">
          <span class="quantite"> ${product.panier}</span>    
      </div>
      <div class="totalarticle">
          <span class="totalitem">${product.price * product.panier},00€</span>
      </div>
    </div>
      `
    });
    itemContainer.innerHTML += `
    <div class="totalCostFormulaire  text-center col-10">
      <span class="commandeTotalContainerTitre">Total de la commande :</span>
      <span id="totalcost">${total},00€</span> 
    </div>   `
  }
}


// Regex pour le nom , le prenom ,la ville acceptant les noms composés (booléen)  
const checkUserNameAndCityName = () =>{
  const userLastName = document.getElementById('lastName').value;
  const userFirstName = document.getElementById('firstName').value;  
  const userCity = document.getElementById('city').value;
  const regexName =  /^[a-zA-ZéèîïÉÈÎÏ][a-zA-ZéèîïÉÈÎÏ]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zA-ZéèîïÉÈÎÏ]+)?$/;
      
    if (regexName.test(userLastName) && regexName.test(userFirstName) && regexName.test(userCity)) { 
      return true;
    } else {
        return false;
    }
}

//Regex pour l'email (booléen)
const checkEmail = () => {
  const userEmail = document.getElementById('email').value;
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (regexEmail.test(userEmail)) {
    return true;
  } else {
      return false;
  }
}


//Regex adresse (booléen)
const checkAddress=()=>{
  const userAddress = document.getElementById('address').value;
  const regexAdress = /^\d+\s[A-z]+\s[A-z]+/;

  if (regexAdress.test(userAddress)) {
    return true;
  } else {
      return false;
  }
}

//double controle pour les champs vides(required en HTML)
const checkAllInputNotEmpty = () => {
  const inputs =document.getElementsByTagName('input');
  const error = document.getElementById('error');
  let errorMsg =""
  for ( i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if(inputs[i].value){
      error.innerHTML = errorMsg;
      return true;
    }else{
      errorMsg = "Merçi de remplir tous les champs";      
      error.innerHTML = errorMsg;
      return false;
    }
    
  }
}

// Controle de toutes les Regex (booléen)
const checkAllInputRegex = () => {
  if(checkUserNameAndCityName()==true && checkEmail()==true && checkAddress()==true ){
      return true;
  }else{
    return false;
  }
}


// construction le l'objet user
const formatData = async () => {
  if(checkAllInputRegex() === true){
  let dataform = {
    lastName:formulaire['lastName'].value,
    firstName:formulaire['firstName'].value,
    address:formulaire['address'].value,
    city:formulaire['city'].value,
    email:formulaire['email'].value
  }
  return dataform;
}
}

// fetch en asynchrone des données user et id_array
const postData = async (url) =>{
  const orderToPost = {
    contact : await formatData(),
    products : getId_Array()
  }  
  const postRequest = {
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(orderToPost)
  }
  await fetch (url, postRequest)
  .then(response=> response.json())
  .then(json => redirectToConfirm(json));
}


// réinitialisation du localstorage sans supprimé les anciennes commandes
const clearLocalstorage = ()=>{
  localStorage.removeItem('nbrProductsInCard');
  localStorage.removeItem('productsInCard');
  localStorage.removeItem('arrayId')
}

// Récupere les commandes dans le localstorage
const getAndParseRegisteredOrder = () => {
    let registeredOrder = localStorage.getItem('registeredOrder');
    registeredOrder = JSON.parse(registeredOrder);
    return registeredOrder;
}

// sauvegarde la commande passée dans le localstorage
const saveOrderInLocalstorage = (id, total) => {
    let registeredOrder = getAndParseRegisteredOrder();
    const orderId = id;
    const totalPrice = total;
    const statut = "En cours, Merçi pour votre commande";
    const saveCommand = {
        totalPrice,
        orderId,
        statut
    };

    if (registeredOrder && saveCommand.orderId != null) {
        registeredOrder = {
            ...registeredOrder,
            [saveCommand.orderId]: saveCommand
        };
    } else if (saveCommand.orderId != null) {
        registeredOrder = { [saveCommand.orderId]: saveCommand };
    }
    localStorage.setItem('registeredOrder', JSON.stringify(registeredOrder));
}

// Redirige faire la page des commandes 
const redirectToConfirm =(confirmationFromAPI)=>{
  clearLocalstorage();
  const totalPrice = confirmationFromAPI.products
  .map( product =>(product.price)/100)
  .reduce((total,price)=>total + price)
    const orderId = confirmationFromAPI.orderId;
    saveOrderInLocalstorage(orderId, totalPrice);
    let url = `${window.location.origin}/html/commande.html?orderId=${orderId}&totalPrice=${totalPrice}`;
    window.location.href = url;
}


// Ecoute de la validation du formulaire
formulaire.addEventListener('submit',function(event){ 
  event.preventDefault();
  if (checkAllInputNotEmpty()==true && checkAllInputRegex()==true) {      
    postData (url); 
  }else{          
  event.preventDefault();
  } 

})

displayRecapCost();