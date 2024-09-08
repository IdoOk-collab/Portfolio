document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('nav ul li a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form validation
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (name && email && message) {
            formMessage.textContent = 'Thank you for your message!';
            form.reset();
        } else {
            formMessage.textContent = 'Please fill out all fields.';
        }
    });

    // Collapsible functionality
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
});
