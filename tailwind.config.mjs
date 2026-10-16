import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './app/**/*.{js,jsx}',
        './Components/**/*.{js,jsx}',
        './Layouts/**/*.{js,jsx}',
        './lib/**/*.{js,jsx}',
        './views/**/*.{js,jsx}',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Sora', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Semantic design-system tokens (public/dark surface).
                // Admin panel keeps the existing light ink/white styles untouched.
                background: '#050505',
                foreground: '#FAFAFA',
                surface: {
                    DEFAULT: '#0A0A0C',
                    elevated: '#0F0F12',
                    hover: '#141417',
                },
                muted: {
                    DEFAULT: '#0F0F12',
                    foreground: '#A6A6AE',
                },
                primary: {
                    DEFAULT: '#F1541C',
                    foreground: '#FAFAFA',
                },
                accent: {
                    DEFAULT: '#F0A93B',
                    foreground: '#0B0B10',
                },
                border: {
                    DEFAULT: 'rgba(255,255,255,0.08)',
                    hover: 'rgba(255,255,255,0.16)',
                },
                ring: '#F1541C',
                brand: {
                    50: '#FFF3ED',
                    100: '#FFE4D3',
                    200: '#FFC5A3',
                    300: '#FF9F6B',
                    400: '#FB7A3C',
                    500: '#F1541C',
                    600: '#D63F12',
                    700: '#B02F0D',
                    800: '#8A250F',
                    900: '#5C1A0D',
                },
                gold: {
                    50: '#FFFBEB',
                    100: '#FFF3C4',
                    200: '#FCE588',
                    300: '#FAD34D',
                    400: '#F7C948',
                    500: '#F0A93B',
                    600: '#D6862A',
                    700: '#AD6620',
                    800: '#7C481A',
                    900: '#4F2E12',
                },
                ink: {
                    50: '#F5F5F7',
                    100: '#E4E4E9',
                    200: '#C4C4CE',
                    300: '#9C9CAB',
                    400: '#6E6E80',
                    500: '#4A4A5C',
                    600: '#33333F',
                    700: '#232330',
                    800: '#17171F',
                    900: '#0B0B10',
                    950: '#050507',
                },
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #F1541C 0%, #F0A93B 100%)',
                'brand-gradient-radial': 'radial-gradient(circle at top right, rgba(241,84,28,0.35), transparent 60%)',
                'grid-faint':
                    'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            },
            backgroundSize: {
                grid: '40px 40px',
            },
            boxShadow: {
                brand: '0 20px 45px -15px rgba(241, 84, 28, 0.45)',
                elevated: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -12px rgba(0,0,0,0.55)',
                'glow-sm': '0 0 0 1px rgba(241,84,28,0.15), 0 8px 24px -8px rgba(241,84,28,0.25)',
            },
            borderRadius: {
                control: '0.75rem', // 12px — buttons, inputs
                card: '1rem', // 16px — cards
                'card-lg': '1.25rem', // 20px — featured cards
            },
            maxWidth: {
                container: '80rem', // 1280px
            },
            transitionTimingFunction: {
                'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            transitionDuration: {
                180: '180ms',
                220: '220ms',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 1.5s',
            },
        },
    },

    plugins: [forms],
};
