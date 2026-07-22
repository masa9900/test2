const TABS = ['Notes', 'Replies', 'Media', 'Saved'];
const DEFAULT_TAB = 'Saved';

const POSTS = [
  {
    when: '2h',
    body: 'The sentō on the corner reopened after the tiler retired. New owner kept the koi mural but painted the ceiling the color of hōjicha. I stayed until my fingers pruned.',
    image: 'PHOTO · sentō ceiling',
    replies: 24, reposts: 8, likes: 412, saves: 63,
  },
  {
    when: '6h',
    body: 'Reading list for July — three books, one field guide, and a stack of neighborhood zines I picked up at the coin laundry.',
    replies: 4, reposts: 2, likes: 88, saves: 41,
  },
  {
    when: '1d',
    body: 'Reposting because I keep coming back to this all week:',
    quote: { author: 'Kōji Tabata', handle: '@koji.walks', body: 'The neighborhood laundromat at 6am is the closest I get to feeling like the city is mine.' },
    replies: 11, reposts: 32, likes: 240, saves: 88,
  },
  {
    when: '2d',
    body: "Question for anyone who lives near a river — what's the best small bridge in your neighborhood? Photos welcome.",
    image: 'PHOTO · bridge, dusk',
    replies: 61, reposts: 4, likes: 174, saves: 22,
  },
];

const ICONS = {
  reply: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.5 6c0-1.4 1.1-2.5 2.5-2.5h8c1.4 0 2.5 1.1 2.5 2.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3 2.5v-2.5H6c-1.4 0-2.5-1.1-2.5-2.5V6Z" fill="currentColor" opacity="0.15"/><path d="M3.5 6c0-1.4 1.1-2.5 2.5-2.5h8c1.4 0 2.5 1.1 2.5 2.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3 2.5v-2.5H6c-1.4 0-2.5-1.1-2.5-2.5V6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><circle cx="8" cy="8" r="0.9" fill="currentColor"/><circle cx="12" cy="8" r="0.9" fill="currentColor"/></svg>',
  repost: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 8 C 4 5 6 3 9 3 h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12.5 1.2 L 15.5 3 L 12.5 4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M16 12 C 16 15 14 17 11 17 h-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M7.5 15.2 L 4.5 17 L 7.5 18.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  like: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17c-6-4-7-9-4.5-11 1.8-1.4 3.5-0.4 4.5 1 1-1.4 2.7-2.4 4.5-1 2.5 2 1.5 7-4.5 11Z" fill="currentColor"/><path d="M15 3.5 L 15.5 5 L 17 5.5 L 15.5 6 L 15 7.5 L 14.5 6 L 13 5.5 L 14.5 5 Z" fill="currentColor" opacity="0.7"/></svg>',
  save: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 4c0-1 0.8-1.8 1.8-1.8h5.4c1 0 1.8 0.8 1.8 1.8v13.2l-4.5-3-4.5 3V4Z" fill="currentColor" opacity="0.15"/><path d="M5.5 4c0-1 0.8-1.8 1.8-1.8h5.4c1 0 1.8 0.8 1.8 1.8v13.2l-4.5-3-4.5 3V4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/></svg>',
  share: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 3 L 3 9 L 8.5 11 L 10.5 17 L 17 3Z" fill="currentColor" opacity="0.15"/><path d="M17 3 L 3 9 L 8.5 11 L 10.5 17 L 17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M8.5 11 L 17 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>',
};

let activeTab = DEFAULT_TAB;
const likedPosts = new Set();
const savedPosts = new Set();

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  tabsEl.innerHTML = TABS.map(label => {
    const isActive = label === activeTab;
    return `
      <button class="tab${isActive ? ' is-active' : ''}" role="tab" aria-selected="${isActive}" data-tab="${label}" type="button">
        ${label}
        ${isActive ? '<span class="tab__indicator"></span>' : ''}
      </button>
    `;
  }).join('');

  tabsEl.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderTabs();
    });
  });
}

function renderFeed() {
  const feedEl = document.getElementById('feed');
  feedEl.innerHTML = POSTS.map((post, i) => `
    <article class="post" data-index="${i}">
      <div class="post__head">
        <div class="post__avatar">S</div>
        <div class="post__meta">
          <div class="post__meta-row">
            <span class="post__author">Sanae Ito</span>
            <span class="post__handle">@sanae.notes</span>
            <span class="post__dot">·</span>
            <span class="post__when">${post.when}</span>
          </div>
        </div>
        <button class="post__more" aria-label="More" type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/></svg>
        </button>
      </div>

      <p class="post__body">${post.body}</p>

      ${post.image ? `
        <div class="post__image">
          <span class="post__image-label">${post.image}</span>
        </div>
      ` : ''}

      ${post.quote ? `
        <div class="post__quote">
          <div class="post__quote-head">
            <div class="post__quote-avatar"></div>
            <span class="post__quote-author">${post.quote.author}</span>
            <span class="post__quote-handle">${post.quote.handle}</span>
          </div>
          <p class="post__quote-body">${post.quote.body}</p>
        </div>
      ` : ''}

      <div class="post__actions">
        <button class="post__action" data-action="reply" type="button">${ICONS.reply}<span class="count" data-count="replies">${post.replies}</span></button>
        <button class="post__action" data-action="repost" type="button">${ICONS.repost}<span class="count" data-count="reposts">${post.reposts}</span></button>
        <button class="post__action post__action--like${likedPosts.has(i) ? ' is-active' : ''}" data-action="like" type="button">${ICONS.like}<span class="count" data-count="likes">${likedPosts.has(i) ? post.likes + 1 : post.likes}</span></button>
        <button class="post__action${savedPosts.has(i) ? ' is-active' : ''}" data-action="save" type="button">${ICONS.save}<span class="count" data-count="saves">${savedPosts.has(i) ? post.saves + 1 : post.saves}</span></button>
        <button class="post__action" data-action="share" type="button">${ICONS.share}</button>
      </div>
    </article>
  `).join('');

  feedEl.querySelectorAll('[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.closest('.post').dataset.index);
      likedPosts.has(index) ? likedPosts.delete(index) : likedPosts.add(index);
      renderFeed();
    });
  });
  feedEl.querySelectorAll('[data-action="save"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.closest('.post').dataset.index);
      savedPosts.has(index) ? savedPosts.delete(index) : savedPosts.add(index);
      renderFeed();
    });
  });
}

function initTheme() {
  const root = document.querySelector('.page');
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('murmur-theme');
  const theme = stored || 'dark';
  root.dataset.theme = theme;

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('murmur-theme', next);
  });
}

function initFollow() {
  const btn = document.getElementById('followBtn');
  btn.addEventListener('click', () => {
    const following = btn.classList.toggle('is-following');
    btn.textContent = following ? 'Following' : 'Follow';
  });
}

initTheme();
initFollow();
renderTabs();
renderFeed();
