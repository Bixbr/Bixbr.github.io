(function(){
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    
    function setTheme(dark) {
        document.body.classList.toggle('dark', dark);
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    
    themeToggle.checked = isDark;
    setTheme(isDark);
    themeToggle.addEventListener('change', e => setTheme(e.target.checked));
})();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const taglines = [
        "Major Arch user",
        "Full-time Arch user, part-time Androider",
        "The sun never sets on the British Empire",
        "#MakeBattlefront3, spread the word!",
        "Yes this is my discord profile; It's a blue oreo, nothing else",
        "Direct cause of having too much time on my hands",
        "I'm a Tory, Get over it."
    ];
    const taglineElem = document.getElementById('animated-tagline');
    let taglineIndex = 0, charIndex = 0, isErasing = false;
    
    function typeTagline() {
        const line = taglines[taglineIndex];
        if (!isErasing) {
            taglineElem.textContent = line.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex < line.length) setTimeout(typeTagline, 50);
            else setTimeout(() => { isErasing = true; typeTagline(); }, 1500);
        } else {
            taglineElem.textContent = line.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex > 0) setTimeout(typeTagline, 25);
            else {
                isErasing = false;
                taglineIndex = (taglineIndex + 1) % taglines.length;
                setTimeout(typeTagline, 700);
            }
        }
    }
    if (taglineElem) typeTagline();

    const code = [
        "function introduceMyself() {",
        "  const me = {",
        '    name: \"Bix\",',
        '    role: \"Side character\",',
        '    skills: [\"Colonising\", \"Arch\", \"rizz\"],',
        '    interests: [\"Gaming\", \"Coding\"],',
        '    currentlyLearning: \"Javascript!\"',
        "  };",
        '  console.log(\"Hello World! I\'m \" + me.name);',
        "  return me;",
        "}"
    ];
    const codeElem = document.getElementById('about-code');
    if (codeElem) {
        codeElem.innerHTML = "";
        let i = 0;
        function typeLine() {
            if (i < code.length) {
                codeElem.innerHTML += code[i++] + "<br/>";
                setTimeout(typeLine, 100);
            }
        }
        setTimeout(typeLine, 500);
    }

    const revealElems = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealElems.forEach(e => obs.observe(e));

    const skillSection = document.getElementById('skills');
    if (skillSection) {
        let triggered = false;
        const bars = skillSection.querySelectorAll('.bar-fill');
        function animateBars() {
            bars.forEach(bar => {
                const pct = bar.getAttribute('data-width');
                bar.style.width = pct + '%';
            });
        }
        const barObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !triggered) {
                    animateBars();
                    triggered = true;
                }
            });
        }, { threshold: 0.2 });
        barObs.observe(skillSection);
    }
});