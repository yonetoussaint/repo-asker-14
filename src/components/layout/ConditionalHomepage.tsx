import React from 'react';
import { useHomepage } from '@/context/HomepageContext';
import ForYou from '@/pages/ForYou';
import BooksHomepage from '@/pages/BooksHomepage';

const ConditionalHomepage = () => {
  const { homepageType } = useHomepage();
  
  return homepageType === 'books' ? <BooksHomepage /> : <ForYou />;
};

export default ConditionalHomepage;