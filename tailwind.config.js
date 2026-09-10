import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['"Sora"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
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
            },
            boxShadow: {
                brand: '0 20px 45px -15px rgba(241, 84, 28, 0.45)',
            },
        },
    },

    plugins: [forms],
};
