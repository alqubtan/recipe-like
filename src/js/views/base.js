export const elements = {
    inputField: document.querySelector('.search__field'),
    inputForm: document.querySelector('.search'),
    resultList: document.querySelector('.results__list'),
    resultParent: document.querySelector('.results'),
    buttonsList: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likeField: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list')
}
export const elementsStrings = {
    loader: 'loader',
    loader2: 'recipe',
    paginateBtn:'btn-inline'
}

export const clearLoader = () => {
    
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    const loader2 = document.querySelector(`.${elementsStrings.loader2}`);

    loader ? loader.parentNode.removeChild(loader) : loader2.parentNode.removeChild(loader2);
}

export const renderLoader = (parent) => {
    const spinner = `
    <div class="loader">
        <svg>
            <use
                href = "img/icons.svg#icon-cw"
            </use>
        </svg>
    </div>`;

    parent.insertAdjacentHTML("afterbegin", spinner)
}