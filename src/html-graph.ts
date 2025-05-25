import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import type { DataPoint } from './generate-data-points'
import dataPointsArrRaw from './dataPoints.json'
const dataPointsArr: DataPoint[] = dataPointsArrRaw

;(async function () {
    dataPointsArr.sort((a, b) => a.date - b.date)

    const minDate = 0 // dataPointsArr[Math.floor(dataPointsArr.length)].date

    const dataPoints: DataPoint[] = []
    for (let i = 0; i < dataPointsArr.length; i++) {
        const e = dataPointsArr[i]
        if (e.date < minDate) continue

        const le = dataPoints[dataPoints.length - 1]
        if (!le) {
            dataPoints.push(e)
            continue
        }

        if (e.typedefData.classes.typed < le.typedefData.classes.typed) continue

        dataPoints.push(e)
    }

    console.log(dataPoints.map(e => e.date))
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    function percentage(data: { typed: number; untyped: number }): number {
        return 100 * (data.typed / (data.typed + data.untyped))
    }
    new Chart(canvas, {
        type: 'line',

        data: {
            labels: dataPoints.map(e => e.date * 1000),
            datasets: [
                {
                    label: 'Classes',
                    data: dataPoints.map(e => percentage(e.typedefData.classes)),
                    backgroundColor: 'blue',
                },
                {
                    label: 'Functions',
                    data: dataPoints.map(e => percentage(e.typedefData.functions)),
                    backgroundColor: 'limegreen',
                },
                {
                    label: 'Fields',
                    data: dataPoints.map(e => percentage(e.typedefData.fields)),
                    backgroundColor: 'purple',
                },
            ],
        },
        options: {
            aspectRatio: 3,
            scales: {
                x: {
                    type: 'time',
                },
                y: {
                    ticks: {
                        callback: value => value + '%',
                    },
                    // suggestedMax: 100
                },
            },
            elements: {
                line: {
                    spanGaps: true,
                },
            },
        },
    })
})()
