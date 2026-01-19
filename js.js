
/* ==========  Dummy Data  ========== */
const videos = [
  {id:1, title:"Sunset Mountains",  category:"Travel",    duration:"0:45", views:1205, likes:42, thumb:"assets/thumbnails/t1.jpg",  src:"assets/videos/v1.mp4", desc:"Breathtaking mountain sunset time-lapse."},
  {id:2, title:"Lo-Fi Chill Beats", category:"Music",     duration:"3:20", views:3100, likes:128,thumb:"assets/thumbnails/t2.jpg",  src:"assets/videos/v2.mp4", desc:"Relax and study with these chill vibes."},
  {id:3, title:"Learn CSS Grid",    category:"Education", duration:"5:12", views:2100, likes:95, thumb:"assets/thumbnails/t3.jpg",  src:"assets/videos/v3.mp4", desc:"Master CSS Grid in under 6 minutes."},
  {id:4, title:"Comedy Club Prank", category:"Comedy",    duration:"2:30", views:4500, likes:312,thumb:"assets/thumbnails/t4.jpg",  src:"assets/videos/v4.mp4", desc:"Hidden-camera fun at the local club."},
  {id:5, title:"City Lights",       category:"Travel",    duration:"1:15", views:890,  likes:33, thumb:"assets/thumbnails/t5.jpg",  src:"assets/videos/v5.mp4", desc:"Neon nights in downtown Tokyo."},
  {id:6, title:"Classic Movie Scene",category:"Movies",   duration:"4:00", views:6700, likes:402,thumb:"assets/thumbnails/t6.jpg",  src:"assets/videos/v6.mp4", desc:"Iconic monologue from the 80s."},
  {id:7, title:"Piano Tutorial",    category:"Music",     duration:"6:00", views:1800, likes:88, thumb:"assets/thumbnails/t7.jpg",  src:"assets/videos/v7.mp4", desc:"Learn your first piano scale."},
  {id:8, title:"JS Promises",       category:"Education", duration:"8:10", views  :1500,likes:72, thumb:"assets/thumbnails/t8.jpg",  src:"assets/videos/v8.mp4", desc:"Async JavaScript explained visually."},
  {id:9, title:"Stand-up Highlights",category:"Comedy",   duration:"3:45", views:5300, likes:250,thumb:"assets/thumbnails/t9.jpg",  src:"assets/videos/v9.mp4", desc:"Best one-liners of the year."},
  {id:10, title:"Paris Walk",       category:"Travel",    duration:"2:00", views:980,  likes:40, thumb:"assets/thumbnails/t10.jpg", src:"assets/videos/v10.mp4",desc:"A quiet morning walk along the Seine."},
  {id:11, title:"Sci-Fi Trailer",   category:"Movies",    duration:"1:30", views:8900, likes:612,thumb:"assets/thumbnails/t11.jpg", src:"assets/videos/v11.mp4",desc:"Teaser for the upcoming indie hit."},
  {id:12, title:"Guitar Loop",      category:"Music",     duration:"1:00", views:1400, likes:65, thumb:"assets/thumbnails/t12.jpg", src:"assets/videos/v12.mp4",desc:"Finger-style guitar loop for creators."}
];

/* ==========  Utility  ========== */
const qs = q => document.querySelector(q);
const qsa = q => document.querySelectorAll(q);
const storage = (key,val) => {
  if(val===undefined) return JSON.parse(localStorage.getItem(key)||'null');
  localStorage.setItem(key,JSON.stringify(val));
};

/* ==========  Theme Toggle  ========== */
const themeBtn = qs('#theme-toggle');
if(themeBtn){
  const setIcon = () => themeBtn.textContent = document.body.classList.contains('dark')?'☀️':'🌙';
  const current = storage('theme') || 'light';
  if(current==='dark') document.body.classList.add('dark');
  setIcon();
  themeBtn.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    storage('theme',document.body.classList.contains('dark')?'dark':'light');
    setIcon();
  });
}

/* ==========  Router-like helpers  ========== */
function route(page){
  const maps = {
    'index':      () => renderFeatured(),
    'explore':    () => { renderGrid(videos,'explore-grid'); initFilters(); },
    'watch':      () => initWatch(),
    'categories': () => renderCategories(),
    'profile':    () => renderProfile(),
    'login':      () => initAuth()
  };
  if(maps[page]) maps[page]();
}
const currentPage = location.pathname.split('/').pop().replace('.html','') || 'index';
route(currentPage);

