import * as React from "react";

export default function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="test-wrapper">{children}</div>;
}
