export function nbrCard(){
    let nbrArticleSelectionnes = localStorage.getItem('nbrProductsInCard');
    let nbreArticleContainer = document.getElementsByClassName('nbrArticlePanier');
  if(nbrArticleSelectionnes){
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier position-absolute top-10 start-100 translate-middle badge rounded-pill bg-secondary');
    nbreArticleContainer[0].textContent = nbrArticleSelectionnes;
  }else{    
  console.log(nbreArticleContainer);
    nbreArticleContainer[0].setAttribute('class', 'nbrArticlePanier');
  }
}