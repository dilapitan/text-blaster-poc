const URL = 'api/v4/messages';
const API_KEY = process.env.REACT_APP_API_KEY;

async function sendSMS(announcement, recipients) {
  try {
    const response = await fetch(URL, {
      body: `apikey=${API_KEY}&number=${recipients}&message=${announcement}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export { sendSMS };
