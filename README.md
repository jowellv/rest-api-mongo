# REST API with ~~MONGODB~~ SEQUELIZE

## LIST OF REQUESTS

`GET` List of movies

`PUSH` with a JSON; Create a new movie

`PUT /:id` Edit movie with id = :id

`DELETE /:id` Delete a movie with id = :id

Movie = {

  name: String


  genre: String (validates to list of accepted input: 

  'action', 'adventure', 'comedy', 'drama', 'horror', 'war')


  desc: String (defaults to No description given.)


}
