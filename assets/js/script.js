/* ======== LÓGICA DE PRECARGA ======== */

// Seleccionamos los elementos del preloader
const preloader = document.getElementById('preloader');
const preloaderProgressBar = document.getElementById('preloader-progress-bar');

// Simulamos un progreso de carga para la barra
// Esto es visual, el ocultamiento real se basa en window.onload
let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 20; // Incremento aleatorio para un efecto más real
    
    // Nos aseguramos de no pasarnos del 90% antes de que la página cargue de verdad
    if (progress > 90) {
        progress = 90;
    }
    
    preloaderProgressBar.style.width = progress + '%';
}, 400); // Actualiza la barra cada 400ms

// El evento 'load' se dispara cuando toda la página y sus recursos han cargado
window.addEventListener('load', () => {
    // 1. Detenemos la simulación de progreso
    clearInterval(interval);
    
    // 2. Llenamos la barra al 100%
    preloaderProgressBar.style.width = '100%';

    // 3. Esperamos un momento para que el usuario vea la barra al 100%
    setTimeout(() => {
        // 4. Agregamos la clase 'hidden' para iniciar la animación de desvanecimiento
        preloader.classList.add('hidden');
    }, 500); // 0.5 segundos de retraso
});

/* ======== LÓGICA DE INDEX.HTML ======== */
document.addEventListener('DOMContentLoaded', function () {

    // Inicialización de AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    // Lógica del menú lateral (sidebar) - sin cambios
    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarButton = document.getElementById('close-sidebar-button');
    menuButton.addEventListener('click', () => sidebar.classList.toggle('active'));
    document.querySelectorAll('.nav-link, .right-column').forEach(element => {
        element.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });

    closeSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('active'); // Simplemente cierra el sidebar
    });

    // Registro del plugin ScrollTrigger de GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Animación de la línea de tiempo vertical (ajustada)
    gsap.to("#timeline-progress", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".right-column", // El disparador ahora es la columna que hace scroll
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Activar puntos de la línea de tiempo al hacer scroll (ajustado)
    const sections = document.querySelectorAll('.section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timeline = document.querySelector('.timeline');
    
    // Función para posicionar los puntos de la línea de tiempo
    function positionTimelineItems() {
        const timelineHeight = timeline.offsetHeight;
        const totalScrollHeight = document.querySelector('.right-column').scrollHeight;

        sections.forEach((section, index) => {
            const timelineItem = timelineItems[index];
            // Calculamos la posición proporcional del punto en la línea de tiempo
            const sectionTop = section.offsetTop;
            const positionRatio = sectionTop / totalScrollHeight;
            const itemTopPosition = positionRatio * timelineHeight;
            
            timelineItem.style.top = `${itemTopPosition}px`;
            
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: self => {
                    if (self.isActive) {
                        timelineItem.classList.add('active');
                    } else {
                        timelineItem.classList.remove('active');
                    }
                }
            });
        });
    }

    // Esperamos a que las imágenes carguen para calcular las alturas correctamente
    window.addEventListener('load', positionTimelineItems);
    
    // Animación de las barras de progreso de habilidades (sin cambios)
    const skillBars = document.querySelectorAll('.progress');
    skillBars.forEach(bar => {
        gsap.fromTo(bar, { width: 0 }, { 
            width: bar.getAttribute('data-progress'),
            duration: 3.0, ease: 'power2.out',
            scrollTrigger: {
                trigger: bar.closest('.skill-item'),
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Inicialización de Swiper.js para la cartera (sin cambios)
    const swiper = new Swiper('.swiper-container', {
        loop: true, pagination: { el: '.swiper-pagination', clickable: true, },
        autoplay: { delay: 3000 }, effect: 'cards', grabCursor: true,
        centeredSlides: true, slidesPerView: 'auto',
        coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true, },
    });

    /* ======== LÓGICA PARA EL MODO OSCURO ======== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const body = document.body;
    const logoPic = document.querySelector('.logo-pic');

    // Función para aplicar el tema guardado
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
            logoPic.setAttribute('src', 'assets/images/logo-rs-2025.webp');  
        } else {
            body.classList.remove('dark-mode');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
            logoPic.setAttribute('src', 'assets/images/logo-rs-2025-dark.webp');
        }
    }

    // Evento de clic para el botón
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Guardar la preferencia en localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
            logoPic.setAttribute('src', 'assets/images/logo-rs-2025.webp');
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
            logoPic.setAttribute('src', 'assets/images/logo-rs-2025-dark.webp');
        }
    });

    // Aplicar el tema guardado cuando la página se carga
    applySavedTheme();

    /* ======== LÓGICA PARA EL BOTÓN DE VOLVER ARRIBA ======== */
    const backToTopBtn = document.getElementById('back-to-top-btn');

    // Función para mostrar/ocultar el botón
    const toggleBackToTopBtn = () => {
        // Si el scroll vertical es mayor a 300px
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    // Función para hacer scroll suave hacia arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // ¡La magia del scroll suave!
        });
    };

    // Escuchar el evento de scroll en la ventana
    window.addEventListener('scroll', toggleBackToTopBtn);

    // Escuchar el evento de clic en el botón
    backToTopBtn.addEventListener('click', scrollToTop);
});