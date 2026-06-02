(function() {
  // ===== PHRASE LIBRARY =====
  const PHRASES = [
   "THE WORLD IS NOT BEAUTIFUL, THEREFORE, IT IS.",
    "SOCIETY? DON'T YOU MEAN YOURSELF?",
    "GOD, I ASK YOU, IS NON-RESISTANCE A CRIME?",
    "STRUGGLING OUT OF THE EGG, THE EGG IS THE WORLD.",
    "O FETUS, O FETUS, WHY DO YOU SQUIRM?",
    "BUT A DREAM WITHIN A DREAM?",
    "MY COWARDLY PRIDE AND HAUGHTY SHAME.",
    "✦ WHAT AM I? ✦",
    "✦ WHAT IS ESSENTIAL IS INVISIBLE. ✦",
    "NOT PAST, NOT FUTURE, ONLY NOW.",
    "ONLY YOURSELF, YOU OWN FATE.",
    "WELCOME CHANGE, DON'T FEAR IT.",
    "THIS MOMENT IS ALL THAT MATTERS.",
    "✦ THE PLAY IS THE TRAGEDY. ✦",
    "IT IS WHAT IT IS. IT IS WHERE IT IS.",
    "1999",
    "YOU HAVE TO MAKE YOUR OWN WAY.",
    "OH DEAR! I SHALL BE LATE!",
    "HOPE CANNOT BE ELUDED FOREVER.",
    "✦ ENTER YE IN STRAIT IS THE GATE. ✦",
    "CAN'T I JUST BE MYSELF?"
  ];

  // Style pools
  const FONT_CLASSES = ['ft-serif', 'ft-playfair'];
  const SIZE_CLASSES = ['size-sm', 'size-md', 'size-lg', 'size-xl', 'size-xxl'];
  const BLUR_CLASSES = ['clear', 'blur-light', 'blur-strong'];
  const COLOR_CLASSES = ['orange-soft', 'orange-bright', 'orange-deep', 'orange-pale', 'orange-rust'];
  
  const SHAPE_TYPES = [
    'shape-circle-hollow', 'shape-square-hollow', 'shape-triangle-hollow', 
    'shape-diamond-hollow', 'shape-ring-hollow', 'shape-hexagon-hollow', 'shape-star-hollow',
    'shape-circle-solid', 'shape-square-solid', 'shape-triangle-solid', 
    'shape-diamond-solid', 'shape-ring-solid', 'shape-hexagon-solid', 'shape-blob-solid', 'shape-star-solid'
  ];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomRange = (min, max) => min + Math.random() * (max - min);
  
  let blogPosts = [];
  let postsLoaded = false;
  
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Simple markdown parser for blog content
  function parseMarkdown(content) {
    if (!content) return '';
    
    let html = content;
    
    // Escape HTML first to prevent injection
    html = escapeHtml(html);
    
    // Images: ![alt](url)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    
    // Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Blockquotes: > text
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Bullet points: - item
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    
    // Fix multiple blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');
    
    // Convert double newlines to paragraphs
    const paragraphs = html.split(/\n\s*\n/);
    if (paragraphs.length > 1) {
      html = paragraphs.map(p => {
        if (p.startsWith('<ul>') || p.startsWith('<blockquote>') || p.startsWith('<img')) {
          return p;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
      }).join('');
    } else {
      html = html.replace(/\n/g, '<br>');
    }
    
    return html;
  }

  function getPlainTextExcerpt(content, maxLength = 120) {
    if (!content) return '';
    let plain = content
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^&gt; /gm, '')
      .replace(/^- /gm, '')
      .replace(/\n/g, ' ');
    if (plain.length <= maxLength) return plain;
    return plain.substring(0, maxLength) + '...';
  }

  // ===== LOAD BLOG POSTS FROM INDIVIDUAL FILES =====
  // This function scans the blog-posts folder and loads all .js files
  async function loadBlogPosts() {
    const container = document.getElementById('blogPostsList');
    
    // Define the list of post files to load
    // You need to manually list your post files here
    // Each file should be in the format: post-1.js, post-2.js, etc.
    const postFiles = [
      'post-1.js'
      // Add more post files here as you create them
    ];
    
    blogPosts = [];
    
    for (const file of postFiles) {
      try {
        const response = await fetch(`blog-posts/${file}`);
        if (response.ok) {
          const scriptText = await response.text();
          // Execute the script to get the post data
          const scriptFunction = new Function(scriptText + '; return BLOG_POST;');
          const post = scriptFunction();
          if (post && post.id) {
            blogPosts.push(post);
          }
        }
      } catch (error) {
        console.warn(`Could not load ${file}:`, error);
      }
    }
    
    // Sort posts by ID (newest first - assuming higher ID = newer)
    blogPosts.sort((a, b) => b.id - a.id);
    
    postsLoaded = true;
    renderBlogPosts();
  }
  
  // Alternative: Dynamically detect post files via a manifest
  // You can also create a manifest.json file in the blog-posts folder
  async function loadPostsFromManifest() {
    try {
      const response = await fetch('blog-posts/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        const postFiles = manifest.posts;
        
        blogPosts = [];
        
        for (const file of postFiles) {
          try {
            const postResponse = await fetch(`blog-posts/${file}`);
            if (postResponse.ok) {
              const scriptText = await postResponse.text();
              const scriptFunction = new Function(scriptText + '; return BLOG_POST;');
              const post = scriptFunction();
              if (post && post.id) {
                blogPosts.push(post);
              }
            }
          } catch (error) {
            console.warn(`Could not load ${file}:`, error);
          }
        }
        
        blogPosts.sort((a, b) => b.id - a.id);
        postsLoaded = true;
        renderBlogPosts();
      } else {
        // Fallback to manual list
        await loadBlogPosts();
      }
    } catch (error) {
      console.warn('Could not load manifest, using manual list:', error);
      await loadBlogPosts();
    }
  }

  function renderBlogPosts() {
    const container = document.getElementById('blogPostsList');
    if (!container) return;
    
    if (!postsLoaded) {
      container.innerHTML = '<div class="empty-blog-message">✧ loading posts... ✧</div>';
      return;
    }
    
    if (blogPosts.length === 0) {
      container.innerHTML = '<div class="empty-blog-message">✧ no entries yet — check back later ✧</div>';
      return;
    }
    
    container.innerHTML = blogPosts.map(post => {
      const plainExcerpt = getPlainTextExcerpt(post.content, 120);
      return `
      <div class="blog-post" onclick="viewPost(${post.id})">
        <div class="blog-post-header">
          <h4 class="blog-post-title">${escapeHtml(post.title)}</h4>
          <span class="blog-post-date">${escapeHtml(post.date)}</span>
        </div>
        <p class="blog-post-excerpt">${escapeHtml(plainExcerpt)}</p>
        <div class="blog-post-footer">
          <span class="blog-post-author">— ${escapeHtml(post.author)}</span>
        </div>
      </div>
    `}).join('');
  }

  window.viewPost = function(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    
    const blogList = document.getElementById('blogPostsList');
    if (blogList) {
      sessionStorage.setItem('blogScrollPos', blogList.scrollTop);
    }
    
    const htmlContent = parseMarkdown(post.content);
    
    const container = document.getElementById('mainContainer');
    container.innerHTML = `
      <div class="post-page">
        <div class="back-button" onclick="goBackToMain()">← Back to main page</div>
        <div class="paper-document">
          <h1 class="post-title">${escapeHtml(post.title)}</h1>
          <div class="post-meta">📅 ${escapeHtml(post.date)} | ✍️ ${escapeHtml(post.author)}</div>
          <div class="post-content">${htmlContent}</div>
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
    
    const savedScroll = sessionStorage.getItem('blogScrollPos');
    if (savedScroll && blogList) {
      blogList.scrollTop = parseInt(savedScroll);
      sessionStorage.removeItem('blogScrollPos');
    }
  }

  // ===== DYNAMIC STYLESHEET =====
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
    
    const isStar = type.includes('star');
    const isTriangle = type.includes('triangle');
    
    if (isStar) {
      const starSize = randomRange(20, 55);
      shape.style.fontSize = `${starSize}px`;
      shape.style.width = 'auto';
      shape.style.height = 'auto';
      shape.style.display = 'inline-flex';
      shape.style.alignItems = 'center';
      shape.style.justifyContent = 'center';
      
      if (type === 'shape-star-solid') {
        const starSpan = document.createElement('span');
        starSpan.textContent = '✦';
        starSpan.style.fontSize = 'inherit';
        starSpan.style.color = `rgba(227, 165, 67, ${randomRange(0.5, 0.8)})`;
        starSpan.style.textShadow = `0 0 ${randomRange(4, 10)}px rgba(227, 165, 67, 0.4)`;
        shape.appendChild(starSpan);
        shape.style.background = 'transparent';
        shape.style.border = 'none';
      }
    } else if (isTriangle) {
      const triW = randomRange(15, 45);
      const triH = randomRange(25, 70);
      shape.style.setProperty('--tw', `${triW}px`);
      shape.style.setProperty('--th', `${triH}px`);
    } else {
      const size = randomRange(20, 90);
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
    }
    
    shape.style.left = `${randomRange(0, 92)}%`;
    shape.style.top = `${randomRange(0, 88)}%`;
    
    const baseOpacity = type.includes('solid') ? randomRange(0.35, 0.65) : randomRange(0.25, 0.55);
    shape.style.opacity = baseOpacity;
    
    const moveX = randomRange(-40, 40);
    const moveY = randomRange(-35, 35);
    const rot = randomRange(-15, 15);
    const duration = randomRange(15, 40);
    
    const animName = `shapeFloat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const keyframes = `@keyframes ${animName} { 
      0% { transform: translate(0,0) rotate(0deg); } 
      50% { transform: translate(${moveX}px, ${moveY}px) rotate(${rot}deg); } 
      100% { transform: translate(0,0) rotate(0deg); } 
    }`;
    
    try {
      if (styleSheet.cssRules.length > 200) {
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
    
    shape.style.animation = `${animName} ${duration}s ease-in-out infinite`;
    shape.style.animationDelay = `${randomRange(0, 12)}s`;
    
    if (Math.random() > 0.7) {
      const blurAmount = type.includes('solid') ? randomRange(0.5, 1.5) : randomRange(0.8, 2.5);
      shape.style.filter = `blur(${blurAmount}px)`;
    }
    
    shapesContainer.appendChild(shape);
    
    const lifespan = duration * 1000 + randomRange(15000, 35000);
    setTimeout(() => { 
      if (shape.parentNode) { 
        shape.remove(); 
        createShape(); 
      } 
    }, lifespan);
  };

  const shapeCount = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < shapeCount; i++) {
    setTimeout(() => createShape(), i * 600);
  }

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    loadPostsFromManifest();
    setupBlogScroll();
    
    // Small delay to ensure posts are loaded before checking hash
    setTimeout(() => {
      checkHashAndLoad();
    }, 500);
  });
})();