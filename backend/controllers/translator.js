const americanOnly = require('./american-only.js')
const americanToBritishSpelling = require('./american-to-british-spelling.js')
const americanToBritishTitles = require('./american-to-british-titles.js')
const britishOnly = require('./british-only.js')

class Translator {
  splitWords(sentence) {
    return sentence.trim().split(/\s|(?=')/)
  }

  getSingleUSWords(sentence) {
    const words = this.splitWords(sentence)

    const step1 = words.map((word) => americanOnly[word] || word)
    const step2 = step1.map((word) => americanToBritishSpelling[word] || word)
    const step3 = step2.map((word) => americanToBritishTitles[word] || word)

    return step3.join(' ').replace(/\s'/g, `'`)
  }

  getMultipleWords(sentence, target, capitalLetters) {
    let newSentence = sentence

    const dictionary = target === 'UK' ? americanOnly : britishOnly
    const keys = Object.keys(dictionary)

    const check = `${newSentence}`

    for (let i = 0; i < keys.length; i++) {
      if (newSentence.includes(keys[i])) {
        const words = keys[i].split(' ')
        const oldText = words.length
        const newText = dictionary[keys[i]].split(' ').length
        const index = newSentence.split(/\s|(?=\.)/).indexOf(words[0])
        const diff = newText - oldText
        const lengthChange = oldText !== newText

        newSentence = newSentence.replace(
          ` ${keys[i]} `,
          ` ${dictionary[keys[i]]} `
        )
        newSentence = newSentence.replace(
          ` ${keys[i]}.`,
          ` ${dictionary[keys[i]]}.`
        )

        const update = check !== newSentence

        if (lengthChange && update) {
          const start = capitalLetters.slice(0, index + 1)
          const end = capitalLetters.slice(index + 1)

          for (let i = 0; i < Math.abs(diff); i++) {
            diff > 0 ? start.push(false) : end.shift()
          }

          capitalLetters = [...start, ...end]
        }
      }
    }
    return {
      newSentence: newSentence.replace(/\s'/g, `'`),
      capitalLetters: capitalLetters,
    }
  }

  getSingleUKWords(sentence) {
    const words = this.splitWords(sentence)

    const step1 = words.map((word) => britishOnly[word] || word)

    const step2 = step1.map(
      (word) =>
        Object.keys(americanToBritishSpelling).find(
          (key) => americanToBritishSpelling[key] === word
        ) || word
    )

    const step3 = step2.map(
      (word) =>
        Object.keys(americanToBritishTitles).find(
          (key) => americanToBritishTitles[key] === word
        ) || word
    )

    return step3.join(' ').replace(/\s'/g, `'`)
  }

  handleCapitalLetters(sentence, capitalLetters) {
    return sentence
      .split(' ')
      .map((w, i) => {
        if (typeof capitalLetters[i] === 'boolean')
          return capitalLetters[i] ? `${w[0].toUpperCase()}${w.slice(1)}` : w
        let word = w.split('')
        capitalLetters[i].forEach(
          (index) => (word[index] = word[index].toUpperCase())
        )
        return word.join('')
      })
      .join(' ')
  }

  handleHours(sentence, target) {
    let newSentence = sentence
    const regex =
      target === 'US' ? /[0-9]{1,2}[.][0-9]{1,2}/ : /[0-9]{1,2}[:][0-9]{1,2}/
    const oldSeparator = target === 'US' ? '.' : ':'
    const newSeparator = target === 'US' ? ':' : '.'
    let hasHours = newSentence.match(regex)

    while (hasHours) {
      const hours = hasHours[0]
      const newHours = hours.replace(oldSeparator, newSeparator)
      newSentence = newSentence.replace(hours, newHours)
      hasHours = newSentence.match(regex)
    }

    return newSentence
  }

  toBritish(sentence, target, capitalLetters) {
    let newSentence = sentence

    newSentence = this.getSingleUSWords(newSentence)
    let result = this.getMultipleWords(newSentence, target, capitalLetters)
    newSentence = result.newSentence
    capitalLetters = result.capitalLetters
    newSentence = this.handleHours(newSentence, target)
    newSentence = this.handleCapitalLetters(newSentence, capitalLetters)

    return newSentence
  }

  toAmerican(sentence, target, capitalLetters) {
    let newSentence = sentence

    newSentence = this.getSingleUKWords(newSentence)
    let result = this.getMultipleWords(newSentence, target, capitalLetters)
    newSentence = result.newSentence
    capitalLetters = result.capitalLetters
    newSentence = this.handleHours(newSentence, target)
    newSentence = this.handleCapitalLetters(newSentence, capitalLetters)

    return newSentence
  }

  specialCap(sent, cap) {
    let newCap = cap
    sent.split(' ').forEach((w, iw) => {
      let caps = w.match(/[A-Z]/g)
      w.split('').forEach((l, il) => {
        if (l !== l.toUpperCase() || !caps || caps.length < 2) return
        if (typeof newCap[iw] !== 'object') return (newCap[iw] = [il])
        return newCap[iw].push(il)
      })
    })
    return newCap
  }

  translate(sentence, target) {
    let newSentence = sentence.trim()

    let capitalLetters = newSentence
      .split(' ')
      .map((word) => word[0] === word[0].toUpperCase())

    capitalLetters = this.specialCap(newSentence, capitalLetters)

    newSentence = newSentence.toLowerCase()

    newSentence =
      target === 'UK'
        ? this.toBritish(newSentence, target, capitalLetters)
        : this.toAmerican(newSentence, target, capitalLetters)

    return newSentence
  }

  highlight(text, translation) {
    const original = text.split(' ')
    const translated = translation.split(' ')
    let highlighted = translation

    const differences = translated.map((x) => original.includes(x))
    const modifications = translated
      .map((x, i) => (differences[i] ? '' : x))
      .join(' ')
      .trim()
      .split(/\s{2,}/)

    modifications.forEach(
      (x) =>
        (highlighted = highlighted.replace(
          x,
          `<span class="tl-highlight">${x}</span>`
        ))
    )

    return highlighted
  }
}

module.exports = Translator
