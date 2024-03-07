import DOMPurify from 'dompurify'
import TranslatorLangTag from './translator-lang-tag'

interface ResponseProps {
  translation: string
  lang: string
}

export default function TranslatorResponse({ translation, lang }: ResponseProps) {
  const cleanHTML = DOMPurify.sanitize(translation.replace('tl-highlight', 'font-bold'))

  return (
    <div className='mt-3'>
      <h4 className='font-bold'>Traduction :</h4>
      <div className='w-full min-h-[5rem] bg-ligthColorHover roudned-md p-3'>
        <TranslatorLangTag lang={lang} />
        <div className='pl-1 text-left' dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      </div>
    </div>
  )
}
