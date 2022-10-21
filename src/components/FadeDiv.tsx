import { motion, AnimatePresence } from "framer-motion";

export default function FadeDiv({ children }: any) {
  return (<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>);
}

export function FadeDivWithPresence({ condition, children }: any) {
  return (
    <AnimatePresence>
      {condition && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>};
    </AnimatePresence>);
}