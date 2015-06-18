/* Email and api key for mandrill */
var EMAIL = ''; // your email
var MANDRILL_API_KEY = '';

/* For mailtrap testing (avoid spam). Not necessary */
var MAILTRAP_USER = '';
var MAILTRAP_PASS = '';

/* Do no touch? */
var gulp = require('gulp');
var jade = require('gulp-jade');
var inlineCss = require('gulp-inline-css');
var rename = require('gulp-rename');
var nodemailer = require('nodemailer');

var mandrill = require('mandrill-api/mandrill');

gulp.task('watch', function() {
  gulp.watch(['./src/*.jade', './src/style.css'], ['build']);
});

gulp.task('build', function() {
   return gulp.src('./src/main.jade')
            .pipe(jade({ pretty: true }))
            .pipe(inlineCss())
            .pipe(rename('index.html'))
            .pipe(gulp.dest('.'));
});

gulp.task('mailtrap', function() {
  var fs = require('fs');

  var transport = nodemailer.createTransport({
    host: 'mailtrap.io',
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS
    }
  });

  fs.readFile('./index.html', 'utf8', function (err, data) {
    if (err) throw err;

    var mailOptions = {
        from: 'Test <tes@test.com>',
        to: 'test@test.com, test@test.com',
        subject: 'Test',
        html: data
    };

    transport.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log('Message sent: ' + info.response);
      }
    });
  });

});

gulp.task('mandrill', function() {
  var fs = require('fs');
  var mandrillClient = new mandrill.Mandrill(MANDRILL_API_KEY);

  fs.readFile('./index.html', 'utf8', function (err, data) {
    if (err) throw err;

    var message = {
      'html': data,
      'subject': 'YOTPO Newsletter',
      'from_email': 'test@test.com',
      'from_name': 'Test',
      'to': [{
        'email': EMAIL,
        'name': 'To name',
        'type': 'to'
      }]
    };

    mandrillClient.messages.send({ 'message': message, 'async': false }, function(result) {
      console.log(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
  });
});