import fs from 'fs';
import path from 'path';

const BASE = 'http://127.0.0.1:5000';

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE}${url}`, options);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body };
};

const log = (name, result) => {
  console.log(`\n=== ${name} ===`);
  console.log('status:', result.status);
  console.log('body:', JSON.stringify(result.body, null, 2));
};

const asJson = (data) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

const run = async () => {
  const sampleDir = path.resolve('./tmp-test-files');
  if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });
  const sampleStl = path.join(sampleDir, 'sample.stl');
  fs.writeFileSync(sampleStl, 'solid test\nendsolid test');
  
  const userReg = await request('/api/auth/register', asJson({
    name: 'User Test',
    email: 'user@teste.com',
    registration: 'USER001',
    course: 'Teste',
    password: 'Senha123',
  }));
  log('Register User', userReg);

  const adminLogin = await request('/api/auth/login', asJson({ email: 'admin@teste.com', password: 'Admin123' }));
  log('Admin Login', adminLogin);
  const adminToken = adminLogin.body.data?.token;

  const userLogin = await request('/api/auth/login', asJson({ email: 'user@teste.com', password: 'Senha123' }));
  log('User Login', userLogin);
  const userToken = userLogin.body.data?.token;

  const profile = await request('/api/auth/profile', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('User Profile', profile);

  const labsBefore = await request('/api/laboratories', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('List Labs (before)', labsBefore);

  const createLab = await request('/api/laboratories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Lab Test', location: 'Bloco A', description: 'Laboratório teste', capacity: 20, resources: ['Impressora 3D'], status: 'active' }),
  });
  log('Create Laboratory', createLab);
  const labId = createLab.body.data?.laboratory?._id;

  const labsAfter = await request('/api/laboratories', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('List Labs (after)', labsAfter);

  const createBooking = await request('/api/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ laboratory: labId, date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), startTime: '10:00', endTime: '12:00' }),
  });
  log('Create Booking', createBooking);
  const bookingId = createBooking.body.data?.booking?._id;

  const listBookings = await request('/api/bookings', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('List Bookings', listBookings);

  const createMaterial = await request('/api/materials', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'PLA', quantity: 10, unit: 'kg', minimumQuantity: 2 }),
  });
  log('Create Material', createMaterial);

  const listMaterials = await request('/api/materials', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('List Materials', listMaterials);

  const dashboard = await request('/api/dashboard', { method: 'GET', headers: { Authorization: `Bearer ${adminToken}` } });
  log('Dashboard', dashboard);

  const logs = await request('/api/logs', { method: 'GET', headers: { Authorization: `Bearer ${adminToken}` } });
  log('Logs', logs);

  const formData = new FormData();
  formData.set('title', 'Projeto Teste');
  formData.set('description', 'Descrição do projeto teste');
  formData.set('author', 'User Test');
  formData.set('images', new Blob([fs.readFileSync(sampleStl)]), 'sample.png');
  const createGallery = await fetch(`${BASE}/api/gallery`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: formData });
  const galleryBody = await createGallery.text();
  log('Create Gallery Item', { status: createGallery.status, body: galleryBody });

  const listGallery = await request('/api/gallery', { method: 'GET' });
  log('List Gallery', listGallery);

  const listPrints = await request('/api/prints', { method: 'GET', headers: { Authorization: `Bearer ${userToken}` } });
  log('List Prints', listPrints);

  const printForm = new FormData();
  printForm.set('title', 'Impressão Teste');
  printForm.set('description', 'Arquivo STL de teste');
  printForm.set('material', 'PLA');
  printForm.set('quantity', '1');
  printForm.set('file', new Blob([fs.readFileSync(sampleStl)]), 'sample.stl');
  const createPrint = await fetch(`${BASE}/api/prints`, { method: 'POST', headers: { Authorization: `Bearer ${userToken}` }, body: printForm });
  const printBody = await createPrint.text();
  log('Create Print Request', { status: createPrint.status, body: printBody });

  console.log('\nAll tests completed.');
};

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
