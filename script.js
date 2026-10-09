document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const isDark = savedMode === 'true' || (savedMode === null && prefersDark);
  
  if (isDark) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }
  
  darkModeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);
  });
  
  document.getElementById('year').textContent = new Date().getFullYear();
  
  const taglines = [
    'Major Arch user',
    'Full-time Arch user, part-time Androider',
    'The sun never sets on the British Empire',
    '#MakeBattlefront3, spread the word!',
    'Yes this is my discord profile; It\'s a blue oreo, nothing else',
    'Direct cause of having too much time on my hands',
    'I\'m a Tory, Get over it.'
  ];
  
  const typedText = document.getElementById('typed-text');
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeEffect() {
    const currentTagline = taglines[taglineIndex];
    
    if (!isDeleting) {
      typedText.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentTagline.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      typedText.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        isDeleting = false;
        taglineIndex = (taglineIndex + 1) % taglines.length;
        setTimeout(typeEffect, 500);
        return;
      }
    }
    
    const speed = isDeleting ? 20 : 50;
    setTimeout(typeEffect, speed);
  }
  
  typeEffect();
  
  const codeLines = [
    'function introduceMyself() {',
    '  const me = {',
    '    name: "Bix",',
    '    role: "Side character",',
    '    skills: ["Colonising", "Arch", "rizz"],',
    '    interests: ["Gaming", "Coding"],',
    '    currentlyLearning: "Javascript!"',
    '  };',
    '  console.log("Hello World! I\'m " + me.name);',
    '  return me;',
    '}'
  ];
  
  const codeDisplay = document.getElementById('code-display');
  let codeIndex = 0;
  
  function typeCode() {
    if (codeIndex < codeLines.length) {
      const line = document.createTextNode(codeLines[codeIndex]);
      codeDisplay.appendChild(line);
      const br = document.createElement('br');
      codeDisplay.appendChild(br);
      codeIndex++;
      setTimeout(typeCode, 100);
    }
  }
  
  setTimeout(typeCode, 500);
  
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar');
        bars.forEach(bar => {
          bar.style.width = bar.style.width;
        });
      }
    });
  }, { threshold: 0.1 });
  
  const skillsSection = document.querySelector('.skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
});
