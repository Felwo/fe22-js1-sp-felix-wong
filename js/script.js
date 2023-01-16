const key = "1dc9b7d8deb2d4be49537eaff2557ac3";
const btn = document.querySelector("#search-button");

//when the button is click, grab the different inputs and value so that Flickr images can be shown on the website. 
btn.addEventListener("click", (event) => {
  event.preventDefault();

  //Mass declaration of variable used for search for the different inputs
  const imgContainer = document.querySelector("#img-container");
  imgContainer.innerText = "";

  const txtInput = document.querySelector(".search-input");
  const txt = txtInput.value;
  txtInput.value = "";

  const sortInput = document.querySelector(".sort").value;
  const amountInput = document.querySelector(".display-amount").value;
  const sizeInput = document.querySelector(".img-size").value;

  //Error texts varaibles that are hidden until a condition is fulfilled
  const defaultErrorMsg = document.querySelector("#default-error-msg");
  const apiErrorMsg = document.querySelector("#no-API-response-error-msg");
  const inputErrorMsg = document.querySelector("#no-input-error-msg");
  const noImagesErrorMsg = document.querySelector("#no-images-error-msg");
  defaultErrorMsg.style.display = "none";
  apiErrorMsg.style.display = "none";
  noImagesErrorMsg.style.display = "none";

  //Declared animation for loading screen and how the animation should behave with the usage of anime.js library
  const loadingFrames = {
    targets: ".loading-container h2",
    loop: true,
    duration: 200,
    delay: anime.stagger(75),
    keyframes: [{ translateY: -10 }, { translateY: 3 }, { translateY: 0 }],
    easing: "easeInOutElastic(1, .55)",
  };
  const loadingAnimation = anime(loadingFrames);
  const animation = document.querySelector(".loading-container");

  //Stops and restart animation when needed
  function stopLoadingAnimation() {
    animation.style.visibility = "hidden";
    loadingAnimation.restart();
    loadingAnimation.pause();
  }

  //First error check before initiating the Flickr API, if the user haven't input anything
  if (txt.length == 0) {
    inputErrorMsg.style.display = "block";
  } else {
    //When the user inputs something, the loading animation will play until images comes up on the screen
    inputErrorMsg.style.display = "none";
    animation.style.visibility = "visible";
    loadingAnimation.play();

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&text=${txt}&sort=${sortInput}&per_page=${amountInput}&format=json&nojsoncallback=1`;

    //Fetching the API and display the images on the HTML
    fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          //Throw an error for API when is not responding
          throw (apiErrorMsg.style.display = "block");
        }
      })
      //Get the JSON and displays it on HTML
      .then((data) => {
        stopLoadingAnimation();

        const photoArr = data.photos.photo;
        //If there are none images, show the error to the user
        if (photoArr.length == 0) {
          noImagesErrorMsg.style.display = "block";
          stopLoadingAnimation();
        }

        //a loop that displays all the fetch data/images into a div container
        photoArr.forEach((result) => {
          let masonry = document.createElement("div");
          const photoImg = document.createElement("img");

          //Grabs the fetch data and put it into a responsive container/layout
          photoImg.src = `https://live.staticflickr.com/${result.server}/${result.id}_${result.secret}_${sizeInput}.jpg`;
          masonry.className = "grid-item";
          masonry.append(photoImg);

          //uses masonry libray for responsive layout and stylize how it should look like
          const grid = document.querySelector(".grid");
          //A timer before it should be in masonry layout, due to images loading in
          setTimeout(function () {
            const masonryGrid = new Masonry(grid, {
              itemSelector: ".grid-item",
              gutter: 10,
            });
          }, 1000);
          //append so that images can be shown on the HTML
          imgContainer.append(masonry);
          //whenever the user click an image, it will show an image preview
          photoImg.addEventListener("click", imageInspect);
        });
      })
      //default error check, gives a general error that is not specific
      .catch((error) => {
        console.log(error);
        stopLoadingAnimation();
        defaultErrorMsg.style.display = "block";
      });
  }
});

//Image preview, modal box shows when you click on the image 
const inspectContainer = document.querySelector("#popup-container");
function imageInspect(event) {
  const inspectImg = document.querySelector("#img-inspect");
  inspectImg.src = event.target.src;
  inspectContainer.style.display = "block";
}
inspectContainer.addEventListener("click", (e) => {
  inspectContainer.style.display = "none";
});
