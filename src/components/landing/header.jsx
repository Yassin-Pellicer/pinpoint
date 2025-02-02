import Logo from "../ui/logo";
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Landing');
  return (
    <header className="flex flex-row justify-between items-center p-4 rounded-3xl text-white">
      <div className="w-32 h-fit">
        {" "}
        <Logo />{" "}
      </div>
      <div className="flex flex-row sm:mt-0 mt-4">
        <div className="mr-4 bg-transparent border w-fit h-fit text-2xl
         border-white text-white rounded-2xl p-2 cursor-pointer hover:bg-blue-600 hover:text-white transition duration-200">
          {t('auth.login')}
        </div>
        <div className="bg-transparent border w-fit text-2xl
         border-white text-white rounded-2xl p-2 cursor-pointer hover:bg-blue-600 hover:text-white transition duration-200">
          {t('auth.signup')}
        </div>
      </div>
    </header>
  );
}
