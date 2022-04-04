const dummy = (blogs) => {
    // ...
    return 1
}


const countLikes = (blogs) => {
    if (blogs.length == 0) {
        return 0
    }
    else if (blogs.length == 1) {
        return blogs[0].likes
    }
    else {
        let count = 0
        blogs.forEach(element => {
            count += element.likes
        });
        return count
    }
}
module.exports = { dummy, countLikes }

