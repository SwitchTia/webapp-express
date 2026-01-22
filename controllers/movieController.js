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

    const reviewsQuery = `SELECT * FROM reviews WHERE movie_id = ?`

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
    `INSERT INTO movies (
    slug, 
    title, 
    director, 
    genre, 
    abstract, 
    image) VALUES  (?, ?, ?, ?, ?)`;

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




function storeReview(req, res, next) {

  const data = req.body;
  const movieId = req.params.id;

  const movieQuery = `SELECT * FROM movies WHERE id = ?`;

  connection.query(movieQuery, [movieId], (err, result) => {
    if (err) return next(err);

    if (result.length === 0) {
      res.status(404);
      return res.json({
        error: "NOT FOUND",
        message: "Oops! Movie not found.",
      });
    }

   
    if (!data.name || !data.vote || data.vote < 1 || data.vote > 5) {
      res.status(400);
      return res.json({
        error: "CLIENT ERROR",
        message:
          "Name and review vote are obligatory fields. Review vote from 1 to 5",
      });
    }

    const sql =
      `INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?);`;

    connection.query(
      sql,
      [movieId, data.name, data.vote, data.text],
      (err, result) => {
        if (err) return next(err);

        res.status(201);
        res.json({
          message: "The review was added successfully!",
          id: result.insertId,
        });
      },
    );
  });
}

export default { index, show, search, store, storeReview };

