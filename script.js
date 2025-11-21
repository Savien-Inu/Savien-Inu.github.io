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
    
    // Type "You've been invited" character by character
    const subtitleText = "You've been invited.";
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
document.querySelectorAll('.game-btn').forEach(button => {
    button.addEventListener('click', function() {
        const imageId = this.getAttribute('data-image');
        const imageDisplay = document.getElementById('image-display');
        
        // In a real application, you would display actual images
        // For this demo, we'll create a placeholder
        imageDisplay.innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;background-color:#2a2a2a;color:#f0f0f0;font-size:1.5rem;">[IMAGE: ${imageId}]</div>`;
        imageDisplay.style.display = 'block';
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