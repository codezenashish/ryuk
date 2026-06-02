import PageHeader from "@/src/features/bookmarks/components/PageHeader";
import CategoryGridSection from "@/src/features/bookmarks/components/social-category-section";
import React from "react";

const page = () => {
  return (
    <>
      <PageHeader title="Bookmarks" />
      <CategoryGridSection />
    </>
  );
};

export default page;
