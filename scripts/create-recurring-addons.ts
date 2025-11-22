import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

async function createRecurringAddons() {
  console.log('🚀 Creating Recurring Add-on Prices...\n');

  try {
    // Extra Seats (2 seats) - RECURRING MONTHLY
    console.log('Creating Extra Seats (Recurring)...');
    const extraSeatsProduct = await stripe.products.create({
      name: 'Extra Team Seats (2) - Recurring',
      description: 'Add 2 additional employee seats to your subscription (billed monthly)',
      metadata: { type: 'addon_recurring', seats: '2' },
    });

    const extraSeatsPriceUSD = await stripe.prices.create({
      product: extraSeatsProduct.id,
      unit_amount: 1900, // $19.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon_recurring', currency: 'usd' },
    });

    const extraSeatsPriceCAD = await stripe.prices.create({
      product: extraSeatsProduct.id,
      unit_amount: 1900, // $19.00 CAD (same price)
      currency: 'cad',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon_recurring', currency: 'cad' },
    });

    console.log(`✅ Extra Seats (Recurring):`);
    console.log(`   USD: ${extraSeatsPriceUSD.id} ($19/mo)`);
    console.log(`   CAD: ${extraSeatsPriceCAD.id} ($19 CAD/mo)\n`);

    // Extra Project - RECURRING MONTHLY
    console.log('Creating Extra Project (Recurring)...');
    const extraProjectProduct = await stripe.products.create({
      name: 'Extra Project - Recurring',
      description: 'Add 1 additional active project to your subscription (billed monthly)',
      metadata: { type: 'addon_recurring', projects: '1' },
    });

    const extraProjectPriceUSD = await stripe.prices.create({
      product: extraProjectProduct.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon_recurring', currency: 'usd' },
    });

    const extraProjectPriceCAD = await stripe.prices.create({
      product: extraProjectProduct.id,
      unit_amount: 4900, // $49.00 CAD (same price)
      currency: 'cad',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon_recurring', currency: 'cad' },
    });

    console.log(`✅ Extra Project (Recurring):`);
    console.log(`   USD: ${extraProjectPriceUSD.id} ($49/mo)`);
    console.log(`   CAD: ${extraProjectPriceCAD.id} ($49 CAD/mo)\n`);

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Recurring Add-on Prices Created!\n');
    console.log('📋 UPDATE shared/stripe-config.ts WITH THESE IDs:\n');
    console.log('addons: {');
    console.log('  usd: {');
    console.log(`    extra_seats: '${extraSeatsPriceUSD.id}',`);
    console.log(`    extra_project: '${extraProjectPriceUSD.id}',`);
    console.log(`    white_label: 'price_1SWCTnBzDsOltscrD2qcZ47m', // Keep existing`);
    console.log('  },');
    console.log('  cad: {');
    console.log(`    extra_seats: '${extraSeatsPriceCAD.id}',`);
    console.log(`    extra_project: '${extraProjectPriceCAD.id}',`);
    console.log(`    white_label: 'price_1SWCToBzDsOltscrRljmQTLz', // Keep existing`);
    console.log('  },');
    console.log('},');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return {
      extra_seats: { usd: extraSeatsPriceUSD.id, cad: extraSeatsPriceCAD.id },
      extra_project: { usd: extraProjectPriceUSD.id, cad: extraProjectPriceCAD.id },
    };
  } catch (error) {
    console.error('❌ Error creating recurring add-ons:', error);
    throw error;
  }
}

// Run immediately
createRecurringAddons()
  .then((priceIds) => {
    console.log('✅ Setup complete!');
    console.log('\nReturned price IDs:', JSON.stringify(priceIds, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });

export { createRecurringAddons };
