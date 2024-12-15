# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/krypciak/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` argument in `main.ts` for your ultimate-crosscode-typedefs repo path  

Results as for [this commit (Dec 15 2024)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/f0e7c547c1c117bb3ccdbdd076c0638fd02fed81)
```js
classes: total: 1828, typedefs: 567, 31.02%
fields: total: 10874, typedefs: 2532, 23.28%
functions: total: 8580, typedefs: 2059, 24.00%
total (avg % of classes + fields + functions): 26.10%
```

## Typedef coverage over time

![image](https://github.com/user-attachments/assets/b391ba89-d87a-4bcf-a330-2dd494e028f7)

### Genereting the graph

```bash
cd graph
# grap latest data, remember to change the repo path in this file
bun generateDataPoints.ts
# start parcel web server
npm run dev
# now visit the page and grap a screenshot
```
