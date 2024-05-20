
const dailyDBReportEmail = (citiesAverages, areaAverages) => {
    return (
        `
        <div>
            <h2>Reporte Diario Base Datos CommercialCity</h2>
            <h5>Fecha: ${citiesAverages.date.toISOString().slice(0, 10)}</h5>
            <ul>
                ${ citiesAverages.data.map(item => (
                    `<li><strong>Ciudad: </strong> ${item.city} / <strong>Cantidad: </strong>${item.samplesLength} / <strong>Promedio: </strong>${item.avgPrice} uf/m2</li>`
                ))}
            </ul>
            ${ areaAverages.map(area => (
                `
                <h2>${area.city}</h2>
                <table>
                    <tr>
                        <thead>
                            <th>Area</th>
                            <th>Numero de Muestras</th>
                            <th>Promedio</th>
                        </thead>
                    </tr>
                    ${ area.data.map(area => (
                        `
                        <tbody>
                            <tr>
                                <td><strong>${area.area}</strong></td>
                                <td style="text-align:center;">${area.samplesLength}</td>
                                <td>${area.avg} uf/m2</td>
                            </tr>
                        </tbody>
                        `
                    ))}
                </table>
                `
            ))}
        </div>
        `
    )
}

module.exports = dailyDBReportEmail
