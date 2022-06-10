import { getData } from './utils.js';

const urlPar = new URLSearchParams(window.location.search);
const id = urlPar.get('id');
const urlID = Number(id);

const url = `https://johannblog.one/wp-json/wp/v2/posts/${urlID}?_embed=true`;
// const url = `https://johannblog.one/wp-json/wp/v2/posts/${urlID}?`;

const detailsContent = document.querySelector('.details-content');
const detailsHeader = document.querySelector('.details-header');
const modal = document.querySelector('.modal');
const spinner = document.querySelector('.spinner');
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

async function displaySingleData() {
  const data = await getData(url);

  if (data) {
    spinner.remove();
    document.title = data.title.rendered;
  }
  const { title, _embedded, date } = data;
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const fullDate = `${day}.${month}.${year}`;

  //   render content
  detailsHeader.innerHTML = title.rendered;
  detailsContent.innerHTML += `
  <div class="image-container">
    <img src="${_embedded['wp:featuredmedia'][0].source_url}" alt="${_embedded['wp:featuredmedia'][0].alt_text}" /> 
    <div class="backdrop">View image</div>
  </div>
  <p class="date-posted">Date: <strong>${fullDate}</strong></p>
  <div class="blog-text">
    <p>${data.content.rendered}</p>
  </div>
  `;

  //   show modal
  const imageContainer = document.querySelector('.image-container');
  imageContainer.addEventListener('click', () => {
    modal.classList.add('show-modal');
    document.body.style.overflow = 'hidden';
    modal.innerHTML = `
        <img class="modal-image" src="${_embedded['wp:featuredmedia'][0].source_url}" alt="${_embedded['wp:featuredmedia'][0].alt_text}" />
    `;
  });
}
displaySingleData();

// close modal
modal.addEventListener('click', (e) => {
  if (e.target.className !== 'modal-image') {
    modal.classList.remove('show-modal');
    document.body.style.overflow = 'scroll';
    document.body.style.overflowX = 'hidden';
  }
});
