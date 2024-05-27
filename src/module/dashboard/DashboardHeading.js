import React from "react";

const DashboardHeading = ({
  title = "",
  desc = "",
  authorName = "",
  children,
}) => {
  return (
    <div className="flex items-start justify-between mb-10">
      <div>
        <h1 className="dashboard-heading">{title}</h1>
        <h3 className="">{authorName}</h3>
        <p className="dashboard-short-desc">{desc}</p>
      </div>
      {children}
    </div>
  );
};

export default DashboardHeading;
