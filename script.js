(function() {
  // ===== CONFIGURATION =====
  const STORAGE_KEY = 'savi_blog_posts';
  const SCROLL_POS_KEY = 'blogScrollPos';
  
  // ===== PHRASE LIBRARY FOR BACKGROUND TEXT =====
  const PHRASES = [
    "THE WORLD IS NOT BEAUTIFUL, THEREFORE, IT IS.",
    "SOCIETY? DON'T YOU MEAN YOURSELF?",
    "GOD, I ASK YOU, IS NON-RESISTANCE A CRIME?",
    "STRUGGLING OUT OF THE EGG, THE EGG IS THE WORLD.",
    "✦ I AM WHO I AM. ✦",
    "O FETUS, O FETUS, WHY DO YOU SQUIRM?",
    "BUT A DREAM WITHIN A DREAM?",
    "MY COWARDLY PRIDE AND HAUGHTY SHAME.",
    "✦ WHAT AM I? ✦",
    "✦ WHAT IS ESSENTIAL IS INVISIBLE. ✦",
    "I'M GONNA MAKE IT BIG SOMEDAY.",
    "NOT PAST, NOT FUTURE, ONLY NOW.",
    "THE ONE AND ONLY",
    "ONLY YOURSELF, YOU OWN FATE.",
    "WELCOME CHANGE, DON'T FEAR IT.",
    "THIS MOMENT IS ALL THAT MATTERS.",
    "✦ THE PLAY IS THE TRAGEDY. ✦",
    "IT IS WHAT IT IS. IT IS WHERE IT IS.",
    "1999",
    "YOU HAVE TO MAKE YOUR OWN WAY.",
    "OH DEAR! I SHALL BE LATE!",
    "HOPE CANNOT BE ELUDED FOREVER.",
    "✦ ENTER YE, STRAIT IS THE GATE. ✦"
  ];

  // Style pools for floating text
  const FONT_CLASSES = ['ft-serif', 'ft-playfair'];
  const SIZE_CLASSES = ['size-sm', 'size-md', 'size-lg', 'size-xl', 'size-xxl'];
  const BLUR_CLASSES = ['clear', 'blur-light', 'blur-strong'];
  const COLOR_CLASSES = ['orange-soft', 'orange-bright', 'orange-deep', 'orange-pale', 'orange-rust'];
  const SHAPE_TYPES = ['shape-circle', 'shape-square', 'shape-triangle', 'shape-diamond', 'shape-ring', 'shape-hexagon'];

  // ===== HELPER FUNCTIONS =====
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomRange = (min, max) => min + Math.random() * (max - min);
  
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function truncateText(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  }

  // ===== DYNAMIC STYLESHEET FOR ANIMATIONS =====
  let styleSheet = document.styleSheets[0];
  if (!styleSheet) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    styleSheet = style.sheet;
  }

  // ===== FLOATING BACKGROUND TEXTS =====
  const textRows = [1, 2, 3, 4, 5].map(i => document.getElementById(`textRow${i}`));
  
  const getRandomStyles = () => `${randomItem(FONT_CLASSES)} ${randomItem(SIZE_CLASSES)} ${randomItem(BLUR_CLASSES)} ${randomItem(COLOR_CLASSES)}`;
  const getRandomVerticalPos = () => 5 + Math.random() * 85;
  const getRandomDrift = () => ({ 
    direction: Math.random() > 0.5 ? 1 : -1, 
    duration: 60 + Math.random() * 90,
    distance: 20 + Math.random() * 40
  });

  const updateTextRow = (row, id) => {
    if (!row) return;
    
    const span = document.createElement('span');
    span.className = getRandomStyles();
    span.textContent = randomItem(PHRASES);
    span.style.opacity = '0';
    span.style.transition = 'opacity 0.3s ease';
    
    row.innerHTML = '';
    row.appendChild(span);
    row.style.top = `${getRandomVerticalPos()}%`;
    
    const { direction, duration, distance } = getRandomDrift();
    const startX = direction === 1 ? -distance : distance;
    const endX = direction === 1 ? distance : -distance;
    const animName = `drift_${id}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    
    const keyframes = `@keyframes ${animName} { 
      0% { transform: translateX(${startX}%); } 
      100% { transform: translateX(${endX}%); } 
    }`;
    
    try {
      // Clean up old animations
      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        if (styleSheet.cssRules[i]?.name?.startsWith(`drift_${id}_`)) {
          styleSheet.deleteRule(i);
        }
      }
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch(e) {
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    
    const fadeDuration = 12 + Math.random() * 6;
    row.style.animation = `${animName} ${duration}s linear infinite`;
    span.style.animation = `fadeTextInOut ${fadeDuration}s ease-in-out infinite`;
    
    setTimeout(() => { if (span) span.style.opacity = '1'; }, 10);
  };

  // Initialize floating texts
  textRows.forEach((row, idx) => {
    setTimeout(() => updateTextRow(row, idx), idx * 500);
    setInterval(() => updateTextRow(row, idx), 18000 + Math.random() * 10000);
  });

  // ===== FLOATING BACKGROUND SHAPES =====
  const shapesContainer = document.getElementById('shapesContainer');
  
  const createShape = () => {
    const type = randomItem(SHAPE_TYPES);
    const shape = document.createElement('div');
    shape.className = `shape ${type}`;
    const size = randomRange(20, 85);
    
    if (type === 'shape-triangle') {
      shape.style.setProperty('--tw', `${randomRange(15, 40)}px`);
      shape.style.setProperty('--th', `${randomRange(25, 65)}px`);
    } else {
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
    }
    
    shape.style.left = `${randomRange(0, 92)}%`;
    shape.style.top = `${randomRange(0, 88)}%`;
    shape.style.opacity = randomRange(0.25, 0.55);
    
    const moveX = randomRange(-30, 30);
    const moveY = randomRange(-25, 25);
    const rot = randomRange(-10, 10);
    const animName = `shapeFloat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const keyframes = `@keyframes ${animName} { 
      0% { transform: translate(0,0) rotate(0deg); } 
      50% { transform: translate(${moveX}px, ${moveY}px) rotate(${rot}deg); } 
      100% { transform: translate(0,0) rotate(0deg); } 
    }`;
    
    try {
      // Limit rule count to prevent performance issues
      if (styleSheet.cssRules.length > 150) {
        for (let i = 0; i < 50; i++) {
          if (styleSheet.cssRules[i]?.name?.startsWith('shapeFloat_')) {
            styleSheet.deleteRule(i);
            break;
          }
        }
      }
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch(e) {
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    
    shape.style.animation = `${animName} ${randomRange(20, 40)}s ease-in-out infinite`;
    shape.style.animationDelay = `${randomRange(0, 10)}s`;
    if (Math.random() > 0.85) shape.style.filter = `blur(${randomRange(0.5, 1.5)}px)`;
    
    shapesContainer.appendChild(shape);
    
    const lifespan = randomRange(20000, 40000);
    setTimeout(() => { 
      if (shape.parentNode) { 
        shape.remove(); 
        createShape(); 
      } 
    }, lifespan);
  };

  // Initialize shapes (6-9 shapes for optimal performance)
  const shapeCount = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < shapeCount; i++) {
    setTimeout(() => createShape(), i * 800);
  }

  // ===== BLOG FUNCTIONALITY =====
  let blogPosts = [];

  function loadBlogPosts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      blogPosts = JSON.parse(saved);
    } else {
      blogPosts = [{
        id: Date.now(),
        title: "First entry: Welcome to my corner",
        content: "After thinking about it for a while, I've decided to start documenting my thoughts here. Expect ramblings about the media I consume, reflections on life, and maybe some original writing. Thanks for stopping by!",
        author: "Savi",
        date: new Date().toLocaleString()
      }];
      saveBlogPosts();
    }
    return blogPosts;
  }

  function saveBlogPosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogPosts));
  }

  function renderBlogPosts() {
    const container = document.getElementById('blogPostsList');
    if (!container) return;
    
    if (blogPosts.length === 0) {
      container.innerHTML = '<div class="empty-blog-message">✧ no entries yet — check back later ✧</div>';
      return;
    }
    
    container.innerHTML = blogPosts.map(post => `
      <div class="blog-post" onclick="viewPost(${post.id})">
        <div class="blog-post-header">
          <h4 class="blog-post-title">${escapeHtml(post.title)}</h4>
          <span class="blog-post-date">${escapeHtml(post.date)}</span>
        </div>
        <p class="blog-post-excerpt">${escapeHtml(truncateText(post.content))}</p>
        <div class="blog-post-footer">
          <span class="blog-post-author">— ${escapeHtml(post.author)}</span>
        </div>
      </div>
    `).join('');
  }

  // View individual post as separate page
  window.viewPost = function(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    
    // Save scroll position
    const blogList = document.getElementById('blogPostsList');
    if (blogList) {
      sessionStorage.setItem(SCROLL_POS_KEY, blogList.scrollTop);
    }
    
    // Render post page
    const container = document.getElementById('mainContainer');
    container.innerHTML = `
      <div class="post-page">
        <div class="back-button" onclick="goBackToMain()">← Back to main page</div>
        <div class="paper-document">
          <h1 class="post-title">${escapeHtml(post.title)}</h1>
          <div class="post-meta">📅 ${escapeHtml(post.date)} | ✍️ ${escapeHtml(post.author)}</div>
          <div class="post-content">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
    
    window.location.hash = `post-${id}`;
    window.scrollTo(0, 0);
  };

  window.goBackToMain = function() {
    window.location.href = window.location.pathname;
  };

  function checkHashAndLoad() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#post-')) {
      const id = parseInt(hash.replace('#post-', ''));
      const post = blogPosts.find(p => p.id === id);
      if (post) viewPost(id);
    }
  }

  function setupBlogScroll() {
    const blogList = document.getElementById('blogPostsList');
    const scrollUpBtn = document.getElementById('scrollBlogUp');
    const scrollDownBtn = document.getElementById('scrollBlogDown');
    
    if (scrollUpBtn) {
      scrollUpBtn.addEventListener('click', () => {
        if (blogList) blogList.scrollBy({ top: -200, behavior: 'smooth' });
      });
    }
    
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', () => {
        if (blogList) blogList.scrollBy({ top: 200, behavior: 'smooth' });
      });
    }
    
    // Restore scroll position
    const savedScroll = sessionStorage.getItem(SCROLL_POS_KEY);
    if (savedScroll && blogList) {
      blogList.scrollTop = parseInt(savedScroll);
      sessionStorage.removeItem(SCROLL_POS_KEY);
    }
  }

  // ===== ADMIN CONSOLE (Console-only access) =====
  let adminConsole = null;
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;

  function createAdminConsole() {
    const div = document.createElement('div');
    div.id = 'adminConsole';
    div.className = 'admin-console';
    div.innerHTML = `
      <div class="admin-header" id="adminHeader">
        <span>✧ Admin Console ✧</span>
        <button class="admin-close" id="adminCloseBtn">×</button>
      </div>
      <div class="admin-content">
        <h4>Add New Post</h4>
        <input type="text" id="adminTitle" class="admin-input" placeholder="Title">
        <textarea id="adminContent" class="admin-textarea" placeholder="Content..."></textarea>
        <input type="text" id="adminAuthor" class="admin-input" placeholder="Author" value="Savi">
        <button id="adminPublishBtn" class="admin-btn">✦ Publish Post ✦</button>
        
        <h4 style="margin-top: 15px;">Delete Post</h4>
        <select id="adminPostSelect" class="admin-select">
          <option value="">Select a post to delete...</option>
        </select>
        <button id="adminDeleteBtn" class="admin-btn admin-delete-btn">🗑️ Delete Selected Post</button>
      </div>
    `;
    document.body.appendChild(div);
    
    // Setup drag functionality
    const header = div.querySelector('#adminHeader');
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    
    function startDrag(e) {
      isDragging = true;
      dragOffsetX = e.clientX - div.offsetLeft;
      dragOffsetY = e.clientY - div.offsetTop;
      div.style.position = 'fixed';
    }
    
    function onDrag(e) {
      if (!isDragging) return;
      div.style.left = `${e.clientX - dragOffsetX}px`;
      div.style.top = `${e.clientY - dragOffsetY}px`;
      div.style.right = 'auto';
      div.style.bottom = 'auto';
    }
    
    function stopDrag() {
      isDragging = false;
    }
    
    return div;
  }

  function updatePostSelect() {
    const select = document.getElementById('adminPostSelect');
    if (select) {
      select.innerHTML = '<option value="">Select a post to delete...</option>' + 
        blogPosts.map(post => `<option value="${post.id}">${escapeHtml(post.title)}</option>`).join('');
    }
  }

  function initAdminConsole() {
    adminConsole = createAdminConsole();
    
    // Close button
    document.getElementById('adminCloseBtn')?.addEventListener('click', () => {
      adminConsole.classList.remove('active');
    });
    
    // Publish button
    document.getElementById('adminPublishBtn')?.addEventListener('click', () => {
      const title = document.getElementById('adminTitle');
      const content = document.getElementById('adminContent');
      const author = document.getElementById('adminAuthor');
      
      if (!title.value.trim() || !content.value.trim()) {
        alert('Please enter both a title and content.');
        return;
      }
      
      const newPost = {
        id: Date.now(),
        title: title.value.trim(),
        content: content.value.trim(),
        author: author.value.trim() || 'Savi',
        date: new Date().toLocaleString()
      };
      blogPosts.unshift(newPost);
      saveBlogPosts();
      renderBlogPosts();
      updatePostSelect();
      
      title.value = '';
      content.value = '';
      author.value = 'Savi';
      
      alert('Post published successfully!');
    });
    
    // Delete button
    document.getElementById('adminDeleteBtn')?.addEventListener('click', () => {
      const select = document.getElementById('adminPostSelect');
      const postId = parseInt(select.value);
      if (!postId) {
        alert('Please select a post to delete.');
        return;
      }
      
      if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        blogPosts = blogPosts.filter(post => post.id !== postId);
        saveBlogPosts();
        renderBlogPosts();
        updatePostSelect();
        alert('Post deleted successfully!');
      }
    });
  }

  // Expose admin console toggle to window (console only)
  window.showAdminConsole = function() {
    if (!adminConsole) initAdminConsole();
    adminConsole.classList.add('active');
    updatePostSelect();
  };
  
  window.hideAdminConsole = function() {
    if (adminConsole) adminConsole.classList.remove('active');
  };

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    renderBlogPosts();
    setupBlogScroll();
    initAdminConsole();
    checkHashAndLoad();
    
    // Console instructions
    console.log('%c✧ Hello there, Curious Traveller~ ✧', 'color: #e0c48b; font-size: 14px; font-weight: bold;');
    console.log('%cYou are quite the nosy one, are you not?', 'color: #c7aa6e; font-size: 12px;');
    console.log('%cSorry to disappoint you - you will find nothing here other than the warnings I have chosen to ignore.', 'color: #c7aa6e; font-size: 12px;');
    console.log('%cSo do not worry about all the errors you are seeing here, I have already seen them! -Savi', 'color: #888; font-size: 11px;');
  });
})();