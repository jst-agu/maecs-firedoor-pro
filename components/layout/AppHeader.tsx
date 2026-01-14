import Image from "next/image";
import { LOGO_BRITISH_SAFETY, LOGO_IFSM, LOGO_MAECS_PAT } from "@/constants/assets";

export default function AppHeader() {
  return (
    <header className="flex justify-between items-start mb-10 pb-6 border-b-2 border-gray-100">
      <div className="flex gap-4 items-center">
        {/* Replace these src with your actual logo paths */}
        <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-[8px] text-center p-1 rounded italic">
          <Image src={LOGO_BRITISH_SAFETY} alt="British Safety Logo" width={100} height={100} />
        </div>
        <div className="h-16 w-50 bg-gray-600 flex items-center justify-center text-[8px] text-center p-1 rounded italic">
          <Image src={LOGO_MAECS_PAT} alt="MAECS PAT Logo" width={250} height={100} />
        </div>
        <div className="ml-4 border-l pl-6 py-2">
           <h1 className="text-2xl font-black text-slate-800 leading-none">MAECS COMPLIANCE</h1>
           <p className="text-xs font-bold text-red-600 tracking-[0.2em]">INSPECTION MODULE</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold">Mae Compliance Service</p>
        <p className="text-xs text-gray-500">+44 7404 229188</p>
        <p className="text-xs text-gray-500 underline">admin@maecs.co.uk</p>
        <p className="text-xs text-gray-500 underline tracking-tighter">https://maecs.co.uk</p>
      </div>
    </header>
  );
}