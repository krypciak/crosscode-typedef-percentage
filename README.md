# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/CCDirectLink/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` argument in `main.ts` for your ultimate-crosscode-typedefs repo path  

Results as for [this commit (Jun 4 2024)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/cd3d249eef2b4f36e8f66e51c15259b40c001cbc)
```js
classes: total: 1828, typedefs: 505, 27.63%
fields: total: 10874, typedefs: 1883, 17.32%
functions: total: 8580, typedefs: 1489, 17.35%
total (avg % of classes + fields + functions): 20.77%
```

## Generated graph

![image](https://github.com/krypciak/crosscode-typedef-percentage/assets/115574014/0aca0404-6f5b-4653-8b62-6ce0bd1ad956)

```bash
cd graph
# grap latest data, remember to change the repo path in this file
bun generateDataPoints.ts
# start parcel web server
npm run dev
# now visit the page and grap a screenshot
```
