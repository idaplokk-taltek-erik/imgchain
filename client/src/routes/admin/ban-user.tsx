import { createFileRoute } from '@tanstack/react-router';
import AdminBanUserPage from '../../components/admin/AdminBanUserPage';

export const Route = createFileRoute('/admin/ban-user')({
  component: AdminBanUserPage,
});
