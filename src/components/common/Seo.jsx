import { useEffect } from 'react';

export default function Seo({ title, description }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | UrbanVibe Clothing` : 'UrbanVibe Clothing';
    document.title = fullTitle;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
