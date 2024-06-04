import Chart from 'chart.js/auto'
import dataPointsArr from './dataPoints.json'
import 'chartjs-adapter-date-fns'

type Entry = (typeof dataPointsArr)[any]
;(async function () {
    dataPointsArr.reverse()

    const dataPoints: Entry[] = []
    for (let i = 0, j = 0; i < dataPointsArr.length; i++, j++) {
        const e = dataPointsArr[i]

        let avgLast: number
        {
            const firstI = -30
            const lastI = 50
            let offsetI = 100
            const sliceArr = dataPoints.slice(i + offsetI + firstI, i).concat(dataPointsArr.slice(i, i + offsetI + lastI))
            if (sliceArr.length == 0) {
                avgLast = e.typedefData.classes
            } else avgLast = sliceArr.reduce((acc: number, v: Entry) => v.typedefData.classes + acc, 0) / sliceArr.length
        }
        let avgFirst: number
        {
            const firstI = 15
            const lastI = 1
            let offsetI = -20
            const sliceArr = dataPoints.slice(j + offsetI + firstI, j).concat(dataPointsArr.slice(i, i + offsetI + lastI))
            if (sliceArr.length == 0) {
                avgFirst = e.typedefData.classes
            } else avgFirst = sliceArr.reduce((acc: number, v: Entry) => v.typedefData.classes + acc, 0) / sliceArr.length
        }

        if (e.typedefData.classes - avgFirst < 0 || e.typedefData.classes - avgLast > 0) {
            j--
            continue
        }
        dataPoints.push(e)
    }

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    new Chart(canvas, {
        type: 'line',

        data: {
            labels: dataPoints.map(e => e.date * 1000),
            datasets: [
                {
                    label: 'Classes',
                    data: dataPoints.map(e => e.typedefData.classes),
                    backgroundColor: 'blue',
                },
                {
                    label: 'Functions',
                    data: dataPoints.map(e => e.typedefData.functions),
                    backgroundColor: 'limegreen',
                },
                {
                    label: 'Fields',
                    data: dataPoints.map(e => e.typedefData.fields),
                    backgroundColor: 'purple',
                },
                // {
                //     label: 'Average',
                //     data: dataPoints.map(e => (e.typedefData.classes + e.typedefData.functions + e.typedefData.fields) / 3),
                //     backgroundColor: 'red',
                // },
            ],
        },
        options: {
            aspectRatio: 3,
            scales: {
                x: {
                    type: 'timeseries',
                },
                y: {
                    ticks: {
                        callback: value => value + '%',
                    },
                    // suggestedMax: 100
                },
            },
        },
    })
})()
