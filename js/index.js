import { getData } from './utils.js';
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts?_embed=true&per_page=8`;
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts`;
const url = `https://www.johannblog.one/wp-json/wp/v2/posts?_embed=true&per_page=12`;
const section = document.querySelector('.slider-section');
// const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
// const cardList = document.querySelector('.slider-container');
const slider = document.querySelector('.slider');
const mobileSlider = document.querySelector('.mobile-next-and-prev-btns');
const heroHeader = document.querySelector('.hero-text-container h1');
const heroParagraph = document.querySelector('.hero-paragraph');
const spinner = document.querySelector('.spinner');
const featuredList = document.querySelector('.featured-list');
const readMoreHeroBtn = document.querySelector('.read-more-btn');
const mobileDots = document.querySelector('.mobile-dots');

// mobile menu variables and functionality
const mobileMenu = document.querySelector('.mobile-menu');
const menuBtn = document.querySelector('.menu-btn');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('show-menu');
  menuBtn.classList.toggle('menu-is-open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && mobileMenu.className.includes('show-menu')) {
    mobileMenu.classList.remove('show-menu');
    menuBtn.classList.remove('menu-is-open');
  }
});

let heroID = 0;

async function displayData() {
  const data = await getData(url);
  if (data) {
    spinner.remove();
    displayHeroImage(data);
    createSliderCards(data);
    mobileSlider.addEventListener('click', (e) =>
      mobileSliderFunction(e, data)
    );
    displayFeaturedPosts(data);
  }
}
displayData();

function displayHeroImage(data) {
  const initialImage = data[heroID]._embedded['wp:featuredmedia'][0];
  heroImage.src = initialImage.source_url;
  heroImage.alt = initialImage.alt_text;
  heroHeader.innerHTML = data[heroID].title.rendered;
  heroParagraph.innerHTML = data[heroID].excerpt.rendered.substring(0, 50);
  readMoreHeroBtn.href = `./details.html?id=${data[heroID].id}`;

  mobileDots.innerHTML = `${heroID + 1}/${data.length}`;
}
// mobile slider function
function mobileSliderFunction(e, data) {
  const maxLength = data.length;
  if (e.target.className.includes('fa-chevron-left')) {
    heroID--;
    if (heroID < 0) {
      heroID = maxLength - 1;
    }
  }
  if (e.target.className.includes('fa-chevron-right')) {
    heroID++;
    if (heroID >= maxLength) {
      heroID = 0;
    }
  }
  displayHeroImage(data);
}

// createSliderCards
function createSliderCards(data) {
  data.map((post, index) => {
    const media = post._embedded['wp:featuredmedia'][0];
    slider.innerHTML += `
    <li class="card">
      <a href="./details.html?id=${post.id}">
        <img data-id="${post.id}" src="${media.source_url}" alt="${media.alt_text}" />
        <div class="text-content">
        <h3>${post.title.rendered}</h3>
        </div>
      </a>
    </li>
    `;
  });

  const cardImages = slider.querySelectorAll('img');
  dynamicHeroImage(cardImages, data);
}

// dynamic hero image
function dynamicHeroImage(cardImages, data) {
  let currentImageHovered = 0;

  cardImages.forEach((cardImage, index) => {
    let timeout1 = null;
    let timeout2 = null;

    cardImage.addEventListener('mouseenter', (e) => {
      currentImageHovered = Number(cardImage.dataset.id);
      const filteredHeroImage = data.filter((item) => {
        return item.id === currentImageHovered;
      });

      const hoverImage =
        filteredHeroImage[0]._embedded['wp:featuredmedia'][0].source_url;

      timeout1 = setTimeout(() => {
        heroImage.classList.add('fade-out');
      }, 700);

      timeout2 = setTimeout(() => {
        heroImage.src = hoverImage;
        heroImage.alt =
          filteredHeroImage[0]._embedded['wp:featuredmedia'][0].alt_text;
        heroHeader.innerHTML = filteredHeroImage[0].title.rendered;
        heroParagraph.innerHTML =
          filteredHeroImage[0].excerpt.rendered.substring(0, 50);
        readMoreHeroBtn.href = `./details.html?id=${filteredHeroImage[0].id}`;
        heroImage.classList.remove('fade-out');
        heroID = index;
        mobileDots.innerHTML = `${heroID + 1}/${cardImages.length}`;
      }, 1000);
      // if (Number(cardImage.dataset.id) !== currentImageHovered) {
      // }
    });

    cardImage.addEventListener('mouseleave', () => {
      if (heroImage.className.includes('fade-out')) {
        heroImage.classList.remove('fade-out');
      }
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    });
  });
}

// slider functionality
let sliderValue = 0;
const maxValue = 2;

section.addEventListener('click', (e) => {
  if (e.target.className.includes('fa-chevron-left')) {
    sliderValue -= 1;
    if (sliderValue < 0) {
      sliderValue = maxValue;
    }
  }
  if (e.target.className.includes('fa-chevron-right')) {
    sliderValue += 1;
    if (sliderValue > maxValue) {
      sliderValue = 0;
    }
  }
  slideFunction();
});

window.addEventListener('DOMContentLoaded', slideFunction);
const dots = document.querySelectorAll('.dot');
// console.log(dots[2]);

function slideFunction() {
  dots.forEach((dot) => {
    dot.style.backgroundColor = 'grey';
  });
  if (sliderValue === 0) {
    slider.style.transform = 'translate(0%, 0%)';
    dots[0].style.backgroundColor = 'black';
  }
  if (sliderValue === 1) {
    slider.style.transform = 'translate(-100%, 0%)';
    dots[1].style.backgroundColor = 'black';
  }
  if (sliderValue === maxValue) {
    slider.style.transform = 'translate(-200%, 0%)';
    dots[2].style.backgroundColor = 'black';
  }
}

// featured posts
function displayFeaturedPosts(data) {
  const filterByFeatured = data.filter((featuredItem) => {
    if (featuredItem.tags.length) {
      return featuredItem;
    }
  });
  filterByFeatured.map((item) => {
    const year = item.date.substring(0, 4);
    const month = item.date.substring(5, 7);
    const day = item.date.substring(8, 10);
    const fullDate = `${day}.${month}.${year}`;
    const imageUrl = item._embedded['wp:featuredmedia'][0].source_url;
    const altText = item._embedded['wp:featuredmedia'][0].alt_text;
    featuredList.innerHTML += `
      <li>
        <img src="${imageUrl}" alt="${altText}"/>
        <div>
          ${item.content.rendered.substring(0, 200)} <br/>
          <p>Date: <strong>${fullDate}</strong></p>
          <a href="./details.html?id=${item.id}">Read more</a>
        </div>
      </li>
    `;
  });
}
