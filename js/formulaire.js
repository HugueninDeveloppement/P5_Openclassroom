const formulaire = document.getElementById('costFormulaire');
const url ='http://localhost:3000/api/cameras/order'


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

const getProductsInCard =()=>{
  const itemsJson = localStorage.getItem('productsInCard');
  return itemsJson;
}

const parseAndFormatProductsInCard =()=>{
  const itemsJson = getProductsInCard();
  const items =Object.values(JSON.parse(itemsJson));
  return items;
}

const getId_Array =()=>{
  let idArray = localStorage.getItem('arrayId');
  idArray = JSON.parse(idArray);
  return idArray;
}

const totalCost = ()=>{
  let totalCost =0 ;
  items = parseAndFormatProductsInCard();
  items.forEach(item => {
      totalCost += item.panier * item.price;        
  })
  return totalCost;   
}

function displayRecapCost() {  
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
 
function checkUserNameAndCityName(){
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


function checkEmail(){
  const userEmail = document.getElementById('email').value;
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (regexEmail.test(userEmail)) {
    return true;
  } else {
      return false;
  }
}

function checkAddress(){
  const userAddress = document.getElementById('address').value;
  const regexAdress = /^\d+\s[A-z]+\s[A-z]+/;

  if (regexAdress.test(userAddress)) {
    return true;
  } else {
      return false;
  }
}

function checkAllInputNotEmpty(){
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


function checkAllInputRegex(){
  if(checkUserNameAndCityName()==true && checkEmail()==true && checkAddress()==true ){
      return true;
  }else{
    return false;
  }
}



async function formatData(){
  let dataform = {
    lastName:formulaire['lastName'].value,
    firstName:formulaire['firstName'].value,
    address:formulaire['address'].value,
    city:formulaire['city'].value,
    email:formulaire['email'].value
  }
  return dataform;
}


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

const clearLocalstorage = ()=>{
  localStorage.removeItem('nbrProductsInCard');
  localStorage.removeItem('arrayId');
  localStorage.removeItem('productsInCard');
}

const redirectToConfirm =(confirmationFromAPI)=>{
  clearLocalstorage();
  console.log(confirmationFromAPI);
  const totalPrice = confirmationFromAPI.products
  .map( product =>(product.price)/100)
  .reduce((total,price)=>total + price)
  const orderId = confirmationFromAPI.orderId;
  let url = `${window.location.origin}/html/commande.html?orderId=${orderId}&totalPrice=${totalPrice}`;
  window.location.href = url;
}

formulaire.addEventListener('submit',function(event){ 
  event.preventDefault();
  if (checkAllInputNotEmpty()==true && checkAllInputRegex()==true) {      
    postData (url); 
  }else{          
  event.preventDefault();
  } 

})

nbrProductInCard();
displayRecapCost();