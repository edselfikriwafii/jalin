import 'dotenv/config'

// Script seed database Jalin
// Mengisi tabel Question dengan 10 soal latihan IELTS (5 Part 1 + 5 Part 2)
//
// Idempotent: menggunakan upsert dengan ID tetap —
// aman dijalankan berulang kali tanpa duplikasi data
//
// Jalankan dengan: npx prisma db seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seed soal IELTS...')

  // ============================================================
  // PART 1 — Deskripsi grafik, diagram, dan tabel
  // chartData dirender oleh Recharts di halaman soal
  // ============================================================

  // Soal 1: Bar Chart — Pengguna Internet
  await prisma.question.upsert({
    where: { id: 'seed-p1-q1' },
    update: {},
    create: {
      id: 'seed-p1-q1',
      type: 'PART1',
      topic: 'Bar Chart — Internet Users by Region',
      difficulty: 'EASY',
      body: `The bar chart below shows the percentage of internet users in five world regions in 2010, 2015, and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      chartData: {
        type: 'bar',
        title: 'Percentage of Internet Users by Region (2010, 2015, 2020)',
        xAxisLabel: 'Region',
        yAxisLabel: 'Percentage',
        unit: '%',
        series: ['2010', '2015', '2020'],
        data: [
          { name: 'N. America', '2010': 72, '2015': 85, '2020': 95 },
          { name: 'Europe',     '2010': 65, '2015': 79, '2020': 87 },
          { name: 'Asia Pac.',  '2010': 25, '2015': 43, '2020': 64 },
          { name: 'L. America', '2010': 33, '2015': 52, '2020': 70 },
          { name: 'Africa',     '2010': 8,  '2015': 19, '2020': 39 },
        ],
      },
    },
  })

  // Soal 2: Line Chart — Emisi CO₂ per Kapita
  await prisma.question.upsert({
    where: { id: 'seed-p1-q2' },
    update: {},
    create: {
      id: 'seed-p1-q2',
      type: 'PART1',
      topic: 'Line Chart — CO₂ Emissions per Capita',
      difficulty: 'MEDIUM',
      body: `The line graph below shows CO₂ emissions per capita (in tonnes) in four countries between 1990 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      chartData: {
        type: 'line',
        title: 'CO₂ Emissions per Capita in Four Countries (1990–2020)',
        xAxisLabel: 'Year',
        yAxisLabel: 'Tonnes per capita',
        unit: 'tonnes',
        series: ['USA', 'China', 'Germany', 'India'],
        data: [
          { name: '1990', USA: 19.3, China: 2.1, Germany: 12.8, India: 0.8 },
          { name: '1995', USA: 19.8, China: 2.6, Germany: 11.2, India: 0.9 },
          { name: '2000', USA: 20.1, China: 2.9, Germany: 10.6, India: 1.1 },
          { name: '2005', USA: 19.5, China: 4.5, Germany: 9.9,  India: 1.3 },
          { name: '2010', USA: 17.6, China: 6.2, Germany: 9.3,  India: 1.6 },
          { name: '2015', USA: 16.5, China: 7.1, Germany: 8.9,  India: 1.8 },
          { name: '2020', USA: 13.9, China: 7.4, Germany: 7.9,  India: 1.9 },
        ],
      },
    },
  })

  // Soal 3: Pie Chart — Sumber Energi Listrik
  await prisma.question.upsert({
    where: { id: 'seed-p1-q3' },
    update: {},
    create: {
      id: 'seed-p1-q3',
      type: 'PART1',
      topic: 'Pie Chart — Electricity Generation Sources',
      difficulty: 'EASY',
      body: `The pie chart below shows the proportion of electricity generated from different sources in Country X in 2022.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      chartData: {
        type: 'pie',
        title: 'Sources of Electricity Generation in Country X (2022)',
        unit: '%',
        data: [
          { name: 'Natural Gas', value: 32 },
          { name: 'Coal',        value: 25 },
          { name: 'Nuclear',     value: 20 },
          { name: 'Wind',        value: 12 },
          { name: 'Solar',       value: 7  },
          { name: 'Other',       value: 4  },
        ],
      },
    },
  })

  // Soal 4: Table — Statistik Pariwisata Internasional
  await prisma.question.upsert({
    where: { id: 'seed-p1-q4' },
    update: {},
    create: {
      id: 'seed-p1-q4',
      type: 'PART1',
      topic: 'Table — International Tourism Statistics',
      difficulty: 'MEDIUM',
      body: `The table below shows international tourism statistics for five countries in 2019.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      chartData: {
        type: 'table',
        title: 'International Tourism Statistics for Five Countries (2019)',
        columns: ['Country', 'Arrivals (millions)', 'Revenue (USD billions)', 'Avg. Stay (days)'],
        rows: [
          { Country: 'France',  'Arrivals (millions)': 89.4, 'Revenue (USD billions)': 63.8,  'Avg. Stay (days)': 4.2  },
          { Country: 'Spain',   'Arrivals (millions)': 83.5, 'Revenue (USD billions)': 79.7,  'Avg. Stay (days)': 7.1  },
          { Country: 'USA',     'Arrivals (millions)': 79.3, 'Revenue (USD billions)': 193.3, 'Avg. Stay (days)': 17.8 },
          { Country: 'China',   'Arrivals (millions)': 65.7, 'Revenue (USD billions)': 35.8,  'Avg. Stay (days)': 5.3  },
          { Country: 'Italy',   'Arrivals (millions)': 64.5, 'Revenue (USD billions)': 49.6,  'Avg. Stay (days)': 3.8  },
        ],
      },
    },
  })

  // Soal 5: Bar Chart — Populasi Urban vs Rural
  await prisma.question.upsert({
    where: { id: 'seed-p1-q5' },
    update: {},
    create: {
      id: 'seed-p1-q5',
      type: 'PART1',
      topic: 'Bar Chart — Urban vs Rural Population by Continent',
      difficulty: 'HARD',
      body: `The bar chart below compares the proportion of urban and rural populations across five continents in 2000 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
      chartData: {
        type: 'bar',
        title: 'Urban and Rural Population by Continent (2000 and 2020)',
        xAxisLabel: 'Continent',
        yAxisLabel: 'Percentage',
        unit: '%',
        series: ['Urban 2000', 'Urban 2020', 'Rural 2000', 'Rural 2020'],
        data: [
          { name: 'Africa',    'Urban 2000': 35, 'Urban 2020': 43, 'Rural 2000': 65, 'Rural 2020': 57 },
          { name: 'Asia',      'Urban 2000': 37, 'Urban 2020': 51, 'Rural 2000': 63, 'Rural 2020': 49 },
          { name: 'Europe',    'Urban 2000': 71, 'Urban 2020': 75, 'Rural 2000': 29, 'Rural 2020': 25 },
          { name: 'N. America','Urban 2000': 79, 'Urban 2020': 83, 'Rural 2000': 21, 'Rural 2020': 17 },
          { name: 'S. America','Urban 2000': 76, 'Urban 2020': 81, 'Rural 2000': 24, 'Rural 2020': 19 },
        ],
      },
    },
  })

  // ============================================================
  // PART 2 — Esai argumentatif, diskusi, problem-solution, dll.
  // Tidak ada chartData untuk Part 2
  // ============================================================

  // Soal 6: Opinion — Teknologi dan Isolasi Sosial
  await prisma.question.upsert({
    where: { id: 'seed-p2-q1' },
    update: {},
    create: {
      id: 'seed-p2-q1',
      type: 'PART2',
      topic: 'Opinion — Technology and Social Isolation',
      difficulty: 'MEDIUM',
      body: `Some people believe that modern technology, such as smartphones and social media, has made people more socially isolated than ever before.

To what extent do you agree or disagree with this statement?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    },
  })

  // Soal 7: Discussion — Work from Home
  await prisma.question.upsert({
    where: { id: 'seed-p2-q2' },
    update: {},
    create: {
      id: 'seed-p2-q2',
      type: 'PART2',
      topic: 'Discussion — Working from Home',
      difficulty: 'MEDIUM',
      body: `Some people think that working from home has many benefits for both employees and employers. Others believe it creates more problems than it solves.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    },
  })

  // Soal 8: Problem-Solution — Kemacetan Lalu Lintas
  await prisma.question.upsert({
    where: { id: 'seed-p2-q3' },
    update: {},
    create: {
      id: 'seed-p2-q3',
      type: 'PART2',
      topic: 'Problem-Solution — Traffic Congestion in Cities',
      difficulty: 'HARD',
      body: `In many cities around the world, traffic congestion has become a serious problem that affects people's quality of life and harms the environment.

What are the main causes of this problem? What measures could governments and individuals take to address it?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    },
  })

  // Soal 9: Advantages-Disadvantages — Belanja Online
  await prisma.question.upsert({
    where: { id: 'seed-p2-q4' },
    update: {},
    create: {
      id: 'seed-p2-q4',
      type: 'PART2',
      topic: 'Advantages & Disadvantages — Online Shopping',
      difficulty: 'EASY',
      body: `The rise of online shopping has significantly changed consumer behaviour worldwide, with more people choosing to buy goods and services through the internet rather than visiting physical stores.

What are the advantages and disadvantages of online shopping compared to traditional in-store shopping?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    },
  })

  // Soal 10: Direct Question — Pendidikan dan Pekerjaan
  await prisma.question.upsert({
    where: { id: 'seed-p2-q5' },
    update: {},
    create: {
      id: 'seed-p2-q5',
      type: 'PART2',
      topic: 'Direct Question — University Education and Employment',
      difficulty: 'HARD',
      body: `Today, more and more young people are choosing to study at university rather than entering the workforce directly after completing secondary school.

Why do you think this is happening? Is this a positive or negative development for individuals and society?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    },
  })

  console.log('✅ Seed selesai — 5 soal Part 1 + 5 soal Part 2 tersimpan.')
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
