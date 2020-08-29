export default class Like {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img,
        }

        
        this.likes.push(like)
        // save it at local storage after add
        this.persistData()
        return like
        
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1)
        // save it at local storage after remove
        this.persistData()

    }

    getLikes() {
        return this.likes.length
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    getStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // retrive likes from localstorage
        if (storage) this.likes = storage;
    }
}