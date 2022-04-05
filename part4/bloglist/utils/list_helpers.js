const _ = require('lodash')
const dummy = (blogs) => {
    // ...
    return 1
}

const countLikes = (blogs) => {
    return blogs.reduce((total, element) => {
        return total + element.likes
    }, 0)
}

const favorite = (blogs) => {
    const numlikes = Math.max(...blogs.map(element => element.likes))
    console.log('numlikes is ', numlikes)
    return blogs.find(element => element.likes === numlikes)
}

const mostBlogs = (blogs) => {
    let count = 0
    let author = ''
    const groups = _.groupBy(blogs, b=>b.author)
    for( const e of Object.entries(groups)){
        if(e[1].length > count){
            count = e[1].length
            author = e[0]
        }
    }
    return { author : author, blogs : count}
}

module.exports = { dummy, countLikes, favorite, mostBlogs }

