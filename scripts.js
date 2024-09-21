document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('nav ul li a');
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    const toggleText = document.getElementById('toggle-text'); // Assuming you have an element for mode text

    // Check for previously saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        toggle.checked = savedTheme === 'dark-mode';
        if (toggleText) {
            toggleText.textContent = savedTheme === 'dark-mode' ? 'Light Mode' : 'Dark Mode';
        }
    }

    // Toggle theme on switch change
    toggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        
        // Update text for light/dark mode switch
        if (body.classList.contains('dark-mode')) {
            if (toggleText) {
                toggleText.textContent = 'Light Mode';
            }
            localStorage.setItem('theme', 'dark-mode');  // Save dark mode preference
        } else {
            if (toggleText) {
                toggleText.textContent = 'Dark Mode';
            }
            localStorage.setItem('theme', 'light-mode');  // Save light mode preference
        }
    });

	document.getElementById('stock-info').innerHTML = 'Please enter a stock symbol to get information.';
	
    // Smooth scrolling for the navigation links
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

        // Validate all fields at once using HTML5 validation
        if (form.checkValidity()) {
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

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
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Stock info form submission
    const stockForm = document.getElementById('stockForm');
    stockForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const stockSymbol = document.getElementById('stockSymbol').value;
        const stockDataDiv = document.getElementById('stockData');
        
        try {
            const response = await fetch(`/api/stock?symbol=${stockSymbol}`);
            
            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            stockDataDiv.innerHTML = `
                <h4>${data.stockName}</h4>
                <p>Current Price: $${data.currentPrice}</p>
                <p>Week Range: ${data.weekRange}</p>
                <p>Year Range: ${data.yearRange}</p>
            `;
        } catch (error) {
            console.error('Fetch error:', error); // Log the error to console
            stockDataDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});
