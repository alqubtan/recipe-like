import { elements } from './base'
import { limitRicpeTitle } from './searchView'

export const toggleLikeButton = islike => {
    const likeStr = islike ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${likeStr}`
    )
}

export const toggleLikeMenu = num0fLikes => {
    num0fLikes > 0 ? elements.likeField.style.visibility = 'visible' :
    elements.likeField.style.visibility = 'hidden'
}

export const renderLike = like => {

    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRicpeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>`;

        elements.likeList.insertAdjacentHTML('beforeend', markup)
}


export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*='${id}']`).parentElement;
    if (el) el.parentElement.removeChild(el);
}