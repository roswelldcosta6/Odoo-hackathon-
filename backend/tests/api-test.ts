import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

/**
 * Lightweight HTTP request helper for testing
 */
function request(
  method: string,
  path: string,
  data: any = null,
  token: string | null = null
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const postData = data ? JSON.stringify(data) : '';

    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode || 500, body: parsed });
        } catch {
          resolve({ status: res.statusCode || 500, body: raw });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Dayflow HRMS Backend API Verification...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Checking Health Endpoint...');
    const health = await request('GET', '/health');
    console.log('Status:', health.status, '| System:', health.body.system);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Admin Login
    console.log('\n2️⃣ Testing Admin Login (admin@dayflow.com)...');
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@dayflow.com',
      password: 'Password@123',
    });
    console.log('Status:', adminLogin.status, '| Success:', adminLogin.body.success);
    const adminToken = adminLogin.body.data?.token;
    if (!adminToken) throw new Error('Admin login failed, token missing');
    console.log('Role:', adminLogin.body.data?.user?.role);

    // 3. Employee Login
    console.log('\n3️⃣ Testing Employee Login (employee@dayflow.com)...');
    const empLogin = await request('POST', '/auth/login', {
      email: 'employee@dayflow.com',
      password: 'Password@123',
    });
    console.log('Status:', empLogin.status, '| Success:', empLogin.body.success);
    const empToken = empLogin.body.data?.token;
    if (!empToken) throw new Error('Employee login failed, token missing');
    console.log('Role:', empLogin.body.data?.user?.role);

    // 4. Authenticated Profile /me
    console.log('\n4️⃣ Testing /auth/me for current user...');
    const me = await request('GET', '/auth/me', null, empToken);
    console.log('Status:', me.status, '| Name:', me.body.data?.employee?.firstName, me.body.data?.employee?.lastName);
    if (me.status !== 200) throw new Error('Authenticated profile check failed');
    console.log('Department:', me.body.data?.employee?.department?.name);

    // 5. Dashboard Analytics Feed
    console.log('\n5️⃣ Testing /analytics/dashboard...');
    const analytics = await request('GET', '/analytics/dashboard', null, adminToken);
    console.log('Status:', analytics.status);
    if (analytics.status !== 200) throw new Error('Dashboard analytics check failed');
    console.log('Top Metrics:', JSON.stringify(analytics.body.data?.topMetrics, null, 2));
    console.log('Attendance & Salary by Unit:', analytics.body.data?.attendanceAndSalaryByUnit?.length, 'units');
    console.log('Muster Roll sample count:', analytics.body.data?.musterRoll?.length);

    // 6. Punch Clock Endpoint
    console.log('\n6️⃣ Testing Punch Clock for Employee...');
    const punch = await request('POST', '/attendance/punch', {}, empToken);
    console.log('Status:', punch.status, '| Message:', punch.body.message);
    if (punch.status !== 200) throw new Error('Punch clock check failed');
    const todayStatus = await request('GET', '/attendance/today-status', null, empToken);
    console.log('Today Status:', JSON.stringify(todayStatus.body.data));
    if (todayStatus.status !== 200) throw new Error('Today attendance status check failed');

    // 7. Leave Balances and Application
    console.log('\n7️⃣ Testing Leave Balances & Application...');
    const balances = await request('GET', '/leaves/balances', null, empToken);
    console.log('Leave Balances count:', balances.body.data?.length);
    if (balances.status !== 200) throw new Error('Leave balance check failed');
    const paidLeaveType = balances.body.data?.[0]?.leaveTypeId;

    const leaveApply = await request(
      'POST',
      '/leaves/apply',
      {
        leaveTypeId: paidLeaveType,
        startDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
        reason: 'Attending technical conference',
      },
      empToken
    );
    console.log('Leave Application Status:', leaveApply.status, '| Days:', leaveApply.body.data?.request?.totalDays);
    if (leaveApply.status !== 201) throw new Error('Leave application check failed');
    console.log('Collision Insights:', JSON.stringify(leaveApply.body.data?.smartInsights));

    // 8. Employee Salary Slip View
    console.log('\n8️⃣ Testing /payroll/my-salary...');
    const salary = await request('GET', '/payroll/my-salary', null, empToken);
    console.log('Status:', salary.status, '| Gross:', salary.body.data?.grossSalary, '| Net:', salary.body.data?.netSalary);
    if (salary.status !== 200) throw new Error('Payroll check failed');

    // 9. Employee Directory & Department Listing
    console.log('\n9️⃣ Testing Employee Directory & Departments...');
    const depts = await request('GET', '/employees/departments', null, adminToken);
    console.log('Departments Count:', depts.body.data?.length);
    if (depts.status !== 200) throw new Error('Department listing check failed');
    const employees = await request('GET', '/employees', null, adminToken);
    console.log('Employees Total:', employees.body.data?.pagination?.total);
    if (employees.status !== 200) throw new Error('Employee directory check failed');

    console.log('\n=========================================================');
    console.log('🎉 ALL BACKEND ENDPOINTS PASSED VERIFICATION PERFECTLY!');
    console.log('=========================================================');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

runTests();
