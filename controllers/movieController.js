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

export default { index, show };

