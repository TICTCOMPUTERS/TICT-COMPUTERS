const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Search route
app.get('/search', (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.redirect('/error.html'); // Redirect to an error page if no keyword
  }

  // Redirect to topics-listing.html and pass the keyword as a query parameter
  res.redirect(`/topics-listing.html?keyword=${encodeURIComponent(keyword)}`);
});

// Contact page route
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Topics details page route
app.get('/topics-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'topics-details.html'));
});

// Handle the contact form submission (POST request)
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configure the nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Or use any email service of your choice
    auth: {
      user: 'tictcomputers1995@gmail.com',
      pass: 'cpsp swle zurk lphn', // Use your generated app password here
    },
  });

  // Mail options
  let mailOptions = {
    from: email, // Sender's email
    to: 'tictcomputers1995@gmail.com', // Receiver's email
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.redirect('/contact?status=error'); // Redirect to contact page with error status
    }
    console.log('Email sent:', info.response);
    res.redirect('/contact?status=success'); // Redirect to contact page with success status
  });
});

// Error handling for undefined routes
app.use((req, res) => {
  res.redirect('/404.html'); // Redirect to 404.html for undefined routes
});

// Global error handler for server-side errors
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.redirect('/404.html'); // Redirect to 404.html for server-side errors
});

const http = require('http');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
