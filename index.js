let camerasUrl ='http://localhost:3000/api/cameras';
let productsContainer = document.getElementById('products');

//methode fetch pour recuperer les données fournies par l'api au format Json 
let productsApiCall = function() {
    //on convertit les données de l API en un tableau lisible par javascript 
    fetch(camerasUrl)
    .then( response => response.json().then(dataCameras => {        
        showAllProducts(dataCameras)     
        }
    ))
    //sinon on renvoie l'erreur
    .catch(error => alert("Erreur : " + error));
};



//affichage des articles sur la page d'accueil, utilisation de bootstrap pour la mise en forme
function showAllProducts(dataCameras){
    console.log(dataCameras);
    if (productsContainer && dataCameras){
        dataCameras.map(article =>{        
            productsContainer.innerHTML += `
            <div class="card border border-secondary" style="width: 18rem" id="${article._id}">
                <!--container pour la photo-->
                <img class="photo__article card-img-top" src="${article.imageUrl}" alt="Card image cap">
                <div class="card-body border-secondary">
                <!--container pour le nom-->
                <h5 class="nom__article card-title">${article.name}</h5>
                <!--container pour la description-->
                <p class="description__article card-text">${article.description}</p>
                <!--container pour le prix-->
                <p class="prix__article card-text">${article.price /100} €</p>
                <button type="submit" class="productLink btn btn-secondary text-info btn-sm">Détails de l'article</button>
                </div>
            </div> `                    
        })
    }
    clickShowDetails();
}


//fonction pour l'ecoute du click details et recuperation du nom du produit
function clickShowDetails(){
    let btnArticleDetails =document.querySelectorAll("button.productLink");

    for(a=0; a<btnArticleDetails.length ;a++){
        let btn = btnArticleDetails[a];       
        btn.addEventListener('click', function(event){
            let nameArticle = btn.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            let idProduct =  btn.parentElement.parentElement.id;           
            console.log(idProduct);
            //showOneProduct(idProduct);  
        });
    }
}

// 




productsApiCall();