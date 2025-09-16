

export interface Department {
  code: string;
  name: string;
}

export interface Commune {
  code: string;
  name: string;
  departmentCode: string;
}

export interface Section {
  code: string;
  name: string;
  communeCode: string;
  description?: string;
}

export interface Quartier {
  code: string;
  name: string;
  sectionCode: string;
}

export const departments: Department[] = [
  { code: 'OU', name: 'Ouest' },
  { code: 'NO', name: 'Nord-Ouest' },
  { code: 'NE', name: 'Nord-Est' },
  { code: 'AR', name: 'Artibonite' },
  { code: 'CE', name: 'Centre' },
  { code: 'NI', name: 'Nippes' },
  { code: 'ND', name: 'Nord' },
  { code: 'SU', name: 'Sud' },
  { code: 'SE', name: 'Sud-Est' },
  { code: 'GA', name: 'Grand\'Anse' }
];

export const communes: Commune[] = [
  // Ouest Department
{ code: 'PAP', name: 'Port-au-Prince', departmentCode: 'OU' },
{ code: 'CAR', name: 'Carrefour', departmentCode: 'OU' },
{ code: 'DEL', name: 'Delmas', departmentCode: 'OU' },
{ code: 'PET', name: 'Pétion-Ville', departmentCode: 'OU' },
{ code: 'CIT', name: 'Cité Soleil', departmentCode: 'OU' },
{ code: 'TAB', name: 'Tabarre', departmentCode: 'OU' },
{ code: 'KAF', name: 'Kenscoff', departmentCode: 'OU' },
{ code: 'GRA', name: 'Gressier', departmentCode: 'OU' },
{ code: 'LEO', name: 'Léogâne', departmentCode: 'OU' },
{ code: 'GGO', name: 'Grand-Goâve', departmentCode: 'OU' },
{ code: 'PGO', name: 'Petit-Goâve', departmentCode: 'OU' },
{ code: 'CRO', name: 'Croix-des-Bouquets', departmentCode: 'OU' },
{ code: 'THO', name: 'Thomazeau', departmentCode: 'OU' },
{ code: 'GAN', name: 'Ganthier', departmentCode: 'OU' },
{ code: 'FVE', name: 'Fonds-Verrettes', departmentCode: 'OU' },
{ code: 'ARC', name: 'Arcahaie', departmentCode: 'OU' },
{ code: 'CAB', name: 'Cabaret', departmentCode: 'OU' },
  
  // Nord Department - All Communes
// Arrondissement de Cap-Haïtien
{ code: 'CAP', name: 'Cap-Haïtien', departmentCode: 'ND' },
{ code: 'LIM', name: 'Limonade', departmentCode: 'ND' },
{ code: 'QUA', name: 'Quartier-Morin', departmentCode: 'ND' },

// Arrondissement de Fort-Dauphin  
{ code: 'FOR', name: 'Fort-Dauphin', departmentCode: 'ND' },
{ code: 'FER', name: 'Ferrier', departmentCode: 'ND' },
{ code: 'PER', name: 'Perches', departmentCode: 'ND' },

// Arrondissement de Grande-Rivière-du-Nord
{ code: 'GRA', name: 'Grande-Rivière-du-Nord', departmentCode: 'ND' },
{ code: 'BAH', name: 'Bahon', departmentCode: 'ND' },
{ code: 'DON', name: 'Dondon', departmentCode: 'ND' },

// Arrondissement du Borgne
{ code: 'BOR', name: 'Borgne', departmentCode: 'ND' },
{ code: 'POR', name: 'Port-Margot', departmentCode: 'ND' },

// Arrondissement de Limbé
{ code: 'LIM', name: 'Limbé', departmentCode: 'ND' },
{ code: 'BAS', name: 'Bas-Limbé', departmentCode: 'ND' },

// Arrondissement de Plaisance
{ code: 'PLA', name: 'Plaisance', departmentCode: 'ND' },
{ code: 'PIL', name: 'Pilate', departmentCode: 'ND' },

// Arrondissement de Saint-Raphaël
{ code: 'SAI', name: 'Saint-Raphaël', departmentCode: 'ND' },
{ code: 'PLN', name: 'Plaine-du-Nord', departmentCode: 'ND' },
{ code: 'MIL', name: 'Milot', departmentCode: 'ND' },
{ code: 'ACU', name: 'Acul-du-Nord', departmentCode: 'ND' },
  

// Artibonite Department - All Communes (15 communes in 5 arrondissements)

// Arrondissement de Dessalines (4 communes)
{ code: 'DES', name: 'Dessalines', departmentCode: 'AR' },
{ code: 'DDU', name: 'Desdunes', departmentCode: 'AR' },
{ code: 'GSL', name: 'Grande-Saline', departmentCode: 'AR' },
{ code: 'PRA', name: 'Petite-Rivière-de-l\'Artibonite', departmentCode: 'AR' },

// Arrondissement des Gonaïves (3 communes)
{ code: 'GVS', name: 'Gonaïves', departmentCode: 'AR' },
{ code: 'ENR', name: 'Ennery', departmentCode: 'AR' },
{ code: 'LES', name: 'L\'Estère', departmentCode: 'AR' },

// Arrondissement de Gros-Morne (3 communes)
{ code: 'GMR', name: 'Gros-Morne', departmentCode: 'AR' },
{ code: 'ANR', name: 'Anse-Rouge', departmentCode: 'AR' },
{ code: 'TRN', name: 'Terre-Neuve', departmentCode: 'AR' },

// Arrondissement de Marmelade (2 communes)
{ code: 'MML', name: 'Marmelade', departmentCode: 'AR' },
{ code: 'SMA', name: 'Saint-Michel-de-l\'Attalaye', departmentCode: 'AR' },

// Arrondissement de Saint-Marc (3 communes)
{ code: 'SMC', name: 'Saint-Marc', departmentCode: 'AR' },
{ code: 'LCP', name: 'La Chapelle', departmentCode: 'AR' },
{ code: 'VRT', name: 'Verrettes', departmentCode: 'AR' },
{ code: 'LCR', name: 'Liancourt', departmentCode: 'AR' },



  // Add more communes for other departments as needed
];

