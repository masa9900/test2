(function () {
  'use strict';

  var TABS = ['Notes', 'Replies', 'Media', 'Saved'];

  var POSTS = [
    { when: '2m', body: 'Found this one on the way north — a curved cedar bench and a lake view that makes the whole trip worth it. The sign says "kōryū sauna."', photo: './assets/sauna-lounge.png', replies: 12, reposts: 4, likes: 189, saves: 38 },
    { when: '4m', body: 'Lakeside sauna in Hakone this weekend — the kind of window seat where you stop checking the clock. Wood stove kept going the whole time.', photo: './assets/sauna-lake.png', replies: 14, reposts: 5, likes: 203, saves: 47 },
    { when: '15m', body: 'Sauna round three. The rain outside the window in the last room is doing more for me than any of the actual heat.', photo: './assets/sauna-post.png', replies: 9, reposts: 3, likes: 156, saves: 34 },
    { when: '30m', body: 'Ended up talking to two strangers for an hour straight, wrapped in towels, watching the light change over the water. This is the whole reason I go.', photo: './assets/sauna-friends.png', replies: 20, reposts: 7, likes: 298, saves: 61 },
    { when: '1h', body: 'A friend visiting from Finland finally got me into a proper wood-fired sauna. She laughed the whole time at how seriously I was taking the vihta.', photo: './assets/sauna-group.png', replies: 18, reposts: 6, likes: 271, saves: 52 },
    { when: '2h', body: 'The sentō on the corner reopened after the tiler retired. New owner kept the koi mural but painted the ceiling the color of hōjicha. I stayed until my fingers pruned.', placeholder: 'PHOTO · sentō ceiling', replies: 24, reposts: 8, likes: 412, saves: 63 },
    { when: '6h', body: 'Reading list for July — three books, one field guide, and a stack of neighborhood zines I picked up at the coin laundry.', replies: 4, reposts: 2, likes: 88, saves: 41 },
    { when: '1d', body: 'Reposting because I keep coming back to this all week:', quote: { author: 'Kōji Tabata', handle: '@koji.walks', body: 'The neighborhood laundromat at 6am is the closest I get to feeling like the city is mine.' }, replies: 11, reposts: 32, likes: 240, saves: 88 },
    { when: '2d', body: "Question for anyone who lives near a river — what's the best small bridge in your neighborhood? Photos welcome.", placeholder: 'PHOTO · bridge, dusk', replies: 61, reposts: 4, likes: 174, saves: 22 },
  ];

  var state = {
    theme: 'dark',
    activeTab: 'Saved',
    following: false,
    liked: new Set(),
    saved: new Set(),
  };

  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var followBtn = document.getElementById('followBtn');
  var tabsEl = document.getElementById('tabs');
  var postsEl = document.getElementById('posts');

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'text') {
          node.textContent = attrs[key];
        } else {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    return node;
  }

  function renderTheme() {
    root.setAttribute('data-theme', state.theme);
  }

  function renderFollow() {
    followBtn.textContent = state.following ? 'Following' : 'Follow';
    followBtn.classList.toggle('following', state.following);
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    TABS.forEach(function (label) {
      var active = label === state.activeTab;
      var btn = el('button', 'tab-btn' + (active ? ' active' : ''), {
        role: 'tab',
        'aria-selected': String(active),
        type: 'button',
      });
      btn.appendChild(document.createTextNode(label));
      if (active) {
        btn.appendChild(el('span', 'tab-underline'));
      }
      btn.addEventListener('click', function () {
        state.activeTab = label;
        renderTabs();
      });
      tabsEl.appendChild(btn);
    });
  }

  function buildActionButton(iconSvg, count, options) {
    options = options || {};
    var btn = el('button', 'post-action-btn' + (options.active ? ' is-active' : ''), { type: 'button' });
    btn.innerHTML = iconSvg;
    if (count !== undefined) {
      var span = document.createElement('span');
      span.textContent = String(count);
      btn.appendChild(span);
    }
    if (options.onClick) btn.addEventListener('click', options.onClick);
    return btn;
  }

  var ICONS = {
    reply: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.5 6c0-1.4 1.1-2.5 2.5-2.5h8c1.4 0 2.5 1.1 2.5 2.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3 2.5v-2.5H6c-1.4 0-2.5-1.1-2.5-2.5V6Z" fill="currentColor" opacity="0.15"></path><path d="M3.5 6c0-1.4 1.1-2.5 2.5-2.5h8c1.4 0 2.5 1.1 2.5 2.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3 2.5v-2.5H6c-1.4 0-2.5-1.1-2.5-2.5V6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"></path><circle cx="8" cy="8" r="0.9" fill="currentColor"></circle><circle cx="12" cy="8" r="0.9" fill="currentColor"></circle></svg>',
    repost: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 8 C 4 5 6 3 9 3 h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"></path><path d="M12.5 1.2 L 15.5 3 L 12.5 4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M16 12 C 16 15 14 17 11 17 h-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"></path><path d="M7.5 15.2 L 4.5 17 L 7.5 18.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>',
    like: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17c-6-4-7-9-4.5-11 1.8-1.4 3.5-0.4 4.5 1 1-1.4 2.7-2.4 4.5-1 2.5 2 1.5 7-4.5 11Z" fill="currentColor"></path><path d="M15 3.5 L 15.5 5 L 17 5.5 L 15.5 6 L 15 7.5 L 14.5 6 L 13 5.5 L 14.5 5 Z" fill="currentColor" opacity="0.7"></path></svg>',
    save: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 4c0-1 0.8-1.8 1.8-1.8h5.4c1 0 1.8 0.8 1.8 1.8v13.2l-4.5-3-4.5 3V4Z" fill="currentColor" opacity="0.15"></path><path d="M5.5 4c0-1 0.8-1.8 1.8-1.8h5.4c1 0 1.8 0.8 1.8 1.8v13.2l-4.5-3-4.5 3V4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"></path></svg>',
    share: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 3 L 3 9 L 8.5 11 L 10.5 17 L 17 3Z" fill="currentColor" opacity="0.15"></path><path d="M17 3 L 3 9 L 8.5 11 L 10.5 17 L 17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"></path><path d="M8.5 11 L 17 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"></path></svg>',
    more: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1.2" fill="currentColor"></circle><circle cx="7" cy="7" r="1.2" fill="currentColor"></circle><circle cx="11" cy="7" r="1.2" fill="currentColor"></circle></svg>',
    pin: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M6 1 4 3H2l3 3-2 3 3-2 3 3-3-3 3-2H7L6 1Z" fill="currentColor"></path></svg>',
  };

  function renderPosts() {
    postsEl.innerHTML = '';

    POSTS.forEach(function (post, index) {
      var liked = state.liked.has(index);
      var saved = state.saved.has(index);

      var article = el('article', 'post');

      var header = el('div', 'post-header');
      header.appendChild(el('div', 'post-avatar', { text: 'S' }));

      var authorBlock = el('div', 'post-author-block');
      var authorLine = el('div', 'post-author-line');
      authorLine.appendChild(el('span', 'post-name', { text: 'Sanae Ito' }));
      authorLine.appendChild(el('span', 'post-handle', { text: '@sanae.notes' }));
      authorLine.appendChild(el('span', 'post-dot', { text: '·' }));
      authorLine.appendChild(el('span', 'post-time', { text: post.when }));
      authorBlock.appendChild(authorLine);
      header.appendChild(authorBlock);

      var moreBtn = el('button', 'post-more-btn', { type: 'button', 'aria-label': 'More' });
      moreBtn.innerHTML = ICONS.more;
      header.appendChild(moreBtn);

      article.appendChild(header);
      article.appendChild(el('p', 'post-body', { text: post.body }));

      if (post.photo) {
        var photoWrap = el('div', 'post-photo');
        var img = el('img', null, { src: post.photo, alt: '' });
        photoWrap.appendChild(img);
        article.appendChild(photoWrap);
      }

      if (post.placeholder) {
        var placeholderWrap = el('div', 'post-placeholder');
        placeholderWrap.appendChild(el('span', 'post-placeholder-chip', { text: post.placeholder }));
        article.appendChild(placeholderWrap);
      }

      if (post.quote) {
        var quoteWrap = el('div', 'post-quote');
        var quoteHeader = el('div', 'post-quote-header');
        quoteHeader.appendChild(el('div', 'post-quote-avatar'));
        quoteHeader.appendChild(el('span', 'post-quote-author', { text: post.quote.author }));
        quoteHeader.appendChild(el('span', 'post-quote-handle', { text: post.quote.handle }));
        quoteWrap.appendChild(quoteHeader);
        quoteWrap.appendChild(el('p', 'post-quote-body', { text: post.quote.body }));
        article.appendChild(quoteWrap);
      }

      var actions = el('div', 'post-actions');
      actions.appendChild(buildActionButton(ICONS.reply, post.replies));
      actions.appendChild(buildActionButton(ICONS.repost, post.reposts));
      actions.appendChild(buildActionButton(ICONS.like, liked ? post.likes + 1 : post.likes, {
        active: liked,
        onClick: function () {
          if (state.liked.has(index)) state.liked.delete(index); else state.liked.add(index);
          renderPosts();
        },
      }));
      actions.appendChild(buildActionButton(ICONS.save, saved ? post.saves + 1 : post.saves, {
        active: saved,
        onClick: function () {
          if (state.saved.has(index)) state.saved.delete(index); else state.saved.add(index);
          renderPosts();
        },
      }));
      actions.appendChild(buildActionButton(ICONS.share));

      article.appendChild(actions);
      postsEl.appendChild(article);
    });
  }

  themeToggle.addEventListener('click', function () {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    renderTheme();
  });

  followBtn.addEventListener('click', function () {
    state.following = !state.following;
    renderFollow();
  });

  renderTheme();
  renderFollow();
  renderTabs();
  renderPosts();
})();
