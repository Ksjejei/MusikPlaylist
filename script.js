const playlist = [
  {id:1, title:'Loose', artist:'Daniel Cesar', file:'audio/track1.mp3', cover:'covers/cover1.jpg'},
  {id:2, title:'Rich Baby Daddy', artist:'Drake', file:'audio/track2.mp3', cover:'covers/cover2.jpg'},
  {id:3, title:'Smooth Operator', artist:'Sade', file:'audio/track3.mp3', cover:'covers/cover3.jpg'}
];

const tracksEl = document.getElementById('tracks');
const audio = new Audio();
let current = -1;
let isShuffle = false;
let isRepeat = false;

function formatTime(s){
  if(!s || isNaN(s)) return '0:00';
  const m = Math.floor(s/60);
  const sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}

function renderList(list){
  tracksEl.innerHTML = '';
  list.forEach((t, i)=>{
    const el = document.createElement('div');
    el.className = 'track';
    el.innerHTML = `
      <div style="text-align:center">
  <img src="${t.cover}" alt="Covers" style="width:45px;height:45px;border-radius:8px;object-fit:cover">
</div>

        <div class="title">${t.title}</div>
        <div class="artist">${t.artist}</div>
      </div>
      <div style="text-align:center"><button class='btn play-btn' data-index='${i}'>Play</button></div>
      <div style="text-align:center"><button class='btn like-btn'>♡</button></div>
    `;
    tracksEl.appendChild(el);
  });

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      playIndex(idx);
    });
  });

  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleLike(btn));
  });
}

function playIndex(i){
  const t = playlist[i];
  if(!t) return;

  if(current === i && !audio.paused){
    audio.pause();
    document.getElementById('play').textContent = 'Play';
    return;
  }

  audio.src = t.file;
  audio.play().catch(err => console.warn('File audio tidak ditemukan', err));
  current = i;
  document.getElementById('player-title').textContent = t.title;
  document.getElementById('player-artist').textContent = t.artist;
  document.getElementById('player-cover').innerHTML = t.cover ? `<img src='${t.cover}' alt='cover'>` : '♪';
  document.getElementById('play').textContent = 'Pause';
}

function toggleLike(btn){ btn.textContent = btn.textContent === '♡' ? '♥' : '♡'; }
function prev(){ if(current > 0) playIndex(current - 1); }
function next(){
  if(isShuffle){ playIndex(Math.floor(Math.random() * playlist.length)); }
  else if(current < playlist.length - 1){ playIndex(current + 1); }
  else if(isRepeat){ playIndex(0); }
}

document.getElementById('prev').addEventListener('click', prev);
document.getElementById('next').addEventListener('click', next);
document.getElementById('play').addEventListener('click', ()=>{
  if(current === -1) return playIndex(0);
  if(audio.paused){ audio.play(); document.getElementById('play').textContent='Pause'; }
  else{ audio.pause(); document.getElementById('play').textContent='Play'; }
});
document.getElementById('shuffle').addEventListener('click', ()=>{
  isShuffle = !isShuffle;
  document.getElementById('shuffle').style.color = isShuffle ? 'var(--accent)' : 'inherit';
});
document.getElementById('repeat').addEventListener('click', ()=>{
  isRepeat = !isRepeat;
  document.getElementById('repeat').style.color = isRepeat ? 'var(--accent)' : 'inherit';
});

audio.addEventListener('timeupdate', ()=>{
  const cur = audio.currentTime;
  const dur = audio.duration || 0;
  document.getElementById('time-cur').textContent = formatTime(cur);
  document.getElementById('time-dur').textContent = formatTime(dur);
  if(dur){ document.getElementById('seek').value = (cur/dur)*100; }
});

document.getElementById('seek').addEventListener('input', e=>{
  const pct = e.target.value/100;
  if(audio.duration) audio.currentTime = pct * audio.duration;
});

document.getElementById('volume').addEventListener('input', e=>{ audio.volume = parseFloat(e.target.value); });

document.getElementById('search').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  const filtered = playlist.filter(p => p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q));
  renderList(filtered);
});

renderList(playlist);

audio.addEventListener('ended', next);