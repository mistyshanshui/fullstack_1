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

module.exports = { dummy, countLikes, favorite }

