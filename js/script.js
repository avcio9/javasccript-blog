'use strict';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const attribute = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */

  const article = document.querySelector(attribute);

  /* add class 'active' to the correct article */

  article.classList.add('active');
}

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelecton: '.post-tags .list',
  articleAuthorSelector: '.authors',
  tagsListSelector: '.sidebar .tags',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size',
};

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */

    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into titleList */

    html = html + linkHTML;

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagClass(count, params) {
  console.log(params.max);
  return Math.round(((count - params.min) / params.max) * (opts.cloudClassCount - 1) + 1).toString();
}

function generateTags() {
  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {

    /* find tags wrapper */

    const wrapper = article.querySelector(opts.articleTagsSelecton);

    wrapper.innerHTML = '';

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const tags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = tags.split(' ');

    /* START LOOP: for each tag */

    for (let articleTag of articleTagsArray) {

      /* generate HTML of the link */

      const link = `<li><a href="#tag-${articleTag}">${articleTag}</a></li>`;

      /* add generated code to html variable */

      html = html + ' ' + link;
      if (!allTags.hasOwnProperty(articleTag)) {
        allTags[articleTag] = 1;
      } else {
        allTags[articleTag]++;
      }


      /* END LOOP: for each tag */
    }


    /* insert HTML of all the links into the tags wrapper */

    wrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }

  const tagsParams = calculateParams(allTags);

  let allTagsHTML = '';

  const tagList = document.querySelector(opts.tagsListSelector);
  for (const a in allTags) {
    const tag = allTags[a];
    allTagsHTML += `<li><a class="${opts.cloudClassPrefix}-${calculateTagClass(tag, tagsParams)}" href="#tag-${a}">${a}</a></li>`;
  }
  tagList.innerHTML = allTagsHTML;
}

function calculateParams(tags) {
  let min = Infinity,
    max = 0;

  Object.values(tags).forEach(value => {
    if (value > max) max = value;
    else if (value < min) min = value;
  });

  return {
    min: min,
    max: max,
  };
}

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks) {

    /* remove class active */

    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let hrefTagLink of hrefTagLinks) {

    /* add class active */

    hrefTagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function generateAuthors(customSelector = '') {
  /* find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  // find sidebar wrapper

  const wrapperSideBar = document.querySelector(opts.articleAuthorSelector + customSelector);

  // clean sidebar html code

  wrapperSideBar.innerHTML = '';

  let html = '';

  // create an empty array of authors for filtering

  const authorList = [];

  for (let article of articles) {

    // find wrapper for author link inside article

    const wrapperArticle = article.querySelector('.post-author');

    const author = article.getAttribute('data-author');

    // skip already added authors

    if (!authorList.includes(author)) {

      const link = `<li>
  <a href="#tag-${author}">
      <span class="author-name">${author}</span>
  </a>
</li>`;

      html = html + link;

      authorList.push(author);

    }

    // add in-article author link

    wrapperArticle.innerHTML = `by <a href="#tag-${author}">${author}</a>`;
  }

  // generate list of authors in sidebar

  wrapperSideBar.innerHTML = html;
}

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks) {

    /* remove class active */

    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let hrefTagLink of hrefTagLinks) {

    /* add class active */

    hrefTagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + tag + '"]');
}

function addClickListenersToTags() {
  const links = document.querySelectorAll('.list-horizontal li a');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}

function addClickListenersToAuthors() {
  const links = document.querySelectorAll('.sidebar .authors a');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

function addClickListenersToAuthorsInArticle() {
  const links = document.querySelectorAll('.post-author a');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

function addClickListenersToTagsInSideBar() {
  const links = document.querySelectorAll('.sidebar .tags a');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}

generateTags();

generateAuthors();

generateTitleLinks();

addClickListenersToTags();

addClickListenersToAuthors();
addClickListenersToAuthorsInArticle();
addClickListenersToTagsInSideBar();