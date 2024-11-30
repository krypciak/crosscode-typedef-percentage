# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/krypciak/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` argument in `main.ts` for your ultimate-crosscode-typedefs repo path  

Results as for [this commit (Nov 30 2024) ()](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/781ea0f2c25bd2249db12b7509dcb77cfd032827)
```js
classes: total: 1828, typedefs: 556, 30.42%
fields: total: 10874, typedefs: 2421, 22.26%
functions: total: 8580, typedefs: 1931, 22.51%
total (avg % of classes + fields + functions): 25.06%
```

## Typedef coverage over time

![image](https://github.com/user-attachments/assets/44965ed1-3a41-47a3-9659-88c0144dc5a9)


### Genereting the graph

```bash
cd graph
# grap latest data, remember to change the repo path in this file
bun generateDataPoints.ts
# start parcel web server
npm run dev
# now visit the page and grap a screenshot
```
