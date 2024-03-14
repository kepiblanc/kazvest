var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const nodemailer = require('nodemailer');

/**
 * Sends an email with the provided HTML content.
 * 
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} htmlContent - HTML string to be sent as email content.
 */
async function sendEmailWithHtml(to, subject, htmlContent, from) {
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'olatunde.oladunni.dev@gmail.com',
        pass: 'nlufddnnrlencrcs',
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: from, // Sender address
        to: to, // List of receivers
        subject: subject, // Subject line
        html: htmlContent, // HTML body content
    });

    console.log("Message sent: %s", info.messageId);
}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/process-application', async (req, res) => {

  const body = 
    `<p><b>Applicant Name: ${req.body.applicant_name}</b></p>
    <p><b>Applicant Phone: ${req.body.applicant_phone}</b></p>
    <p>${req.body.applicant_message}</p>`

  const subject = `Application for investment/funding from ${req.body.applicant_name}`;

  sendEmailWithHtml('qandagamesmail@gmail.com,parkerkapital@mail.com', subject, body, req.body.applicant_email)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
