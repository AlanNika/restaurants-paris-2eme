// Données des restaurants avec leurs coordonnées géographiques
const restaurants = [
  {
    name: "Faggio",
    lat: 48.8698,
    lng: 2.3415,
    rating: "4.7/5",
    address: "Passage des Panoramas, 2ème Arrondissement, Paris",
    description: "Pizzeria italienne avec four à bois de hêtre"
  },
  {
    name: "La Bourse et la Vie",
    lat: 48.8687,
    lng: 2.3399,
    rating: "4.6/5",
    address: "12 Rue Vivienne, 2ème Arrondissement, Paris",
    description: "Gastronomie française dans un cadre élégant"
  },
  {
    name: "L'Entente",
    lat: 48.8711,
    lng: 2.3317,
    rating: "4.5/5",
    address: "Près de l'Opéra Garnier, 2ème Arrondissement, Paris",
    description: "Brasserie anglaise d'excellence"
  },
  {
    name: "Liza",
    lat: 48.8700,
    lng: 2.3386,
    rating: "4.5/5",
    address: "14 Rue de la Banque, 2ème Arrondissement, Paris",
    description: "Cuisine libanaise raffinée dans un décor élégant"
  },
  {
    name: "Les Noces de Jeannette",
    lat: 48.8712,
    lng: 2.3363,
    rating: "4.4/5",
    address: "Près de la salle Favart, 2ème Arrondissement, Paris",
    description: "Bistrot traditionnel français des Grands Boulevards"
  }
];

// Fonction d'initialisation de la carte
function initMap() {
  // Coordonnées du centre de la carte (2ème arrondissement de Paris)
  const parisSecond = [48.8698, 2.3370];
  
  // Création de la carte centrée sur le 2ème arrondissement
  const map = L.map('restaurant-map').setView(parisSecond, 15);
  
  // Ajout de la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Création d'une icône personnalisée pour les restaurants
  const restaurantIcon = L.icon({
    iconUrl: 'images/restaurant-marker.png',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
  
  // Ajout des marqueurs pour chaque restaurant
  restaurants.forEach(restaurant => {
    // Création du contenu de la popup
    const popupContent = `
      <div class="map-popup">
        <h3>${restaurant.name}</h3>
        <p class="rating">Note: ${restaurant.rating}</p>
        <p>${restaurant.description}</p>
        <p class="address">${restaurant.address}</p>
        <a href="restaurant/${restaurant.name.toLowerCase().replace(/\s+/g, '-')}.html" class="details-btn">Voir détails</a>
      </div>
    `;
    
    // Ajout du marqueur avec la popup
    L.marker([restaurant.lat, restaurant.lng], { icon: restaurantIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });
  
  // Ajout de contrôles pour zoomer/dézoomer
  map.addControl(new L.Control.Zoom({ position: 'bottomright' }));
}

// Initialisation de la carte au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Vérification que l'élément de carte existe
  const mapElement = document.getElementById('restaurant-map');
  if (mapElement) {
    initMap();
  }
});
