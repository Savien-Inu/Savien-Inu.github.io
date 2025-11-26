// Audio permission system
// why won't browsers let me play music automatically anymore :c
let audioEnabled = false;
let musicStarted = false;
const backgroundMusic = document.getElementById('background-music');
const muteButton = document.getElementById('mute-btn');
const audioPermissionModal = document.getElementById('audio-permission-modal');

// Show audio permission modal on page load and pause typewriter
function showAudioPermission() {
    // Set typewriter container to loading state
    document.querySelector('.typewriter-container').classList.add('loading');
    
    // Wait a moment for the page to load, then show the modal
    setTimeout(() => {
        audioPermissionModal.style.display = 'block';
    }, 500);
}

// Initialize audio permission system
function initializeAudioSystem() {
    // Set up permission button event listeners
    document.getElementById('allow-audio').addEventListener('click', function() {
        audioEnabled = true;
        hideAudioPermissionModal();
        
        // Pre-load and test the audio
        preloadAudio().then(() => {
            console.log('yayyyy they let me play audio! audio system is ready!');
            // Show music player immediately when allowed
            document.querySelector('.music-player').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.music-player').classList.add('visible');
            }, 100);
            
            // Start the typewriter effect after audio decision
            startTypewriter();
        }).catch(error => {
            console.log('Audio preload failed:', error);
            // Start typewriter even if audio fails
            startTypewriter();
        });
    });

document.getElementById('deny-audio').addEventListener('click', function() {
    audioEnabled = false;
        hideAudioPermissionModal();
        console.log('Audio disabled by user');
        
        // Start the typewriter effect after audio decision
        startTypewriter();
    });

    // Set up mute button (only functional if audio is enabled)
    muteButton.addEventListener('click', function() {
        if (!audioEnabled) return;
        
        if (backgroundMusic.muted) {
            // Unmute
            backgroundMusic.muted = false;
            muteButton.textContent = '🔊';
            muteButton.classList.remove('muted');
        } else {
            // Mute
            backgroundMusic.muted = true;
            muteButton.textContent = '🔇';
            muteButton.classList.add('muted');
        }
    });

    // Show permission modal on page load
    showAudioPermission();
}


// Preload audio and handle any errors
function preloadAudio() {
    return new Promise((resolve, reject) => {
        backgroundMusic.volume = 0.3;
        backgroundMusic.load();
        
        if (partyPopperSound) {
            partyPopperSound.volume = 0.5;
            partyPopperSound.load();
        }
        
        let musicLoaded = false;
        let popperLoaded = true; // Default to true if no party popper sound
        
        function checkLoaded() {
            if (musicLoaded && popperLoaded) {
                resolve();
            }
        }
        
        backgroundMusic.addEventListener('canplaythrough', () => {
            musicLoaded = true;
            checkLoaded();
        });
        
        if (partyPopperSound) {
            popperLoaded = false;
            partyPopperSound.addEventListener('canplaythrough', () => {
                popperLoaded = true;
                checkLoaded();
            });
            
            partyPopperSound.addEventListener('error', (error) => {
                console.log('Party popper load error:', error);
                popperLoaded = true; // Continue even if sound effect fails
                checkLoaded();
            });
        }
        
        backgroundMusic.addEventListener('error', (error) => {
            console.log('Background music load error:', error);
            musicLoaded = true; // Continue even if music fails
            checkLoaded();
        });
        
        // Timeout fallback
        setTimeout(() => {
            resolve();
        }, 3000);
    });
}

// Confetti and celebration system
let confettiCanvas = null;
let partyPopperSound = null;
let confettiActive = false;

function initializeConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    partyPopperSound = document.getElementById('party-popper-sound');
    
    if (!confettiCanvas) {
        console.error('Confetti canvas not found!');
        return;
    }
    
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (confettiCanvas) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    });
}

