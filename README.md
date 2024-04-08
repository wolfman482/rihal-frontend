## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

to run docker:
```bash
docker build -t nextjs_docker:dev .
docker run --publish 3000:3000 nextjs_docker:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




