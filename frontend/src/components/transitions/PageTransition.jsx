import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';


const animations = {
  fade: {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  },
  slide: {
    initial: {
      opacity: 0,
      x: 50 
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: -50
    }
  },
  zoom: {
    initial: {
      opacity: 0,
      scale: 0.97
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.03
    }
  },
  fadeUp: {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

const PageTransition = ({ children, type = "fadeUp" }) => {
  const { pathname } = useLocation();
  

  const variant = animations[type] || animations.fadeUp;
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={variant}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 