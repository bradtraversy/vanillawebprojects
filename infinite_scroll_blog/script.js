const post = document.querySelector('.post');
const postContainer = document.querySelector('.list');
// const loading=document.querySelectorAll('.circle')
const loading = document.querySelector('.loader');
const filter = document.querySelector('input');

let limit = 5;
let page = 1;
///fetching
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

//show posts
async function showPosts() {
  const p = await getPosts();
  console.log(p);
  p.forEach((post) => {
    const newPost = document.createElement('div');
    // newPost.classList.add('post');
    newPost.className = 'post';
    newPost.innerHTML = `<div class="number">${post.id}</div>
    <div class="info">
      <h3>${post.title}</h3>
      <p>
      ${post.body}
      </p>
    </div>
    `;

    postContainer.appendChild(newPost);
  });
  loading.classList.remove('show');
}

function showLoading() {
  loading.classList.add('show');
  page++;
  showPosts();
}
window.addEventListener('scroll', () => {

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
    console.log('s');
  }
});
showPosts();
