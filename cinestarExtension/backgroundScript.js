function handleMessage(request, sender, sendResponse) {
  if (request.action === "getCinestarData") {
    fetch("http://188.129.61.168:3000/getMovies")
      .then((response) => response.json())
      .then((data) => sendResponse({ data: data }))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Required to use sendResponse asynchronously.
  } else if (request.action === "missingMovie") {
    fetch(`http://188.129.61.168:3000/missing/${request.missingMovieName}`);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
