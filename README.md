# Online Shopping Sales Analysis: Grouping & Aggregation Explorer

A complete full-stack Next.js 14 web application featuring dynamic dataset grouping, client-side Pandas simulation, visual charting with Recharts, and an active SQLite backend managed via Prisma ORM.

## Project Structure
```
online-shopping-sales-analysis/
├── app/
│   ├── api/
│   │   └── sales/
│   │       └── route.ts        # GET & POST API routes for sales data
│   ├── globals.css             # Tailwind base styles
│   ├── layout.tsx              # Application layout root
│   └── page.tsx                # Dynamic Dashboard UI & Aggregation Engine
├── lib/
│   └── prisma.ts               # Prisma ORM Singleton Client instance
├── prisma/
│   ├── schema.prisma           # SQLite Database Schema definition
│   └── seed.ts                 # Database Seeder script (180 initial records)
├── package.json
└── README.md
```

## How to Run & Deploy

### Local Development Setup
1. Extract the zip file and navigate into the project directory:
   ```bash
   cd online-shopping-sales-analysis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize SQLite Database & Run Migrations:
   ```bash
   npx prisma db push
   ```

4. Seed the Database with 180 initial sales transactions:
   ```bash
   npm run db:seed
   ```

5. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Location & Inspection

### Where is the Database Stored?
- The SQLite database file is generated directly inside the project root at:
  `prisma/dev.db`
- All application sales data, newly added transactions, order dates, regions, and prices are persistently saved inside this single `dev.db` file.

### How to View/Inspect SQLite Database Data?
1. **Prisma Studio (Recommended UI):**
   Run the following command in your terminal:
   ```bash
   npx prisma studio
   ```
   This will automatically open an interactive database visualizer in your browser at `http://localhost:5555`. You can directly browse, add, edit, or delete records visually.

2. **VS Code Extension:**
   Install the **"SQLite Viewer"** or **"Database Client"** extension in VS Code and open `prisma/dev.db`.

3. **DB Browser for SQLite:**
   Download the standalone app [DB Browser for SQLite](https://sqlitebrowser.org/) and open `prisma/dev.db`.
