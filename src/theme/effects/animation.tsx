import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import {} from "framer-motion";
import { forwardRef } from "react";
// ... other MUI imports

// 1. Create the Custom Bounce Transition
const BounceTransition = forwardRef((props: any, ref) => {
  const { children, in: isOpen, onEnter, onExited, ...others } = props;

  return (
    <LazyMotion features={domMax}>
      <AnimatePresence>
        {isOpen && (
          <m.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8, y: -20 }} // Start small and slightly above
            animate={{ opacity: 1, scale: 1, y: 0 }} // Pop into place
            exit={{ opacity: 0, scale: 0.9, y: -10 }} // Shrink away
            transition={{
              type: "spring",
              stiffness: 300, // Higher = Snappier
              damping: 20, // Lower = More "Bounce"
            }}
            style={{ transformOrigin: "bottom left" }} // Originates from the avatar
            {...others}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
});

export default BounceTransition;
