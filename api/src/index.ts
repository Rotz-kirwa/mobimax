import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { prisma } from './lib/db';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { sign, verify } = jwt;
const { compare, hash } = bcrypt;

const app = new Hono().basePath('/api');

// Prevent caching for dynamic storefront data
app.use('*', async (c, next) => {
  await next();
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  c.header('Pragma', 'no-cache');
  c.header('Expires', '0');
});

// Global error handler for debugging
app.onError((err, c) => {
  console.error(`❌ API ERROR [${c.req.method} ${c.req.url}]:`, err);
  return c.text(`Mobimax API Error: ${err.message}`, 500);
});

const JWT_SECRET = process.env.JWT_SECRET || 'mobiplus-enterprise-secret-change-this';

// --- AUTH MIDDLEWARE ---
const adminAuth = async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const payload = verify(token, JWT_SECRET);
    c.set('admin', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// --- STOREFRONT ROUTES ---

// Get all products with optional filtering
app.get('/products', async (c) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return c.json(products);
});

// Get featured/hot deals for home page
app.get('/storefront/featured', async (c) => {
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 8,
  });
  const hotDeals = await prisma.product.findMany({
    where: { isHotDeal: true },
    take: 4,
  });
  const banners = await prisma.heroBanner.findMany({
    orderBy: { order: 'asc' },
  });
  
  return c.json({ featured, hotDeals, banners });
});

// Get categories and brands
app.get('/metadata', async (c) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  return c.json({ categories, brands });
});

app.get('/products/:id', async (c) => {
  const id = c.req.param('id');
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return c.json({ error: 'Product not found' }, 404);
  return c.json(product);
});

// Submit Order
app.post('/orders', async (c) => {
  const body = await c.req.json();
  const order = await prisma.order.create({
    data: {
      reference: `MBX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      customer: body.customer,
      items: body.items,
      total: body.total,
    },
  });
  return c.json(order, 201);
});

// --- ADMIN ROUTES (Protected) ---

app.post('/admin/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // For the first admin, if none exists, we allow creation or check against env
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    // Check against initial setup env vars if provided
    const masterEmail = process.env.ADMIN_EMAIL || 'admin@mobimax.local';
    const masterPass = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === masterEmail && password === masterPass) {
      const token = sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return c.json({ token, user: { email } });
    }
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await compare(password, admin.passwordHash);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  const token = sign({ email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  return c.json({ token, user: { email: admin.email } });
});

app.get('/admin/dashboard', adminAuth, async (c) => {
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: 'confirmed' }
  });

  return c.json({
    stats: {
      products: productCount,
      orders: orderCount,
      revenue: totalRevenue._sum.total || 0,
    },
    recentOrders,
  });
});

// Admin Product CRUD
app.post('/admin/products', adminAuth, async (c) => {
  const data = await c.req.json();
  const product = await prisma.product.create({ data });
  return c.json(product, 201);
});

app.put('/admin/products/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json();
  const product = await prisma.product.update({ where: { id }, data });
  return c.json(product);
});

app.delete('/admin/products/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  await prisma.product.delete({ where: { id } });
  return c.json({ success: true });
});

// Admin Orders
app.get('/admin/orders', adminAuth, async (c) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return c.json(orders);
});

app.put('/admin/orders/:id/status', adminAuth, async (c) => {
  const id = c.req.param('id');
  const { status, type } = await c.req.json(); // type can be 'payment' or 'order'
  
  const updateData: any = {};
  if (type === 'payment') updateData.paymentStatus = status;
  else updateData.orderStatus = status;

  const order = await prisma.order.update({
    where: { id },
    data: updateData
  });
  
  return c.json(order);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export { app };
export default handle(app);
