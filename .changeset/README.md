# Changesets

Every pull request that changes a published package adds a changeset:

```bash
pnpm changeset
```

All `@stop-ui/*` packages share one version, so `@stop-ui/react@1.4.0` always works with
`@stop-ui/core@1.4.0`. See [Changesets](https://github.com/changesets/changesets) for details.
