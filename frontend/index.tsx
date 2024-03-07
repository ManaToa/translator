import { useEffect, useState } from 'react'

import { getRecaptchaToken, initRecaptcha } from '../../utils/reCaptcha'
import { POSTrequest } from '../../utils/requests'
import TranslatorInput from './translator-input'
import TranslatorResponse from './translator-response'
import TranslatorButton from './translator-button'
import TranslatorSwitchButton from './translator-switch'

export default function Translator() {
  const [isUStoUK, setIsUStoUK] = useState<boolean>(true)
  const [langFrom, setLangFrom] = useState<string>('US')
  const [langTo, setLangTo] = useState<string>('UK')
  const [text, setText] = useState<string>('')
  const [translation, setTranslation] = useState<string>('')
  const [locale, setLocale] = useState<string>('american-to-british')

  async function handleTranslation() {
    const stuff = {
      text: text,
      locale: locale,
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = '/translator/translate'
      const response = await POSTrequest(url, stuff)

      if (response.error) return setTranslation(JSON.stringify(response, null, 2))
      setTranslation(response.translation)
    } catch (error) {
      setTranslation('Une Erreur est survenue')
    }
  }

  useEffect(() => {
    setLangFrom(isUStoUK ? 'US' : 'UK')
    setLangTo(isUStoUK ? 'UK' : 'US')
    setLocale(isUStoUK ? 'american-to-british' : 'british-to-american')
  }, [isUStoUK])

  useEffect(() => {
    initRecaptcha()
  }, [])

  return (
    <div className='bg-lightColor shadow-xl p-3 lg:p-6 rounded-md md:w-[32rem]'>
      <TranslatorInput text={text} updateText={setText} lang={langFrom} />
      <TranslatorResponse translation={translation} lang={langTo} />
      <div className='flex justify-between py-4'>
        <TranslatorSwitchButton
          langFrom={langFrom}
          langTo={langTo}
          switchLangs={setIsUStoUK}
          isUStoUK={isUStoUK}
        />
        <TranslatorButton translate={handleTranslation} />
      </div>
    </div>
  )
}
