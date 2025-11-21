// Typewriter effect
document.addEventListener('DOMContentLoaded', function() {
    const mainTitle = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');
    
    // Initial state
    mainTitle.textContent = '';
    subtitle.textContent = '';
    mainTitle.classList.add('typing');
    
    // Type "Greetings." character by character
    const greetingText = "Greetings.";
    let i = 0;
    
    function typeGreeting() {
        if (i < greetingText.length) {
            mainTitle.textContent += greetingText.charAt(i);
            i++;
            setTimeout(typeGreeting, 150);
        } else {
            // Finished typing "Greetings."
            // Keep caret blinking for 2 seconds
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
    
    const subtitleText = "You've been invited!";
    let j = 0;
    
    function typeSubtitle() {
        if (j < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(j);
            j++;
            setTimeout(typeSubtitle, 100);
        } else {
            // Finished typing subtitle, keep caret blinking
            subtitle.classList.remove('typing');
            subtitle.classList.add('complete');
        }
    }
    
    // Start the typewriter effect
    setTimeout(typeGreeting, 500);
});

// Login functionality
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('login-message');
    
    // Check credentials (in a real application, this would be server-side)
    if (username === 'archive' && password === 'celebration2023') {
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

// Game button passwords
const buttonPasswords = {
    // Game 1 passwords
    'memory1': 'memory1',
    'nostalgia': 'nostalgia', 
    'archive23': 'archive23',
    'secret4': 'secret4',
    'hidden5': 'hidden5',
    'final6': 'final6',
    
    // Game 2 passwords
    'archive1': 'archive1',
    'archive2': 'archive2',
    'archive3': 'archive3',
    'archive4': 'archive4',
    'archive5': 'archive5',
    'archive6': 'archive6',
    'archive7': 'archive7',
    'archive8': 'archive8',
    'archive9': 'archive9',
    'archive10': 'archive10'
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
    }
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