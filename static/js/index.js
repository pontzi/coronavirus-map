import styles from "./styles.js"

const mapContainer = document.querySelector("#map");
const map = new window.google.maps.Map(mapContainer, {
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 3,
  styles
});
const info = new window.google.maps.InfoWindow();

const content = ({
  confirmed,
  deaths,
  recovered,
  provincestate,
  countryregion,
}) => {
  return `
    <div>
      <p> <b>${provincestate} - ${countryregion} </b> </p>
      <p>Confirmed: ${confirmed}</p>
      <p>Deaths: ${deaths}</p>
      <p>Recovered: ${recovered}</p>
    </div>
  `;
};

const getData = async () => {
  const response = await fetch(
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest"
  );
  const data = await response.json();
  return data;
};

const renderData = async () => {
  const data = await getData();
  data.forEach((country) => {
    if (country.confirmed > 0) {
      const marker = new window.google.maps.Marker({
        position: {
          lat: country.location.lat,
          lng: country.location.lng,
        },
        map,
        icon: "../static/images/covid.png",
      });
      marker.addListener("click", () => {
        info.setContent(content(country));
        info.open(map, marker);
      });
    }
  });
};

renderData();
