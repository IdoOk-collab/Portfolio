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
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    });
  });

  // Stock form submission
  const stockForm = document.getElementById('stockForm');
  const stockDataDiv = document.getElementById('stockData');

  stockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const stockSymbol = stockForm.stockSymbol.value.trim();

    // Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
    const apiKey = 'PFRXJUPUUFY3KNWF';
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=5min&apikey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // Process the data to extract the latest price
      const timeSeries = data['Time Series (5min)'];
      if (!timeSeries) throw new Error('Invalid data format');

      const latestTimestamp = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestTimestamp];
      const price = latestData['4. close']; // or '1. open' for the closing price

      stockDataDiv.innerHTML = `<p>The current price of ${stockSymbol} is $${price}</p>`;
    } catch (error) {
      stockDataDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
  });
});