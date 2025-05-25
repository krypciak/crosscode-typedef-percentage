# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/krypciak/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` and `gameCompiledPath` argument in `src/generate-data-points.ts` for your ultimate-crosscode-typedefs repo and game code paths  

Results as for [this commit (May 22 2025)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/a06a27682e34d07a7ea1a965f14f4138dedccbc7)
```js
classes: total: 1789, typedefs: 1334, 74.57%
functions: total: 10595, typedefs: 6297, 59.43%
fields: total: 8631, typedefs: 5275, 61.12%
total (avg % of classes + fields + functions): 65.04%
```

## Typedef coverage over time

![image](https://github.com/user-attachments/assets/7733cad1-d20c-4e65-b3c1-6df32a5a3476)

### Genereting the graph

```bash
pnpm install
# grab latest data, remember to change the repo path in this file
pnpm run generateDataPoints
# start parcel web server
pnpm run dev
```
