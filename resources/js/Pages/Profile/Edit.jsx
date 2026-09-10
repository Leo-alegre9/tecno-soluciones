import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout header="Mi perfil">
            <Head title="Mi perfil" />

            <div className="max-w-2xl space-y-6">
                <Card className="p-6">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </Card>

                <Card className="p-6">
                    <UpdatePasswordForm />
                </Card>
            </div>
        </AdminLayout>
    );
}
