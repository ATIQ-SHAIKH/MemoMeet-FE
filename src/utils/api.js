export const checkSession = async () => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/user/check/session`,
      {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent with the request
      }
    );

    if (response.ok) {
      return true; // Session is active
    }

    throw new Error('Session is inactive');
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const fetchWithAuth = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error('Unauthorized or error in request');
};

export const logout = async () => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Sends cookies (including JWT) with the request
    });

    if (response.ok) {
      return true;
    }

    throw new Error('Failed to logout');
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const signin = async (data) => {
  const response = await fetch(`${process.env.BACKEND_URL}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Sends cookies (including JWT) with the request
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error('Failed to login');
};

export const createMeetCode = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/user/create/meet/code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Sends cookies (including JWT) with the request
    }
  );
  if (response.ok) {
    const { meet_code } = await response.json();
    return meet_code;
  }
};
