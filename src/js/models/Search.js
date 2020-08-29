import axios from 'axios'
import { clearLoader } from '../views/base';

export class Search{
    constructor(query) {
        this.query = query
    }

    async searchRecipes() {
        const url = `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
        try {
            const res = await axios(url);
            this.recipes = await res.data.recipes;
        } catch (error) {
            clearLoader();
            throw new Error('ohh 🙃. check your search keyword OR your internet connection')
        }
    
    }  
}