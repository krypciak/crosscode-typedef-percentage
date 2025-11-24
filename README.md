# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/krypciak/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` and `gameCompiledPath` argument in `src/generate-data-points.ts` for your ultimate-crosscode-typedefs repo and game code paths  

Results as for [this commit (November 24 2025)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/2f12a8541ed83cc2ef6d4d30aaa1eb4bf4663080)
```js
classes        total:  1793  typedefs:  1379  76.91%
methods        total: 10460  typedefs:  7121  68.08%
functions      total:   143  typedefs:    36  25.17%
localFunctions total:   125  typedefs:     7  5.60%
fields         total:  8631  typedefs:  5799  67.19%
total          total: 21152  typedefs: 14342  67.80%
```

## Typedef coverage over time

<img width="1279" height="434" alt="image" src="https://github.com/user-attachments/assets/a91bb451-1633-43bd-a651-f63d32f22816" />


### Genereting the graph

```bash
pnpm install
# grab latest data, remember to change the repo path in this file
pnpm run generateDataPoints
# start parcel web server
pnpm run dev
```
