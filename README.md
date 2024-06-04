# crosscode-typedef-percentage
Generate the percentage the [ultimate-crosscode-typedefs](https://github.com/CCDirectLink/ultimate-crosscode-typedefs) cover of the game's all types  

To use replace the `repoPath` argument in `main.ts` for your ultimate-crosscode-typedefs repo path  
Also run `prettier --print-width 10000 -w .` in the `modules` directory in the `ultimate-crosscode-typedefs` repo  

Results as for [this commit (Jun 4 2024)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/cd3d249eef2b4f36e8f66e51c15259b40c001cbc)
```js
classes: total: 1828, typedefs: 505, 27.63%
fields: total: 10874, typedefs: 1883, 17.32%
functions: total: 8580, typedefs: 1489, 17.35%
total (avg % of classes + fields + functions): 20.77%
```


Results as for [this commit (Feb 4 2024)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/2b7bcbbcbebf65d1874c95467738ecf8d5868843):
```js
classes: total: 1828, typedefs: 389, 21.28%
fields: total: 10874, typedefs: 1219, 11.21%
functions: total: 8580, typedefs: 956, 11.14%
total (avg % of classes + fields + functions): 14.54%
```

Results for [this commit (Dec 5 2023)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/10787b86e96febf59c6e9f50d00bc76e24c15c3f)
```js
classes: total: 1828, typedefs: 345, 18.87%
fields: total: 10874, typedefs: 943, 8.67%
functions: total: 8580, typedefs: 731, 8.52%
total (avg % of classes + fields + functions): 12.02%
```

Results for [this commit (Oct 9 2023)](https://github.com/krypciak/ultimate-crosscode-typedefs/commit/5e782608fcea9c28fc71810a74dc17ce3ba611d4)
```js
classes: total: 1828, typedefs: 336, 18.38%
fields: total: 10874, typedefs: 824, 7.58%
functions: total: 8580, typedefs: 679, 7.91%
total (avg % of classes + fields + functions): 11.29%
```
