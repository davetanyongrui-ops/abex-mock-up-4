const { loadStripe } = require('@stripe/stripe-js');
async function test() {
  try {
    const stripe = await loadStripe('pk_test_placeholder');
    console.log(stripe);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