/* ==========  Card Factory  ========== */
function card(v){
  return `
  <div class="video-card" data-id="${v.id}">
    <img src="${v.thumb}" alt="${v.title}">
    <div class="video-info">
      <h4>${v.title}</h4>
      <div class="meta">${v.duration} · ${v.views} views</div>
    </div>
  </div>`;
}
function renderGrid(list,target){
  const grid = qs(`#${target}`);
  if(!grid) return;
  grid.innerHTML = list.map(card).join('');
  grid.addEventListener('click',e=>{
    const c = e.target.closest('.video-card');
    if(c) openWatch(c.dataset.id);
  });
}
function renderFeatured(){
  const grid = qs('#featured-grid');
  if(!grid) return;
  renderGrid(videos.slice(0,6),'featured-grid');
}

/* ==========  Filters & Search  ========== */
function initFilters(){
  const search = qs('#search-input');
  const btns   = qsa('.filter-btn');
  function apply(){
    const term = search.value.trim().toLowerCase();
    const cat  = qs('.filter-btn.active')?.dataset.cat || 'all';
    const filtered = videos.filter(v=>{
      const matchCat = cat==='all' || v.category===cat;
      const matchTxt = !term || v.title.toLowerCase().includes(term);
      return matchCat && matchTxt;
    });
    renderGrid(filtered,'explore-grid');
  }
  search.addEventListener('input',apply);
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    apply();
  }));
}

/* ==========  Watch Page  ========== */
function openWatch(id){
  location.href = `watch.html?id=${id}`;
}
function initWatch(){
  const id = new URLSearchParams(location.search).get('id');
  const v  = videos.find(x=>x.id==id) || videos[0];
  const player = qs('#player');
  player.src = v.src;
  qs('#v-title').textContent   = v.title;
  qs('#v-desc').textContent    = v.desc;
  qs('#v-views').textContent   = `${v.views+1} views`;
  v.views++; /* dummy increment */

  /* like logic */
  const likes = storage('likes') || {};
  let likeCount = v.likes;
  if(likes[v.id]) likeCount++;
  qs('#like-count').textContent = likeCount;
  qs('#like-btn').addEventListener('click',()=>{
    likes[v.id] = !likes[v.id];
    storage('likes',likes);
    qs('#like-count').textContent = likes[v.id] ? ++likeCount : --likeCount;
    qs('#like-icon').textContent  = likes[v.id] ? '❤️' : '🤍';
  });

  /* suggested */
  const suggested = videos.filter(x=>x.id!=v.id).slice(0,6);
  renderGrid(suggested,'suggested-list');

  /* history */
  const history = storage('history') || [];
  history.unshift(v);
  storage('history',history.slice(0,30));
}

/* ==========  Categories  ========== */
function renderCategories(){
  const cats = [...new Set(videos.map(v=>v.category))];
  const box = qs('#cat-grid');
  box.innerHTML = cats.map(c=>{
    return `<div class="cat-card" data-cat="${c}">${c}</div>`;
  }).join('');
  box.addEventListener('click',e=>{
    if(e.target.classList.contains('cat-card')){
      const cat = e.target.dataset.cat;
      location.href = `explore.html?cat=${cat}`;
    }
  });
}
/* pre-select category if url param */
if(currentPage==='explore'){
  const cat = new URLSearchParams(location.search).get('cat');
  if(cat){
    qs(`[data-cat="${cat}"]`)?.click();
  }
}

/* ==========  Profile  ========== */
function renderProfile(){
  const history = storage('history') || [];
  const likes   = storage('likes') || {};
  const likedVideos = videos.filter(v=>likes[v.id]);
  renderGrid(history,'history-grid');
  renderGrid(likedVideos,'liked-grid');
}

/* ==========  Auth  ========== */
function initAuth(){
  const form   = qs('#auth-form');
  const title  = qs('#form-title');
  const switchBtn = qs('#switch-btn');
  let mode = 'login';
  switchBtn.addEventListener('click',()=>{
    mode = mode==='login'?'register':'login';
    title.textContent = mode==='login'?'Login':'Register';
    form.querySelector('button').textContent = mode==='login'?'Login':'Create Account';
    switchBtn.parentElement.innerHTML = `${mode==='login'?'New here':'Already have an account'}? <span id="switch-btn">${mode==='login'?'Create an account':'Login'}</span>`;
    qs('#switch-btn').addEventListener('click',arguments.callee);
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const user = qs('#auth-user').value.trim();
    const pass = qs('#auth-pass').value.trim();
    if(!user || !pass) return alert('Fill both fields');
    storage('user',{username:user});
    location.href = 'index.html';
  });
}
