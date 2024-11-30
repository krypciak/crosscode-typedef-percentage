import Chart from 'chart.js/auto'
import dataPointsArr from './dataPoints.json'
import 'chartjs-adapter-date-fns'

type Entry = (typeof dataPointsArr)[any]
;(async function () {
    dataPointsArr.reverse()

    const dataPoints: Entry[] = []
    for (let i = 0; i < dataPointsArr.length; i++) {
        const e = dataPointsArr[i]
        const le = dataPoints[dataPoints.length - 1]
        if (!le) {
            dataPoints.push(e)
            continue
        }

        if (e.typedefData.classes < le.typedefData.classes) continue

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
