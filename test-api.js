const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch("https://trust-platform-omega.vercel.app/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        comment: "Test comment",
        rating: 5,
        honeypot: "",
        token: "fake-token-for-testing"
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch (err) {
    console.error(err);
  }
}

test();