function createConfetti() {
    if (!confettiCanvas || confettiActive) return;
    confettiActive = true;
    
    const ctx = confettiCanvas.getContext('2d');
    const particles = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    
    // how tf do programmers know the math for ts
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
    
    let animationId = null;
    
    // Animation function
    function animateConfetti() {
        if (!confettiCanvas) {
            if (animationId) cancelAnimationFrame(animationId);
            return;
        }
        
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        let particlesAlive = false;
        
        particles.forEach(particle => {
            // Update position
            particle.y += particle.speed;
            particle.x += Math.sin(particle.angle) * 2;
            particle.angle += 0.1;
            particle.rotation += particle.rotationSpeed;
            
            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
            
            // Check if particle is still on screen
            if (particle.y < confettiCanvas.height) {
                particlesAlive = true;
            }
        });
        
        if (particlesAlive) {
            animationId = requestAnimationFrame(animateConfetti);
        } else {
            // All particles are off screen - final cleanup
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiActive = false;
            if (animationId) cancelAnimationFrame(animationId);
            console.log('confetti animation finished. ive killed all the confetti.');
        }
    }
    
    // Start animation
    animationId = requestAnimationFrame(animateConfetti);
    
    // Safety timeout - force cleanup after 10 seconds max
    setTimeout(() => {
        if (confettiActive) {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiActive = false;
            if (animationId) cancelAnimationFrame(animationId);
            console.log('killed all confetti because they existed for too long.');
        }
    }, 10000);
}

function playPartyPopper() {
    if (audioEnabled && partyPopperSound) {
        partyPopperSound.volume = 0.5;
        partyPopperSound.currentTime = 0;
        partyPopperSound.play().catch(error => {
            console.log('Party popper sound failed:', error);
        });
    }
}

function startCelebration() {
    // Play party popper sound
    playPartyPopper();
    
    // Launch confetti
    createConfetti();
    
    // Add celebration effect to music player
    const musicPlayer = document.querySelector('.music-player');
    if (musicPlayer) {
        musicPlayer.classList.add('celebrating');
        
        // Remove celebration class after animation completes
        setTimeout(() => {
            musicPlayer.classList.remove('celebrating');
        }, 1500);
    }
} 
// Start background music (called when typing completes)
function startBackgroundMusic() {
    if (!audioEnabled || musicStarted) return;
    
    backgroundMusic.play().then(() => {
        console.log('OHHHH YES! PLAY THE MUSIC!');
        musicStarted = true;
        muteButton.textContent = '🔊';
        
        // START CELEBRATION!
        startCelebration();
    }).catch(error => {
        console.log('Music play failed:', error);
        // If play fails, show muted state
        muteButton.textContent = '🔇';
        muteButton.classList.add('muted');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeConfetti();
    initializeAudioSystem();
});

function hideAudioPermissionModal() {
    audioPermissionModal.style.display = 'none';
}

// Close audio permission modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === audioPermissionModal) {
        hideAudioPermissionModal();
    }
});

// Typewriter animation function (only starts after audio decision)
// Ts took too long to create. I'm starting to hate Java
function startTypewriter() {
    const mainTitle = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');
    const typewriterContainer = document.querySelector('.typewriter-container');
    
    // Mark container as ready (makes text visible)
    typewriterContainer.classList.remove('loading');
    typewriterContainer.classList.add('ready');
    
    // Initial state
    mainTitle.textContent = '';
    subtitle.textContent = '';
    mainTitle.classList.add('typing');
    
    // Type "Greetings." character by character
    const greetingText = "Greetings";
    let i = 0;
    
    function typeGreeting() {
        if (i < greetingText.length) {
            mainTitle.textContent += greetingText.charAt(i);
            i++;
            setTimeout(typeGreeting, 150);
        } else {
            // Finished typing "Greetings."
            setTimeout(() => {
                // Remove caret from "Greetings."
                mainTitle.classList.remove('typing');
                mainTitle.classList.add('complete');
                
                // Start typing subtitle
                subtitle.classList.add('typing');
                typeSubtitle();
            }, 2000);
        }
    }
    
    // Type "You've been invited" character by character
    const subtitleText = "You've been invited!";
    let j = 0;
    
    function typeSubtitle() {
        if (j < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(j);
            j++;
            setTimeout(typeSubtitle, 100);
        } else {
            // Finished typing subtitle
            subtitle.classList.remove('typing');
            subtitle.classList.add('complete');
            
            // START BACKGROUND MUSIC ONLY IF USER ALLOWED AUDIO
            setTimeout(() => {
                if (audioEnabled) {
                    startBackgroundMusic();
                }
            }, 500);
        }
    }
    
    // Start the typewriter effect
    setTimeout(typeGreeting, 500);
}

