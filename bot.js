const math = require('mathjs');
const limitedEval = math.eval
// Limiting eval functions for security issues
// Source: http://mathjs.org/docs/expressions/security.html
math.import({
  'import': function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'eval': function () { throw new Error('Function eval is disabled') },
  'parse': function () { throw new Error('Function parse is disabled') },
  'simplify': function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }
}, { override: true })

const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('inline_query', (msg) => {
  const query = msg.query;
  let resultValue = limitedEval(query)
  const results = [
    {
      type: 'article',
      id: '0',
      title: 'Inline Calculator Bot',
      description: query,
      input_message_content: {message_text: query + ' = ' + resultValue}
    }
  ]
  bot.answerInlineQuery(msg.id, JSON.stringify(results)).then(() => {});
});

module.exports = bot;
