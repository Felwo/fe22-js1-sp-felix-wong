const key = "1dc9b7d8deb2d4be49537eaff2557ac3";
const btn = document.querySelector("#search-button");

btn.addEventListener("click", (event) => {
  event.preventDefault();

  const imgContainer = document.querySelector("#img-container");
  imgContainer.innerText = "";

  const txtInput = document.querySelector(".search-input");
  const txt = txtInput.value;
  txtInput.value = "";

  const sortInput = document.querySelector(".sort").value;
  const amountInput = document.querySelector(".display-amount").value;
  const sizeInput = document.querySelector(".img-size").value;

  const defaultErrorMsg = document.querySelector("#default-error-msg");
  const apiErrorMsg = document.querySelector("#no-API-response-error-msg");
  const inputErrorMsg = document.querySelector("#no-input-error-msg");
  const noImagesErrorMsg = document.querySelector("#no-images-error-msg");
  defaultErrorMsg.style.display = "none";
  apiErrorMsg.style.display = "none";
  noImagesErrorMsg.style.display = "none";

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

  function stopLoadingAnimation() {
    animation.style.visibility = "hidden";
    loadingAnimation.restart();
    loadingAnimation.pause();
  }

  if (txt.length == 0) {
    inputErrorMsg.style.display = "block";
  } else {
    inputErrorMsg.style.display = "none";
    animation.style.visibility = "visible";
    loadingAnimation.play();

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&text=${txt}&sort=${sortInput}&per_page=${amountInput}&format=json&nojsoncallback=1`;

    fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw (apiErrorMsg.style.display = "block");
        }
      })
      .then((data) => {
        stopLoadingAnimation();

        const photoArr = data.photos.photo;
        if (photoArr.length == 0) {
          noImagesErrorMsg.style.display = "block";
          stopLoadingAnimation();
        }

        photoArr.forEach((result) => {
          let masonry = document.createElement("div");
          const photoImg = document.createElement("img");

          photoImg.src = `https://live.staticflickr.com/${result.server}/${result.id}_${result.secret}_${sizeInput}.jpg`;
          masonry.className = "grid-item";
          masonry.append(photoImg);

          const grid = document.querySelector(".grid");
          setTimeout(function () {
            const masonryGrid = new Masonry(grid, {
              itemSelector: ".grid-item",
              gutter: 10,
            });
          }, 1000);
          imgContainer.append(masonry);
          photoImg.addEventListener("click", imageInspect);
        });
      })
      .catch((error) => {
        console.log(error);
        stopLoadingAnimation();
        defaultErrorMsg.style.display = "block";
      });
  }
});

const inspectContainer = document.querySelector("#popup-container");
//Image preview, modal box
function imageInspect(event) {
  const inspectImg = document.querySelector("#img-inspect");
  inspectImg.src = event.target.src;
  inspectContainer.style.display = "block";
}
inspectContainer.addEventListener("click", (e) => {
  inspectContainer.style.display = "none";
});
