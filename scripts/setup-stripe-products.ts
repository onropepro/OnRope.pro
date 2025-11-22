import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

async function setupStripeProducts() {
  console.log('🚀 Creating Stripe Products and Prices (USD + CAD)...\n');

  try {
    // Subscription Tiers (Recurring Monthly)
    const tiers = [
      {
        name: 'Basic',
        description: '2 projects, 4 employee seats',
        priceUSD: 7900, // $79.00 in cents
        priceCAD: 10700, // $107.00 CAD (≈1.35x USD)
        projects: 2,
        seats: 4,
      },
      {
        name: 'Starter',
        description: '5 projects, 10 employee seats',
        priceUSD: 29900, // $299.00
        priceCAD: 40400, // $404.00 CAD
        projects: 5,
        seats: 10,
      },
      {
        name: 'Premium',
        description: '9 projects, 18 employee seats',
        priceUSD: 49900, // $499.00
        priceCAD: 67400, // $674.00 CAD
        projects: 9,
        seats: 18,
      },
      {
        name: 'Enterprise',
        description: 'Unlimited projects and employee seats',
        priceUSD: 89900, // $899.00
        priceCAD: 121400, // $1214.00 CAD
        projects: -1, // unlimited
        seats: -1, // unlimited
      },
    ];

    const tierPriceIds: Record<string, { usd: string; cad: string }> = {};

    for (const tier of tiers) {
      // Create product (shared for both currencies)
      const product = await stripe.products.create({
        name: `Rope Access Pro - ${tier.name}`,
        description: tier.description,
        metadata: {
          tier: tier.name.toLowerCase(),
          maxProjects: tier.projects.toString(),
          maxSeats: tier.seats.toString(),
        },
      });

      // Create USD price (recurring monthly)
      const priceUSD = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.priceUSD,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          tier: tier.name.toLowerCase(),
          currency: 'usd',
        },
      });

      // Create CAD price (recurring monthly)
      const priceCAD = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.priceCAD,
        currency: 'cad',
        recurring: {
          interval: 'month',
        },
        metadata: {
          tier: tier.name.toLowerCase(),
          currency: 'cad',
        },
      });

      tierPriceIds[tier.name.toLowerCase()] = {
        usd: priceUSD.id,
        cad: priceCAD.id,
      };
      console.log(`✅ ${tier.name}:`);
      console.log(`   USD: ${priceUSD.id} ($${tier.priceUSD / 100}/mo)`);
      console.log(`   CAD: ${priceCAD.id} ($${tier.priceCAD / 100} CAD/mo)`);
    }

    // Add-ons
    console.log('\n📦 Creating Add-ons (USD + CAD)...\n');

    // Extra Seats (2 seats) - One-time
    const extraSeatsProduct = await stripe.products.create({
      name: 'Extra Seats (2)',
      description: 'Add 2 additional employee seats to your subscription',
      metadata: { type: 'addon', seats: '2' },
    });
    const extraSeatsPriceUSD = await stripe.prices.create({
      product: extraSeatsProduct.id,
      unit_amount: 1900, // $19.00
      currency: 'usd',
      metadata: { type: 'addon', currency: 'usd' },
    });
    const extraSeatsPriceCAD = await stripe.prices.create({
      product: extraSeatsProduct.id,
      unit_amount: 2600, // $26.00 CAD
      currency: 'cad',
      metadata: { type: 'addon', currency: 'cad' },
    });
    console.log(`✅ Extra Seats:`);
    console.log(`   USD: ${extraSeatsPriceUSD.id} ($19)`);
    console.log(`   CAD: ${extraSeatsPriceCAD.id} ($26 CAD)`);

    // Extra Project - One-time
    const extraProjectProduct = await stripe.products.create({
      name: 'Extra Project',
      description: 'Add 1 additional active project to your subscription',
      metadata: { type: 'addon', projects: '1' },
    });
    const extraProjectPriceUSD = await stripe.prices.create({
      product: extraProjectProduct.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      metadata: { type: 'addon', currency: 'usd' },
    });
    const extraProjectPriceCAD = await stripe.prices.create({
      product: extraProjectProduct.id,
      unit_amount: 6700, // $67.00 CAD
      currency: 'cad',
      metadata: { type: 'addon', currency: 'cad' },
    });
    console.log(`✅ Extra Project:`);
    console.log(`   USD: ${extraProjectPriceUSD.id} ($49)`);
    console.log(`   CAD: ${extraProjectPriceCAD.id} ($67 CAD)`);

    // White Label Branding - Recurring monthly
    const brandingProduct = await stripe.products.create({
      name: 'White Label Branding',
      description: 'Customize the platform with your company logo and brand colors',
      metadata: { type: 'addon', feature: 'branding' },
    });
    const brandingPriceUSD = await stripe.prices.create({
      product: brandingProduct.id,
      unit_amount: 49, // $0.49
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon', currency: 'usd' },
    });
    const brandingPriceCAD = await stripe.prices.create({
      product: brandingProduct.id,
      unit_amount: 67, // $0.67 CAD
      currency: 'cad',
      recurring: {
        interval: 'month',
      },
      metadata: { type: 'addon', currency: 'cad' },
    });
    console.log(`✅ White Label Branding:`);
    console.log(`   USD: ${brandingPriceUSD.id} ($0.49/mo)`);
    console.log(`   CAD: ${brandingPriceCAD.id} ($0.67 CAD/mo)`);

    // Print summary with price IDs
    console.log('\n\n🎉 All Products Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 PRICE IDs (save these for your code):\n');
    console.log('Subscription Tiers (USD):');
    Object.entries(tierPriceIds).forEach(([tier, prices]) => {
      console.log(`  ${tier}_usd: ${prices.usd}`);
    });
    console.log('\nSubscription Tiers (CAD):');
    Object.entries(tierPriceIds).forEach(([tier, prices]) => {
      console.log(`  ${tier}_cad: ${prices.cad}`);
    });
    console.log('\nAdd-ons (USD):');
    console.log(`  extra_seats_usd: ${extraSeatsPriceUSD.id}`);
    console.log(`  extra_project_usd: ${extraProjectPriceUSD.id}`);
    console.log(`  white_label_usd: ${brandingPriceUSD.id}`);
    console.log('\nAdd-ons (CAD):');
    console.log(`  extra_seats_cad: ${extraSeatsPriceCAD.id}`);
    console.log(`  extra_project_cad: ${extraProjectPriceCAD.id}`);
    console.log(`  white_label_cad: ${brandingPriceCAD.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Return all IDs for programmatic use
    return {
      tiers: tierPriceIds,
      addons: {
        extra_seats: { usd: extraSeatsPriceUSD.id, cad: extraSeatsPriceCAD.id },
        extra_project: { usd: extraProjectPriceUSD.id, cad: extraProjectPriceCAD.id },
        white_label: { usd: brandingPriceUSD.id, cad: brandingPriceCAD.id },
      },
    };
  } catch (error) {
    console.error('❌ Error creating Stripe products:', error);
    throw error;
  }
}

// Run immediately
setupStripeProducts()
  .then(() => {
    console.log('✅ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });

export { setupStripeProducts };
