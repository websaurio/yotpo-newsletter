var gulp = require('gulp');
var jade = require('gulp-jade');
var inlineCss = require('gulp-inline-css');
var rename = require("gulp-rename");
var nodemailer = require('nodemailer');

gulp.task('jade', function() {
 return gulp.src('./src/main.jade')
            .pipe(jade({ pretty: true }))
            .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/*.jade', './src/style.css'], ['jade', 'inline-css']);
});

gulp.task('inline-css', function() {
  return gulp.src('./build/main.html')
      .pipe(inlineCss())
      .pipe(rename("index.html"))
      .pipe(gulp.dest('./build/'));
});

gulp.task('build', function() {
   return gulp.src('./src/main.jade')
            .pipe(jade({ pretty: true }))
            .pipe(inlineCss())
            .pipe(rename("index.html"))
            .pipe(gulp.dest('./build/'));
});

gulp.task('test', function() {
  var fs = require('fs');

  var transport = nodemailer.createTransport({
    host: "mailtrap.io",
    port: 2525,
    auth: {
      user: "",
      pass: ""
    }
  });

  fs.readFile('./build/index.html', "utf8", function (err, data) {
    if (err) throw err;

    var mailOptions = {
        from: 'Test <tes@test.com>',
        to: 'test@test.com, test@test.com',
        subject: 'Test',
        text: 'Hello world ✔',
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