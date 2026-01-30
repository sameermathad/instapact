import React from 'react';
import { JsonLd } from './json-ld';

export const SiteSchema: React.FC = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InstaPact",
    "url": "https://www.instapact.in",
    "logo": "https://www.instapact.in/logo/logo@3x.png",
    "sameAs": [
      "https://twitter.com/instapact",
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InstaPact",
    "url": "https://www.instapact.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.instapact.in/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
    </>
  );
};
