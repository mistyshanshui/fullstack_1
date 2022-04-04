const listHelpers = require('../utils/list_helpers')

test('dummy returns one', () => {
    const blogs = []
    const result = listHelpers.dummy(blogs)
    expect(result).toBe(1)
})


describe('total likes tests', () => {
    const blogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        }
    ]

    const oneBlog = [{
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }]

    const emptyBlog = []

    test('one blog in list', () => {
        const result = listHelpers.countLikes(oneBlog)
        expect(result).toBe(7)
    })
    test('empty blog list', () => {
        const result = listHelpers.countLikes(emptyBlog)
        expect(result).toBe(0)
    })
    test('list of 3 blogs', () => {
        const result = listHelpers.countLikes(blogs)
        expect(result).toBe(24)
    })
})