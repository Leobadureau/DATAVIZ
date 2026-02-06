const driverChart = echarts.init(document.getElementById('driverChart'));

const colorMap = {
  "Red Bull Racing": "#213395",
  "McLaren": "#FF8700",
  "Mercedes": "#00D2BE",
  "Ferrari": "#DC0000",
  "Alpine F1 Team": "#0090FF",
  "AlphaTauri": "#4B5563",
  "Toro Rosso": "#4B5563",
  "Aston Martin": "#006F62",
  "Williams": "#005AFF",
  "Haas F1 Team": "#FFFFFF",
  "Alfa Romeo": "#900000",
  "Sauber": "#900000",
  "Renault": "#FFFF00",
  "Racing Point": "#FF33CC",
  "Force India": "#CC6600",
  "Lotus F1": "#86995B",
  "BMW Sauber": "#0033A0"
};

Promise.all([
  fetch('Json/drivers.json').then(res => res.json()),
  fetch('Json/driver_standings.json').then(res => res.json()),
  fetch('Json/races.json').then(res => res.json()),
  fetch('Jon/constructors.json').then(res => res.json()),
  fetch('Json/results.json').then(res => res.json()),
  fetch('Json/team.json').then(res => res.json())
]).then(([drivers, standings, races, constructors, results, teamData]) => {
  const raceMap = new Map(races.map(r => [r.raceId, { year: r.year, round: r.round }]));
  const constructorMap = new Map(constructors.map(c => [c.constructorId.toString(), c.name]));

  standings.forEach(s => {
    const race = raceMap.get(s.raceId);
    if (race) {
      s.year = race.year;
      s.round = race.round;
    }
    s.driverId = s.driverId.toString();
    s.points = +s.points;
  });

  results.forEach(r => {
    r.driverId = r.driverId.toString();
    r.constructorId = r.constructorId.toString();
    const race = raceMap.get(r.raceId);
    r.year = race ? race.year : null;
    r.round = race ? race.round : null;
    r.points = +r.points;
  });

  const driverNameToConstructor = new Map();
  for (const yearStr in teamData) {
    const year = +yearStr;
    if (!teamData.hasOwnProperty(yearStr)) continue;
    teamData[yearStr].forEach(pair => {
      const key = `${pair.driver}_${year}`;
      driverNameToConstructor.set(key, pair.constructor);
    });
  }

  const years = Array.from(new Set(standings.map(s => s.year)))
    .filter(y => y >= 2015 && y <= 2025)
    .sort((a, b) => b - a);

  const select = document.getElementById("yearSelectPilote");
  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    select.appendChild(opt);
  });

  function updateChart(year) {
    const filteredStandings = standings.filter(s => s.year === year);

    const lastStandingByDriver = new Map();
    filteredStandings.forEach(s => {
      const cur = lastStandingByDriver.get(s.driverId);
      if (!cur || s.round > cur.round) {
        lastStandingByDriver.set(s.driverId, s);
      }
    });

    const driversWithPoints = drivers
      .filter(d => lastStandingByDriver.has(d.driverId.toString()))
      .map(d => {
        const st = lastStandingByDriver.get(d.driverId.toString());
        const fullName = d.forename + ' ' + d.surname;
        const key = `${fullName}_${year}`;
        const constrName = driverNameToConstructor.get(key) || null;
        return {
          name: fullName,
          points: st.points,
          constructorName: constrName
        };
      });

    driversWithPoints.sort((a, b) => b.points - a.points);

    const names = driversWithPoints.map(d => d.name);
    const pointVals = driversWithPoints.map(d => d.points);

    driverChart.setOption({
      backgroundColor: '#1e1e1e',
      title: {
        text: `Championnat Pilote ${year}`,
        left: 'center',
        textStyle: { color: '#fff' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex;
          const driver = params[0].name;
          const points = params[0].value;
          const team = driversWithPoints[dataIndex].constructorName || 'Inconnue';
          return `<strong>${driver}</strong><br/>Équipe : ${team}<br/>Points : ${points}`;
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '5%',
        top: 60,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff' }
      },
      yAxis: {
        type: 'category',
        data: names,
        inverse: true,
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff' }
      },
      series: [{
        type: 'bar',
        data: pointVals,
        itemStyle: {
          color: function (params) {
            const drv = driversWithPoints[params.dataIndex];
            const constr = drv.constructorName;
            return colorMap[constr] || "#888";
          }
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff'
        }
      }]
    });
  }

  updateChart(years[0]);

  select.addEventListener("change", function () {
    updateChart(+this.value);
  });

}).catch(err => {
  console.error("Erreur dans la section pilotes :", err);
});
