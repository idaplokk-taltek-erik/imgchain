import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

function AdminBanUserPage() {
  const [userId, setUserId] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banExpiresIn, setBanExpiresIn] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'danger'>('success');

  const handleBan = async () => {
    try {
      console.log({ userId, banReason, banExpiresIn });
      const res = await fetch('/api/auth/admin/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, banReason, banExpiresIn }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ban failed');

      setMessage('User has been banned successfully.');
      setVariant('success');
    } catch (err: any) {
      setMessage(`${err.message}`);
      setVariant('danger');
    }
  };

  const handleUnban = async () => {
    try {
      const res = await fetch('/api/auth/admin/unban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unban failed');

      setMessage('User has been unbanned successfully.');
      setVariant('success');
    } catch (err: any) {
      setMessage(`${err.message}`);
      setVariant('danger');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Ban / Unban User</h2>
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ban Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Reason for ban"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ban Expires In</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 7d, 3h, 30m"
                value={banExpiresIn}
                onChange={(e) => setBanExpiresIn(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="danger" onClick={handleBan}>Ban User</Button>
          <Button variant="secondary" onClick={handleUnban}>Unban User</Button>
        </div>
      </Form>
    </Container>
  );
}

export default AdminBanUserPage;
