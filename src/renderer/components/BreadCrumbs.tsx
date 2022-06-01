import "./BreadCrumbs.scss";
import { Link } from "react-router-dom";
import { Fragment, FunctionComponent } from "react";

export const BreadCrumbs: FunctionComponent<{
  extraCrumbs?: { link: string; text: string }[];
  current?: string;
}> = ({ extraCrumbs, current }) => (
  <div className="nonshrinkContent">
    <Link className="breadcrumb" to="/">
      Home
    </Link>
    {" / "}
    {extraCrumbs?.map(({ link, text }) => (
      <Fragment key={link}>
        <Link className="breadcrumb" to={link}>
          {text}
        </Link>
        {" / "}
      </Fragment>
    ))}
    {current && (
      <p title={current} className="breadcrumb breadcrumb--current">
        {current}
      </p>
    )}
  </div>
);
