const express = require("express");
const cheerio = require("cheerio");
const fs = require("fs");
const app = express();
const port = 3000;

let cinestarData = JSON.parse(fs.readFileSync("cinestarData.json"));
if (cinestarData) console.log("Datoteka ucitana");

app.get("/getMovies", async (req, res) => {
  res.send(cinestarData);
  tryToUpdateRatings();
});

app.get("/missing/:movieNameCro", async (req, res) => {
  const missingMovieName = req.params.movieNameCro;
  console.log("Missing movie reported: " + missingMovieName);

  // provjerava dali stvarno nema filma u listi
  if (cinestarData.some((movie) => movie.croatianName == missingMovieName)) {
    console.log("Film već postoji u listi \n");
    res.send("Film postoji u bazi ! PREVERANTE !");
    return;
  }

  // ako film nije u listi, ponovno skida listu sa cinestara
  const newCinestarMovies = await getCinestarMovies();

  // dodaje filmove koje do sada nema u bazu i za njih nabavlja ocijene
  for (let newMovie of newCinestarMovies) {
    // ako je film vec u bazi, ignoriraj
    if (
      cinestarData.some(
        (cinestarMovie) => cinestarMovie.croatianName == newMovie.croatianName
      )
    )
      continue;

    newMovie = await fillCinestarDataWithLetterboxd(newMovie);
    newMovie = await fillCinestarDataWithImdb(newMovie);
    cinestarData.push(newMovie);

    //console.log(newMovie);
  }

  res.send(cinestarData);
});

const getLetterboxdUrlFromName = async (targetName, targetYear, targetDirectors) => {
  const filmSearchUrl =
    "https://letterboxd.com/search/films/" + targetName.replaceAll(" ", "+") + "/";

  const filmSearchResponse = await fetch(filmSearchUrl);
  const filmSearchHtml = await filmSearchResponse.text();

  const $ = cheerio.load(filmSearchHtml);
  const filmSearchResults = $("ul.results .film-detail-content");

  let moviePageUrl = null; // finalni URL koji se returna

  console.log("\nTraženje filma: " + targetName + ", " + targetYear);

  filmSearchResults.each((i, el) => {
    const title = $(el).find(".film-title-wrapper > a").first().text();
    const linkToMovie = $(el).find(".film-title-wrapper > a").first().attr("href");
    const releaseYear = $(el).find(".film-title-wrapper > .metadata").first().text();
    //const director = $(el).find("p.film-metadata > a").first().text();
    //console.log("Direktor sa LB: " + director);

    // ako je godina na letterboxdu jednaka na cinestaru +-1

    // mogo bi sve iz ove kategorije stavit u listu i onda u listi provjeravat jel ima
    // neki sa tocnom godinom ili tocnim imenom?
    if (targetYear + 1 - releaseYear < 4 && moviePageUrl == null) {
      console.log(
        "    ->\t" +
          releaseYear +
          "\n    ->\t" +
          title +
          "\n    ->\t" +
          linkToMovie +
          "\n"
      );
      moviePageUrl = "https://letterboxd.com" + linkToMovie;
    } else {
      console.log("\t" + releaseYear + "\n\t" + title + "\n\t" + linkToMovie + "\n");
    }
  });

  return moviePageUrl;
};

const getLetterboxdDataFromUrl = async (url) => {
  if (!url) {
    return { letterboxdOcjena: null, imdbUrl: null };
  }

  const movieDataResponse = await fetch(url);
  const movieDataHtml = await movieDataResponse.text();
  const $ = cheerio.load(movieDataHtml);

  const letterboxdOcjena = $('[name="twitter:data2"]').attr("content");
  let imdbUrl = $('[data-track-action="IMDb"]').attr("href");

  if (!imdbUrl) imdbUrl = null;

  return { letterboxdOcjena, imdbUrl };
};

const getImdbDataFromUrl = async (url) => {
  if (!url) {
    console.log("Nema URL-a");
    return null;
  }

  console.log("Traženje na: " + url);
  const movieDataResponse = await fetch(url);
  const movieDataHtml = await movieDataResponse.text();
  const $ = cheerio.load(movieDataHtml);

  const ocjena = $(".ipc-btn__text #iconContext-star")
    .first()
    .parent()
    .next()
    .find("span")
    .first()
    .text();

  return ocjena;
};

