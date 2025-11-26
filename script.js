// Dark mode toggle
(function(){
    const themeToggle = document.getElementById('theme-toggle');
    function setTheme(dark) {
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    themeToggle.checked = localStorage.getItem('theme') === 'dark';
    setTheme(themeToggle.checked);
    themeToggle.addEventListener('change', e => setTheme(e.target.checked));
})();

// Current year in footer
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = (new Date()).getFullYear();

    // Hero tagline animation
    const taglines = [
        "Major Arch user",
        "Full-time Arch user, part-time Androider",
        "The sun never sets on the British Empire",
        "#MakeBattlefront3, spread the word!",
        "Yes this is my discord profile; It's a blue oreo, nothing else",
        "Direct cause of having too much time on my hands"
        "I'm a Tory, Get over it."
    ];
    const taglineElem = document.getElementById('animated-tagline');
    let taglineIndex = 0, charIndex = 0, isErasing = false;
    function typeTagline() {
        const line = taglines[taglineIndex];
        if (!isErasing) {
            taglineElem.textContent = line.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex < line.length) setTimeout(typeTagline, 56);
            else setTimeout(()=>{isErasing=true;typeTagline()}, 1500);
        } else {
            taglineElem.textContent = line.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex > 0) setTimeout(typeTagline, 30);
            else { isErasing=false; taglineIndex=(taglineIndex+1)%taglines.length; setTimeout(typeTagline, 700);}
        }
    }
    if(taglineElem) typeTagline();

    // About code animation
    const code = [
        "function introduceMyself() {",
                          "  const me = {",
                          '    name: "Bix",',
                          '    role: "Side character",',
                          '    skills: ["Colonising", "Arch", "rizz"],',
                          '    interests: ["Gaming", "Coding"],',
                          '    currentlyLearning: "Javascript!"',
                          "  };",
                          '  console.log("Hello World! I\'m " + me.name);',
                          "  return me;",
                          "}"
    ];
    const codeElem = document.getElementById('about-code');
    if(codeElem) {
        codeElem.innerHTML = "";
        let i = 0;
        function typeLine() {
            if(i < code.length) {
                codeElem.innerHTML += code[i++] + "<br/>";
                setTimeout(typeLine, 120);
            }
        }
        setTimeout(typeLine, 500);
    }

    // Reveal on scroll
    const revealElems = document.querySelectorAll('.fade-in');
    const obs = new window.IntersectionObserver(entries => {
        for(const entry of entries) {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        }
    }, { threshold: 0.13 });
    revealElems.forEach(e=>obs.observe(e));

    // Animate skill bars when skills section comes into view
    const skillSection = document.getElementById('skills');
    if(skillSection) {
        let triggered = false;
        const bars = skillSection.querySelectorAll('.bar-fill');
        function animateBars() {
            bars.forEach(bar=>{
                const pct = bar.getAttribute('data-width');
                bar.style.width = pct + "%";
            });
        }
        const barObs = new IntersectionObserver(entries=>{
            for(const e of entries) {if(e.isIntersecting && !triggered) { animateBars(); triggered=true; } }
        },{threshold:0.25});
        barObs.observe(skillSection);
    }
});
