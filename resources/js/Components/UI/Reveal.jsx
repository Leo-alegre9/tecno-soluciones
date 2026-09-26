import { motion, useReducedMotion } from 'motion/react';

/**
 * Fades content in with a small upward translate the first time it enters the
 * viewport. Falls back to an instant, static render when the user prefers
 * reduced motion.
 */
export default function Reveal({ children, delay = 0, y = 16, className, as = 'div', once = true, ...props }) {
    const shouldReduceMotion = useReducedMotion();
    const MotionTag = motion[as] ?? motion.div;

    if (shouldReduceMotion) {
        const Tag = as;
        return (
            <Tag className={className} {...props}>
                {children}
            </Tag>
        );
    }

    return (
        <MotionTag
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: '-80px' }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
            {...props}
        >
            {children}
        </MotionTag>
    );
}
