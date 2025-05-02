import { createContext, useContext, useState, useEffect } from 'react';
import forumData from '../utils/forumData.json';

const ForumDataContext = createContext({
  universities: [],
  faculties: [],
  programs: [],
  isLoading: true
});

export const ForumDataProvider = ({ children }) => {
  const [data, setData] = useState({
    universities: [],
    faculties: [],
    programs: [],
    isLoading: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        universities: forumData.universities,
        faculties: forumData.faculties,
        programs: forumData.programs,
        isLoading: false
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ForumDataContext.Provider value={data}>
      {children}
    </ForumDataContext.Provider>
  );
};

export const useForumData = () => useContext(ForumDataContext); 