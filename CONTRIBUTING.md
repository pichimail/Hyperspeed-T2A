# Contributing to HyperSpeed T2A

Thanks for helping improve HyperSpeed T2A.

## Running locally

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Contribution priorities

Please prefer work that improves the real builder engine over cosmetic changes:

1. Project/file persistence and version checkpoints.
2. Patch-based edits and user-edited code preservation.
3. Self-correcting preview repair loop.
4. Better sandbox error visibility.
5. Public sharing, gallery, and dynamic OG generation.
6. Theme tokens and shadcn component registry.
7. Python/Streamlit runtime support.
8. Rate limiting, admin controls, and evals.

For larger changes, open an issue first with the intended schema, route, and UI changes.

## License

By contributing, you agree that your contributions are licensed under the project license.
