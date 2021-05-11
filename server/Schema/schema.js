const graphql = require("graphql");
const { books, authors, users } = require("../DummyData/data");//these are just dummy data
const bookModel = require("../Models/book");
const authorModel = require("../Models/author");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const _ = require("lodash");



const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent)
                // return _.find(authors,{id:parent.authorId})
                return authorModel.findById(parent.authorId);
            }
        },

    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            //here it will be displayed within an array
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //here it will match each book with authorId of author
                //return _.filter(books,{authorId:parent.id})
                return bookModel.find({ authorId: parent._id })
            }
        }
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db /other source
                // return _.find(books,{id:args.id}); 
                return bookModel.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors,{id:args.id})
                return authorModel.findById(args.id);
            }
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return bookModel.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return authorModel.find({});
            }
        }
    })

});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type:new GraphQLNonNull(GraphQLString) },
                age: { type:new GraphQLNonNull( GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new authorModel({
                    name: args.name,
                    age: args.age
                })
                return author.save();

            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type:new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new bookModel({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save();
            }
        },
       deleteBook:{
           type:BookType,
           args:{
               id:{type:new GraphQLNonNull(GraphQLID)}
           },
           resolve(parent, args) {
            let book = bookModel.deleteOne({_id:args.id})
            console.log(book)
            return "delete";
        }

       }

    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})