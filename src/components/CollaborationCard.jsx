import { Link } from "react-router-dom";
import Card from "./Card";
import Button from "./Button";

function CollaborationCard({
  title,
  description,
  primaryActionText,
  secondaryActionText,
  primaryActionTo,
  secondaryActionTo,
  onPrimaryAction,
  onSecondaryAction,
  icon,
  iconClassName = "gradient-brand",
  primaryButtonClassName = "",
}) {
  const renderPrimaryAction = () => {
    if (!primaryActionText) return null;

    const button = (
      <Button onClick={primaryActionTo ? undefined : onPrimaryAction} className={primaryButtonClassName}>
        {primaryActionText}
      </Button>
    );

    return primaryActionTo ? <Link to={primaryActionTo}>{button}</Link> : button;
  };

  const renderSecondaryAction = () => {
    if (!secondaryActionText) return null;

    const button = (
      <Button variant="secondary" onClick={secondaryActionTo ? undefined : onSecondaryAction}>
        {secondaryActionText}
      </Button>
    );

    return secondaryActionTo ? <Link to={secondaryActionTo}>{button}</Link> : button;
  };

  return (
    <Card variant="brand" padding="lg">
      <div className="py-2">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-button ${iconClassName}`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 text-sm leading-6 max-w-xl">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {renderPrimaryAction()}
          {renderSecondaryAction()}
        </div>
      </div>
    </Card>
  );
}

export default CollaborationCard;
