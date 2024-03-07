import TranslatorLangTag from './translator-lang-tag'

interface InputProps {
  text: string
  lang: string
  updateText: React.Dispatch<React.SetStateAction<string>>
}

export default function TranslatorInput({ text, updateText, lang }: InputProps) {
  return (
    <div>
      <h4 className='font-bold'>Texte à traduire :</h4>
      <div className='bg-ligthColorHover rounded-md outline-none p-3 pb-0 w-full'>
        <TranslatorLangTag lang={lang} />
        <textarea
          className=' bg-transparent outline-none w-full pl-1'
          name=''
          cols={60}
          rows={5}
          value={text}
          onChange={e => updateText(e.target.value)}
        />
      </div>
    </div>
  )
}
