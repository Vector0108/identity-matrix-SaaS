import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ConditionalRoute: React.FC<ConditionalRouteProps> = ({
  condition,
  redirectTo,
  children,
}: ConditionalRouteProps) => {
  return condition ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

interface ConditionalRouteProps {
  condition: boolean;
  redirectTo: string;
  children?: ReactNode;
}

export default ConditionalRoute;