export const sections: Section[] = [
  // Port-au-Prince sections
  { code: 'PAP-01', name: 'Centre-ville', communeCode: 'PAP' },
  { code: 'PAP-02', name: 'Bourdon', communeCode: 'PAP' },
  { code: 'PAP-03', name: 'Turgeau', communeCode: 'PAP' },
  { code: 'PAP-04', name: 'Bois Verna', communeCode: 'PAP' },
  { code: 'PAP-05', name: 'Pacot', communeCode: 'PAP' },
  { code: 'PAP-06', name: 'Christ-Roi', communeCode: 'PAP' },
  { code: 'PAP-07', name: 'Canapé-Vert', communeCode: 'PAP' },
  { code: 'PAP-08', name: 'Lalue', communeCode: 'PAP' },
  { code: 'PAP-09', name: 'Martissant', communeCode: 'PAP' },
  { code: 'PAP-10', name: 'Carrefour-Feuilles', communeCode: 'PAP' },
  
  // Delmas sections
  { code: 'DEL-01', name: 'Delmas 1', communeCode: 'DEL' },
  { code: 'DEL-02', name: 'Delmas 2', communeCode: 'DEL' },
  
  // Add sections for other communes as needed


  { code: 'VRT-00', name: 'Ville de Verrettes', communeCode: 'VRT', description: "Agglomération principale, rive gauche de la rivière, production agricole : café, sucre, coton, tafia" },
  { code: 'VRT-01', name: 'Bélanger', communeCode: 'VRT', description: "Section historique avec habitation Borel" },
  { code: 'VRT-02', name: 'Guillaume-Mogé', communeCode: 'VRT', description: "Section nord avec localités Allaïe, Basse Mory, Bras Gauche…" },
  { code: 'VRT-03', name: 'Désarmes', communeCode: 'VRT', description: "District et section communale éponyme" },
  { code: 'VRT-04', name: 'Bastien', communeCode: 'VRT', description: "Section sud avec Bastien, Baveux, Cabouet…" },
  { code: 'VRT-05', name: 'Terre-Natte', communeCode: 'VRT', description: "Section aux terres agricoles fertiles" },


];

export const quartiers: Quartier[] = [
  // Centre-ville quartiers
  { code: 'PAP-01-01', name: 'Rue Pavée', sectionCode: 'PAP-01' },
  { code: 'PAP-01-02', name: 'Champ de Mars', sectionCode: 'PAP-01' },
  { code: 'PAP-01-03', name: 'Sacré-Coeur', sectionCode: 'PAP-01' },
  { code: 'PAP-01-04', name: 'Fort National', sectionCode: 'PAP-01' },
  
  // Bourdon quartiers
  { code: 'PAP-02-01', name: 'Villa Rosa', sectionCode: 'PAP-02' },
  { code: 'PAP-02-02', name: 'Morne Calvaire', sectionCode: 'PAP-02' },
  
  // Delmas quartiers
  { code: 'DEL-01-01', name: 'Delmas 31', sectionCode: 'DEL-01' },
  { code: 'DEL-01-02', name: 'Delmas 33', sectionCode: 'DEL-01' },
  
  // Add quartiers for other sections as needed
];

// Helper functions to get locations by parent
export const getCommunesByDepartment = (departmentCode: string) => {
  return communes.filter(commune => commune.departmentCode === departmentCode);
};

export const getSectionsByCommune = (communeCode: string) => {
  return sections.filter(section => section.communeCode === communeCode);
};

export const getQuartiersBySection = (sectionCode: string) => {
  return quartiers.filter(quartier => quartier.sectionCode === sectionCode);
};