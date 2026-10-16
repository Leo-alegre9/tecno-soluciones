import Login from '@/views/Auth/Login';

export const metadata = { title: 'Ingresar' };

export default async function LoginPage({ searchParams }) {
    const { error } = await searchParams;
    return <Login status={error === 'link' ? 'El enlace venció o ya fue usado. Pedí uno nuevo.' : null} />;
}
