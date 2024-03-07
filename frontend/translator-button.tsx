interface TranslatorButtonProps {
  translate: () => void
}

export default function TranslatorButton({ translate }: TranslatorButtonProps) {
  return (
    <button
      className='bg-darkColor hover:bg-mainColor p-2 uppercase text-lightColor rounded-sm font-bold'
      onClick={() => translate()}
    >
      Traduire
    </button>
  )
}
