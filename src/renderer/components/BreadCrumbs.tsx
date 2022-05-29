import "./BreadCrumbs.scss";
import { Link } from "react-router-dom";
import { Fragment, FunctionComponent } from "react";

export const BreadCrumbs: FunctionComponent<{
  extraCrumbs?: { link: string; text: string }[];
}> = ({ extraCrumbs }) => (
  <div className="nonshrinkContent">
    <Link className="homeLink" to="/">
      Home
    </Link>
    {" / "}
    {extraCrumbs?.map(({ link, text }) => (
      <Fragment key={link}>
        <Link className="homeLink" to={link}>
          {text}
        </Link>
        {" / "}
      </Fragment>
    ))}
  </div>
);
