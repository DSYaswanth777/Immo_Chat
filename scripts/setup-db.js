const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@immochat.com' },
      update: {},
      create: {
        email: 'admin@immochat.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+39 333 123 4567',
        company: 'Immochat Admin',
        bio: 'Administrator of the Immochat platform'
      }
    })

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 12)
    const customer = await prisma.user.upsert({
      where: { email: 'customer@immochat.com' },
      update: {},
      create: {
        email: 'customer@immochat.com',
        name: 'Customer User',
        password: customerPassword,
        role: 'CUSTOMER',
        phone: '+39 333 987 6543',
        company: 'Real Estate Customer',
        bio: 'Customer user for testing'
      }
    })

    // Create test user for credentials login
    const testPassword = await bcrypt.hash('password123', 12)
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: testPassword,
        role: 'ADMIN',
        phone: '+39 333 456 7890',
        company: 'Test Company'
      }
    })

    // Create sample properties
    const property1 = await prisma.property.create({
      data: {
        title: 'Appartamento Moderno Milano Centro',
        description: 'Bellissimo appartamento nel cuore di Milano, completamente ristrutturato con finiture di lusso. Situato in una zona strategica con tutti i servizi a portata di mano.',
        type: 'APARTMENT',
        status: 'FOR_SALE',
        address: 'Via Montenapoleone 12',
        city: 'Milano',
        state: 'Lombardia',
        zipCode: '20121',
        country: 'Italy',
        latitude: 45.4654,
        longitude: 9.1859,
        price: 650000,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        yearBuilt: 2020,
        floors: 1,
        parking: 1,
        features: JSON.stringify(['Balcone', 'Ascensore', 'Aria Condizionata', 'Parcheggio']),
        images: JSON.stringify(['/images/property1.jpg']),
        ownerId: admin.id
      }
    })

    const property2 = await prisma.property.create({
      data: {
        title: 'Villa con Giardino Roma Nord',
        description: 'Splendida villa indipendente con ampio giardino e piscina, ideale per famiglie. Zona residenziale tranquilla e ben collegata.',
        type: 'VILLA',
        status: 'FOR_SALE',
        address: 'Via Cassia 245',
        city: 'Roma',
        state: 'Lazio',
        zipCode: '00123',
        country: 'Italy',
        latitude: 41.9028,
        longitude: 12.4964,
        price: 890000,
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        lotSize: 500,
        yearBuilt: 2018,
        floors: 2,
        parking: 2,
        features: JSON.stringify(['Giardino', 'Piscina', 'Garage', 'Camino']),
        images: JSON.stringify(['/images/property2.jpg']),
        ownerId: customer.id
      }
    })

    const property3 = await prisma.property.create({
      data: {
        title: 'Attico con Terrazza Napoli',
        description: 'Attico di lusso con terrazza panoramica e vista sul Golfo di Napoli. Completamente arredato e pronto per essere abitato.',
        type: 'APARTMENT',
        status: 'FOR_RENT',
        address: 'Via Partenope 48',
        city: 'Napoli',
        state: 'Campania',
        zipCode: '80121',
        country: 'Italy',
        latitude: 40.8518,
        longitude: 14.2681,
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        yearBuilt: 2019,
        floors: 1,
        parking: 1,
        features: JSON.stringify(['Terrazza', 'Vista Mare', 'Ascensore', 'Aria Condizionata']),
        images: JSON.stringify(['/images/property3.jpg']),
        ownerId: testUser.id
      }
    })

    console.log('✅ Database setup completed!')
    console.log('\n📊 Created:')
    console.log(`- ${admin.name} (${admin.email}) - ADMIN`)
    console.log(`- ${customer.name} (${customer.email}) - CUSTOMER`)
    console.log(`- ${testUser.name} (${testUser.email}) - ADMIN`)
    console.log(`- ${property1.title}`)
    console.log(`- ${property2.title}`)
    console.log(`- ${property3.title}`)
    
    console.log('\n🔑 Test Credentials:')
    console.log('Admin: admin@immochat.com / admin123')
    console.log('Customer: customer@immochat.com / customer123')
    console.log('Test User: test@example.com / password123')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
