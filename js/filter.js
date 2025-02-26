// Données enrichies des restaurants avec les informations de filtrage
const restaurantsData = [
  {
    id: "faggio",
    name: "Faggio",
    cuisine: ["Italienne", "Pizzeria"],
    rating: 4.7,
    price: 2, // €€
    specialities: ["Pizza napolitaine", "Pâtes fraîches", "Antipasti"],
    dietary: ["Végétarien"]
  },
  {
    id: "la-bourse-et-la-vie",
    name: "La Bourse et la Vie",
    cuisine: ["Française", "Gastronomique"],
    rating: 4.6,
    price: 3, // €€€
    specialities: ["Pot-au-feu de foie gras", "Viandes maturées", "Desserts classiques"],
    dietary: []
  },
  {
    id: "lentente",
    name: "L'Entente",
    cuisine: ["Anglaise", "Brasserie"],
    rating: 4.5,
    price: 2, // €€
    specialities: ["Sunday roast", "Fish & Chips", "Yorkshire pudding"],
    dietary: []
  },
  {
    id: "liza",
    name: "Liza",
    cuisine: ["Libanaise", "Moyen-Orient"],
    rating: 4.5,
    price: 3, // €€€
    specialities: ["Mezzes", "Kebbé", "Mouhalabieh"],
    dietary: ["Végétarien", "Sans gluten"]
  },
  {
    id: "les-noces-de-jeannette",
    name: "Les Noces de Jeannette",
    cuisine: ["Française", "Bistrot"],
    rating: 4.4,
    price: 2, // €€
    specialities: ["Blanquette de veau", "Plats traditionnels", "Desserts maison"],
    dietary: []
  }
];

// État des filtres
let activeFilters = {
  cuisine: [],
  rating: 0,
  price: [],
  dietary: []
};

// Fonction d'initialisation
function initFilters() {
  // Générer les options de filtrage dynamiquement
  generateFilterOptions();
  
  // Attacher les événements aux filtres
  attachFilterEvents();
  
  // Afficher le nombre total de restaurants au départ
  updateResultCount();
}

// Générer les options de filtrage à partir des données
function generateFilterOptions() {
  // Extraire toutes les cuisines uniques
  const allCuisines = new Set();
  restaurantsData.forEach(restaurant => {
    restaurant.cuisine.forEach(cuisine => allCuisines.add(cuisine));
  });
  
  // Ajouter les options de cuisine
  const cuisineFilter = document.getElementById('cuisine-filter');
  if (cuisineFilter) {
    allCuisines.forEach(cuisine => {
      const option = document.createElement('div');
      option.className = 'filter-option';
      option.innerHTML = `
        <input type="checkbox" id="cuisine-${cuisine.toLowerCase()}" data-filter="cuisine" value="${cuisine}">
        <label for="cuisine-${cuisine.toLowerCase()}">${cuisine}</label>
      `;
      cuisineFilter.appendChild(option);
    });
  }
  
  // Ajouter les options de régime alimentaire
  const dietaryOptions = ['Végétarien', 'Végétalien', 'Sans gluten', 'Halal'];
  const dietaryFilter = document.getElementById('dietary-filter');
  if (dietaryFilter) {
    dietaryOptions.forEach(option => {
      const optionElem = document.createElement('div');
      optionElem.className = 'filter-option';
      optionElem.innerHTML = `
        <input type="checkbox" id="dietary-${option.toLowerCase().replace(' ', '-')}" data-filter="dietary" value="${option}">
        <label for="dietary-${option.toLowerCase().replace(' ', '-')}">${option}</label>
      `;
      dietaryFilter.appendChild(optionElem);
    });
  }
}

// Attacher les événements aux différents filtres
function attachFilterEvents() {
  // Événements pour les checkboxes (cuisine et régime)
  document.querySelectorAll('input[type="checkbox"][data-filter]').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const filterType = event.target.dataset.filter;
      const value = event.target.value;
      
      if (event.target.checked) {
        // Ajouter le filtre
        activeFilters[filterType].push(value);
      } else {
        // Retirer le filtre
        activeFilters[filterType] = activeFilters[filterType].filter(item => item !== value);
      }
      
      applyFilters();
    });
  });
  
  // Événement pour le filtre de note
  const ratingFilter = document.getElementById('rating-filter');
  if (ratingFilter) {
    ratingFilter.addEventListener('change', event => {
      activeFilters.rating = parseFloat(event.target.value);
      applyFilters();
    });
  }
  
  // Événements pour les filtres de prix
  document.querySelectorAll('input[type="checkbox"][data-filter="price"]').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
      const value = parseInt(event.target.value);
      
      if (event.target.checked) {
        activeFilters.price.push(value);
      } else {
        activeFilters.price = activeFilters.price.filter(item => item !== value);
      }
      
      applyFilters();
    });
  });
  
  // Événement pour réinitialiser les filtres
  const resetButton = document.getElementById('reset-filters');
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
}

// Appliquer les filtres actifs
function applyFilters() {
  const restaurantCards = document.querySelectorAll('.restaurant-card');
  let visibleCount = 0;
  
  restaurantCards.forEach(card => {
    const restaurantId = card.dataset.id;
    const restaurant = restaurantsData.find(r => r.id === restaurantId);
    
    if (!restaurant) return;
    
    // Vérifier si le restaurant passe tous les filtres actifs
    let isVisible = true;
    
    // Filtre de cuisine
    if (activeFilters.cuisine.length > 0) {
      const hasCuisine = restaurant.cuisine.some(cuisine => 
        activeFilters.cuisine.includes(cuisine));
      if (!hasCuisine) isVisible = false;
    }
    
    // Filtre de note minimale
    if (activeFilters.rating > 0 && restaurant.rating < activeFilters.rating) {
      isVisible = false;
    }
    
    // Filtre de prix
    if (activeFilters.price.length > 0 && !activeFilters.price.includes(restaurant.price)) {
      isVisible = false;
    }
    
    // Filtre de régime alimentaire
    if (activeFilters.dietary.length > 0) {
      const hasDietary = restaurant.dietary.some(diet => 
        activeFilters.dietary.includes(diet));
      if (!hasDietary) isVisible = false;
    }
    
    // Appliquer la visibilité avec animation
    if (isVisible) {
      card.classList.remove('hidden');
      setTimeout(() => card.classList.remove('fade-out'), 10);
      visibleCount++;
    } else {
      card.classList.add('fade-out');
      setTimeout(() => card.classList.add('hidden'), 300);
    }
  });
  
  // Mettre à jour le compteur de résultats
  updateResultCount(visibleCount);
}

// Mettre à jour le compteur de résultats
function updateResultCount(count = restaurantsData.length) {
  const resultCounter = document.getElementById('result-count');
  if (resultCounter) {
    resultCounter.textContent = count;
    resultCounter.parentElement.classList.toggle('no-results', count === 0);
  }
}

// Réinitialiser tous les filtres
function resetFilters() {
  // Réinitialiser l'état des filtres
  activeFilters = {
    cuisine: [],
    rating: 0,
    price: [],
    dietary: []
  };
  
  // Réinitialiser les éléments de formulaire
  document.querySelectorAll('input[type="checkbox"][data-filter]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  document.getElementById('rating-filter').value = "0";
  
  // Réappliquer les filtres (tout afficher)
  applyFilters();
}

// Initialiser les filtres au chargement du document
document.addEventListener('DOMContentLoaded', initFilters);
