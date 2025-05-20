import { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import { useTheme } from '../../lib/theme/hook';

function AdminUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  const cellStyle = {
  backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
  color: isDarkMode ? '#f0f0f0' : '#000000',
};

  useEffect(() => {
    fetch('/api/auth/admin/list-users')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching users');
        if (res.status === 403) {
          throw new Error('You are not authorized to view this page');
        }
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2>All users</h2>
      <Table striped bordered hover>
      <thead>
        <tr>
          {[
            'Name',
            'ID',
            'E-mail',
            'Role',
            'Created at',
            'Banned',
            'Ban reason',
            'Ban expires',
          ].map((header) => (
            <th
              key={header}
              style={{
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                color: isDarkMode ? '#f0f0f0' : '#000000',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td style={cellStyle}>{user.name || '-'}</td>
            <td style={cellStyle}>{user.id}</td>
            <td style={cellStyle}>{user.email}</td>
            <td style={cellStyle}>{user.role}</td>
            <td style={cellStyle}>
              {new Date(user.createdAt).toLocaleString()}
            </td>
            <td style={cellStyle}>{user.banned ? 'Yes' : 'No'}</td>
            <td style={cellStyle}>{user.banReason || '-'}</td>
            <td style={cellStyle}>
              {user.banExpires
                ? new Date(user.banExpires).toLocaleString()
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </Container>
  );
}

export default AdminUserListPage;
