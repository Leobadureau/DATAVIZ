const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const info = document.getElementById("info");

let circuits2025 = [];
let races2025 = [];

// ✅ Mapping circuitId -> image locale
const circuitImages = {
 bahrain: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.webp",
  jeddah: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackjeddahdetailed.webp",
  albert_park: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmelbournedetailed.webp",
  miami: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmiamidetailed.webp",
  monaco: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmontecarlodetailed.webp",
  imola: "https://formulapedia.com/wp-content/uploads/2023/01/Emilia-Romagna-Imola-Circuit-map.png",
  montmelo: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackcatalunyadetailed.webp",
  gilles_villeneuve: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmontrealdetailed.webp",
  red_bull_ring: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackspielbergdetailed.webp",
  silverstone: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksilverstonedetailed.webp",
  spa: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackspafrancorchampsdetailed.webp",
  hungaroring: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackhungaroringdetailed.webp",
  zandvoort: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackzandvoortdetailed.webp",
  monza: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmonzadetailed.webp",
  baku: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackbakudetailed.webp",
  marina_bay: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksingaporedetailed.webp",
  austin: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackaustindetailed.webp",
  hermanos_rodriguez: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmexicocitydetailed.webp",
  interlagos: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackinterlagosdetailed.webp",
  vegas: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracklasvegasdetailed.webp",
  lusail: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracklusaildetailed.webp",
  yas_marina: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackyasmarinacircuitdetailed.webp",
  shanghai: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackshanghaidetailed.webp",
  suzuka: "https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksuzukadetailed.webp",
};

// ✅ Mapping circuitId -> drapeau
const circuitFlags = {
  bahrain: "https://th.bing.com/th/id/R.25c22e5afa1443827b925e395e325a91?rik=qH%2fFRVpzzdFrzQ&riu=http%3a%2f%2fwww.drapeaux-du-monde.fr%2fdrapeaux-du-monde%2f3000%2fdrapeau-bahrein.jpg&ehk=4VHV4hXtQnInYkP9WIhwVsTV0eKH4uKy3MenJRrOpVk%3d&risl=&pid=ImgRaw&r=0",
  jeddah: "https://www.countryflags.com/wp-content/uploads/saudi-arabia-flag-png-large.png",
  albert_park: "https://th.bing.com/th/id/R.b9f48175dbfea709a3c28654459b1805?rik=bIc%2fhR%2by5MWfZA&riu=http%3a%2f%2fwww.drapeaux-du-monde.fr%2fdrapeaux-du-monde%2f3000%2fdrapeau-australie.jpg&ehk=WFOPk0pjl4m1Cd31lc5uoT2P%2fZzGngu5qnsMKGncdSI%3d&risl=&pid=ImgRaw&r=0",
  miami: "https://thumbs.dreamstime.com/b/drapeau-de-ville-miami-la-floride-usa-129226256.jpg",
  monaco: "https://tse3.mm.bing.net/th/id/OIP.VvX9vWzsMwRLPQsHKqpBrQHaF7?rs=1&pid=ImgDetMain&o=7&rm=3",
  imola: "https://clipground.com/images/italy-flag-png-7.png",
  montmelo: "https://tse2.mm.bing.net/th/id/OIP.agcTbSuLQCkZKsf8-SADcQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
  gilles_villeneuve: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Canada.png",
  red_bull_ring: "https://www.nouahsark.com/data/images/infocenter/worldwide/europe/flags_big/austria.png",
  silverstone: "https://static.vecteezy.com/system/resources/thumbnails/020/153/877/original/united-kingdom-flag-waving-in-wind-of-great-britain-and-northern-ireland-realistic-union-jack-flag-background-british-uk-flag-looping-closeup-1080p-full-hd-1920x1080-footage-united-kingdom-free-video.jpg",
  spa: "https://tse3.mm.bing.net/th/id/OIP.jro2pecFvLh6PVcKIBYNwQHaFL?rs=1&pid=ImgDetMain&o=7&rm=3",
  hungaroring: "https://cdn.britannica.com/55/1455-004-F3D1D26C/Flag-Hungary.jpg",
  zandvoort: "https://www.worldatlas.com/upload/b7/64/48/shutterstock-606897284.jpg",
  monza: "https://clipground.com/images/italy-flag-png-7.png",
  baku: "https://www.publicdomainpictures.net/pictures/340000/velka/flag-of-azerbaijan-1588676171Dkl.jpg",
  marina_bay: "https://cdn.britannica.com/36/4036-050-37052A78/Flag-Singapore.jpg",
  austin: "https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg",
  hermanos_rodriguez: "https://th.bing.com/th/id/R.0737629c397c86c1bb392066a06ba31a?rik=KGu3D5DE%2fWhhjw&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2f1%2f17%2fFlag_of_Mexico.png&ehk=MAXespfiLeO3ZBPldQ3%2fNDkCjzGo7hljFBd3yKgqLTY%3d&risl=&pid=ImgRaw&r=0",
  interlagos: "https://cdn.britannica.com/47/6847-004-7D668BB0/Flag-Brazil.jpg",
  vegas: "https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg",
  lusail: "https://cdn.britannica.com/76/5776-004-54A070FA/Flag-Qatar.jpg",
  yas_marina: "https://image.freepik.com/free-photo/uae-national-fabric-flag_113767-1541.jpg",
  shanghai: "https://www.worldatlas.com/upload/a6/ee/9d/shutterstock-104282006.jpg",
  suzuka: "https://tse3.mm.bing.net/th/id/OIP.CQe2YZJTOcujPbi8F76ZIQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
};


