import {Search} from './models/Search'
import {elements, renderLoader, clearLoader, elementsStrings} from './views/base'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {Recipe} from './models/Recipe'
import List from './models/List'
import * as listView from './views/listView'
import Like from './models/Like'
import * as likeView from './views/likeView'





const state = {}
window.state = state

const controlSearch = async () => {
    // 1. get query from user interface
    const query = searchView.getInput();
    if (query) {
        try {
            // 2. add search object to the State
            state.search = new Search(query);
    
            // 3. prepare Ui while searching
            searchView.clearField();
            searchView.clearResult();
            renderLoader(elements.resultParent);
    
            // 4. start searching for recipes
            await state.search.searchRecipes();
        
            // 5. display the result to UI
            clearLoader();
            searchView.renderRecipes(state.search.recipes);
            
        } catch (error) {
            alert(error)
        }
    }

}



// UI Search
elements.inputForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

// UI Pagination
elements.buttonsList.addEventListener('click', e => {
    const btn = e.target.closest(`.${elementsStrings.paginateBtn}`)
    if (btn) {
        const PageToGo = parseInt(btn.dataset.goto);
        searchView.clearResult();
        searchView.renderRecipes(state.search.recipes, PageToGo);       
    }
})


const recipeControl = async () => {
    const recipeID = window.location.hash.replace('#', '');

    if (recipeID) {
            
        // 1) Prepare Ui
        recipeView.clearRecipe()
        renderLoader(elements.recipe)
        // 2) Create recipe object
        state.recipe = new Recipe(recipeID);
    
        try {

            // 3) get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // 4) calc recipe object Methodes
            state.recipe.calcCookingTime();
            state.recipe.calcServings();
        
            // 5) display it to the UI 
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.like.isLiked(recipeID)
            )
            // select active Recipe only if search list not empty
            if (state.search) {
                document.querySelectorAll(`.results__link`).forEach(link =>
                    link.classList.remove('results__link--active')
                )
                recipeView.highlightSelected(recipeID);

            }
            

        } catch (error) {
           alert(error);
        }
    }

}

// List controller
const controlList = () => {
    if(!state.list) {
        state.list = new List();
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count, el.unit ,el.ingredient);
            listView.renderItem(item)
            
        })
    }
}


// delete & update item from Shopping List
elements.shoppingList.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.id;
   if (id) {
       if (e.target.matches('.shopping__delete, .shopping__delete *')) {
           // delete from  state
           state.list.deleteItem(id)
           // delete from UI
           listView.removeItem(id)

       } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')){ 
            const value = parseFloat(e.target.value);
            // update count DATA
            state.list.updateCount(id, value)
       }
   }
})


const controlLike = () => {
    if(!state.like) {
        state.like = new Like();
    }
        //get ID for current recipe
        const id = state.recipe.id
        // create new like object
        
        // check if its like or dislike
        if (!state.like.isLiked(id)) {
            // add new like
            const newLike = state.like.addLike(
                id,
                state.recipe.title,
                state.recipe.author,
                state.recipe.img

            )
            // add it to the Ui
            likeView.toggleLikeButton(true)
            likeView.renderLike(newLike)
            
        } else {
            // remove like from object
            state.like.deleteLike(id)
            
            // remove it from ui
            likeView.toggleLikeButton(false)
            likeView.deleteLike(id);
        }

        likeView.toggleLikeMenu(state.like.getLikes())

    }


// UI Recipe 
window.addEventListener('hashchange' ,recipeControl)
window.addEventListener('load', recipeControl)


// UI - RECIPE

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease servings
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike()
    }
        
})


// get likes from localstroage

window.addEventListener('load', () => {
    // new like object
    state.like = new Like();
    // set get like from localstorage
    state.like.getStorage();
    // render like list icon
    likeView.toggleLikeMenu(state.like.getLikes());
    // render Each like to the UI
    state.like.likes.forEach(like => likeView.renderLike(like))
    
})