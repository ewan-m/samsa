import "./NavigationCard.scss";
import { Link } from "react-router-dom";
import { FunctionComponent } from "react";

export const NavigationCard: FunctionComponent<{
  to: string;
  link: string;
  description: string;
}> = ({ to, link, description }) => (
  <Link className="navigationCard" to={to}>
    <h3 className="navigationCard__title">{link}</h3>
    <p className="navigationCard__info">{description}</p>
  </Link>
);
