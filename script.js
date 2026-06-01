(function() {
  // ----- PHRASE LIBRARY -----
  const PHRASES = [
    "THE WORLD IS NOT BEAUTIFUL, THEREFORE, IT IS.", "SOCIETY? DON'T YOU MEAN YOURSELF?", "GOD, I ASK YOU, IS NON-RESISTANCE A CRIME?",
    "STRUGGLING OUT OF THE EGG, THE EGG IS THE WORLD.", "✦I AM WHO I AM.✦", "O FETUS, O FETUS, WHY DO YOU SQUIRM?",
    "BUT A DREAM WITHIN A DREAM?", "MY COWARDLY PRIDE AND HAUGHTY SHAME.", "✦WHAT AM I?✦","✦","*","||",
    "✦WHAT IS ESSENTIAL IS INVISIBLE.✦", "I'M GONNA MAKE IT BIG SOMEDAY.", "NOT PAST, NOT FUTURE, ONLY NOW.", "IT IS WHERE IT IS.",
    "THE ONE AND ONLY", "ONLY YOURSELF, YOU OWN FATE.", "WELCOME CHANGE, DON'T FEAR IT.", "THIS MOMENT IS ALL THAT MATTERS.",
    "✦THE PLAY IS THE TRAGEDY.✦", "IT IS WHAT IT IS.", "1999","YOU HAVE TO MAKE YOUR OWN WAY.",
    "OH DEAR! I SHALL BE LATE!", "HOPE CANNOT BE ELUDED FOREVER.","✦ENTER YE, STRAIT IS THE GATE.✦"
  ];

  // SERIF-ONLY font classes for background text (removed non-serif options)
  const FONT_CLASSES = ['ft-serif', 'ft-playfair'];
  const SIZE_CLASSES = ['size-sm', 'size-md', 'size-lg', 'size-xl', 'size-xxl'];
  const BLUR_CLASSES = ['clear', 'blur-light', 'blur-strong'];
  const COLOR_CLASSES = ['orange-soft', 'orange-bright', 'orange-deep', 'orange-pale', 'orange-rust'];
  const SHAPE_TYPES = ['shape-circle', 'shape-square', 'shape-triangle', 'shape-diamond', 'shape-ring', 'shape-hexagon'];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomRange = (min, max) => min + Math.random() * (max - min);

  // Get or create stylesheet for dynamic animations
  let styleSheet = document.styleSheets[0];
  if (!styleSheet) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    styleSheet = style.sheet;
  }

  // ----- FLOATING TEXTS (SERIF ONLY, no snapping) -----
  const textRows = [1, 2, 3, 4, 5].map(i => document.getElementById(`textRow${i}`));
  
  const getRandomStyles = () => `${randomItem(FONT_CLASSES)} ${randomItem(SIZE_CLASSES)} ${randomItem(BLUR_CLASSES)} ${randomItem(COLOR_CLASSES)}`;
  const getRandomVerticalPos = () => 5 + Math.random() * 85;
  const getRandomDrift = () => ({ 
    direction: Math.random() > 0.5 ? 1 : -1, 
    duration: 60 + Math.random() * 90,
    distance: 20 + Math.random() * 40
  });

  const activeAnimations = new Map();

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
        if (styleSheet.cssRules[i] && styleSheet.cssRules[i].name && styleSheet.cssRules[i].name.startsWith(`drift_${id}_`)) {
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
    
    activeAnimations.set(id, animName);
    
    setTimeout(() => {
      if (span) span.style.opacity = '1';
    }, 10);
  };

  textRows.forEach((row, idx) => {
    setTimeout(() => {
      updateTextRow(row, idx);
    }, idx * 500);
    
    setInterval(() => {
      updateTextRow(row, idx);
    }, 18000 + Math.random() * 10000);
  });

  // ----- FLOATING SHAPES -----
  const shapesContainer = document.getElementById('shapesContainer');
  
  const createShape = () => {
    const type = randomItem(SHAPE_TYPES);
    const shape = document.createElement('div');
    shape.className = `shape ${type}`;
    const size = randomRange(20, 85);
    
    if (type === 'shape-triangle') {
      const tw = randomRange(15, 40);
      const th = randomRange(25, 65);
      shape.style.setProperty('--tw', `${tw}px`);
      shape.style.setProperty('--th', `${th}px`);
    } else {
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
    }
    
    shape.style.left = `${randomRange(0, 92)}%`;
    shape.style.top = `${randomRange(0, 88)}%`;
    shape.style.opacity = randomRange(0.25, 0.55);
    
    const durX = randomRange(20, 40);
    const durY = randomRange(20, 40);
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
      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        if (styleSheet.cssRules[i] && styleSheet.cssRules[i].name && styleSheet.cssRules[i].name.startsWith('shapeFloat_')) {
          if (styleSheet.cssRules.length > 100) {
            styleSheet.deleteRule(i);
          }
        }
      }
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch(e) {
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    
    shape.style.animation = `${animName} ${randomRange(durX, durY)}s ease-in-out infinite`;
    shape.style.animationDelay = `${randomRange(0, 10)}s`;
    if (Math.random() > 0.85) shape.style.filter = `blur(${randomRange(0.5, 1.5)}px)`;
    
    shapesContainer.appendChild(shape);
    
    const lifespan = (durX + durY) / 2 * 1000 + randomRange(15000, 30000);
    setTimeout(() => { 
      if (shape.parentNode) { 
        shape.remove(); 
        createShape(); 
      } 
    }, lifespan);
  };

  const shapeCount = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < shapeCount; i++) {
    setTimeout(() => createShape(), i * 800);
  }

  // ----- IMAGE PLACEHOLDER HANDLERS -----
  const aboutImage = document.getElementById('aboutImagePlaceholder');
  const paperImage = document.getElementById('paperImagePlaceholder');
  
  if (aboutImage) {
    aboutImage.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            aboutImage.style.background = `url(${event.target.result}) center/cover`;
            aboutImage.style.backgroundRepeat = 'no-repeat';
            aboutImage.innerHTML = '';
            aboutImage.style.border = '2px solid #e0c48b';
            aboutImage.classList.add('has-image');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }
  
  if (paperImage) {
    paperImage.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            paperImage.style.background = `url(${event.target.result}) center/cover`;
            paperImage.style.backgroundSize = 'cover';
            paperImage.innerHTML = '';
            paperImage.style.border = '2px solid #b8860b';
            paperImage.classList.add('has-image');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }
})();