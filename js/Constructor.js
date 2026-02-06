const chart = echarts.init(document.getElementById('chart'));

Promise.all([
  fetch("./Json/constructors.json").then(r => r.json()),
  fetch("./Json/constructor_results.json").then(r => r.json()),
  fetch("./Json/races.json").then(r => r.json())
]).then(([constructors, results, races]) => {

  const racesMap = new Map(races.map(r => [r.raceId, { year: r.year, round: r.round }]));
  const constructorMap = new Map(constructors.map(c => [c.constructorId, c.name]));

  results.forEach(r => {
    const race = racesMap.get(r.raceId);
    r.year = race.year;
    r.round = race.round;
    r.constructorName = constructorMap.get(r.constructorId);
    r.points = +r.points;
  });

  const years = Array.from(new Set(results.map(d => d.year)))
    .filter(y => y >= 2015 && y <= 2025)
    .sort((a, b) => b - a);

  const select = document.getElementById("yearSelect");
  years.forEach(y => {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    select.appendChild(option);
  });

  function drawChart(year) {
    chart.clear();

    const yearResults = results.filter(r => r.year === year);
    const rounds = races
      .filter(r => r.year === year)
      .map(r => r.round)
      .sort((a, b) => a - b);

    const grouped = new Map();

    for (const r of yearResults) {
      const name = r.constructorName;
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name).push(r);
    }

    const series = [];

    grouped.forEach((entries, constructor) => {
      let sum = 0;
      const dataMap = new Map(entries.map(d => [d.round, d.points]));

      const data = rounds.map(round => {
        if (dataMap.has(round)) {
          sum += dataMap.get(round);
        }
        return [round, sum];
      });

      series.push({
        name: constructor,
        type: 'line',
        data,
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 3 },
        itemStyle: { color: colorMap[constructor] || '#aaa' }
      });
    });

    series.sort((a, b) => {
      const aLast = a.data[a.data.length - 1][1];
      const bLast = b.data[b.data.length - 1][1];
      return bLast - aLast;
    });

    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: {
        left: 60,
        right: 150,
        bottom: 50,
        top: 70
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'middle',
        textStyle: { color: '#fff' },
        type: 'scroll',
        data: series.map(s => s.name)
      },
      xAxis: {
        type: 'category',
        data: rounds,
        name: 'Course',
        nameTextStyle: { color: '#fff' },
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        name: 'Points cumulés',
        nameTextStyle: { color: '#fff' },
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } },
        splitLine: { lineStyle: { color: '#444' } }
      },
      series
    });

    updateRanking(year, series);
  }

  function updateRanking(year, series) {
    const ranking = document.getElementById("ranking");
    ranking.innerHTML = '';
    document.getElementById("rankingTitle").textContent = `Classement ${year}`;

    const finalScores = series.map(s => {
      const last = s.data[s.data.length - 1];
      return { constructor: s.name, points: last[1] };
    }).sort((a, b) => b.points - a.points);

    finalScores.forEach(team => {
      const li = document.createElement("li");
      li.style.color = colorMap[team.constructor] || "#aaa";
      li.textContent = `${team.constructor} - ${team.points} pts`;
      ranking.appendChild(li);
    });
  }

  drawChart(years[0]);

  select.addEventListener("change", function () {
    drawChart(+this.value);
  });

}).catch(err => {
  console.error("Erreur dans la section constructeurs :", err);
});
