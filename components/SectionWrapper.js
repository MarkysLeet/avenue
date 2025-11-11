import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const SectionWrapper = ({ as = 'section', children, className = '', ...rest }) => {
  const MotionComponent = motion[as] || motion.section;
  return (
    <MotionComponent
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

export default SectionWrapper;
