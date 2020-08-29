import axios from 'axios'

export class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const url = `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
        try {
            const res = await axios(url)
            this.title = res.data.recipe.title
            this.ingredients = res.data.recipe.ingredients
            this.author = res.data.recipe.publisher
            this.url = res.data.recipe.source_url
            this.img = res.data.recipe.image_url

        } catch (error) {
           throw new Error('Recipe not found. 😅 ')
        }
    }

    calcCookingTime() {
        const num0fIng = this.ingredients.length;
        const period = Math.ceil(num0fIng / 3);
        this.time = period * 15

    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'g', 'kg']
        let newIngredients = this.ingredients.map(el => {
            // 1) uniform units
            let ingredient = el.toLowerCase()
            
            unitsLong.forEach((unit, i) => {
               ingredient = ingredient.replace(unit, units[i])
            });

            // 2) remove paranthes

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) split ingredient to unit, count, Text ...

            // but single ingredient into array
            const ingKewords = ingredient.split(' ');
            let curentKeyword = ingKewords.findIndex(key => unitsShort.includes(key));
            
            let ingredientOBJ;

            if (curentKeyword > -1) {
                // there is unit 
            
                // [1, cup] OR [1, 3/4, cup]
                const unitStr = ingKewords.slice(0, curentKeyword)
                let count;
                if (unitStr.length === 1) {
                    count = eval(unitStr[0].replace('-', '+'));
                    
                } else {
                    count = eval(unitStr.slice(0, curentKeyword).join('+'));
                }

                ingredientOBJ = {
                    unit:ingKewords[curentKeyword],
                    count,
                    ingredient: ingKewords.slice(curentKeyword + 1).join(' ')
                }
            }
            else if (parseInt(ingKewords[0], 10)) {
                // there is count in first
                ingredientOBJ = {
                    unit: '',
                    count: parseInt(ingKewords[0], 10),
                    ingredient: ingKewords.slice(1).join(' ')
                }
            }
            else if (curentKeyword === -1) {
                // there is not unit OR count 
                ingredientOBJ = {
                    unit: '',
                    count: 1,
                    ingredient
                }
            
            }

            return ingredientOBJ;
        })
        this.ingredients = newIngredients;
        // this function return an array of ingredients objects with properties [count, unit, text]
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // update ingredient count (devide Servings on Each Ingredient Count.)
        this.ingredients.forEach(ing =>
            ing.count *= (newServings / this.servings)
        );

        // update servings
        this.servings = newServings;
    }
}