let bazaFilmova = [
  {
    origTitle: "Scream 6",
    croTitle: "Vrisak 6",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "65",
    croTitle: "65",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Everything Everywhere All at Once",
    croTitle: "Sve u isto vrijeme",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "John Wick: Chapter 4",
    croTitle: "John Wick 4",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Guardians of the Galaxy Vol. 3",
    croTitle: "CINEHERO projekcija Čuvari galaksije Vol. 3",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Mavka",
    croTitle: "Mavka: Čuvarica šume",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Ooops! The Adventure Continues",
    croTitle: "Ups 2!: Avantura se nastavlja...",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Alibi.com 2",
    croTitle: "Alibi.com 2",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "The Pope’s Exorcist",
    croTitle: "Papin egzorcist",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "The Three Musketeers: d’Artagnan",
    croTitle: "Tri mušketira: d’Artagnan",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Nekaj sladkega",
    croTitle: "Nešto slatko",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Renfield",
    croTitle: "Renfield",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Dnevnik Pauline P.",
    croTitle: "Dnevnik Pauline P.",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Beautiful Disaster",
    croTitle: "Divna propast",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Dungeons & Dragons: Honor Among Thieves",
    croTitle: "Dungeons &amp; Dragons: Čast lopova",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Cocaine Bear",
    croTitle: "Kokainski medvjed",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Marlowe",
    croTitle: "Detektiv Marlowe",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "The Super Mario Bros. Movie",
    croTitle: "Super Mario Bros. Film",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Creed III",
    croTitle: "Creed III",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Shazam! Fury of the Gods",
    croTitle: "Shazam! Bijes Bogova",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Evil Dead Rise",
    croTitle: "Zla smrt: Buđenje",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Mafia Mamma",

    croTitle: "Mafija mama",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
  {
    origTitle: "Air",
    croTitle: "Air",
    imdbRating: 9.5,
    rottenRating: 4.5,
  },
];

const titles = document.querySelectorAll(".title");
const titlesCroatian = [];
for (const title of titles) {
  titlesCroatian.push(title.innerHTML.trim());

  const podaciOFilmu = bazaFilmova.find(
    (film) => film.croTitle === title.innerHTML.trim()
  );

  if (!podaciOFilmu) {
    console.log("Film " + title.innerHTML + " nije u bazi filmova");
    continue;
  }

  title.innerHTML += " (" + podaciOFilmu.origTitle + ")";

  const movieContentDiv = title.parentElement.parentElement;
  console.log(movieContentDiv);
  //movieContentDiv.style.position = "relative";
  addRatingToMovieDiv(movieContentDiv, podaciOFilmu);
}
console.log("Titlovi na trenutnom ekranu: ");
console.log(titlesCroatian);

function addRatingToMovieDiv(movieContentDiv, podaciOFilmu) {
  // IMDB ocjena
  const imdbOcjenaContainer = document.createElement("div");
  imdbOcjenaContainer.classList.add("ratingInnerContainer");
  const imdbTekstParagraph = document.createElement("p");
  imdbTekstParagraph.classList.add("ratingCompany");
  const imdbOcjenaParagraph = document.createElement("p");
  imdbTekstParagraph.innerHTML = "IMDB";
  imdbOcjenaParagraph.innerHTML = podaciOFilmu.imdbRating + " / 10";
  imdbOcjenaContainer.appendChild(imdbTekstParagraph);
  imdbOcjenaContainer.appendChild(imdbOcjenaParagraph);

  // Rotten ocjena
  const rottenOcjenaContainer = document.createElement("div");
  rottenOcjenaContainer.classList.add("ratingInnerContainer");
  const rottenTekstParagraph = document.createElement("p");
  rottenTekstParagraph.classList.add("ratingCompany");
  const rottenOcjenaParagraph = document.createElement("p");
  rottenTekstParagraph.innerHTML = "Rotten";
  rottenOcjenaParagraph.innerHTML = podaciOFilmu.rottenRating + "/5";
  rottenOcjenaContainer.appendChild(rottenTekstParagraph);
  rottenOcjenaContainer.appendChild(rottenOcjenaParagraph);

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("ratingContainer");
  ratingContainer.appendChild(imdbOcjenaContainer);
  ratingContainer.appendChild(rottenOcjenaContainer);

  const fsk = movieContentDiv.querySelector(".fsk");
  if (fsk) {
    fsk.parentNode.insertBefore(ratingContainer, fsk.nextSibling);
  } else {
    const fskAndTrailer = movieContentDiv.querySelector(".fsk-and-trailer");
    fskAndTrailer.insertBefore(ratingContainer, fskAndTrailer.firstChild);
  }
}

/*




*/

const apiData = JSON.parse(
  document.getElementById("pmkino-front-script-js-extra").innerHTML.slice(39, -12)
).apiData;

const moviesData = apiData.movies;
console.log("apiData.movies: ");
console.log(moviesData);

// Using array methods
Object.entries(moviesData.items).forEach(([key, value]) => {
  console.log(value.title + " (" + value.origTitle + ")");
});
