document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.case-study__nav__link');
    const mainNav = document.querySelector('.navigation');
    const nav = document.querySelector('.case-study__nav');
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    const menuText = menuIcon.querySelector('p'); // Assuming there's a <p> inside .menu-icon

    const mainNavTop = mainNav.offsetTop;
    const buffer = 2; // 2 pixels of overlap
    let navTop;

    const sections = Array.from(navLinks).map(link => 
        document.querySelector(link.querySelector('a').getAttribute('href'))
    );

    function calculateNavTop() {
        navTop = nav.offsetTop - mainNav.offsetHeight;
    }

    function setActiveLink() {
        const scrollPosition = window.scrollY ;
        const offset = mainNav.offsetHeight + nav.offsetHeight;

        sections.forEach((section, index) => {
            if (section) {
                const sectionTop = section.offsetTop - offset;
                const sectionHeight = section.clientHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLinks[index].classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Make main nav sticky
        if (scrollPosition > mainNavTop) {
            mainNav.classList.add('sticky');
            document.body.style.paddingTop = mainNav.offsetHeight + 'px';
        } else {
            mainNav.classList.remove('sticky');
            document.body.style.paddingTop = '0';
        }

        // Make case study nav sticky
        if (scrollPosition > navTop - buffer) {
            nav.classList.add('sticky');
            nav.style.top = (mainNav.offsetHeight - buffer) + 'px';
        } else {
            nav.classList.remove('sticky');
            nav.style.top = '';
        }

        setActiveLink();
    });

    window.addEventListener('load', calculateNavTop);
    window.addEventListener('resize', calculateNavTop);

    // Smooth scroll to section with offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.querySelector('a').getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const offset = mainNav.offsetHeight + nav.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Menu toggle functionality
    menuIcon.addEventListener('click', function() {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            menuText.textContent = 'CLOSE';
        } else {
            menuText.textContent = 'MENU';
        }
    });
});