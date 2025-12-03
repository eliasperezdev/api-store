import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando el seeding...')


  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🧹 Base de datos limpiada.')

const categoriesData = [
  {
    name: 'Electrónica',
    products: {
      create: [
        { name: 'Auriculares Bluetooth', description: 'Cancelación de ruido', price: 15000, stock: 50, image: "https://placehold.co/600x400" },
        { name: 'Teclado Mecánico', description: 'Switches Blue', price: 45000, stock: 20 },
        { name: 'Monitor 24"', description: 'Full HD 75Hz', price: 120000, stock: 10 },
        { name: 'Smartphone Android', description: '128GB RAM 6GB', price: 250000, stock: 25 },
        { name: 'Tablet 10"', description: 'Resolución 2K', price: 180000, stock: 15 },
        { name: 'Smartwatch', description: 'Monitoreo deportivo', price: 75000, stock: 40 },
        { name: 'Parlante Portátil', description: 'Resistente al agua', price: 32000, stock: 60 },
      ],
    },
  },
  {
    name: 'Ropa',
    products: {
      create: [
        { name: 'Remera Básica', description: 'Algodón 100%', price: 8000, stock: 100 },
        { name: 'Zapatillas Running', description: 'Suela amortiguada', price: 65000, stock: 15 },
        { name: 'Jean Slim Fit', description: 'Color azul oscuro', price: 28000, stock: 40 },
        { name: 'Camisa Formal', description: 'Manga larga', price: 35000, stock: 30 },
        { name: 'Buzo con Capucha', description: 'Algodón peinado', price: 42000, stock: 25 },
        { name: 'Chaqueta Impermeable', description: 'Para lluvia', price: 89000, stock: 20 },
      ],
    },
  },
  {
    name: 'Hogar',
    products: {
      create: [
        { name: 'Lámpara LED', description: 'Luz cálida', price: 3500, stock: 200 },
        { name: 'Cafetera Filtro', description: 'Capacidad 1L', price: 35000, stock: 30 },
        { name: 'Juego de Sábanas', description: 'Algodón egipcio', price: 22000, stock: 50 },
        { name: 'Aspiradora Robot', description: 'Programable', price: 120000, stock: 12 },
        { name: 'Set de Ollas', description: 'Acero inoxidable', price: 78000, stock: 18 },
        { name: 'Cortina Blackout', description: 'Impermeable', price: 45000, stock: 35 },
      ],
    },
  },
  {
    name: 'Deportes',
    products: {
      create: [
        { name: 'Pelota de Fútbol', description: 'Tamaño oficial', price: 25000, stock: 60 },
        { name: 'Raqueta de Tenis', description: 'Peso ligero', price: 95000, stock: 15 },
        { name: 'Bicicleta Mountain Bike', description: '21 velocidades', price: 320000, stock: 8 },
        { name: 'Set de Pesas', description: '20kg ajustables', price: 85000, stock: 25 },
        { name: 'Colchoneta Yoga', description: 'Antideslizante', price: 15000, stock: 70 },
        { name: 'Mochila Trekking', description: 'Impermeable 30L', price: 68000, stock: 22 },
      ],
    },
  },
  {
    name: 'Libros',
    products: {
      create: [
        { name: 'Novela Best Seller', description: 'Edición tapa dura', price: 12500, stock: 150 },
        { name: 'Libro de Cocina', description: '100 recetas', price: 18000, stock: 80 },
        { name: 'Guía de Viaje', description: 'Europa 2024', price: 22000, stock: 45 },
        { name: 'Fantasia Épica', description: 'Trilogía completa', price: 45000, stock: 30 },
        { name: 'Libro Infantil', description: 'Ilustrado a color', price: 9500, stock: 120 },
        { name: 'Biografía', description: 'Figura histórica', price: 28000, stock: 40 },
      ],
    },
  },
  {
    name: 'Juguetes',
    products: {
      create: [
        { name: 'Set de Lego', description: '1000 piezas', price: 55000, stock: 35 },
        { name: 'Muñeca Interactiva', description: 'Habla y camina', price: 32000, stock: 50 },
        { name: 'Juego de Mesa', description: 'Para 4 jugadores', price: 28000, stock: 60 },
        { name: 'Pistola de Agua', description: 'Capacidad 1L', price: 12000, stock: 100 },
        { name: 'Robot Programable', description: 'Para niños +8', price: 75000, stock: 20 },
        { name: 'Puzzle 1000 Piezas', description: 'Paisaje montañoso', price: 18000, stock: 45 },
      ],
    },
  },
  {
    name: 'Belleza',
    products: {
      create: [
        { name: 'Crema Hidratante', description: 'Para piel seca', price: 15000, stock: 90 },
        { name: 'Set de Maquillaje', description: 'Paleta completa', price: 45000, stock: 30 },
        { name: 'Perfume Eau de Toilette', description: 'Fragancia fresca', price: 68000, stock: 40 },
        { name: 'Secador de Pelo', description: '2200W', price: 35000, stock: 25 },
        { name: 'Cepillo Alisador', description: 'Iónico', price: 55000, stock: 18 },
        { name: 'Mascarilla Facial', description: 'Pack x6', price: 12000, stock: 110 },
      ],
    },
  },
  {
    name: 'Alimentos',
    products: {
      create: [
        { name: 'Aceite de Oliva Extra Virgen', description: '1L', price: 8500, stock: 200 },
        { name: 'Café Molido Premium', description: '500g', price: 6500, stock: 180 },
        { name: 'Chocolate Amargo', description: '70% cacao', price: 3200, stock: 250 },
        { name: 'Miel Orgánica', description: '500g', price: 7500, stock: 120 },
        { name: 'Pasta Artesanal', description: 'Pack x3', price: 5800, stock: 160 },
        { name: 'Salsa de Tomate', description: 'Sin conservantes', price: 4200, stock: 220 },
      ],
    },
  },
];

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