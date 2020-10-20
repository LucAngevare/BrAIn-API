const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const Imap = require('imap')
require('dotenv').config()
const inspect = require('util').inspect;
var fs = require('fs'), fileStream;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//FIXME: Not authorized with 2fa?
app.post('/email/get/unseen', function(req, res) {
  const imap = new Imap({
    user: req.body.username || process.env.MAIL_USERNAME,
    password: req.body.password || process.env.MAIL_PASSWORD,
    host: req.body.mail_host || process.env.MAIL_IMAP_HOST,
    port: req.body.mail_port || 993,
    tls: true,
    debug: (debug) => {
      console.log(debug)
    }
  })
  console.log({ username: req.body.username || process.env.MAIL_USERNAME, password: req.body.password || process.env.MAIL_PASSWORD })

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  openInbox(function(err, box) {
    if (err) throw err;
    imap.search([ 'UNSEEN' ], function(err, results) {
      if (err) throw err;
      var f = imap.fetch(results, { bodies: '' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          console.log(prefix + 'Body');
          stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        res.json({ messages: f, dateOfRetrieval: Date.now(), username: imap["user"], mailHost: imap["host"] })
        imap.end();
      });
    });
  });
})
