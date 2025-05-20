import { createFileRoute } from '@tanstack/react-router';
import AdminUserListPage from '../../components/admin/AdminUserListPage';

export const Route = createFileRoute('/admin/user-list')({
  component: AdminUserListPage,
});