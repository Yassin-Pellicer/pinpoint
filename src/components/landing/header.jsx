import Link from "next/link";
import Logo from "../ui/logo_btn";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("Landing");
  return (
    <header className="flex flex-row justify-between items-center p-4 rounded-3xl text-white">
      <div className="w-32 h-fit">
        {" "}
        <Logo />{" "}
      </div>
      <div className="flex flex-row sm:mt-0 mt-4">
        <Link href="/login" className="mr-4 ">
        <i className="material-icons mr-4 text-4xl">login</i>
        </Link>
        <Link href="/signup">
          <i className="material-icons mr-4 text-4xl">person_add</i>
        </Link>
      </div>
    </header>
  );
}
