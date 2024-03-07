interface LangTagProps {
  lang: string
}

export default function TranslatorLangTag({ lang }: LangTagProps) {
  return (
    <p className=' text-xs text-darkColor font-bold p-2 bg-[#3636361c] w-[2rem] rounded-md h-[1.5rem] flex items-center justify-center mb-1'>
      {lang}
    </p>
  )
}
