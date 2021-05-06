// Recupération du l'url du navigateur
const url = window.location.search;
const camerasUrl ='http://localhost:3000/api/cameras';
// Obtention de la requete inclus dans l'url
const getProductId = (url) => {
	const urlToSplit = url.split("=");
	const queryPositionInArray = urlToSplit.length - 1;
	const result = urlToSplit[queryPositionInArray];

	return result;
};

// fetch one product by id
const oneApiCall = async function (productId){
    try{
      const response =await fetch (camerasUrl+"/"+productId)
      if(response.ok){
        const dataProduct = await response.json();
        showOne (dataProduct);        
      } else {
        console.log('retour du server : ', response.status)
      }
    } catch (e){
      console.log(e)
    }  
  };
const formatResponseKeys = (dataJson)=>{
  const dataKeys = Object.keys(dataJson);
  return dataKeys;
};

function showOne (oneCamera){
    const articleContainer = document.getElementById('detailProduit');
    const articleJson= oneCamera;
    const articleKeys = formatResponseKeys(oneCamera);
    articleContainer.innerHTML +=
        `<section class="mb-5">
        <div class="row">
        <div class="col-md-5 mb-4 mb-md-0">    
            <div class="row product-gallery mx-1">  
              <div class="col-12 mb-0">
                <figure class="view overlay rounded z-depth-1 main-img">
                  <a href="${articleJson.imageUrl}" target="_blank"
                    data-size="680x789">
                    <img src="${articleJson.imageUrl}"
                      class="img-fluid z-depth-1" >
                  </a>
                </figure>
              </div> 
            </div> 
        </div>
        <div class="col-md-7">  
          <h5>${articleJson.name}</h5>
          <p><span class="mr-1"><strong>${articleJson.price / 100} €</strong></span></p>
          <p class="pt-1">${articleJson.description}</p>
          <div class="table-responsive">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="pl-0 w-25" scope="row"><strong>Livraison</strong></th>
                  <td>USA, Europe</td>
                </tr>
                <tr>                
                  <th class="pl-0 w-25" scope="row"><strong>${articleKeys[0]}</strong></th>
                  <td>
                    <div class="mt-1" id="options"></div>
                  </td>
                </tr>               
              </tbody>
            </table>
            <button type="button" id="btnAdd" class=" btn btn-secondary btn-md mr-1 mb-2"><i
                class="fas fa-shopping-cart pr-2"></i>Ajouter au panier</button>
          </div>
        </div>
      </div>    
    </section>`
    
    const options = articleKeys[0];
    articleJson[options].map(option => {
        const optionsContainer = document.getElementById('options')
        optionsContainer.innerHTML+=`
        <div class="form-check form-check-inline pl-0">
        <input type="radio" class="form-check-input " value="${option}" name="materialExampleRadios"
            checked>
        <label class="form-check-label text-uppercase card-link-secondary"
            for="${option}">${option}</label>
        </div>
        `
    });
    addToCard(articleJson);
    
};


function addToCard(articleJson) {
  const btnAdd = document.getElementById('btnAdd')
  btnAdd.addEventListener('click',function(event){
  setItemInCard(articleJson);
  nbrProductsInCard();  
  })
}

function nbrProductsInCard() {
  let nbrProductsInCard = localStorage.getItem('nbrProductsInCard');
  if(nbrProductsInCard){
    nbrProductsInCard = parseInt(nbrProductsInCard);
    nbrProductsInCard +=1;   
  } else {
    nbrProductsInCard = 1;
  }
  localStorage.setItem('nbrProductsInCard',nbrProductsInCard);
  nbrCard ();
}

function setItemInCard(articleJson) {
  let products = localStorage.getItem('productsInCard');
  const productId = articleJson._id;
  const productName = articleJson.name;
  const productprice = articleJson.price;
  const productImage = articleJson.imageUrl;
  const productInCard = 1;
  const product = { id : productId, name : productName, price : productprice / 100,img : productImage, panier:productInCard};
  const id = JSON.stringify(productId);
  
  if(products == null){
    products ={[product.id]:product};
  } else {
    products = JSON.parse(products);

      if(products[product.id] == undefined){
        
        products = {
          ...products,
              [product.id]:product
        }
      }
      else{
        products[product.id].panier +=1;
      }    
  }
  localStorage.setItem('productsInCard',JSON.stringify(products));
}

function nbrCard (){
    let nbrArticleSelectionnes = localStorage.getItem('nbrProductsInCard');
    let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrArticleSelectionnes){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
  }else{    
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }
}

oneApiCall(getProductId(url));
nbrCard ();
