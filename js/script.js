'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCludLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};



const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors'
};



function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');


  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
}


//Generating Title List -generujemy liste tytolow:

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /*[DONE] for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html ='';

  for (let article of articles) {

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /*[DONE] find the title element */
    /*[DONE] get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /*[DONE] create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /*[DONE] insert link into titleList */
    html = html + linkHTML;
  }
  console.log(html);

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();


// Calculate tags parameters - znajdujemy najwieksza i najmniejsza liczbe wystapien tagow:

function calculateTagsParams(tags) {
  const params = {max: 0, min: 999999};

  for(let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    else (tags[tag] < params.min); {
      params.min =tags[tag];
    }
  }
  return params;
}

// Calculate tag class -wybieramy klase dla tagu:

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );
  console.log('classNumber');
  return opts.cloudClassPrefix + classNumber;
}


//GENERATE TAGS -Generujemy tagi:

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* [DONE] START LOOP: for every article: */

  for (let article of articles) {

    /* [DONE] find tags wrapper */

    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    tagsWrapper.innerHTML = '';

    /* [DONE] make html variable with empty string */

    let html ='';

    /* [DONE] get tags from data-tags attribute */

    const articleTags  = article.getAttribute('data-tags');
    console.log(articleTags);

    /* [DONE] split tags into array */

    const articleTagsArray = articleTags.split(' ');
    
    //rozdzielamy tagi
    console.log(articleTagsArray);

    /* [DONE] START LOOP: for each tag */

    for(let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */

      const linkHTML = templates.articleTagLink({ tag: tag });
      //<li><a href="#tag-rice">rice</a></li>
      console.log(linkHTML);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        //wykrzyknik czytamy jako negacje czyli: "jesli allTags NIE MA(!) klucza tag"

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else{
        allTags[tag]++;  //jesli ten tag znajduje sie w allTags,zwiekszamy licznik wystapien o jeden
      }

    /* END LOOP: for each tag */
    }
    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* [DONE] END LOOP: for every article: */
  }

  /* [ find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  /*[create variable for all links HTML code*/
  const tagsParams = calculateTagsParams(allTags);
 
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /*  START LOOP: for each tag in allTags: */
  for(let tag in allTags) {

    /* [ generete code of link and add it to allTagsHTML*/
    //allTagsHTML += tag + '(' + allTags[tag] + ')'; -zmieniamy ta linie kodu na:
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /* LOOP: for each tag in allTags */
  }
  /* [ add html from allTagsHTML to tagList */
  //tagList.innerHTML - allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();


function tagClickHandler(event) {

  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* [DONE] find all tag links with class active */

  const tagLinksActives = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */

  for (let tagLinksActive of tagLinksActives) {

    /* [DONE] remove class active */

    tagLinksActive.classList.remove('active');

  /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {

    /* [DONE] add class active */

    tagLink.classList.add('active');

    /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags() {
  /* [DONE] find all links to tags */

  const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');

  /* [DONE] START LOOP: for each link */

  for (let allLinksToTag of allLinksToTags) {

    /* [DONE] add tagClickHandler as event listener for that link */

    allLinksToTag.addEventListener('click', tagClickHandler);

  /* [DONE] END LOOP: for each link */
  }
}

addClickListenersToTags();

// Nie dodajemy funkcji "split" ani petli iterujacej po tagach

function generateAuthors() {

  let authorRightBar = {};
  /*  find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /*  start loop: for every article: */

  for (let article of articles) {

    /*  find author wrapper */
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    /*  make html variable with empty string */
    let html ='';

    /*  get author from data-author attribute */
    const articleAuthor  = article.getAttribute('data-author');
    console.log(articleAuthor);

    /* [NEW] check if this link is NOT already in allTags */
    const linkToHTMLData = { author: articleAuthor };
    const linkToHTM = templates.authorLink(linkToHTMLData);
    html = html + linkToHTM;

    if(!authorRightBar.hasOwnProperty(articleAuthor)){
      authorRightBar[articleAuthor] = 1;
    } else {
      authorRightBar[articleAuthor]++;  
    }
    authorWrapper.innerHTML = html;
    /* END LOOP: for each tag */
  }
  /* [DONE] insert HTML of all the links into the tags wrapper */
  const authorRightList = document.querySelector(opts.authorsListSelector);
  //let allTagsHTML = '';
  const allAuthorData = { authors: []};
  /* [NEW] generete code of link and add it to allTagsHTML*/
  //allTagsHTML += tag + '(' + allTags[tag] + ')'; -zmieniamy ta linie kodu na:
  //allTagsHTML += tagLinkHTML;
  for (let author in authorRightBar) {
    allAuthorData.authors.push({author: author});
    /* [NEW] END LOOP: for each tag in allTags */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  //tagList.innerHTML - allTagsHTML;
  authorRightList.innerHTML = templates.authorCludLink(allAuthorData);
}
generateAuthors();




//Dodajemy funkcje authorClickHandler wzorujac sie na tagClickHandler:

function authorClickHandler(event) {

  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

  const author = href.replace('#author-', '');

  /* [DONE] find all tag links with class active */

  const authorLinksActives = document.querySelectorAll('a.active[href^="#author-"]');

  /* [DONE] START LOOP: for each active tag link */

  for (let authorLinksActive of authorLinksActives) {

    /* [DONE] remove class active */

    authorLinksActive.classList.remove('active');

  /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */

  for (let authorLink of authorLinks) {

    /* [DONE] add class active */

    authorLink.classList.add('active');

    /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}


// Dodajemy funkcje addClickListenersToAuthors wzorujac sie na addClickListenersToTags:

function addClickListenersToAuthors() { 

  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let author of authorLinks) { 

    author.addEventListener('click', authorClickHandler);

 
  }
}

addClickListenersToAuthors();

