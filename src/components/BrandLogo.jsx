import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function BrandLogo({
  to = "/",
  onClick,
  className = "",
  compact = false,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-3 leading-none ${className}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <img
          src={logo}
          alt="Learn Easy logo"
          className="h-11 w-11 shrink-0 object-contain scale-[1.22]"
        />
      </span>
      {!compact ? (
        <span className="font-ui text-[0.92rem] font-semibold tracking-[0.14em] text-slate-900">
          LEARN EASY
        </span>
      ) : null}
    </Link>
  );
}

export default BrandLogo;
