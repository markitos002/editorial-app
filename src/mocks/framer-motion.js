// src/mocks/framer-motion.js - Mock de framer-motion para evitar errores
// Este archivo reemplaza completamente framer-motion con implementaciones vacías

// Componente motion mock
export const motion = new Proxy({}, {
  get: function(target, prop) {
    return function(props) {
      const { children, ...otherProps } = props || {};
      // Retorna un div simple con las props (sin animaciones)
      return {
        type: prop,
        props: {
          ...otherProps,
          children
        }
      };
    };
  }
});

// AnimatePresence mock
export const AnimatePresence = ({ children }) => children;

// Hooks mock
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {}
});

export const useMotionValue = (initial) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {}
});

export const useTransform = () => ({
  get: () => 0,
  set: () => {},
  onChange: () => () => {}
});

export const useSpring = (config) => config;

export const useMotionTemplate = () => '';

export const useIsPresent = () => true;

export const usePresence = () => [true, () => {}];

// Otras utilidades mock
export const animate = () => Promise.resolve();
export const scroll = () => () => {};
export const transform = (input, output) => (value) => value;

// Easing functions mock
export const easeIn = 'ease-in';
export const easeOut = 'ease-out';
export const easeInOut = 'ease-in-out';

// Default export mock
export default {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  scroll,
  transform,
  easeIn,
  easeOut,
  easeInOut
};
