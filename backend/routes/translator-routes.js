const captcha = require('../controllers/reCaptcha')
const Translator = require('../controllers/translator.js')

module.exports = function (app) {
  const translator = new Translator()

  app.route('/translator/translate').post(async (req, res) => {
    const isNotBot = await captcha.verify(req.body)
    if (!isNotBot.success)
      return res.json({
        error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
      })

    const text = req.body.text
    const locale = req.body.locale
    const options = ['american-to-british', 'british-to-american']

    if (text === undefined || !locale)
      return res.json({ error: 'Required field(s) missing' })
    if (text === '') return res.json({ error: 'No text to translate' })
    if (!options.includes(locale))
      return res.json({ error: 'Invalid value for locale field' })

    if (!/^[\w\s.!?-]+$/i.test(text))
      return res.json({ error: `Invalid text, some characters not allowed` })

    const target = locale === 'american-to-british' ? 'UK' : 'US'
    const translation = translator.translate(text, target)

    const highlighted = translator.highlight(text, translation)

    res.json({
      text: text,
      translation:
        text !== translation ? highlighted : 'Everything looks good to me!',
    })
  })
}
