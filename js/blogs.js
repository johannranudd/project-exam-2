import { getData } from './utils.js';
const listOfBlogs = document.querySelector('.list-of-blogs');
const spinner = document.querySelector('.spinner');
const loadMoreBtn = document.querySelector('.load-more-btn');
const sortByBtns = document.querySelector('.sort-by-buttons');
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

const url = `https://www.johannblog.one/wp-json/wp/v2/posts?_embed=true&per_page=10`;

let totalData = [];

async function displayTenFirstBlogs() {
  const data = await getData(url);
  totalData = data;
  if (data) {
    spinner.remove();
    mapData(totalData);
    loadMoreBtn.addEventListener('click', loadeMoreFunction);
  }
}
displayTenFirstBlogs();

// MAP DATA
function mapData(data) {
  listOfBlogs.innerHTML = '';
  data.map((item) => {
    const year = item.date.substring(0, 4);
    const month = item.date.substring(5, 7);
    const day = item.date.substring(8, 10);
    const fullDate = `${day}.${month}.${year}`;
    const imageUrl = item._embedded['wp:featuredmedia'][0].source_url;
    const altText = item._embedded['wp:featuredmedia'][0].alt_text;
    listOfBlogs.innerHTML += `
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
sortByBtns.addEventListener('click', (e) => sortByFunction(e));

// LOAD MORE
let offset = 10;
async function loadeMoreFunction() {
  const offsetURL = `https://www.johannblog.one/wp-json/wp/v2/posts?_embed=true&offset=${offset}&per_page=10`;
  const moreData = await getData(offsetURL);
  if (moreData.length > 0) {
    offset += moreData.length;
    moreData.map((item) => {
      totalData.push(item);
    });
    mapData(totalData);
  } else {
    const allPostsWarning = document.querySelector('.all-posts-warning');
    if (allPostsWarning.innerHTML === '') {
      allPostsWarning.innerHTML = 'There are no more posts';
      setTimeout(() => {
        allPostsWarning.innerHTML = '';
      }, 3000);
    }
    return;
  }
}

function sortByFunction(e) {
  const id = e.target.dataset.id;
  if (id === 'latest') {
    const latest = totalData.sort((a, b) => {
      if (Date.parse(a.date) < Date.parse(b.date)) {
        return 1;
      } else {
        return -1;
      }
    });
    mapData(latest);
  }
  if (id === 'oldest') {
    const oldest = totalData.sort((a, b) => {
      if (Date.parse(a.date) > Date.parse(b.date)) {
        return 1;
      } else {
        return -1;
      }
    });
    mapData(oldest);
  }
}

const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input');
const searchFormLabel = searchForm.querySelector('label');

searchForm.addEventListener('submit', searchFunction);

async function searchFunction(e) {
  e.preventDefault();
  const allPostsUrl = `https://www.johannblog.one/wp-json/wp/v2/posts?_embed=true&per_page=100`;
  const searchData = await getData(allPostsUrl);
  const getMatchingPosts = searchData.filter((item) => {
    if (
      searchInput.value &&
      item.title.rendered
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      return item;
    }
  });
  if (getMatchingPosts.length === 0) {
    searchFormLabel.innerHTML = 'No wrecks found with that name';
    searchFormLabel.style.color = 'red';
    setTimeout(() => {
      searchFormLabel.innerHTML = 'Search wreck name';
      searchFormLabel.style.color = 'black';
    }, 3000);
  } else {
    mapData(getMatchingPosts);
  }
  searchInput.value = '';
  searchInput.focus();
}
