'use strict';

const titleClickHandler = function (event) {

  event.preventDefault();

  const clickedElement = this;

    /* remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

for(let activeLink of activeLinks){
  activeLink.classList.remove('active');
}

    /* add class 'active' to the clicked link */
    clikedElement.classList.add('active');




    /* remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts article.active');

for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
}

    /* get 'href' attribute from the clicked link */

const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */


  targetArticle.classList.add('active');

}