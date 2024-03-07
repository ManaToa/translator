import { FaLongArrowAltRight } from 'react-icons/fa'

interface SwitchButtonProps {
  langFrom: string
  langTo: string
  switchLangs: React.Dispatch<React.SetStateAction<boolean>>
  isUStoUK: boolean
}

export default function TranslatorSwitchButton({
  langFrom,
  langTo,
  switchLangs,
  isUStoUK,
}: SwitchButtonProps) {
  return (
    <button
      className='flex items-center justify-around w-[6rem] bg-darkColor hover:bg-mainColor p-2 uppercase text-lightColor rounded-sm font-bold'
      onClick={() => switchLangs(!isUStoUK)}
    >
      <div>{langFrom}</div>
      <FaLongArrowAltRight />
      <div>{langTo}</div>
    </button>
  )
}
