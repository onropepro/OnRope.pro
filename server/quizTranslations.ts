// Quiz translations for French and Spanish
// English content is the default and lives in the quiz files themselves

export interface QuizContentTranslation {
  question: string;
  options: { A: string; B: string; C: string; D: string };
}

export interface QuizTranslations {
  [quizType: string]: {
    [questionNumber: number]: QuizContentTranslation;
  };
}

// French translations
export const frenchQuizTranslations: QuizTranslations = {
  // IRATA Level 1 - Quiz A
  irata_level_1_a: {
    1: { question: "Quel est le nombre minimum de points d'attache requis lorsque vous travaillez sur corde?", options: { A: "Un", B: "Deux", C: "Trois", D: "Quatre" } },
    2: { question: "Que signifie EPI?", options: { A: "Equipement de Protection Individuelle", B: "Essentiels de Protection Professionnelle", C: "Equipement de Protection Primaire", D: "Essentiels de Protection Personnelle" } },
    3: { question: "Avant d'utiliser une corde, quelle est la premiere chose a faire?", options: { A: "Attacher votre descendeur", B: "L'inspecter pour detecter les dommages", C: "Mesurer sa longueur", D: "L'enrouler correctement" } },
    4: { question: "Quel est l'objectif principal d'un dispositif de secours en acces sur corde?", options: { A: "Accelerer la descente", B: "Fournir un deuxieme point d'attache en cas de defaillance de la ligne principale", C: "Transporter des outils", D: "Aider a la montee" } },
    5: { question: "Quel noeud est couramment utilise pour s'attacher a un harnais?", options: { A: "Noeud de cabestan", B: "Noeud de chaise", C: "Noeud en huit sur double", D: "Noeud plat" } },
    6: { question: "Quelle est la charge de travail minimale securitaire pour un ancrage d'acces sur corde?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" } },
    7: { question: "A quelle frequence les harnais doivent-ils etre inspectes par une personne competente?", options: { A: "Hebdomadairement", B: "Mensuellement", C: "Tous les 6 mois", D: "Avant chaque utilisation et a intervalles reguliers" } },
    8: { question: "A quoi sert la protection des aretes?", options: { A: "Pour prevenir les dommages a la corde causes par les aretes vives", B: "Pour marquer les zones de travail", C: "Pour ancrer les cordes", D: "Pour fournir une protection contre les intemperies" } },
    9: { question: "Que devez-vous faire si vous decouvrez des dommages a votre equipement lors d'une inspection?", options: { A: "Continuer a l'utiliser avec precaution", B: "Le signaler et le retirer du service", C: "Couvrir les dommages avec du ruban adhesif", D: "L'utiliser uniquement pour des travaux legers" } },
    10: { question: "Quel est le but d'un noeud d'arret a l'extremite d'une corde?", options: { A: "Pour marquer l'extremite de la corde", B: "Pour empecher l'extremite de la corde de passer a travers un descendeur", C: "Pour ajouter du poids", D: "Pour faciliter l'enroulement" } },
    11: { question: "Quelle est la bonne facon de stocker les cordes?", options: { A: "En plein soleil pour les secher", B: "Pres de produits chimiques pour le nettoyage", C: "Dans un endroit frais et sec, a l'abri des UV et des produits chimiques", D: "Suspendues avec des vrilles serrees" } },
    12: { question: "Quel type de harnais est requis pour le travail d'acces sur corde?", options: { A: "Simple ceinture de taille", B: "Harnais de poitrine seulement", C: "Harnais complet avec points d'attache avant et arriere", D: "Harnais de siege seulement" } },
    13: { question: "Quelle est la fonction principale d'un descendeur?", options: { A: "Monter sur la corde", B: "Controler la descente sur une corde", C: "Agir comme dispositif de secours", D: "Connecter les cordes ensemble" } },
    14: { question: "Quand ne devriez-vous PAS utiliser les techniques d'acces sur corde?", options: { A: "Dans des conditions venteuses depassant 80 km/h", B: "Quand des alternatives plus sures sont disponibles et pratiques", C: "Sur des batiments de plus de 10 etages", D: "Uniquement pendant les heures de jour" } },
    15: { question: "Que comprend une verification avant utilisation d'un mousqueton?", options: { A: "Verifier que le doigt s'ouvre et se ferme correctement et que le mecanisme de verrouillage fonctionne", B: "Peser le mousqueton", C: "Verifier la couleur", D: "Le tester au sol" } },
    16: { question: "Quelle est la distance minimale entre le point le plus bas de descente et le sol ou l'obstruction?", options: { A: "1 metre", B: "2 metres", C: "La longueur necessaire pour un arret controle", D: "5 metres" } },
    17: { question: "Quel est le but d'une reunion de securite?", options: { A: "Discuter de l'entretien des outils", B: "Communiquer les dangers specifiques au site et les procedures de securite", C: "Attribuer des outils aux travailleurs", D: "Compter les outils" } },
    18: { question: "Comment devez-vous transporter des outils lorsque vous travaillez en hauteur?", options: { A: "Dans vos poches", B: "Fixes avec des longes d'outils ou dans un sac a outils", C: "Dans vos mains", D: "Lances par un collegue" } },
    19: { question: "Quelle action doit etre prise si les conditions meteorologiques se deteriorent?", options: { A: "Accelerer le travail", B: "Continuer normalement", C: "Evaluer le risque et envisager d'arreter le travail", D: "Retirer tous les EPI pour bouger plus vite" } },
    20: { question: "Quel est le but d'une longe de positionnement au travail?", options: { A: "Pour l'arret de chute seulement", B: "Pour permettre un travail mains libres en etant soutenu", C: "Pour les operations de sauvetage", D: "Pour la descente en rappel" } }
  },
  // IRATA Level 1 - Quiz B
  irata_level_1_b: {
    1: { question: "Que signifie IRATA?", options: { A: "Association Internationale de Formation a l'Acces sur Corde", B: "Association Professionnelle Industrielle d'Acces sur Corde", C: "Association Internationale des Techniciens d'Acces sur Corde", D: "Association des Techniciens Industriels d'Acces sur Corde" } },
    2: { question: "Quelle est la charge maximale qui devrait etre appliquee a un connecteur concu pour la suspension humaine?", options: { A: "5 kN", B: "15 kN", C: "25 kN", D: "35 kN" } },
    3: { question: "Quel type de corde est generalement utilise pour le travail d'acces sur corde?", options: { A: "Corde d'escalade dynamique", B: "Corde semi-statique a ame et gaine", C: "Corde en polypropylene", D: "Corde en fibre naturelle" } },
    4: { question: "Quelle est la fonction d'un bloqueur?", options: { A: "Controler la descente", B: "Saisir la corde et permettre le mouvement vers le haut", C: "Connecter les cordes", D: "Fournir une protection de secours" } },
    5: { question: "Combien de temps une certification IRATA Niveau 1 est-elle valide?", options: { A: "1 an", B: "2 ans", C: "3 ans", D: "5 ans" } },
    6: { question: "Que doit-on verifier lors d'une inspection de harnais avant utilisation?", options: { A: "Couleur et marque", B: "Coutures, sangles, boucles et points d'attache", C: "Poids seulement", D: "Date d'achat" } },
    7: { question: "Quel est le but d'une deviation?", options: { A: "Ajouter plus de corde", B: "Rediriger la corde loin des dangers ou obstructions", C: "Augmenter la vitesse", D: "Marquer la zone de travail" } },
    8: { question: "Lors de l'utilisation de deux cordes, quelle devrait etre la relation entre elles?", options: { A: "Une devrait etre plus longue", B: "Elles devraient etre de couleurs differentes", C: "Elles devraient etre ancrees independamment", D: "Elles doivent avoir le meme diametre" } },
    9: { question: "Qu'est-ce que le traumatisme de suspension?", options: { A: "Peur des hauteurs", B: "Une condition medicale causee par une suspension prolongee dans un harnais", C: "Brulure de corde", D: "Defaillance de l'equipement" } },
    10: { question: "Quel est le delai d'action recommande pour sauver une personne suspendue?", options: { A: "Dans l'heure", B: "Le plus rapidement possible, idealement en quelques minutes", C: "Dans les 30 minutes", D: "A la fin du quart de travail" } },
    11: { question: "Quel marquage devrait etre sur les EPI certifies?", options: { A: "Logo de l'entreprise seulement", B: "Marquage CE avec les normes EN pertinentes", C: "Code couleur", D: "Nom de l'employe" } },
    12: { question: "Quelle est la taille minimale d'equipe pour le travail d'acces sur corde?", options: { A: "Une personne peut travailler seule", B: "Deux personnes minimum", C: "Trois personnes minimum", D: "Quatre personnes minimum" } },
    13: { question: "A quoi sert une longe courte (cow's tail)?", options: { A: "Manipulation d'animaux", B: "Longe courte pour connexion aux ancrages", C: "Transport d'outils", D: "Protection contre les intemperies" } },
    14: { question: "Comment les cordes doivent-elles etre transportees?", options: { A: "Trainees au sol", B: "Dans un sac ou conteneur, protegees des dommages", C: "Enroulees autour de l'equipement", D: "En vrac dans un vehicule" } },
    15: { question: "Quel est le but d'une evaluation des risques?", options: { A: "Accelerer le travail", B: "Identifier les dangers et mettre en oeuvre des mesures de controle", C: "Reduire les couts d'equipement", D: "Attribuer les responsabilites" } },
    16: { question: "Que devez-vous faire si vous vous sentez mal lorsque vous etes suspendu sur une corde?", options: { A: "Continuer a travailler", B: "Communiquer immediatement et descendre ou etre secouru", C: "Se reposer pendant 30 minutes", D: "Augmenter la vitesse pour finir plus vite" } },
    17: { question: "A quoi sert le noeud papillon alpin?", options: { A: "S'attacher au harnais", B: "Creer une boucle au milieu d'une corde", C: "Joindre deux cordes", D: "Terminer les extremites de corde" } },
    18: { question: "Quelle couleur de corde est generalement utilisee comme ligne de secours/securite?", options: { A: "N'importe quelle couleur est acceptable", B: "Rouge seulement", C: "Couleur differente de la ligne de travail pour une identification facile", D: "Noir seulement" } },
    19: { question: "Qu'est-ce que le chargement croise d'un mousqueton?", options: { A: "Chargement sur l'axe mineur au lieu de l'axe majeur", B: "Utilisation de plusieurs mousquetons", C: "Connexion de deux mousquetons ensemble", D: "Utilisation normale" } },
    20: { question: "Quand devez-vous informer votre superviseur des problemes d'equipement?", options: { A: "A la fin de la semaine", B: "Immediatement apres la decouverte", C: "Pendant les pauses seulement", D: "Seulement si cela cause un accident" } }
  },
  // SWP Window Cleaning
  swp_window_cleaning: {
    1: { question: "Quelle est la resistance minimale requise pour les points d'ancrage d'acces sur corde pour le nettoyage de fenetres?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" } },
    2: { question: "Quel seuil de vitesse du vent devrait declencher l'arret du travail de nettoyage de fenetres par acces sur corde?", options: { A: "20 km/h", B: "30 km/h", C: "40 km/h", D: "50 km/h" } },
    3: { question: "Quel est l'objectif principal de l'etablissement de zones d'exclusion au sol pendant le nettoyage de fenetres?", options: { A: "Pour empecher l'acces du public pour la vie privee", B: "Pour proteger les pietons des objets qui tombent", C: "Pour reserver des places de stationnement", D: "Pour marquer l'horaire de travail" } },
    4: { question: "Quel type de harnais est requis pour le nettoyage de fenetres par acces sur corde?", options: { A: "Ceinture de taille seulement", B: "Harnais de poitrine seulement", C: "Harnais complet avec points d'attache avant et arriere", D: "Harnais de siege seulement" } },
    5: { question: "Quelle est la norme minimale de casque requise pour le nettoyage de fenetres par acces sur corde?", options: { A: "EN 812", B: "EN 397", C: "EN 166", D: "EN 352" } },
    6: { question: "Comment les outils doivent-ils etre securises lorsque vous travaillez en hauteur pendant le nettoyage de fenetres?", options: { A: "Dans les poches seulement", B: "Tenus dans les mains", C: "Fixes avec des longes d'outils ou dans un sac a outils", D: "Places sur les rebords de fenetres" } },
    7: { question: "Quel est le diametre minimum de corde recommande pour le nettoyage de fenetres par acces sur corde?", options: { A: "8 mm", B: "9 mm", C: "10,5 mm", D: "12 mm" } },
    8: { question: "Quelle action doit etre prise immediatement si un traumatisme de suspension est suspecte?", options: { A: "Attendre l'ambulance", B: "Initier le sauvetage dans les 10 minutes", C: "Laisser la personne se reposer pendant 30 minutes", D: "Continuer a surveiller" } },
    9: { question: "Quelle est la taille minimale d'equipe pour les operations de nettoyage de fenetres par acces sur corde?", options: { A: "1 personne", B: "2 personnes", C: "3 personnes", D: "4 personnes" } },
    10: { question: "Quel type de solution de nettoyage est prefere pour le nettoyage de fenetres exterieures?", options: { A: "N'importe quel nettoyant menager", B: "Solvants industriels", C: "Solutions biodegradables approuvees", D: "Nettoyants a base d'acide" } },
    11: { question: "Quel est le but des protecteurs de corde dans les operations de nettoyage de fenetres?", options: { A: "Pour ajouter du poids a la corde", B: "Pour marquer la corde", C: "Pour prevenir les dommages a la corde causes par les aretes vives", D: "Pour rendre la corde impermeable" } },
    12: { question: "Avant de passer par-dessus le bord, quelle verification de securite doit etre effectuee?", options: { A: "Verifier les previsions meteo", B: "Verification mutuelle de tous les EPI et attaches", C: "Compter tous les outils", D: "Prendre une photo" } },
    13: { question: "Quel est le niveau minimum de certification IRATA requis pour le nettoyage de fenetres?", options: { A: "Aucune certification necessaire", B: "Niveau 1 minimum", C: "Niveau 2 minimum", D: "Niveau 3 seulement" } },
    14: { question: "Quel appareil de communication tout le personnel d'acces sur corde devrait-il porter?", options: { A: "Telephone portable seulement", B: "Sifflet seulement", C: "Radio bidirectionnelle", D: "Megaphone" } },
    15: { question: "Que doit-on faire si des conditions meteorologiques severes se developpent pendant les operations?", options: { A: "Accelerer le travail", B: "Continuer normalement", C: "Remontee controlee immediate vers la securite", D: "Attendre sur la corde que les conditions s'ameliorent" } },
    16: { question: "Quelle documentation doit etre disponible sur site pour les produits chimiques de nettoyage?", options: { A: "Recus d'achat", B: "Fiches de donnees de securite (FDS)", C: "Brochures de marque", D: "Instructions de melange seulement" } },
    17: { question: "A quelle frequence les points d'ancrage doivent-ils etre inspectes et confirmes pour les charges nominales?", options: { A: "Annuellement", B: "Mensuellement", C: "Avant chaque session de travail", D: "Quand des dommages sont visibles" } },
    18: { question: "Que doit-on inspecter sur le harnais avant chaque utilisation?", options: { A: "Couleur seulement", B: "Sangles, coutures et quincaillerie", C: "Nom de marque", D: "Poids" } },
    19: { question: "Quelle est la technique correcte lors de la descente pour le nettoyage de fenetres?", options: { A: "Descente en chute libre", B: "Maniere controlee en maintenant trois points de contact", C: "Descente rapide pour gagner du temps", D: "Rebondir contre le batiment" } },
    20: { question: "Que doit etre en place avant tout nettoyage de fenetres par acces sur corde?", options: { A: "Horaire des pauses cafe", B: "Plan de sauvetage avec equipe de secours formee disponible", C: "Materiaux marketing", D: "Paiement du client" } }
  },
  // FLHA Assessment
  flha_assessment: {
    1: { question: "Quand une evaluation des risques sur le terrain (FLHA) doit-elle etre completee?", options: { A: "Une fois par mois", B: "Avant de commencer chaque tache de travail ou lorsque les conditions changent", C: "Seulement pour les nouveaux projets", D: "A la fin de chaque journee" } },
    2: { question: "Quel est l'objectif principal d'une FLHA?", options: { A: "Pour satisfaire les exigences de paperasse", B: "Pour identifier et controler les dangers sur le lieu de travail avant le debut des travaux", C: "Pour documenter le travail termine", D: "Pour attribuer la responsabilite des accidents" } },
    3: { question: "Qui est responsable de completer une FLHA?", options: { A: "Les superviseurs seulement", B: "Les travailleurs effectuant la tache, souvent avec revision du superviseur", C: "Les agents de securite seulement", D: "Les proprietaires de batiments" } },
    4: { question: "Que doit-on evaluer concernant les conditions meteorologiques dans une FLHA?", options: { A: "La temperature seulement", B: "Le vent, les precipitations, le risque de foudre et les temperatures extremes", C: "Seulement s'il pleut", D: "La meteo n'est pas pertinente" } },
    5: { question: "Qu'est-ce qu'une 'mesure de controle' dans une FLHA?", options: { A: "Un appareil de telecommande", B: "Une action prise pour eliminer ou reduire un danger", C: "Un outil de mesure", D: "Une norme de qualite" } },
    6: { question: "Que doit-on faire si un nouveau danger est identifie pendant le travail?", options: { A: "L'ignorer et continuer", B: "Arreter, reevaluer, mettre a jour la FLHA et implementer des controles", C: "Le signaler a la fin de la journee", D: "Signaler seulement si quelqu'un est blesse" } },
    7: { question: "Quels facteurs personnels doivent etre consideres dans une FLHA?", options: { A: "La condition physique seulement", B: "La fatigue, le stress, les medicaments et l'aptitude au travail", C: "Le titre du poste seulement", D: "Les annees d'experience seulement" } },
    8: { question: "Que doit-on evaluer concernant la zone de travail dans une FLHA?", options: { A: "La couleur de l'environnement", B: "L'acces/sortie, les conditions du sol, les dangers aeriens, les activites a proximite", C: "L'eclairage seulement", D: "La disponibilite du stationnement seulement" } },
    9: { question: "Quelle est la hierarchie des controles dans la gestion des dangers?", options: { A: "Les EPI d'abord, puis les autres mesures", B: "Elimination, substitution, ingenierie, administratif, EPI", C: "Utiliser uniquement les EPI", D: "Selection aleatoire des controles" } },
    10: { question: "Quels elements lies a l'equipement doivent etre evalues dans une FLHA?", options: { A: "Les noms de marque seulement", B: "L'etat, l'adequation, les EPI requis et le statut d'inspection", C: "La date d'achat seulement", D: "L'appariement des couleurs" } },
    11: { question: "Quels elements de communication doivent etre inclus dans une FLHA?", options: { A: "Les numeros de telephone personnels", B: "Les contacts d'urgence, les signaux et les methodes de communication d'equipe", C: "Les slogans marketing de l'entreprise", D: "Les comptes de reseaux sociaux" } },
    12: { question: "Comment les dangers doivent-ils etre priorises dans une FLHA?", options: { A: "Alphabetiquement", B: "Par gravite et probabilite d'occurrence", C: "Par cout de correction", D: "Par facilite de documentation" } },
    13: { question: "Que doit-il se passer si les travailleurs ne peuvent pas controler un danger identifie?", options: { A: "Travailler quand meme", B: "Arreter le travail et escalader a la supervision", C: "Ignorer et continuer", D: "Documenter pour la prochaine fois" } },
    14: { question: "Quel role joue la signature de la FLHA?", options: { A: "Juste de la paperasse", B: "Confirmation que les dangers ont ete discutes et compris", C: "Exigence legale seulement", D: "Pour identifier l'ecriture" } },
    15: { question: "Que doit-on faire avec les documents FLHA completes?", options: { A: "Les jeter", B: "Les conserver comme dossiers selon la politique de l'entreprise", C: "Les donner au client", D: "Les publier sur les reseaux sociaux" } },
    16: { question: "Quels dangers environnementaux doivent etre consideres dans une FLHA?", options: { A: "Aucun", B: "Le trafic, les services publics, l'acces public, la faune, le terrain", C: "La meteo seulement", D: "Le bruit seulement" } },
    17: { question: "Quand la FLHA doit-elle etre revisee pendant un quart de travail?", options: { A: "Jamais apres la completion initiale", B: "Quand les conditions changent ou a intervalles reguliers", C: "Seulement si un accident se produit", D: "A la fin du quart" } },
    18: { question: "Qu'est-ce que le risque residuel dans le contexte d'une FLHA?", options: { A: "Un risque qui n'existe pas", B: "Le risque restant apres la mise en oeuvre des mesures de controle", C: "Le risque d'hier", D: "Le risque predit pour l'avenir" } },
    19: { question: "Comment les membres de l'equipe doivent-ils participer au processus FLHA?", options: { A: "Seulement ecouter", B: "Contribuer activement des observations et des preoccupations", C: "Signer sans lire", D: "Deleguer a une personne" } },
    20: { question: "Quelle formation est requise pour completer efficacement une FLHA?", options: { A: "Aucune formation necessaire", B: "Formation a la reconnaissance et au controle des dangers", C: "Premiers soins seulement", D: "Competences informatiques seulement" } }
  },
  // Harness Inspection
  harness_inspection: {
    1: { question: "A quelle frequence un harnais doit-il etre inspecte par l'utilisateur?", options: { A: "Hebdomadairement", B: "Avant chaque utilisation", C: "Mensuellement", D: "Annuellement" } },
    2: { question: "Que doit-on verifier sur les sangles du harnais lors de l'inspection?", options: { A: "La decoloration seulement", B: "Coupures, abrasions, effilochage, dommages chimiques et degradation UV", C: "L'etiquette de marque seulement", D: "La capacite de charge" } },
    3: { question: "Quel etat des coutures indique que le harnais doit etre retire du service?", options: { A: "Toute couture visible", B: "Coutures cassees, coupees ou tirees", C: "Fil de couleur differente", D: "Double couture" } },
    4: { question: "Que doit-on verifier sur la quincaillerie metallique lors de l'inspection du harnais?", options: { A: "Niveau de polissage", B: "Fissures, deformation, corrosion et bon fonctionnement", C: "Tampon du fabricant seulement", D: "Poids" } },
    5: { question: "Comment un harnais doit-il etre stocke lorsqu'il n'est pas utilise?", options: { A: "En plein soleil", B: "Dans un endroit propre et sec, a l'abri de la chaleur, des produits chimiques et des UV", C: "Suspendu par une sangle", D: "Dans un sac humide" } },
    6: { question: "Quelle est la duree de vie maximale typique d'un harnais?", options: { A: "1 an", B: "5-10 ans selon le fabricant et l'utilisation", C: "Illimitee s'il a l'air bien", D: "3 mois" } },
    7: { question: "Que doit-on faire avec un harnais qui a ete soumis a une chute?", options: { A: "Continuer a l'utiliser s'il a l'air OK", B: "Le retirer du service et le faire inspecter par une personne competente", C: "Le laver et le reutiliser", D: "Resserrer toutes les sangles et continuer" } },
    8: { question: "Quelle documentation doit accompagner un harnais?", options: { A: "Aucune requise", B: "Instructions du fabricant, registres d'inspection et historique de service", C: "Recu d'achat seulement", D: "Etiquette de taille seulement" } },
    9: { question: "Quels points d'attache sur un harnais doivent etre inspectes?", options: { A: "Le point avant seulement", B: "Tous les points d'attache incluant les anneaux en D avant, arriere et lateraux", C: "Les points metalliques seulement", D: "La ceinture de taille seulement" } },
    10: { question: "Quels types de boucles necessitent des procedures d'inspection specifiques?", options: { A: "Toutes les boucles sont identiques", B: "Les boucles a connexion rapide, a passage et a ardillon ont chacune des verifications specifiques", C: "Les boucles metalliques seulement", D: "Les boucles en plastique seulement" } },
    11: { question: "Qu'indique une contamination chimique sur un harnais?", options: { A: "Apparence propre", B: "Rigidite, decoloration ou odeur inhabituelle", C: "Flexibilite normale", D: "Couleurs vives" } },
    12: { question: "Que doit-on faire si un defaut est trouve lors de l'inspection du harnais?", options: { A: "Le marquer pour reparation ulterieure", B: "L'etiqueter et le retirer du service immediatement", C: "Continuer a l'utiliser avec precaution", D: "Signaler a la fin de la semaine" } },
    13: { question: "Qui est considere comme une 'personne competente' pour l'inspection formelle des harnais?", options: { A: "N'importe quel travailleur", B: "Quelqu'un forme et competent en inspection de harnais", C: "Le nouvel employe", D: "N'importe qui avec des outils" } },
    14: { question: "A quelle frequence une inspection formelle par une personne competente doit-elle etre effectuee?", options: { A: "Seulement quand endommage", B: "A intervalles specifies par le fabricant, generalement tous les 6-12 mois", C: "Une fois dans la vie du harnais", D: "Tous les 5 ans" } },
    15: { question: "Quelles informations d'etiquette doivent etre presentes et lisibles sur un harnais?", options: { A: "Le nom de marque seulement", B: "Fabricant, modele, taille, conformite aux normes et date de fabrication", C: "Le prix seulement", D: "Le code couleur seulement" } },
    16: { question: "Quelle est la signification de la date de fabrication sur un harnais?", options: { A: "Aucune signification", B: "Determine le calcul de la duree de vie et le calendrier d'inspection", C: "Pour la garantie seulement", D: "Pour commander des remplacements seulement" } },
    17: { question: "Que doit-on verifier sur les cuissardes lors de l'inspection?", options: { A: "Le rembourrage seulement", B: "L'etat des sangles, les coutures, les boucles et l'ajustement correct", C: "La taille seulement", D: "La couleur seulement" } },
    18: { question: "Quelles sources de contamination peuvent endommager les materiaux du harnais?", options: { A: "L'eau seulement", B: "Produits chimiques, huiles, solvants, acide de batterie et certains agents de nettoyage", C: "La peinture seulement", D: "La salete seulement" } },
    19: { question: "Que doit-on verifier concernant l'ajustement du harnais lors de l'inspection?", options: { A: "Seulement qu'il s'enfile", B: "Dimensionnement correct, plage d'ajustement et positionnement securise une fois porte", C: "L'appariement des couleurs seulement", D: "Le poids seulement" } },
    20: { question: "Quelle est la reponse correcte si un harnais montre des signes de dommages thermiques?", options: { A: "Continuer s'il n'est pas fondu", B: "Le retirer du service car l'integrite structurelle peut etre compromise", C: "Le refroidir et le reutiliser", D: "Couvrir les zones endommagees avec du ruban adhesif" } }
  }
};

