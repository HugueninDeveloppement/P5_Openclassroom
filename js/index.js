let camerasUrl ='http://localhost:3000/api/cameras';
let productsContainer = document.getElementById('products');
let detailsContainer = document.getElementById('detailProduit');
let showNbrProducts = document.getElementById('nbreArticle');
let panierContainer = document.getElementById('panierContainer');

//import {showQuantityProductsInCard} from "./modules/module";

// fetch all products
const allProductsFromApi = async () => {
  try{
    let response = await fetch(camerasUrl)
    if (response.ok){
      let dataProducts = await response.json()
      showAllProducts(dataProducts);
    }else {
      console.log('retour du server : ', response.status)
    }
  } catch (e){
    console.log(e)
  }
};


//affichage des articles sur la page d'accueil, utilisation de bootstrap pour la mise en forme
const showAllProducts = (dataProducts) => {
    if (productsContainer && dataProducts) {      
      const products = dataProducts;
      products.map(article =>{        
            productsContainer.innerHTML += `
            <div class="card border border-secondary" style="width: 22rem">
                <!--container pour la photo-->
                <div class=zoom>
                  <div class=image>
                    <img class="photo__article card-img-top" src="${article.imageUrl}" alt="Card image cap">
                  </div>
                </div>                
                <div class="card-body border-secondary">
                  <!--container pour le nom-->
                  <h5 class="nom__article card-title">${article.name}</h5>
                  <!--container pour la description-->
                  <p class="description__article card-text">${article.description}</p>
                  <!--container pour le prix-->
                  <div class="d-flex justify-content-between">
                    <button type="button" class="productLink btn btn-secondary text-white btn-sm col-7">Détails de l'article</button>
                    </button>  
                    <p class="prix__article card-text text-center col-5">${article.price /100} €</p>
                  </div>
                </div>
            </div> `                    
        })
    }
    clickShowDetails(dataProducts);
}

//fonction pour l'ecoute du click details et recuperation du nom du produit
const clickShowDetails = (dataProducts) => {
  let btnProductDetails =document.querySelectorAll("button.productLink");
  for(a=0; a<btnProductDetails.length ;a++){
      let btn = btnProductDetails[a];       
      btn.addEventListener('click', function(event){
          let nameProduct = btn.parentElement.previousElementSibling.previousElementSibling.textContent;
          let rangOfProduct = dataProducts.findIndex(product => product.name === nameProduct);
          let idProduct = dataProducts[rangOfProduct]._id;            
          window.location.href='produit.html?produit='+idProduct;                      
      });
  }
}

const showQuantityProductsInCard = () => {
  let nbrArticleSelectionnes = localStorage.getItem('nbrProductsInCard');
  let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
if(nbrArticleSelectionnes){
  nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
  nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
}else{    
  nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
}
}



allProductsFromApi();
showQuantityProductsInCard();



