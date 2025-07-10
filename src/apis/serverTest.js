const baseURL = 'http://obesity-app.r-e.kr';

export const loginTest = async () => {
  try {
    const response = await fetch(`${baseURL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: 'admin', password: '1234'}),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
