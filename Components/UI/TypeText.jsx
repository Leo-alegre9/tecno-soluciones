'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

// Typewriter that cycles through `words`: types one, pauses, deletes it and
// types the next, with a blinking cursor (after Framer's "Pro Text Type").
// The first word is rendered complete on the server, so there is no empty
// flash and crawlers/screen readers get real text. With reduced motion it
// just shows the first word.
export default function TypeText({
    words,
    typingSpeed = 75,
    deletingSpeed = 40,
    pauseDuration = 1800,
    className,
    cursorClassName,
}) {
    const reducedMotion = useReducedMotion();
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState(words[0] ?? '');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (reducedMotion || words.length < 2) return undefined;

        const word = words[wordIndex];
        let timeout;

        if (!deleting && text === word) {
            timeout = setTimeout(() => setDeleting(true), pauseDuration);
        } else if (deleting && text === '') {
            setDeleting(false);
            setWordIndex((i) => (i + 1) % words.length);
        } else if (deleting) {
            timeout = setTimeout(() => setText((t) => t.slice(0, -1)), deletingSpeed);
        } else {
            // Slight random variation feels more like real typing.
            timeout = setTimeout(
                () => setText(word.slice(0, text.length + 1)),
                typingSpeed * (0.7 + Math.random() * 0.6),
            );
        }

        return () => clearTimeout(timeout);
    }, [text, deleting, wordIndex, words, reducedMotion, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className="whitespace-nowrap">
            <span className={className}>{text}</span>
            <motion.span
                aria-hidden="true"
                className={cn('ml-1 inline-block font-light', cursorClassName)}
                animate={reducedMotion ? undefined : { opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            >
                |
            </motion.span>
        </span>
    );
}
