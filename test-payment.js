// Test payment endpoint
const testPayment = async () => {
  try {
    // First, login as a student
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✓ Login successful:', loginData.user?.name || 'User');
    const token = loginData.token;
    
    if (!token) {
      console.log('❌ No token received');
      return;
    }

    // Get a course
    const coursesResponse = await fetch('http://localhost:5000/api/courses');
    const coursesData = await coursesResponse.json();
    const paidCourse = coursesData.courses.find(c => c.price > 0);
    
    if (!paidCourse) {
      console.log('❌ No paid courses found');
      return;
    }

    console.log('✓ Found paid course:', paidCourse.title, `($${paidCourse.price})`);

    // Try to create payment intent
    const paymentResponse = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId: paidCourse._id
      })
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.log('❌ Payment intent creation failed:', errorData);
      return;
    }

    const paymentData = await paymentResponse.json();
    console.log('✓ Payment intent created successfully');
    console.log('  Client Secret:', paymentData.clientSecret ? 'Present' : 'Missing');
    console.log('  Amount:', paymentData.amount);
    console.log('  Course:', paymentData.courseName);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testPayment();
