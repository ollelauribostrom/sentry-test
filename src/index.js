// Configure raven (change the dns if you want to try it yourself)
const dns = 'https://b55cfeb60336478ea4ddb534c10c2a9e@sentry.io/1218838';
Raven.config(dns).install()

const successButton = document.querySelector('.btn-200');
const failButton = document.querySelector('.btn-500');
const logElement = document.querySelector('.log');
let isMakingRequest = false;

successButton.addEventListener('click', () => makeRequest('https://httpbin.org/status/200'));
failButton.addEventListener('click', () => makeRequest('https://httpbin.org/status/500'))

function log(message) {
  logElement.textContent = message;
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(), duration);
  });
}

async function makeRequest(url) {
  if (isMakingRequest) {
    return;
  }

  isMakingRequest = true;
  log(`Making request to: ${url}`);
  await wait(2000);
  const response = await fetch(url);

  if (response.ok) {
    log(`API responded with: ${response.status}. Nothing logged to Sentry.`);
  } else {
    // Notify Sentry
    const message = `Request to: ${url} failed with status: ${response.status} - ${response.statusText}`;
    Raven.captureMessage(message);
    console.warn(`Sentry notified with message: ${message}`);
    log(`Request failed, error logged to Sentry`);
  }

  isMakingRequest = false;
}