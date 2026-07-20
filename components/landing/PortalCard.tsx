import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonColor: string;
  features: string[];
  buttonText?: string;
}

export default function PortalCard({
  title,
  description,
  icon,
  href,
  buttonColor,
  features,
  buttonText = "Login",
}: PortalCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full">
      
      <div className="flex justify-center text-slate-700 mb-5">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-center text-slate-900">
        {title}
      </h3>

      <p className="text-center text-gray-500 mt-3 text-sm min-h-[50px]">
        {description}
      </p>

      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-gray-700"
          >
            <CheckCircle
              size={18}
              className="text-green-500 flex-shrink-0"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link href={href} className="mt-6">
        <button
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${buttonColor}`}
        >
          {buttonText}
        </button>
      </Link>

    </div>
  );
}