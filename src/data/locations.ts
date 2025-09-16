export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

export interface City {
  name: string;
  stateCode: string;
  countryCode: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', flag: 'us' },
  { code: 'CA', name: 'Canada', flag: 'ca' },
  { code: 'FR', name: 'France', flag: 'fr' },
  { code: 'ES', name: 'Spain', flag: 'es' },
  { code: 'HT', name: 'Haiti', flag: 'ht' },
  { code: 'GB', name: 'United Kingdom', flag: 'gb' },
  { code: 'DE', name: 'Germany', flag: 'de' },
];

export const states: State[] = [
  // United States
  { code: 'AL', name: 'Alabama', countryCode: 'US' },
  { code: 'AK', name: 'Alaska', countryCode: 'US' },
  { code: 'AZ', name: 'Arizona', countryCode: 'US' },
  { code: 'AR', name: 'Arkansas', countryCode: 'US' },
  { code: 'CA', name: 'California', countryCode: 'US' },
  { code: 'CO', name: 'Colorado', countryCode: 'US' },
  { code: 'FL', name: 'Florida', countryCode: 'US' },
  { code: 'NY', name: 'New York', countryCode: 'US' },
  { code: 'TX', name: 'Texas', countryCode: 'US' },

  // Canada
  { code: 'AB', name: 'Alberta', countryCode: 'CA' },
  { code: 'BC', name: 'British Columbia', countryCode: 'CA' },
  { code: 'ON', name: 'Ontario', countryCode: 'CA' },
  { code: 'QC', name: 'Quebec', countryCode: 'CA' },

  // France
  { code: 'IDF', name: 'Île-de-France', countryCode: 'FR' },
  { code: 'PAC', name: 'Provence-Alpes-Côte d\'Azur', countryCode: 'FR' },
  { code: 'OCC', name: 'Occitanie', countryCode: 'FR' },

  // Spain
  { code: 'MD', name: 'Madrid', countryCode: 'ES' },
  { code: 'CT', name: 'Catalonia', countryCode: 'ES' },
  { code: 'AN', name: 'Andalusia', countryCode: 'ES' },

  // Haiti (Departments)
  { code: 'AR', name: 'Artibonite', countryCode: 'HT' },
  { code: 'CE', name: 'Centre', countryCode: 'HT' },
  { code: 'GA', name: 'Grand\'Anse', countryCode: 'HT' },
  { code: 'NI', name: 'Nippes', countryCode: 'HT' },
  { code: 'ND', name: 'Nord', countryCode: 'HT' },
  { code: 'NE', name: 'Nord-Est', countryCode: 'HT' },
  { code: 'NO', name: 'Nord-Ouest', countryCode: 'HT' },
  { code: 'OU', name: 'Ouest', countryCode: 'HT' },
  { code: 'SD', name: 'Sud', countryCode: 'HT' },
  { code: 'SE', name: 'Sud-Est', countryCode: 'HT' },
];

export const cities: City[] = [
  // California, US
  { name: 'Los Angeles', stateCode: 'CA', countryCode: 'US' },
  { name: 'San Francisco', stateCode: 'CA', countryCode: 'US' },
  { name: 'San Diego', stateCode: 'CA', countryCode: 'US' },
  { name: 'Sacramento', stateCode: 'CA', countryCode: 'US' },

  // New York, US
  { name: 'New York City', stateCode: 'NY', countryCode: 'US' },
  { name: 'Buffalo', stateCode: 'NY', countryCode: 'US' },
  { name: 'Albany', stateCode: 'NY', countryCode: 'US' },

  // Texas, US
  { name: 'Houston', stateCode: 'TX', countryCode: 'US' },
  { name: 'Dallas', stateCode: 'TX', countryCode: 'US' },
  { name: 'Austin', stateCode: 'TX', countryCode: 'US' },

  // Florida, US
  { name: 'Miami', stateCode: 'FL', countryCode: 'US' },
  { name: 'Orlando', stateCode: 'FL', countryCode: 'US' },
  { name: 'Tampa', stateCode: 'FL', countryCode: 'US' },

  // Ontario, Canada
  { name: 'Toronto', stateCode: 'ON', countryCode: 'CA' },
  { name: 'Ottawa', stateCode: 'ON', countryCode: 'CA' },
  { name: 'Hamilton', stateCode: 'ON', countryCode: 'CA' },

  // Quebec, Canada
  { name: 'Montreal', stateCode: 'QC', countryCode: 'CA' },
  { name: 'Quebec City', stateCode: 'QC', countryCode: 'CA' },

  // Île-de-France, France
  { name: 'Paris', stateCode: 'IDF', countryCode: 'FR' },
  { name: 'Versailles', stateCode: 'IDF', countryCode: 'FR' },

  // Madrid, Spain
  { name: 'Madrid', stateCode: 'MD', countryCode: 'ES' },
  { name: 'Alcalá de Henares', stateCode: 'MD', countryCode: 'ES' },

  // Catalonia, Spain
  { name: 'Barcelona', stateCode: 'CT', countryCode: 'ES' },
  { name: 'Girona', stateCode: 'CT', countryCode: 'ES' },

  // Ouest Department, Haiti
  { name: 'Port-au-Prince', stateCode: 'OU', countryCode: 'HT' },
  { name: 'Pétionville', stateCode: 'OU', countryCode: 'HT' },
  { name: 'Carrefour', stateCode: 'OU', countryCode: 'HT' },
  { name: 'Delmas', stateCode: 'OU', countryCode: 'HT' },

  // Nord Department, Haiti
  { name: 'Cap-Haïtien', stateCode: 'ND', countryCode: 'HT' },
  { name: 'Fort-Dauphin', stateCode: 'ND', countryCode: 'HT' },

// Artibonite Department, Haiti - Complete list of cities
{ name: 'Gonaïves', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Saint-Marc', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Anse-Rouge', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Deschapelles', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Desdunes', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Dessalines', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Ennery', stateCode: 'AR', countryCode: 'HT' },
{ name: 'L\'Estère', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Grande-Saline', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Gros-Morne', stateCode: 'AR', countryCode: 'HT' },
{ name: 'La Chapelle', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Marmelade', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Petite-Rivière-de-l\'Artibonite', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Pont-Sondé', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Saint-Michel-de-l\'Attalaye', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Terre-Neuve', stateCode: 'AR', countryCode: 'HT' },
{ name: 'Verrettes', stateCode: 'AR', countryCode: 'HT' },


  // Sud Department, Haiti
  { name: 'Les Cayes', stateCode: 'SD', countryCode: 'HT' },
  { name: 'Port-Salut', stateCode: 'SD', countryCode: 'HT' },

  // Centre Department, Haiti
  { name: 'Hinche', stateCode: 'CE', countryCode: 'HT' },
  { name: 'Mirebalais', stateCode: 'CE', countryCode: 'HT' },

  // Grand'Anse Department, Haiti
  { name: 'Jérémie', stateCode: 'GA', countryCode: 'HT' },

  // Sud-Est Department, Haiti
  { name: 'Jacmel', stateCode: 'SE', countryCode: 'HT' },

  // Nord-Est Department, Haiti
  { name: 'Fort-Dauphin', stateCode: 'NE', countryCode: 'HT' },

  // Nord-Ouest Department, Haiti
  { name: 'Port-de-Paix', stateCode: 'NO', countryCode: 'HT' },

  // Nippes Department, Haiti
  { name: 'Miragoâne', stateCode: 'NI', countryCode: 'HT' },
];