// Login functionality
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('login-message');
    
    // too lazy to make a unique user for everyone LOL
    if (username === 'celebrant' && password === '112804') {
        message.textContent = 'Authentication successful!';
        message.style.color = '#006400';
        
        // Show games section after a short delay
        setTimeout(() => {
            document.querySelector('.games-section').style.display = 'flex';
            document.querySelector('.games-section').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    } else {
        message.textContent = 'Invalid credentials. Please wait for celebration day.';
        message.style.color = '#8b0000';
    }
});

// Game selection functionality
document.getElementById('game1-btn').addEventListener('click', function() {
    document.getElementById('game1-options').style.display = 'flex';
    document.getElementById('game2-options').style.display = 'none';
    document.getElementById('image-display').style.display = 'none';
});

document.getElementById('game2-btn').addEventListener('click', function() {
    document.getElementById('game2-options').style.display = 'flex';
    document.getElementById('game1-options').style.display = 'none';
    document.getElementById('image-display').style.display = 'none';
});

// Image display functionality
// Updated image display functionality
document.querySelectorAll('.game-btn').forEach(button => {
    button.addEventListener('click', function() {
        const imagePath = this.getAttribute('data-image');
        const imageDisplay = document.getElementById('image-display');
        
        // Display the actual image
        imageDisplay.innerHTML = `<img src="${imagePath}" alt="Game Image">`;
        imageDisplay.style.display = 'block';
        
        // Scroll to the image if it's not fully visible
        imageDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// Scroll indicator functionality
window.addEventListener('scroll', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// Password protection system
let currentButton = null;
let unlockedButtons = new Set(); // Track which buttons are unlocked

// Password modal elements
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const submitPassword = document.getElementById('submit-password');
const passwordMessage = document.getElementById('password-message');
const closeModal = document.querySelector('.close');
const passwordPrompt = document.getElementById('password-prompt');

// Game button passwords (YOU'RE NOT SUPPOSED TO BE HERE)
const buttonPasswords = {
    // Game 1 passwords
    'memory1': 'Grandma!',
    'nostalgia': 'monica4)', 
    'archive23': 'mortimer&',
    'secret4': 'penn(',
    'hidden5': 'theButler%',
    'final6': '@UncleGrandpa',
    
    // Game 2 passwords (im running out of passwords)
    'archive1': 'minorCharacter1',
    'archive2': 'theMain^',
    'archive3': '$Deuteragonist',
    'archive4': 'novelist+',
    'archive5': 'theAntagonist!',
    'archive6': 'camGuy07',
    'archive7': 'costumeArtist*',
    'archive8': 'lightGuy/01',
    'archive9': '#journalist',
    'archive10': 'explosionBoom.'

    //surely these passwords can't be guessed ahahahahah
};

// Initialize all game buttons as locked
function initializeGameButtons() {
    document.querySelectorAll('.game-btn').forEach(button => {
        button.classList.add('locked');
        button.classList.remove('unlocked');
        
        // Remove any existing event listeners
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-attach event listeners to new button nodes
    document.querySelectorAll('.game-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const buttonId = this.getAttribute('data-password');
            
            console.log('Button clicked:', buttonId, 'Unlocked:', unlockedButtons.has(buttonId));
            
            // If button is already unlocked, show image
            if (unlockedButtons.has(buttonId)) {
                showImage(this);
            } else {
                // Show password modal for locked buttons
                showPasswordModal(this);
            }
        });
    });
}

// Modal functionality
function showPasswordModal(button) {
    currentButton = button;
    const buttonName = button.textContent;
    
    passwordPrompt.textContent = `Please enter the password for "${buttonName}":`;
    passwordInput.value = '';
    passwordMessage.textContent = '';
    passwordModal.style.display = 'block';
    passwordInput.focus();
}

function hidePasswordModal() {
    passwordModal.style.display = 'none';
    currentButton = null;
}

function unlockButton(button) {
    const buttonId = button.getAttribute('data-password');
    unlockedButtons.add(buttonId);
    button.classList.remove('locked');
    button.classList.add('unlocked');
}

function showImage(button) {
    const imagePath = button.getAttribute('data-image');
    const imageDisplay = document.getElementById('image-display');
    
    console.log('Loading image from:', imagePath);
    
    // Clear previous content
    imageDisplay.innerHTML = '';
    
    // Create and configure the image element
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Game Image: ${button.textContent}`;
    
    // Add loading state
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    // Handle image load
    img.onload = function() {
        img.style.opacity = '1';
    };
    
    // Handle image error (if image doesn't exist)
    img.onerror = function() {
        console.error('Failed to load image:', imagePath);
        imageDisplay.innerHTML = `
            <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:#2a2a2a;color:#f0f0f0;font-size:1rem;padding:1rem;">
                <div style="font-size:2rem;margin-bottom:1rem;">⚠️</div>
                <div>Image not found:</div>
                <div style="font-family: 'Cutive Mono', monospace; margin-top: 0.5rem;">${imagePath}</div>
                <div style="margin-top: 1rem; font-size: 0.9rem;">Please check the file path</div>
            </div>
        `;
    };
    
    // Add the image to the display
    imageDisplay.appendChild(img);
    imageDisplay.style.display = 'block';
    imageDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Password submission
submitPassword.addEventListener('click', function() {
    if (!currentButton) return;
    
    const enteredPassword = passwordInput.value;
    const requiredPassword = buttonPasswords[currentButton.getAttribute('data-password')];
    
    if (enteredPassword === requiredPassword) {
        // Correct password
        passwordMessage.textContent = 'Access granted! Button unlocked. Click it again to view the image.';
        passwordMessage.style.color = '#006400';
        
        // Unlock the button
        unlockButton(currentButton);
        
        // Close modal after success - NO IMAGE SHOWN
        setTimeout(() => {
            hidePasswordModal();
            
            // Visual feedback that button is now clickable
            currentButton.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                currentButton.style.animation = '';
            }, 500);
        }, 1500);
    } else {
        // Incorrect password
        passwordMessage.textContent = 'Incorrect password. Please try again.';
        passwordMessage.style.color = '#8b0000';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Close modal when clicking X
closeModal.addEventListener('click', hidePasswordModal);

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === passwordModal) {
        hidePasswordModal();
    }
});

// Allow pressing Enter to submit password
passwordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        submitPassword.click();
    }
});

// Reset all passwords
function resetAllPasswords() {
    unlockedButtons.clear();
    initializeGameButtons();
    // Hide any displayed image
    document.getElementById('image-display').style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game buttons
    initializeGameButtons();
    // blocked out this code because it just blocks the images and was being annoying. might be useful later on tho idk
    /*
    // Add reset button to games section
    const gamesSection = document.querySelector('.games-section .archive-paper');
    if (gamesSection && !gamesSection.querySelector('#reset-passwords-btn')) {
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-passwords-btn';
        resetButton.textContent = 'Reset All Passwords';
        resetButton.style.marginTop = '1rem';
        resetButton.style.backgroundColor = '#8b0000';
        resetButton.addEventListener('click', resetAllPasswords);
        gamesSection.appendChild(resetButton);
    } */
});

// Prevent any default button behavior
document.addEventListener('DOMContentLoaded', function() {
    // Prevent any form submissions that might be causing issues
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
});

// i hate javascript so much