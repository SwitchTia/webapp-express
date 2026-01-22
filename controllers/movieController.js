import connection from "../database/dbConnections.js";
import slugify from "slugify";


function index(req, res, next) {
  const query = `SELECT * FROM movies`;

  connection.query(query, (err, result) => {
    if (err) return next(err);
    return res.json({
      results: result,
    });
  });
}



function show(req, res, next) {
  const slug = req.params.slug;


  const showQuery = `
    SELECT * FROM movies
    WHERE slug = ?`;

  connection.query(showQuery, [slug], (err, results) => {
    if (err) return next(err);

    const movie = results[0];

    const reviewsQuery = "SELECT * FROM reviews WHERE movie_id = ?"

    connection.query(reviewsQuery, [movie.id], (err, reviewsResult) => {
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

  const searchQuery = `SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS avg_vote
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movie_id
    WHERE title LIKE ? 
    OR abstract LIKE ? 
    GROUP BY movies.id`

  connection.query(searchQuery, [searchKey, searchKey], (err, results) => {
    if (err) return next(err);
    res.json({
      results: results,
    });
  });
}


function store(req, res, next) {
  const { title, director, genre, abstract } = req.body;

  console.log(req.body, req.file);

  const slug = slugify(title, {
    lower: true,
    strict: true, 
  });

  const fileName = req.file?.filename || null;

  const sql =
    "INSERT INTO `movies` (`slug`, `title`,`director`, `genre`, `abstract`, `image`) VALUES  (?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [slug, title, director, genre, abstract, fileName],
    (err, result) => {
      if (err) return next(err);

      res.status(201);
      return res.json({
        message: "The movie was saved successfully",
        movieId: result.insertId,
      });
    },
  );
}

export default { index, show, search, store };

