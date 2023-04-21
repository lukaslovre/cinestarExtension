let cinestarData;

const getCinestarData = async (cinestarData) => {
  cinestarData = await fetch("https://localhost:3000/");
  console.log(cinestarData);
};

getCinestarData();

/*
const titles = document.querySelectorAll(".title");
const titlesCroatian = [];
for (const title of titles) {
  titlesCroatian.push(title.innerHTML.trim());

  const podaciOFilmu = cinestarData.find(
    (film) => film.croatianName === title.innerHTML.trim()
  );

  if (!podaciOFilmu) {
    console.log("Film " + title.innerHTML + " nije u bazi filmova");
    continue;
  }

  title.innerHTML += " (" + podaciOFilmu.originalname + ")";

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
  rottenOcjenaParagraph.innerHTML = podaciOFilmu.letterboxdRating + "/5";
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
*/
