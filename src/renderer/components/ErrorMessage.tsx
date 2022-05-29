import "./ErrorMessage.scss";
import { FunctionComponent } from "react";

export const ErrorMessage: FunctionComponent<{ message: string }> = ({
  message,
}) => (
  <div className="errorMessage">
    <h3 className="errorMessage__title">An error has occurred</h3>
    <p className="errorMessage__content">{message}</p>
  </div>
);