const findMovieByNameAndYear = async (name, year) => {
  const letterboxdUrl = await getLetterboxdUrlFromName(name, year);

  const { letterboxdOcjena, imdbUrl } = await getLetterboxdDataFromUrl(letterboxdUrl);

  const imdbOcjena = await getImdbDataFromUrl(imdbUrl);

  return { letterboxdOcjena, imdbOcjena, letterboxdUrl, imdbUrl };
};

const getCinestarMovies = async () => {
  const cinestarMoviesResponse = await fetch(
    "https://zagreb.cinestarcinemas.hr/na-programu/"
  );
  const cinestarMoviesHtml = await cinestarMoviesResponse.text();
  const $ = cheerio.load(cinestarMoviesHtml);

  const apiData = JSON.parse($("#pmkino-front-script-js-extra").text().slice(39, -12))
    .apiData.movies;

  //console.log(apiData);

  let tempMovieData = [];
  console.log("Skeniran cinestar!");

  Object.entries(apiData.items).forEach(([key, value]) => {
    // spremanje podataka o filmovima
    tempMovieData.push({
      letterboxdLastEdited: Date.now(),
      imdbLastEdited: Date.now(),
      croatianName: value.title.trim(),
      originalname: value.origTitle.trim(),
      letterboxdUrl: null, //
      imdbUrl: null, //
      letterboxdRating: null, //
      imdbRating: null, //
      releaseYear: value.productionYear,
      category: value.genres[0],
      duration: value.length,
      directors: value.directors.map((director) => director.name),
      description: value.description,
      posterUrl: value.images.poster.url,
    });
  });

  return tempMovieData;
};
/*
{
  lastEdited: Date.now(),
  croatianName: value.title,
  originalname: value.origTitle,
  letterboxdUrl: null, //
  imdbUrl: null, //
  letterboxdRating: null, //
  imdbRating: null, //
  releaseYear: value.productionYear,
  category: value.genres[0],
  duration: value.length,
  directors: value.directors.map((director) => director.name),
  description: value.description,
  posterUrl: value.images.poster.url,
}
*/

const fillCinestarDataWithLetterboxd = async (cinestarData) => {
  if (!Array.isArray(cinestarData)) cinestarData = [cinestarData];
  for (const movie of cinestarData) {
    // ako je proslo vise od 1.5h od zadnjeg update-a ratinga
    if (Date.now() < movie.letterboxdLastEdited + 5400000) continue;

    if (!movie.letterboxdUrl) {
      movie.letterboxdUrl = await getLetterboxdUrlFromName(
        movie.originalname,
        movie.releaseYear,
        movie.directors
      );
    }
    // sad bi trebo imat url
    const { letterboxdOcjena, imdbUrl } = await getLetterboxdDataFromUrl(
      movie.letterboxdUrl
    );
    if (letterboxdOcjena) movie.letterboxdRating = letterboxdOcjena;
    if (imdbUrl) movie.imdbUrl = imdbUrl;
  }

  return cinestarData;
};

const fillCinestarDataWithImdb = async (cinestarData) => {
  if (!Array.isArray(cinestarData)) cinestarData = [cinestarData];

  for (const movie of cinestarData) {
    // ako je proslo vise od 1.5h od zadnjeg update-a ratinga
    if (Date.now() < movie.imdbLastEdited + 5400000) continue;

    if (!movie.imdbUrl) continue;

    const imdbOcjena = await getImdbDataFromUrl(movie.imdbUrl);
    if (imdbOcjena) movie.imdbRating = imdbOcjena;
  }

  return cinestarData;
};

const tryToUpdateRatings = async () => {
  cinestarData = await fillCinestarDataWithLetterboxd(cinestarData);
  cinestarData = await fillCinestarDataWithImdb(cinestarData);

  fs.writeFile("cinestarData.json", JSON.stringify(cinestarData), (err) => {
    if (err) throw err;
    console.log("Saving to File complete!");
  });
};

//tryToUpdateRatings();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
