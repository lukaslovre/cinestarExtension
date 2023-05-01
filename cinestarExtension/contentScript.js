let cinestarData;

browser.runtime
  .sendMessage({
    action: "getCinestarData",
  })
  .then(
    (data) => {
      console.log("Received data:", data.data);
      cinestarData = data.data;
      addDataToPage();
    },
    (err) => {
      console.error("Error fetching data:", err);
    }
  );

const titles = document.querySelectorAll(".title");

function addDataToPage() {
  for (const titleElement of titles) {
    // izvuci podatke o trenutnom filmu iz baze
    const podaciOFilmu = cinestarData.find(
      (film) => film.croatianName === titleElement.textContent.trim()
    );

    if (!podaciOFilmu) {
      // TODO: poslati serveru obavijest o tom filmu
      console.log("Film " + titleElement.textContent + " nije u bazi filmova");
      browser.runtime.sendMessage({
        action: "missingMovie",
        missingMovieName: titleElement.textContent.trim(),
      });
      continue;
    }

    const movieContentDiv = titleElement.parentElement.parentElement;
    console.log(movieContentDiv);

    const elementsContainer = document.createElement("div");
    elementsContainer.classList.add("extensionElementsContainer");
    movieContentDiv.appendChild(elementsContainer);

    addMoviePoster(elementsContainer, podaciOFilmu.posterUrl);
    addTitleAndFeatures(elementsContainer, podaciOFilmu);
    //addDirectorAndDescription(elementsContainer, podaciOFilmu);
    //addRatingToMovieDiv(movieContentDiv, podaciOFilmu);
  }
}

function addMoviePoster(movieContentDiv, posterUrl) {
  const posterImg = document.createElement("img");
  posterImg.classList.add("extensionMoviePoster");
  posterImg.setAttribute("src", posterUrl);
  // TODO: staviti odgovarajuci poster naziv?
  posterImg.setAttribute("alt", "Poster za film");
  movieContentDiv.appendChild(posterImg);
}

function addTitleAndFeatures(movieContentDiv, movieData) {
  const titleAndFeaturesContainer = document.createElement("div");
  titleAndFeaturesContainer.classList.add("extensionTitleAndFeatures");
  movieContentDiv.appendChild(titleAndFeaturesContainer);

  const newTitleElement = document.createElement("p");
  newTitleElement.classList.add("extensionMovieTitle");
  newTitleElement.textContent = movieData.originalname;
  titleAndFeaturesContainer.appendChild(newTitleElement);

  const featuresContainer = document.createElement("div");
  featuresContainer.classList.add("extensionMovieFeatures");

  // godina
  const releaseYearElement = document.createElement("p");
  releaseYearElement.textContent = movieData.releaseYear;
  featuresContainer.appendChild(releaseYearElement);

  const t1 = document.createElement("p");
  t1.textContent = "·";
  featuresContainer.appendChild(t1);

  // zanr
  const genreElement = document.createElement("p");
  genreElement.textContent = movieData.category;
  featuresContainer.appendChild(genreElement);

  const t2 = document.createElement("p");
  t2.textContent = "·";
  featuresContainer.appendChild(t2);

  // trajanje
  const durationElement = document.createElement("p");
  durationElement.textContent = movieData.duration;
  featuresContainer.appendChild(durationElement);

  // ocijena
  if (movieData.letterboxdRating) {
    const t3 = document.createElement("p");
    t3.textContent = "·";
    featuresContainer.appendChild(t3);

    const lbRatingElement = document.createElement("div");
    const lbRatingText = document.createElement("p");
    const lbLogo = document.createElement("img");
    lbLogo.setAttribute("src", browser.runtime.getURL("images/letterboxdIcon.png"));
    lbLogo.setAttribute("alt", "Letterboxd logo");
    lbRatingText.textContent = movieData.letterboxdRating + "/5";
    lbRatingElement.appendChild(lbLogo);
    lbRatingElement.appendChild(lbRatingText);
    featuresContainer.appendChild(lbRatingElement);
  }

  // ocijena
  if (movieData.imdbRating) {
    const t4 = document.createElement("p");
    t4.textContent = "·";
    featuresContainer.appendChild(t4);

    const imdbRatingElement = document.createElement("div");
    const imdbRatingText = document.createElement("p");
    const imdbLogo = document.createElement("img");
    imdbLogo.setAttribute("src", browser.runtime.getURL("images/imdbIcon.png"));
    imdbLogo.setAttribute("alt", "IMDB logo");
    imdbRatingText.textContent = movieData.imdbRating + "/10";
    imdbRatingElement.appendChild(imdbLogo);
    imdbRatingElement.appendChild(imdbRatingText);
    featuresContainer.appendChild(imdbRatingElement);
  }

  titleAndFeaturesContainer.appendChild(featuresContainer);
  addDirectorAndDescription(titleAndFeaturesContainer, movieData);
}

function addDirectorAndDescription(elementsContainer, movieData) {
  // direktor
  const directorElement = document.createElement("p");
  const directorName = document.createElement("p");

  directorElement.classList.add("extensionDirector");
  directorName.classList.add("extensionDirectorName");

  directorElement.textContent = "Direktor";
  directorName.textContent = movieData.directors.join(", ");

  directorElement.appendChild(directorName);
  elementsContainer.appendChild(directorElement);

  // opis
  const descriptionElement = document.createElement("p");
  const descriptionText = document.createElement("p");

  descriptionElement.classList.add("extensionDescription");
  descriptionText.classList.add("extensionDescriptionText");

  descriptionElement.textContent = "Opis";
  descriptionText.textContent = movieData.description;

  descriptionElement.appendChild(descriptionText);
  elementsContainer.appendChild(descriptionElement);
}

function addRatingToMovieDiv(movieContentDiv, podaciOFilmu) {
  // IMDB ocjena
  const imdbOcjenaContainer = document.createElement("div");
  imdbOcjenaContainer.classList.add("ratingInnerContainer");
  const imdbTekstParagraph = document.createElement("p");
  imdbTekstParagraph.classList.add("ratingCompany");
  const imdbOcjenaParagraph = document.createElement("p");
  imdbTekstParagraph.innerHTML = "IMDB";
  imdbOcjenaParagraph.innerHTML = podaciOFilmu.imdbRating + "/10";
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
