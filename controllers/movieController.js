import connection from "../database/dbConnections.js";


function index(req, res, next) {
  const query = "SELECT * FROM movies";

  connection.query(query, (err, result) => {
    if (err) return next(err);
    return res.json({
      results: result,
    });
  });
}



function show(req, res, next) {
  const id = req.params.id;
  const showQuery = "SELECT * FROM movies WHERE id = ?"

  connection.query(showQuery, [id], (err, movieResult) => {
    if (err) return next(err);
    const movie = movieResult[0];

    const reviewsQuery = "SELECT * FROM reviews WHERE movie_id = ?"

    connection.query(reviewsQuery, [id], (err, reviewsResult) => {
      if (err) return next(err);

      res.status(200);
      res.json({
        ...movie,
        reviews: reviewsResult
      });

    });

  });

}



function search(req, res, next) {
  const key = req.query.key;

  const searchKey = `%${key}%`;

  const query = `
    SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS avg_vote
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movies_id
    WHERE title LIKE ? 
    OR abstract LIKE ? 
    GROUP BY movies.id
  `;

  connection.query(query, [searchKey, searchKey], (err, results) => {
    if (err) return next(err);
    res.json({
      results: results,
    });
  });
}


// function storeReview (req, res, next){
//   const data = req.body;
//   const movieId = req.params.id;

//   const sql = "INSERT INTO reviews (movie.id, name, vote, text) VALUES (?,?,?,?);";


// }

export default { index, show, search };

