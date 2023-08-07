"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArticleRepository_1 = require("./api/repositories/ArticleRepository");
const PREVIOUS_BUTTON_NAME = "Vorige";
const NEXT_BUTTON_NAME = "Volgende";
const PREVIOUS_BUTTON_CLASS = "paginator-prev-btn";
const NEXT_BUTTON_CLASS = "paginator-next-btn";
const BUTTON_CONTAINER_CLASS = "paginator-btns";
const BUTTON_DISABLE_CLASS = "paginator-btn-disabled";
const ARTICLE_LIST_CLASS = "articles";
// General state for the pagination.
let pageNumber = 0;
function setUpArticles(repository) {
    return __awaiter(this, void 0, void 0, function* () {
        const { articles, hasNext } = yield fetchArticles(repository);
        // From the articles create a list view in the DOM.
        createListFromArticles(articles);
        // Add the event listeners for the buttons, clicking them will fetch articles from the next batch.
        setPaginatorButtons(repository, hasNext);
    });
}
function fetchArticles(repository) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield repository.get_articles(pageNumber);
    });
}
function getDomAnchor() {
    return document.querySelector(".entry-content");
}
function createArticleList() {
    const el = document.createElement("ul");
    el.classList.add(ARTICLE_LIST_CLASS);
    return el;
}
function createListFromArticles(articles) {
    const anchor = getDomAnchor();
    // Get the article list, if it was not previously created, create a new article list DOM element.
    const articleList = (document.querySelector(`.${ARTICLE_LIST_CLASS}`) ||
        createArticleList());
    //  If the article list was created, it has no parent, in that case it needs to be attached to the DOM.
    if (anchor && articleList.parentNode === null) {
        anchor.appendChild(articleList);
    }
    // Make sure the list is empty at the start.
    articleList.innerHTML = "";
    // Fill the list with the actual articles.
    articles.forEach((article) => {
        const articleListElement = createArticleListItem(article);
        if (articleList)
            articleList.appendChild(articleListElement);
    });
}
function createArticleListItem(article) {
    const el = document.createElement("li");
    el.classList.add(ARTICLE_LIST_CLASS);
    const image = `<img class="article-image" src="${article.featuredImageUrl}" alt="" width="180">`;
    el.innerHTML = `${image}
      <div class="article-text">
        <a class="article-title" href="${article.url}">${article.title}</a>
        <p class="article-date">${article.date}</p>
        <p class="article-excerpt">${article.excerpt}</p>`;
    return el;
}
function createButtons() {
    const el = document.createElement("div");
    el.classList.add(BUTTON_CONTAINER_CLASS);
    el.innerHTML = `<button class="${PREVIOUS_BUTTON_CLASS}">${PREVIOUS_BUTTON_NAME}</button>
                    <button class="${NEXT_BUTTON_CLASS}">${NEXT_BUTTON_NAME}</button>`;
    const anchor = getDomAnchor();
    anchor.appendChild(el);
    return el;
}
function disablePaginatorButtonWhen(button, predicate) {
    if (predicate && !button.disabled) {
        button.classList.add(BUTTON_DISABLE_CLASS);
        button.disabled = true;
    }
    if (!predicate && button.disabled) {
        button.classList.remove(BUTTON_DISABLE_CLASS);
        button.disabled = false;
    }
}
/*
Factory function to create buttons for the paginator, the prevPage and nextPage
inputs are used to determine whether the buttons is disabled, e.g. if there are no pages to fetch.
*/
function setPaginatorButtons(repository, hasNext) {
    const hasPrevious = pageNumber > 0;
    // Check if the buttons already exists, if they do use them else create and attach to the DOM.
    const alreadyCreatedButtons = document.querySelector(`.${BUTTON_CONTAINER_CLASS}`);
    const buttons = alreadyCreatedButtons ? alreadyCreatedButtons : createButtons();
    const prevButton = buttons.querySelector(`.${PREVIOUS_BUTTON_CLASS}`);
    const nextButton = buttons.querySelector(`.${NEXT_BUTTON_CLASS}`);
    disablePaginatorButtonWhen(prevButton, !hasPrevious);
    disablePaginatorButtonWhen(nextButton, !hasNext);
    // Only add event listeners if the buttons were created.
    if (!alreadyCreatedButtons) {
        prevButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            pageNumber = pageNumber > 0 ? pageNumber - 1 : 0;
            yield setUpArticles(repository);
        }));
        nextButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            pageNumber = hasNext ? pageNumber + 1 : pageNumber;
            yield setUpArticles(repository);
        }));
    }
}
setUpArticles(new ArticleRepository_1.ArticleRepository()).then(r => r);
//# sourceMappingURL=articles.js.map