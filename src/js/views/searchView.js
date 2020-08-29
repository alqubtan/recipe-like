import {elements} from './base'

export const getInput = () => elements.inputField.value

export const clearField = () => {
    elements.inputField.value = '';
}

export const clearResult = () => {
    elements.resultList.innerHTML = '';
    elements.buttonsList.innerHTML = '';
}

// pasta with tomoto and salad
export const limitRicpeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        
        return `${newTitle.join(' ')} ...`;
    }
    return title
}

export const renderRecipe = (recipe) => {
    const markup = `

    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRicpeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`

    elements.resultList.insertAdjacentHTML("beforeend", markup)
}

const createButton = (page, type) => 
`
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page  -  1: page + 1}>
    <span>Page ${type === 'prev' ? page  -  1: page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
    </svg>
    </button>
`

const renderButtons = (page, num0fRecipes, resultPerPage) => {

    const pages = Math.ceil(num0fRecipes / resultPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // render next button
        button = createButton(page, 'next');
    } else if (page > 1 && page < pages) {
        //render previous & next button
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // render previous button
        button = createButton(page, 'prev')
    }

    elements.buttonsList.insertAdjacentHTML("afterbegin", button);
}

export const renderRecipes = (recipes, page = 1, resultPerPage = 10) => {
    // 1) split result array
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    recipes.slice(start, end).forEach(renderRecipe)

    // 2) render button to the UI
    renderButtons(page, recipes.length, resultPerPage)


}