// 1️⃣ Récupère les circuits 2025
fetch("https://f1api.dev/api/2025/circuits")
  .then(res => res.json())
  .then(json => {
    circuits2025 = json.circuits || [];
    circuits2025.forEach(c => {
      const li = document.createElement("li");
      li.dataset.id = c.circuitId;
      const flagImg = circuitFlags[c.circuitId] ? `<img src="${circuitFlags[c.circuitId]}" alt="drapeau">` : "";
      li.innerHTML = `${flagImg} ${c.circuitName}`;
      dropdownMenu.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Erreur circuits 2025:", err);
    info.innerHTML = `<p style="color:red">Erreur chargement circuits : ${err.message}</p>`;
  });

// 2️⃣ Récupère les courses 2025
fetch("https://f1api.dev/api/2025/races")
  .then(res => {
    if (!res.ok) {
      console.warn("Aucune course trouvée pour 2025");
      return { races: [] }; // Retourne un tableau vide pour éviter les erreurs
    }
    return res.json();
  })
  .then(json => { races2025 = json.races || []; })
  .catch(err => console.error("Erreur fetch races 2025:", err));

// 3️⃣ Affichage des infos du circuit
dropdownMenu.addEventListener("click", e => {
  if (!e.target.closest("li")) return;
  const li = e.target.closest("li");
  const id = li.dataset.id;
  dropdownBtn.textContent = li.textContent; // Met le nom sélectionné
  dropdownMenu.style.display = "none";

  const circuit = circuits2025.find(c => c.circuitId === id);
  if (!circuit) return;

  const imgUrl = circuitImages[id] || `https://via.placeholder.com/800x400?text=${encodeURIComponent(circuit.circuitName)}`;
  const racesFor = races2025.filter(r => r.circuit && r.circuit.circuitId === id);
  let firstDate = null, lastDate = null;
  if (racesFor.length) {
    const dates = racesFor.map(r => new Date(r.schedule.race.date));
    firstDate = new Date(Math.min(...dates));
    lastDate = new Date(Math.max(...dates));
  }

 info.innerHTML = `
  <div class="team-card scroll-reveal" style="flex-direction: column; padding: 15px; height: auto;">
    <img class="circuit-img" src="${imgUrl}" alt="${circuit.circuitName}">
    <h3>${circuit.circuitName}</h3>
    <p><strong>Pays :</strong> ${circuit.country || "Inconnu"}</p>
    <p><strong>Ville :</strong> ${circuit.city || "Inconnu"}</p>
    <p><strong>Longueur :</strong> ${circuit.circuitLength || "Non dispo"} m</p>
    <p><strong>Record au tour :</strong> ${circuit.lapRecord || "Non dispo"}</p>
    <p><strong>Pilote record :</strong> ${circuit.fastestLapDriverId || "Non dispo"}</p>
    ${firstDate && lastDate ? `<p><strong>Première utilisation :</strong> ${firstDate.toLocaleDateString()}</p>
    <p><strong>Dernière utilisation :</strong> ${lastDate.toLocaleDateString()}</p>` : ""}
  </div>
`;



  const card = info.querySelector(".scroll-reveal");
  setTimeout(() => card.classList.add("visible"), 100);
});

// 4️⃣ Toggle dropdown
dropdownBtn.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// 5️⃣ Fermer si clic dehors
document.addEventListener("click", e => {
  if (!e.target.closest(".dropdown")) dropdownMenu.style.display = "none";
});
