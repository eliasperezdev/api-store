import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando el seeding...')

  // 1. Limpiar base de datos (Borrar datos viejos)
  // El orden es importante por las relaciones (Foreign Keys)
  // Primero borramos items de ordenes, luego ordenes, productos y al final categorías.
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🧹 Base de datos limpiada.')

  // 2. Definir los datos a insertar
  const categoriesData = [
    {
      name: 'Electrónica',
      products: {
        create: [
          { name: 'Auriculares Bluetooth', description: 'Cancelación de ruido', price: 15000, stock: 50 },
          { name: 'Teclado Mecánico', description: 'Switches Blue', price: 45000, stock: 20 },
          { name: 'Monitor 24"', description: 'Full HD 75Hz', price: 120000, stock: 10 },
        ],
      },
    },
    {
      name: 'Ropa',
      products: {
        create: [
          { name: 'Remera Básica', description: 'Algodón 100%', price: 8000, stock: 100 },
          { name: 'Zapatillas Running', description: 'Suela amortiguada', price: 65000, stock: 15 },
        ],
      },
    },
    {
      name: 'Hogar',
      products: {
        create: [
          { name: 'Lámpara LED', description: 'Luz cálida', price: 3500, stock: 200 },
          { name: 'Cafetera Filtro', description: 'Capacidad 1L', price: 35000, stock: 30 },
        ],
      },
    },
  ]

  // 3. Insertar en la base de datos
  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: cat,
    })
    console.log(`✅ Categoría creada: ${category.name} con sus productos.`)
  }

  console.log('🌱 Seeding finalizado con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })