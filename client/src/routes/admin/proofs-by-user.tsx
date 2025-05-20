import { createFileRoute } from '@tanstack/react-router';
import AdminProofsByUserPage from '../../components/admin/AdminProofsByUserPage';

export const Route = createFileRoute('/admin/proofs-by-user')({
  component: AdminProofsByUserPage,
});