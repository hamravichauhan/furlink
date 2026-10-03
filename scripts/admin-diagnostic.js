const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.wdifdkcxnavrmbtuwamd:bcapromax9823@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await c.connect();

    const users = await c.query('SELECT COUNT(*)::int AS n FROM "User"');
    console.log('Users:', users.rows[0].n);

    const roles = await c.query('SELECT role, COUNT(*)::int AS n FROM "User" GROUP BY role');
    console.log('Users by role:');
    for (const r of roles.rows) console.log(`  ${r.role}: ${r.n}`);

    const st = await c.query('SELECT COUNT(*)::int AS n FROM "SterilizationRequest"');
    console.log('');
    console.log('Sterilization requests:', st.rows[0].n);

    const stBy = await c.query('SELECT status, COUNT(*)::int AS n FROM "SterilizationRequest" GROUP BY status');
    console.log('By status:');
    for (const r of stBy.rows) console.log(`  ${r.status}: ${r.n}`);

    const rescues = await c.query('SELECT COUNT(*)::int AS n FROM "RescueReport"');
    console.log('');
    console.log('Rescues:', rescues.rows[0].n);

    const apps = await c.query('SELECT COUNT(*)::int AS n FROM "AdoptionApplication"');
    console.log('Adoption applications:', apps.rows[0].n);

    const donations = await c.query('SELECT COUNT(*)::int AS n, COALESCE(SUM(amount), 0)::float AS total FROM "Donation"');
    console.log('Donations:', donations.rows[0].n, '| total:', donations.rows[0].total);

    const userList = await c.query('SELECT id, email, name, role FROM "User" ORDER BY "createdAt" DESC LIMIT 20');
    console.log('');
    console.log('Recent users:');
    for (const u of userList.rows) {
      console.log(`  ${u.email}  |  ${u.name || '—'}  |  [${u.role}]`);
    }

    await c.end();
  } catch (err) {
    console.error('FAIL:', err.message);
    process.exit(1);
  }
})();