// Spanish translations
export const spanishQuizTranslations: QuizTranslations = {
  // IRATA Level 1 - Quiz A
  irata_level_1_a: {
    1: { question: "Cual es el numero minimo de puntos de anclaje requeridos cuando se trabaja en cuerda?", options: { A: "Uno", B: "Dos", C: "Tres", D: "Cuatro" } },
    2: { question: "Que significa EPP?", options: { A: "Equipo de Proteccion Personal", B: "Esenciales de Proteccion Profesional", C: "Equipo de Proteccion Primaria", D: "Esenciales de Proteccion Personal" } },
    3: { question: "Antes de usar una cuerda, cual es lo primero que debe hacer?", options: { A: "Conectar su descensor", B: "Inspeccionarla para detectar danos", C: "Medir su longitud", D: "Enrollarla correctamente" } },
    4: { question: "Cual es el proposito principal de un dispositivo de respaldo en acceso con cuerdas?", options: { A: "Acelerar el descenso", B: "Proporcionar un segundo punto de anclaje en caso de falla de la linea principal", C: "Transportar herramientas", D: "Ayudar a ascender" } },
    5: { question: "Que nudo se usa comunmente para atarse al arnes?", options: { A: "Nudo de ballestrinque", B: "As de guia", C: "Ocho sobre doble", D: "Nudo llano" } },
    6: { question: "Cual es la carga de trabajo minima segura para un anclaje de acceso con cuerdas?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" } },
    7: { question: "Con que frecuencia deben ser inspeccionados los arneses por una persona competente?", options: { A: "Semanalmente", B: "Mensualmente", C: "Cada 6 meses", D: "Antes de cada uso y a intervalos regulares" } },
    8: { question: "Para que se usa la proteccion de bordes?", options: { A: "Para prevenir danos a la cuerda por bordes afilados", B: "Para marcar areas de trabajo", C: "Para anclar cuerdas", D: "Para proporcionar proteccion contra el clima" } },
    9: { question: "Que debe hacer si descubre danos en su equipo durante una inspeccion?", options: { A: "Continuar usandolo con cuidado", B: "Reportarlo y retirarlo del servicio", C: "Cubrir el dano con cinta", D: "Usarlo solo para trabajos ligeros" } },
    10: { question: "Cual es el proposito de un nudo de tope al final de una cuerda?", options: { A: "Para marcar el extremo de la cuerda", B: "Para evitar que el extremo de la cuerda pase a traves de un descensor", C: "Para agregar peso", D: "Para facilitar el enrollado" } },
    11: { question: "Cual es la forma correcta de almacenar las cuerdas?", options: { A: "A la luz directa del sol para secarlas", B: "Cerca de productos quimicos para limpiar", C: "En un lugar fresco y seco, alejado de la luz UV y productos quimicos", D: "Colgadas con nudos apretados" } },
    12: { question: "Que tipo de arnes se requiere para el trabajo de acceso con cuerdas?", options: { A: "Cinturon de cintura simple", B: "Arnes de pecho solamente", C: "Arnes de cuerpo completo con puntos de anclaje delanteros y traseros", D: "Arnes de asiento solamente" } },
    13: { question: "Cual es la funcion principal de un descensor?", options: { A: "Ascender por la cuerda", B: "Controlar el descenso en una cuerda", C: "Actuar como dispositivo de respaldo", D: "Conectar cuerdas entre si" } },
    14: { question: "Cuando NO debe usar tecnicas de acceso con cuerdas?", options: { A: "En condiciones de viento superiores a 80 km/h", B: "Cuando hay alternativas mas seguras disponibles y practicas", C: "En edificios de mas de 10 pisos", D: "Solo durante las horas del dia" } },
    15: { question: "Que incluye una verificacion previa al uso de un mosqueton?", options: { A: "Verificar que la puerta se abre y cierra correctamente y que el mecanismo de bloqueo funciona", B: "Pesar el mosqueton", C: "Verificar el color", D: "Probarlo en el suelo" } },
    16: { question: "Cual es la distancia minima entre el punto mas bajo de descenso y el suelo u obstruccion?", options: { A: "1 metro", B: "2 metros", C: "La longitud necesaria para una parada controlada", D: "5 metros" } },
    17: { question: "Cual es el proposito de una reunion de seguridad?", options: { A: "Discutir el mantenimiento de herramientas", B: "Comunicar los peligros especificos del sitio y los procedimientos de seguridad", C: "Asignar herramientas a los trabajadores", D: "Contar herramientas" } },
    18: { question: "Como debe transportar herramientas cuando trabaja en altura?", options: { A: "En sus bolsillos", B: "Aseguradas con cordones de herramientas o en una bolsa de herramientas", C: "En sus manos", D: "Lanzadas por un colega" } },
    19: { question: "Que accion debe tomarse si las condiciones climaticas se deterioran?", options: { A: "Acelerar el trabajo", B: "Continuar normalmente", C: "Evaluar el riesgo y considerar detener el trabajo", D: "Quitar todo el EPP para moverse mas rapido" } },
    20: { question: "Cual es el proposito de una eslinga de posicionamiento de trabajo?", options: { A: "Solo para detencion de caidas", B: "Para permitir trabajo con manos libres mientras esta soportado", C: "Para operaciones de rescate", D: "Para rappel" } }
  },
  // IRATA Level 1 - Quiz B
  irata_level_1_b: {
    1: { question: "Que significa IRATA?", options: { A: "Asociacion Internacional de Capacitacion en Acceso con Cuerdas", B: "Asociacion Comercial Industrial de Acceso con Cuerdas", C: "Asociacion Internacional de Tecnicos de Acceso con Cuerdas", D: "Asociacion de Tecnicos Industriales de Acceso con Cuerdas" } },
    2: { question: "Cual es la carga maxima que debe aplicarse a un conector disenado para suspension humana?", options: { A: "5 kN", B: "15 kN", C: "25 kN", D: "35 kN" } },
    3: { question: "Que tipo de cuerda se usa tipicamente para el trabajo de acceso con cuerdas?", options: { A: "Cuerda de escalada dinamica", B: "Cuerda semistatica de alma y funda", C: "Cuerda de polipropileno", D: "Cuerda de fibra natural" } },
    4: { question: "Cual es la funcion de un bloqueador?", options: { A: "Controlar el descenso", B: "Agarrar la cuerda y permitir el movimiento hacia arriba", C: "Conectar cuerdas", D: "Proporcionar proteccion de respaldo" } },
    5: { question: "Cuanto tiempo es valida una certificacion IRATA Nivel 1?", options: { A: "1 ano", B: "2 anos", C: "3 anos", D: "5 anos" } },
    6: { question: "Que debe verificarse durante una inspeccion de arnes antes del uso?", options: { A: "Color y marca", B: "Costuras, cintas, hebillas y puntos de anclaje", C: "Solo el peso", D: "Fecha de compra" } },
    7: { question: "Cual es el proposito de una desviacion?", options: { A: "Agregar mas cuerda", B: "Redirigir la cuerda lejos de peligros u obstrucciones", C: "Aumentar la velocidad", D: "Marcar el area de trabajo" } },
    8: { question: "Al usar dos cuerdas, cual debe ser la relacion entre ellas?", options: { A: "Una debe ser mas larga", B: "Deben ser de diferentes colores", C: "Deben estar ancladas independientemente", D: "Deben tener el mismo diametro" } },
    9: { question: "Que es el trauma por suspension?", options: { A: "Miedo a las alturas", B: "Una condicion medica causada por suspension prolongada en un arnes", C: "Quemadura por cuerda", D: "Falla del equipo" } },
    10: { question: "Cual es el tiempo de accion recomendado para rescatar a una persona suspendida?", options: { A: "Dentro de 1 hora", B: "Lo mas rapido posible, idealmente en minutos", C: "Dentro de 30 minutos", D: "Al final del turno de trabajo" } },
    11: { question: "Que marcado debe tener el EPP certificado?", options: { A: "Solo el logo de la empresa", B: "Marcado CE con las normas EN relevantes", C: "Codigo de colores", D: "Nombre del empleado" } },
    12: { question: "Cual es el tamano minimo del equipo para el trabajo de acceso con cuerdas?", options: { A: "Una persona puede trabajar sola", B: "Dos personas minimo", C: "Tres personas minimo", D: "Cuatro personas minimo" } },
    13: { question: "Para que se usa una cola de vaca?", options: { A: "Manejo de animales", B: "Eslinga corta para conexion a anclajes", C: "Transporte de herramientas", D: "Proteccion contra el clima" } },
    14: { question: "Como deben transportarse las cuerdas?", options: { A: "Arrastradas por el suelo", B: "En una bolsa o contenedor, protegidas de danos", C: "Enrolladas alrededor del equipo", D: "Sueltas en un vehiculo" } },
    15: { question: "Cual es el proposito de una evaluacion de riesgos?", options: { A: "Acelerar el trabajo", B: "Identificar peligros e implementar medidas de control", C: "Reducir costos de equipo", D: "Asignar culpa" } },
    16: { question: "Que debe hacer si se siente mal mientras esta suspendido en una cuerda?", options: { A: "Continuar trabajando", B: "Comunicarse inmediatamente y descender o ser rescatado", C: "Descansar por 30 minutos", D: "Aumentar la velocidad para terminar mas rapido" } },
    17: { question: "Para que se usa el nudo mariposa alpino?", options: { A: "Atarse al arnes", B: "Crear un lazo en el medio de una cuerda", C: "Unir dos cuerdas", D: "Terminar extremos de cuerda" } },
    18: { question: "Que color de cuerda se usa tipicamente como linea de respaldo/seguridad?", options: { A: "Cualquier color es aceptable", B: "Solo rojo", C: "Color diferente de la linea de trabajo para facil identificacion", D: "Solo negro" } },
    19: { question: "Que es la carga cruzada de un mosqueton?", options: { A: "Carga en el eje menor en lugar del eje mayor", B: "Usar multiples mosquetones", C: "Conectar dos mosquetones juntos", D: "Uso normal" } },
    20: { question: "Cuando debe informar a su supervisor sobre problemas con el equipo?", options: { A: "Al final de la semana", B: "Inmediatamente al descubrirlo", C: "Solo durante los descansos", D: "Solo si causa un accidente" } }
  },
  // SWP Window Cleaning
  swp_window_cleaning: {
    1: { question: "Cual es el requisito minimo de resistencia para los puntos de anclaje de acceso con cuerdas en limpieza de ventanas?", options: { A: "5 kN", B: "10 kN", C: "15 kN", D: "20 kN" } },
    2: { question: "Que umbral de velocidad del viento debe activar el cese del trabajo de limpieza de ventanas por acceso con cuerdas?", options: { A: "20 km/h", B: "30 km/h", C: "40 km/h", D: "50 km/h" } },
    3: { question: "Cual es el proposito principal de establecer zonas de exclusion a nivel del suelo durante la limpieza de ventanas?", options: { A: "Para prevenir el acceso publico por privacidad", B: "Para proteger a los peatones de objetos que caen", C: "Para reservar espacios de estacionamiento", D: "Para marcar el horario de trabajo" } },
    4: { question: "Que tipo de arnes se requiere para la limpieza de ventanas por acceso con cuerdas?", options: { A: "Solo cinturon de cintura", B: "Solo arnes de pecho", C: "Arnes de cuerpo completo con puntos de anclaje delanteros y traseros", D: "Solo arnes de asiento" } },
    5: { question: "Cual es el estandar minimo de casco requerido para la limpieza de ventanas por acceso con cuerdas?", options: { A: "EN 812", B: "EN 397", C: "EN 166", D: "EN 352" } },
    6: { question: "Como deben asegurarse las herramientas cuando se trabaja en altura durante la limpieza de ventanas?", options: { A: "Solo en bolsillos", B: "Sostenidas en las manos", C: "Aseguradas con cordones de herramientas o en una bolsa de herramientas", D: "Colocadas en los marcos de las ventanas" } },
    7: { question: "Cual es el diametro minimo de cuerda recomendado para la limpieza de ventanas por acceso con cuerdas?", options: { A: "8 mm", B: "9 mm", C: "10.5 mm", D: "12 mm" } },
    8: { question: "Que accion debe tomarse inmediatamente si se sospecha trauma por suspension?", options: { A: "Esperar a la ambulancia", B: "Iniciar el rescate dentro de 10 minutos", C: "Dejar que la persona descanse por 30 minutos", D: "Continuar monitoreando" } },
    9: { question: "Cual es el tamano minimo del equipo para operaciones de limpieza de ventanas por acceso con cuerdas?", options: { A: "1 persona", B: "2 personas", C: "3 personas", D: "4 personas" } },
    10: { question: "Que tipo de solucion de limpieza se prefiere para la limpieza de ventanas exteriores?", options: { A: "Cualquier limpiador domestico", B: "Solventes industriales", C: "Soluciones biodegradables aprobadas", D: "Limpiadores a base de acido" } },
    11: { question: "Cual es el proposito de los protectores de cuerda en las operaciones de limpieza de ventanas?", options: { A: "Para agregar peso a la cuerda", B: "Para marcar la cuerda", C: "Para prevenir danos a la cuerda por bordes afilados", D: "Para hacer la cuerda impermeable" } },
    12: { question: "Antes de pasar por el borde, que verificacion de seguridad debe realizarse?", options: { A: "Verificar el pronostico del tiempo", B: "Verificacion mutua de todo el EPP y conexiones", C: "Contar todas las herramientas", D: "Tomar una foto" } },
    13: { question: "Cual es el nivel minimo de certificacion IRATA requerido para la limpieza de ventanas?", options: { A: "No se necesita certificacion", B: "Nivel 1 minimo", C: "Nivel 2 minimo", D: "Solo Nivel 3" } },
    14: { question: "Que dispositivo de comunicacion debe llevar todo el personal de acceso con cuerdas?", options: { A: "Solo telefono movil", B: "Solo silbato", C: "Radio bidireccional", D: "Megafono" } },
    15: { question: "Que debe hacerse si se desarrolla clima severo durante las operaciones?", options: { A: "Acelerar el trabajo", B: "Continuar normalmente", C: "Ascenso controlado inmediato hacia la seguridad", D: "Esperar en la cuerda a que mejoren las condiciones" } },
    16: { question: "Que documentacion debe estar disponible en el sitio para los quimicos de limpieza?", options: { A: "Recibos de compra", B: "Hojas de Datos de Seguridad (HDS)", C: "Folletos de marca", D: "Solo instrucciones de mezcla" } },
    17: { question: "Con que frecuencia deben inspeccionarse y confirmarse los puntos de anclaje para las cargas nominales?", options: { A: "Anualmente", B: "Mensualmente", C: "Antes de cada sesion de trabajo", D: "Cuando el dano es visible" } },
    18: { question: "Que debe inspeccionarse en el arnes antes de cada uso?", options: { A: "Solo el color", B: "Cintas, costuras y herrajes", C: "Nombre de marca", D: "Peso" } },
    19: { question: "Cual es la tecnica correcta al descender para la limpieza de ventanas?", options: { A: "Descenso en caida libre", B: "Manera controlada manteniendo tres puntos de contacto", C: "Descenso rapido para ahorrar tiempo", D: "Rebotar contra el edificio" } },
    20: { question: "Que debe estar en su lugar antes de comenzar cualquier limpieza de ventanas por acceso con cuerdas?", options: { A: "Horario de descansos", B: "Plan de rescate con equipo de rescate capacitado disponible", C: "Materiales de marketing", D: "Pago del cliente" } }
  },
  // FLHA Assessment
  flha_assessment: {
    1: { question: "Cuando debe completarse una Evaluacion de Peligros a Nivel de Campo (FLHA)?", options: { A: "Una vez al mes", B: "Antes de comenzar cada tarea de trabajo o cuando las condiciones cambien", C: "Solo para proyectos nuevos", D: "Al final de cada dia" } },
    2: { question: "Cual es el proposito principal de una FLHA?", options: { A: "Para satisfacer requisitos de papeleo", B: "Para identificar y controlar los peligros del lugar de trabajo antes de que comience el trabajo", C: "Para documentar el trabajo completado", D: "Para asignar culpa por accidentes" } },
    3: { question: "Quien es responsable de completar una FLHA?", options: { A: "Solo supervisores", B: "Trabajadores realizando la tarea, a menudo con revision del supervisor", C: "Solo oficiales de seguridad", D: "Propietarios de edificios" } },
    4: { question: "Que debe evaluarse con respecto a las condiciones climaticas en una FLHA?", options: { A: "Solo la temperatura", B: "Viento, precipitacion, riesgo de rayos y temperaturas extremas", C: "Solo si esta lloviendo", D: "El clima no es relevante" } },
    5: { question: "Que es una 'medida de control' en una FLHA?", options: { A: "Un dispositivo de control remoto", B: "Una accion tomada para eliminar o reducir un peligro", C: "Una herramienta de medicion", D: "Un estandar de calidad" } },
    6: { question: "Que debe hacerse si se identifica un nuevo peligro durante el trabajo?", options: { A: "Ignorarlo y continuar", B: "Detenerse, reevaluar, actualizar la FLHA e implementar controles", C: "Reportarlo al final del dia", D: "Solo reportar si alguien resulta herido" } },
    7: { question: "Que factores personales deben considerarse en una FLHA?", options: { A: "Solo la condicion fisica", B: "Fatiga, estres, medicamentos y aptitud para el trabajo", C: "Solo el titulo del puesto", D: "Solo los anos de experiencia" } },
    8: { question: "Que debe evaluarse sobre el area de trabajo en una FLHA?", options: { A: "Color del entorno", B: "Acceso/salida, condiciones del suelo, peligros aereos, actividades cercanas", C: "Solo la iluminacion", D: "Solo la disponibilidad de estacionamiento" } },
    9: { question: "Cual es la jerarquia de controles en la gestion de peligros?", options: { A: "EPP primero, luego otras medidas", B: "Eliminacion, sustitucion, ingenieria, administrativo, EPP", C: "Solo usar EPP", D: "Seleccion aleatoria de controles" } },
    10: { question: "Que elementos relacionados con el equipo deben evaluarse en una FLHA?", options: { A: "Solo nombres de marca", B: "Condicion, idoneidad, EPP requerido y estado de inspeccion", C: "Solo fecha de compra", D: "Combinacion de colores" } },
    11: { question: "Que elementos de comunicacion deben incluirse en una FLHA?", options: { A: "Numeros de telefono personales", B: "Contactos de emergencia, senales y metodos de comunicacion del equipo", C: "Eslogan de marketing de la empresa", D: "Cuentas de redes sociales" } },
    12: { question: "Como deben priorizarse los peligros en una FLHA?", options: { A: "Alfabeticamente", B: "Por gravedad y probabilidad de ocurrencia", C: "Por costo de correccion", D: "Por facilidad de documentacion" } },
    13: { question: "Que debe suceder si los trabajadores no pueden controlar un peligro identificado?", options: { A: "Trabajar de todos modos", B: "Detener el trabajo y escalar a supervision", C: "Ignorar y continuar", D: "Documentar para la proxima vez" } },
    14: { question: "Que rol cumple la firma de la FLHA?", options: { A: "Solo papeleo", B: "Confirmacion de que los peligros fueron discutidos y entendidos", C: "Solo requisito legal", D: "Para identificar la escritura" } },
    15: { question: "Que debe hacerse con los documentos FLHA completados?", options: { A: "Tirarlos", B: "Retenerlos como registros segun la politica de la empresa", C: "Darlos al cliente", D: "Publicarlos en redes sociales" } },
    16: { question: "Que peligros ambientales deben considerarse en una FLHA?", options: { A: "Ninguno", B: "Trafico, servicios publicos, acceso publico, vida silvestre, terreno", C: "Solo el clima", D: "Solo el ruido" } },
    17: { question: "Cuando debe revisarse la FLHA durante un turno de trabajo?", options: { A: "Nunca despues de la finalizacion inicial", B: "Cuando las condiciones cambien o a intervalos regulares", C: "Solo si ocurre un accidente", D: "Al final del turno" } },
    18: { question: "Que es el riesgo residual en el contexto de una FLHA?", options: { A: "Riesgo que no existe", B: "Riesgo que permanece despues de implementar las medidas de control", C: "Riesgo de ayer", D: "Riesgo predicho para el futuro" } },
    19: { question: "Como deben participar los miembros del equipo en el proceso de FLHA?", options: { A: "Solo escuchar", B: "Contribuir activamente con observaciones y preocupaciones", C: "Firmar sin leer", D: "Delegar a una persona" } },
    20: { question: "Que capacitacion se requiere para completar efectivamente una FLHA?", options: { A: "No se necesita capacitacion", B: "Capacitacion en reconocimiento y control de peligros", C: "Solo primeros auxilios", D: "Solo habilidades informaticas" } }
  },
  // Harness Inspection
  harness_inspection: {
    1: { question: "Con que frecuencia debe ser inspeccionado un arnes por el usuario?", options: { A: "Semanalmente", B: "Antes de cada uso", C: "Mensualmente", D: "Anualmente" } },
    2: { question: "Que debe verificarse en las cintas del arnes durante la inspeccion?", options: { A: "Solo la decoloracion", B: "Cortes, abrasiones, deshilachado, danos quimicos y degradacion UV", C: "Solo la etiqueta de marca", D: "Capacidad de carga" } },
    3: { question: "Que condicion de las costuras indica que el arnes debe retirarse del servicio?", options: { A: "Cualquier costura visible", B: "Costuras rotas, cortadas o jaladas", C: "Hilo de diferente color", D: "Costura doble" } },
    4: { question: "Que debe verificarse en los herrajes metalicos durante la inspeccion del arnes?", options: { A: "Nivel de pulido", B: "Grietas, deformacion, corrosion y funcionamiento adecuado", C: "Solo sello del fabricante", D: "Peso" } },
    5: { question: "Como debe almacenarse un arnes cuando no esta en uso?", options: { A: "A la luz directa del sol", B: "En un lugar limpio y seco, alejado del calor, quimicos y UV", C: "Colgado de una cinta", D: "En una bolsa humeda" } },
    6: { question: "Cual es la vida util maxima tipica de un arnes?", options: { A: "1 ano", B: "5-10 anos dependiendo del fabricante y uso", C: "Ilimitada si se ve bien", D: "3 meses" } },
    7: { question: "Que debe hacerse con un arnes que ha sido sometido a una caida?", options: { A: "Continuar usandolo si se ve OK", B: "Retirarlo del servicio y hacerlo inspeccionar por una persona competente", C: "Lavarlo y reutilizarlo", D: "Apretar todas las cintas y continuar" } },
    8: { question: "Que documentacion debe acompanar a un arnes?", options: { A: "Ninguna requerida", B: "Instrucciones del fabricante, registros de inspeccion e historial de servicio", C: "Solo recibo de compra", D: "Solo la etiqueta de talla" } },
    9: { question: "Que puntos de anclaje en un arnes deben inspeccionarse?", options: { A: "Solo el punto frontal", B: "Todos los puntos de anclaje incluyendo anillos D frontales, traseros y laterales", C: "Solo puntos metalicos", D: "Solo el cinturon de cintura" } },
    10: { question: "Que tipos de hebillas requieren procedimientos de inspeccion especificos?", options: { A: "Todas las hebillas son iguales", B: "Las hebillas de conexion rapida, de paso y de lengua tienen verificaciones especificas", C: "Solo hebillas metalicas", D: "Solo hebillas plasticas" } },
    11: { question: "Que indica contaminacion quimica en un arnes?", options: { A: "Apariencia limpia", B: "Rigidez, decoloracion u olor inusual", C: "Flexibilidad normal", D: "Colores brillantes" } },
    12: { question: "Que debe hacerse si se encuentra algun defecto durante la inspeccion del arnes?", options: { A: "Marcarlo para reparacion posterior", B: "Etiquetarlo y retirarlo del servicio inmediatamente", C: "Continuar usandolo con cuidado", D: "Reportar al final de la semana" } },
    13: { question: "Quien se considera una 'persona competente' para la inspeccion formal de arneses?", options: { A: "Cualquier trabajador", B: "Alguien capacitado y conocedor en inspeccion de arneses", C: "El empleado mas nuevo", D: "Cualquiera con herramientas" } },
    14: { question: "Con que frecuencia debe realizarse una inspeccion formal por una persona competente?", options: { A: "Solo cuando esta danado", B: "A intervalos especificados por el fabricante, tipicamente cada 6-12 meses", C: "Una vez en la vida del arnes", D: "Cada 5 anos" } },
    15: { question: "Que informacion de etiqueta debe estar presente y legible en un arnes?", options: { A: "Solo el nombre de marca", B: "Fabricante, modelo, talla, cumplimiento de normas y fecha de fabricacion", C: "Solo el precio", D: "Solo el codigo de color" } },
    16: { question: "Cual es el significado de la fecha de fabricacion en un arnes?", options: { A: "Sin significado", B: "Determina el calculo de vida util y el calendario de inspeccion", C: "Solo para garantia", D: "Solo para ordenar reemplazos" } },
    17: { question: "Que debe verificarse en las perneras durante la inspeccion?", options: { A: "Solo el acolchado", B: "Condicion de las cintas, costuras, hebillas y ajuste adecuado", C: "Solo la talla", D: "Solo el color" } },
    18: { question: "Que fuentes de contaminacion pueden danar los materiales del arnes?", options: { A: "Solo agua", B: "Quimicos, aceites, solventes, acido de bateria y algunos agentes de limpieza", C: "Solo pintura", D: "Solo suciedad" } },
    19: { question: "Que debe verificarse sobre el ajuste del arnes durante la inspeccion?", options: { A: "Solo que se pueda poner", B: "Dimensionamiento adecuado, rango de ajuste y posicionamiento seguro cuando se usa", C: "Solo la combinacion de colores", D: "Solo el peso" } },
    20: { question: "Cual es la respuesta correcta si un arnes muestra signos de danos por calor?", options: { A: "Continuar si no esta derretido", B: "Retirarlo del servicio ya que la integridad estructural puede estar comprometida", C: "Enfriarlo y reutilizarlo", D: "Cubrir las areas danadas con cinta" } }
  }
};

// Function to get translated quiz content
export function getTranslatedQuestion(
  quizType: string,
  questionNumber: number,
  language: string
): QuizContentTranslation | null {
  if (language === 'fr' && frenchQuizTranslations[quizType]) {
    return frenchQuizTranslations[quizType][questionNumber] || null;
  }
  if (language === 'es' && spanishQuizTranslations[quizType]) {
    return spanishQuizTranslations[quizType][questionNumber] || null;
  }
  return null; // Return null for English (use original content)
}
