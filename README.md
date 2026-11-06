# Pharmacy Client

Next.js and TypeScript frontend for the Razeth HR portal, backed by the [Pharmacy API](https://github.com/Pizeth/pharmacy-api).

- Public HR pages and a searchable document library.
- Authenticated document tracking and administration for users, roles, translation keys, and social providers.
- Shared Material UI tables and cards, with TanStack Table for state and server-backed queries where supported.

## Local development

Use Node.js 22 and npm. Run the backend locally or use a development API you can sign into. Set `NEXT_PUBLIC_API_URL` to the API origin, for example `http://localhost:3000`. Configure the backend to trust `http://localhost:8080` for local sign-in.

```sh
npm ci
npm run dev
```

Open [localhost:8080](http://localhost:8080). Run `npm run typecheck`, `npm test`, or `npm run build` to verify changes.

See [HRD architecture](docs/hrd-architecture.md) for feature structure and [AGENTS.md](AGENTS.md) for contribution conventions.

## License

The project source code is available under the [MIT License](LICENSE). Third-party components and assets retain their respective licenses.
