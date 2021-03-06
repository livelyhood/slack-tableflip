var bodyParser = require('body-parser'),
    express = require('express'),
    flip = require('flip'),
    request = require('request'),

    argv = require('minimist')(process.argv.slice(2), {
      default: {
        token: process.env.TOKEN,
        webhook: process.env.WEBHOOK,
        norage: false,
        port: 3000
      }
    }),

    app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/health', function (req, res) {
  res.json({ wow: 'such health' });
});

app.post('/tableflip', function (req, res) {
  var channel, text, payload;

  if (req.body.token !== argv.token) {
    return res.status(401).send({ success: false, error: 'Invalid token.' });
  }

  channel = req.body.channel_name === 'directmessage' ?
    req.body.channel_id : '#' + req.body.channel_name;

  text = req.body.text ? flip(req.body.text) : '┻━┻';

  payload = {
    channel: channel,
    text: '(╯°□°）╯︵ ' + text,
    icon_emoji: ':rage1:'
  };

  if (argv.norage) {
    delete payload.icon_emoji;
  }

  request.post({
    url: argv.webhook,
    form: { payload: JSON.stringify(payload) }
  }, function (err, resp, body) {
    if (err) {
      return res.status(500).send({ success: false, error: err.message });
    }

    res.end();
  });
});

app.listen(argv.port);
