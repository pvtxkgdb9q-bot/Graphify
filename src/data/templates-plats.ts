import { o, type Template } from './recipe-dsl';

const SP = 'sel, poivre';

// ---------- Options partagées ----------
const PROT_WOK = [
  o('poulet', 'blanc-de-poulet 700g', 'Coupez le poulet en lanières et faites-le dorer 5 à 6 min à feu vif.', 'au poulet'),
  o('bœuf', 'steak-de-boeuf 700g', 'Coupez le bœuf en fines lanières et saisissez-le 2 min à feu très vif, puis réservez.', 'au bœuf'),
  o('porc', 'filet-mignon-de-porc 700g', 'Coupez le porc en fines lanières et faites-le dorer 5 min.', 'au porc'),
  o('crevettes', 'crevettes 600g', 'Faites sauter les crevettes 2 à 3 min jusqu’à ce qu’elles rosissent, puis réservez.', 'aux crevettes'),
  o('tofu', 'tofu 600g', 'Coupez le tofu en dés et faites-le dorer sur toutes les faces, puis réservez.', 'au tofu'),
  o('canard', 'magret-de-canard 700g', 'Retirez la peau du magret, coupez-le en lanières et saisissez-le 3 min.', 'au canard'),
  o('dinde', 'escalope-de-dinde 700g', 'Coupez la dinde en lanières et faites-la dorer 5 min.', 'à la dinde'),
];
const VEG_WOK = [
  o('aux poivrons', 'poivron-rouge 1p, poivron-vert 1p, oignon 1p', 'Émincez les poivrons et l’oignon.'),
  o('au brocoli', 'brocoli 400g, carotte 2p', 'Détaillez le brocoli en petits bouquets et la carotte en rondelles fines.'),
  o('aux champignons', 'champignons-de-paris 400g, oignon-nouveau 3p', 'Émincez les champignons et les oignons nouveaux.'),
  o('aux haricots verts', 'haricots-verts 400g, oignon 1p', 'Équeutez les haricots verts et coupez-les en deux, émincez l’oignon.'),
  o('au pak choï', 'pak-choi 400g, germes-de-soja 200g', 'Coupez le pak choï en morceaux, rincez les germes de soja.'),
  o('aux légumes croquants', 'carotte 2p, courgette 1p, pois-gourmands 150g', 'Taillez carotte et courgette en bâtonnets.'),
];
const SAUCE_WOK = [
  o('soja-miel', 'sauce-soja 5cs, miel 2cs, ail 2gs, gingembre-frais 15g', 'Mélangez la sauce soja, le miel, l’ail écrasé et le gingembre râpé.'),
  o('teriyaki', 'sauce-teriyaki 6cs, ail 1gs, graines-de-sesame 1cs?', 'Préparez la sauce teriyaki avec l’ail écrasé.'),
  o('aigre-douce', 'ketchup 3cs, vinaigre-de-riz 3cs, sucre 2cs, sauce-soja 2cs, ananas 200g?', 'Mélangez ketchup, vinaigre, sucre et sauce soja.'),
  o('satay', 'beurre-de-cacahuete 3cs, lait-de-coco 200ml, sauce-soja 2cs, cacahuetes 50g?', 'Délayez le beurre de cacahuète dans le lait de coco avec la sauce soja.'),
  o('à l’huître', 'sauce-huitre 4cs, sauce-soja 2cs, ail 2gs', 'Mélangez la sauce huître, la sauce soja et l’ail écrasé.'),
];

export const wok: Template = {
  key: 'wok', cuisine: 'asiatique', meal: ['plat'], prep: 15, cook: 15, diff: 'facile', eq: ['wok'],
  base: 'huile-de-tournesol 3cs',
  slots: {
    base: [o('riz', 'riz-thai 400g', 'Faites cuire le riz.'), o('nouilles', 'nouilles-chinoises 400g', 'Faites cuire les nouilles selon le paquet et égouttez-les.')],
    p: PROT_WOK, v: VEG_WOK, s: SAUCE_WOK,
  },
  title: (s) => s.base.label === 'riz'
    ? `Wok de ${s.p.label} ${s.v.label} sauce ${s.s.label} et riz`
    : `Nouilles sautées ${s.p.x} ${s.v.label} sauce ${s.s.label}`,
  steps: (s) => [
    s.base.step!, s.v.step!, s.s.step!,
    `Chauffez l’huile dans le wok. ${s.p.step}`,
    'Ajoutez les légumes et faites-les sauter 4 à 5 min en gardant du croquant.',
    s.base.label === 'nouilles' ? 'Ajoutez les nouilles, remettez la protéine, versez la sauce et faites sauter 2 min.' : 'Remettez la protéine, versez la sauce et laissez napper 2 min.',
    s.base.label === 'riz' ? 'Servez bien chaud sur le riz.' : 'Servez aussitôt.',
  ],
  tags: ['rapide'],
};

// ---------- Curry ----------
export const curry: Template = {
  key: 'curry', cuisine: 'indienne', meal: ['plat'], prep: 15, cook: 30, diff: 'facile', eq: ['cocotte'],
  base: 'oignon 1p, ail 2gs, gingembre-frais 15g, huile-de-tournesol 2cs, riz-basmati 400g, coriandre-fraiche 1br?',
  slots: {
    st: [
      o('rouge thaï', 'pate-de-curry-rouge 2cs, lait-de-coco 400ml', 'Faites revenir la pâte de curry 1 min puis versez le lait de coco.'),
      o('vert thaï', 'pate-de-curry-vert 2cs, lait-de-coco 400ml, citron-vert 1p', 'Faites revenir la pâte de curry 1 min, versez le lait de coco et le jus du citron vert.'),
      o('à l’indienne', 'curry-en-poudre 2cs, curcuma 1cc, creme-liquide 200ml, tomates-concassees 400g', 'Ajoutez le curry et le curcuma, puis les tomates et la crème.'),
      o('tikka masala', 'garam-masala 2cs, paprika 1cc, tomates-concassees 400g, yaourt-nature 150g', 'Ajoutez les épices, les tomates puis, hors du feu en fin de cuisson, le yaourt.'),
    ],
    p: [
      o('au poulet', 'hauts-de-cuisse-de-poulet 800g', 'Coupez le poulet en morceaux et faites-le dorer.'),
      o('à l’agneau', 'epaule-d-agneau 800g', 'Coupez l’agneau en cubes et faites-le dorer.'),
      o('aux crevettes', 'crevettes 600g', 'Ajoutez les crevettes 5 min avant la fin.'),
      o('aux pois chiches', 'pois-chiches 500g', 'Égouttez et rincez les pois chiches, ajoutez-les avec la sauce.'),
      o('au tofu', 'tofu 500g', 'Coupez le tofu en dés et faites-le dorer.'),
      o('au cabillaud', 'cabillaud 700g', 'Ajoutez le poisson en gros morceaux 8 min avant la fin.'),
      o('aux lentilles corail', 'lentilles-corail 300g', 'Rincez les lentilles et ajoutez-les avec 50 cl d’eau.'),
      o('au bœuf', 'boeuf-a-braiser 800g', 'Coupez le bœuf en cubes et faites-le dorer.'),
    ],
    v: [
      o('et pommes de terre', 'pomme-de-terre 4p', 'Pelez les pommes de terre et coupez-les en cubes.'),
      o('et épinards', 'epinards 300g', 'Ajoutez les épinards en fin de cuisson, juste pour les faire tomber.'),
      o('et courgettes', 'courgette 2p', 'Coupez les courgettes en dés.'),
      o('et patate douce', 'patate-douce 2p', 'Pelez la patate douce et coupez-la en cubes.'),
      o('et chou-fleur', 'chou-fleur 500g', 'Détaillez le chou-fleur en petits bouquets.'),
    ],
  },
  title: (s) => `Curry ${s.st.label} ${s.p.label} ${s.v.label}`,
  cookFor: (s) => (s.p.label.includes('bœuf') || s.p.label.includes('agneau') ? 75 : 30),
  steps: (s) => [
    'Lancez la cuisson du riz basmati.',
    'Émincez l’oignon, hachez l’ail et râpez le gingembre ; faites-les revenir dans l’huile 3 min.',
    s.p.step!, s.v.step!, s.st.step!,
    s.p.label.includes('bœuf') || s.p.label.includes('agneau') ? 'Couvrez et laissez mijoter 1 h à feu doux.' : 'Laissez mijoter 20 min à feu doux.',
    'Rectifiez l’assaisonnement, parsemez de coriandre et servez avec le riz.',
  ],
  tags: ['épicé', 'réconfortant'],
};

// ---------- Gratins ----------
export const gratin: Template = {
  key: 'gratin', cuisine: 'française', meal: ['plat'], prep: 20, cook: 40, diff: 'facile', eq: ['four', 'casserole'],
  base: `creme-liquide 300ml, lait 200ml, oeufs 2p, ail 1gs, muscade 1pi, beurre 20g, ${SP}`,
  slots: {
    v: [
      o('pommes de terre', 'pomme-de-terre 1500g', 'Pelez et coupez les pommes de terre en fines rondelles, précuisez-les 10 min à l’eau.'),
      o('courgettes', 'courgette 4p', 'Coupez les courgettes en rondelles et faites-les revenir 8 min pour retirer l’eau.'),
      o('chou-fleur', 'chou-fleur 1000g', 'Faites cuire les bouquets de chou-fleur 10 min à l’eau salée.'),
      o('brocolis', 'brocoli 800g', 'Faites cuire les bouquets de brocoli 6 min à l’eau salée.'),
      o('butternut', 'courge-butternut 1200g', 'Pelez la butternut, coupez-la en cubes et précuisez-la 10 min.'),
      o('poireaux', 'poireau 4p', 'Émincez les poireaux et faites-les fondre 10 min au beurre.'),
      o('endives', 'endive 6p', 'Faites braiser les endives 15 min à la poêle.'),
      o('patates douces', 'patate-douce 3p', 'Pelez les patates douces, coupez-les en rondelles et précuisez-les 8 min.'),
      o('pâtes', 'macaroni 500g', 'Faites cuire les pâtes 2 min de moins que le temps indiqué.'),
      o('aubergines', 'aubergine 3p', 'Coupez les aubergines en tranches et faites-les dorer à la poêle.'),
    ],
    c: [
      o('au fromage', 'emmental-rape 200g'), o('au comté', 'comte 200g'), o('au chèvre', 'buche-de-chevre 200g'),
      o('au reblochon', 'reblochon 1p'), o('à la mozzarella', 'mozzarella 250g'), o('au bleu', 'roquefort 150g'),
    ],
    p: [
      o('', ''), o('et au jambon', 'jambon-blanc 6t'), o('et aux lardons', 'lardons 250g', 'Faites dorer les lardons à sec.'),
      o('et au poulet', 'blanc-de-poulet 500g', 'Coupez le poulet en dés et faites-le dorer 6 min.'),
      o('et au saumon', 'saumon 500g', 'Coupez le saumon en cubes.'),
      o('et à la viande hachée', 'boeuf-hache 500g, oignon 1p', 'Faites revenir la viande hachée avec l’oignon émincé.'),
    ],
  },
  skip: (s) => s.p.label === 'et au saumon' && ['au reblochon', 'au bleu'].includes(s.c.label),
  title: (s) => `Gratin de ${s.v.label} ${s.c.label} ${s.p.label}`,
  steps: (s) => [
    'Préchauffez le four à 200 °C. Frottez un plat à gratin avec l’ail puis beurrez-le.',
    s.v.step!, s.p.step ?? '',
    'Fouettez la crème, le lait et les œufs avec sel, poivre et muscade.',
    `Disposez les ${s.v.label} dans le plat${s.p.label ? ' en alternant avec la garniture' : ''}, versez l’appareil.`,
    'Couvrez de fromage et enfournez 30 à 35 min jusqu’à ce que le dessus soit bien doré.',
  ],
  tags: ['réconfortant', 'familial'],
};

// ---------- Pâtes ----------
const PASTA = [
  o('Spaghetti', 'spaghetti 500g'), o('Penne', 'penne 500g'), o('Tagliatelles', 'tagliatelles 500g'),
  o('Fusilli', 'fusilli 500g'), o('Rigatoni', 'rigatoni 500g'), o('Coquillettes', 'coquillettes 500g'),
];
const PASTA_SAUCE = [
  o('à la carbonara', 'lardons 250g, jaunes-d-oeufs 4p, parmesan 80g, poivre', 'Faites dorer les lardons. Fouettez les jaunes avec le parmesan et beaucoup de poivre. Hors du feu, mélangez les pâtes, les lardons et les jaunes avec un peu d’eau de cuisson.'),
  o('à la bolognaise', 'boeuf-hache 600g, oignon 1p, carotte 1p, ail 2gs, tomates-concassees 800g, concentre-de-tomate 1cs, huile-d-olive 2cs, parmesan 50g?, herbes-de-provence 1cc', 'Faites revenir oignon, carotte et ail hachés, ajoutez la viande puis les tomates et le concentré ; laissez mijoter 30 min.'),
  o('au pesto', 'pesto-vert 190g, parmesan 50g, pignons-de-pin 30g?', 'Mélangez les pâtes égouttées avec le pesto et un peu d’eau de cuisson, parsemez de parmesan et de pignons.'),
  o('à l’arrabbiata', 'tomates-concassees 800g, ail 3gs, flocons-de-piment 1cc, huile-d-olive 3cs, persil 1br?', 'Faites revenir l’ail et le piment dans l’huile, ajoutez les tomates et laissez réduire 15 min.'),
  o('aux quatre fromages', 'creme-liquide 300ml, gorgonzola 100g, mozzarella 125g, parmesan 50g, emmental-rape 80g', 'Faites fondre doucement les fromages dans la crème.'),
  o('au saumon et à la crème', 'saumon 400g, creme-liquide 300ml, citron 1p, aneth 1br?', 'Faites cuire le saumon en dés 3 min, ajoutez la crème et le zeste de citron.'),
  o('au thon et à la tomate', 'thon-en-boite 280g, tomates-concassees 800g, oignon 1p, olives-noires 50g?, huile-d-olive 2cs', 'Faites revenir l’oignon, ajoutez les tomates 10 min puis le thon émietté.'),
  o('aux champignons et à la crème', 'champignons-de-paris 500g, creme-liquide 300ml, echalote 2p, beurre 20g, persil 1br?', 'Faites dorer les champignons et l’échalote au beurre, ajoutez la crème et laissez réduire.'),
  o('au poulet et à la crème', 'blanc-de-poulet 600g, creme-liquide 300ml, champignons-de-paris 250g, oignon 1p', 'Faites dorer le poulet en dés avec l’oignon et les champignons, ajoutez la crème.'),
  o('au chorizo', 'chorizo 200g, tomates-concassees 400g, poivron-rouge 1p, creme-liquide 150ml', 'Faites revenir le chorizo et le poivron, ajoutez les tomates puis la crème.'),
  o('aux crevettes à l’ail', 'crevettes 500g, ail 4gs, huile-d-olive 4cs, persil 1br, citron 1p, flocons-de-piment 1pi?', 'Faites sauter les crevettes avec l’ail et le piment dans l’huile, ajoutez le persil et le jus de citron.'),
  o('aux légumes du soleil', 'courgette 1p, aubergine 1p, poivron-rouge 1p, tomates-cerises 250g, ail 2gs, huile-d-olive 4cs, basilic 1br?', 'Faites rôtir les légumes en dés à la poêle 15 min avec l’ail.'),
  o('ricotta-épinards', 'ricotta 250g, epinards 400g, parmesan 50g, ail 1gs, muscade 1pi', 'Faites tomber les épinards avec l’ail, mélangez avec la ricotta et le parmesan.'),
  o('aux lardons et à la crème', 'lardons 300g, creme-fraiche-epaisse 250g, oignon 1p', 'Faites dorer les lardons et l’oignon, ajoutez la crème.'),
  o('à la puttanesca', 'tomates-concassees 800g, olives-noires 100g, capres 2cs, anchois 6p, ail 2gs, huile-d-olive 3cs', 'Faites fondre les anchois et l’ail dans l’huile, ajoutez tomates, olives et câpres ; 15 min de cuisson.'),
  o('citron-parmesan', 'citron 2p, parmesan 100g, beurre 50g, poivre', 'Mélangez les pâtes avec le beurre, le zeste et le jus de citron, le parmesan et de l’eau de cuisson.'),
  o('gorgonzola et noix', 'gorgonzola 150g, creme-liquide 200ml, noix 60g', 'Faites fondre le gorgonzola dans la crème, ajoutez les noix concassées.'),
  o('à la saucisse et à la tomate', 'saucisse-de-toulouse 4p, tomates-concassees 800g, oignon 1p, fenouil 1p?', 'Retirez la peau des saucisses, émiettez la chair et faites-la dorer avec l’oignon, ajoutez les tomates 20 min.'),
  o('alla norma', 'aubergine 2p, tomates-concassees 800g, ricotta 150g, basilic 1br, huile-d-olive 4cs', 'Faites dorer les aubergines en dés, ajoutez les tomates 15 min ; servez avec la ricotta.'),
  o('brocoli-anchois', 'brocoli 500g, anchois 6p, ail 2gs, flocons-de-piment 1pi, huile-d-olive 4cs, parmesan 50g?', 'Faites cuire le brocoli avec les pâtes ; faites fondre anchois, ail et piment dans l’huile et mélangez.'),
  o('cacio e pepe', 'pecorino 150g, poivre', 'Mélangez énergiquement les pâtes avec le pecorino, beaucoup de poivre et de l’eau de cuisson jusqu’à obtenir une sauce crémeuse.'),
  o('jambon-fromage', 'jambon-blanc 6t, emmental-rape 150g, creme-fraiche-epaisse 150g', 'Mélangez les pâtes avec le jambon en lanières, la crème et le fromage.'),
];
export const pates: Template = {
  key: 'pates', cuisine: 'italienne', meal: ['plat'], prep: 10, cook: 20, diff: 'facile', eq: ['casserole', 'poele'],
  base: 'sel',
  slots: { pa: PASTA, s: PASTA_SAUCE },
  title: (s) => `${s.pa.label} ${s.s.label}`,
  steps: (s) => [
    'Portez une grande casserole d’eau salée à ébullition.',
    `Faites cuire les ${s.pa.label.toLowerCase()} al dente ; gardez une louche d’eau de cuisson.`,
    s.s.step!,
    'Mélangez les pâtes avec la sauce et servez immédiatement.',
  ],
  tags: ['rapide'],
};

// ---------- Salades composées ----------
export const salade: Template = {
  key: 'salade', cuisine: 'française', meal: ['plat', 'entree'], prep: 20, cook: 15, diff: 'facile', eq: ['casserole'],
  base: `huile-d-olive 4cs, vinaigre-de-vin 2cs, moutarde 1cc, ${SP}`,
  slots: {
    b: [
      o('composée', 'salade-verte 1p'), o('de riz', 'riz-blanc 300g', 'Faites cuire le riz, rincez-le à l’eau froide.'),
      o('de pâtes', 'fusilli 400g', 'Faites cuire les pâtes, rincez-les à l’eau froide.'),
      o('de lentilles', 'lentilles-vertes 300g', 'Faites cuire les lentilles 25 min, égouttez-les.'),
      o('de pommes de terre', 'pomme-de-terre 1200g', 'Faites cuire les pommes de terre à l’eau, coupez-les en cubes.'),
      o('de quinoa', 'quinoa 300g', 'Faites cuire le quinoa 12 min, égouttez-le.'),
      o('de boulgour', 'boulgour 300g', 'Faites cuire le boulgour, laissez-le refroidir.'),
    ],
    p: [
      o('au thon', 'thon-en-boite 280g'), o('au poulet', 'blanc-de-poulet 500g', 'Faites griller le poulet et coupez-le en lamelles.'),
      o('aux œufs durs', 'oeufs 6p', 'Faites cuire les œufs 10 min, écalez-les et coupez-les en quartiers.'),
      o('à la feta', 'feta 200g'), o('au saumon fumé', 'saumon-fume 250g'), o('au jambon', 'jambon-blanc 6t'),
      o('à la mozzarella', 'mozzarella 250g'), o('aux pois chiches', 'pois-chiches 400g'),
    ],
    e: [
      o('tomates et concombre', 'tomate 3p, concombre 1p'), o('maïs et poivron', 'mais 300g, poivron-rouge 1p'),
      o('avocat et tomates cerises', 'avocat 2p, tomates-cerises 250g'), o('carottes et raisins secs', 'carotte 3p, raisins-secs 50g'),
    ],
  },
  title: (s) => `Salade ${s.b.label} ${s.p.label}, ${s.e.label}`,
  steps: (s) => [
    s.b.step ?? 'Lavez et essorez la salade.', s.p.step ?? '',
    `Coupez les légumes (${s.e.label}) en dés ou en rondelles.`,
    'Préparez la vinaigrette : moutarde, vinaigre, sel, poivre puis l’huile en fouettant.',
    'Mélangez tous les ingrédients avec la vinaigrette et servez frais.',
  ],
  tags: ['frais'],
};

// ---------- Burgers ----------
export const burger: Template = {
  key: 'burger', cuisine: 'américaine', meal: ['plat'], prep: 15, cook: 20, diff: 'facile', eq: ['poele', 'four'],
  base: `pain-a-burger 4p, salade-verte 1p, tomate 2p, oignon-rouge 1p, ketchup 2cs?, frites-surgelees 1000g?, ${SP}`,
  slots: {
    m: [
      o('bœuf', 'boeuf-hache 720g', 'Façonnez 4 steaks de 180 g, salez, poivrez et saisissez-les 3 min de chaque côté.'),
      o('poulet croustillant', 'poulet-pane 4p', 'Faites cuire le poulet pané au four ou à la poêle jusqu’à ce qu’il soit bien croustillant.'),
      o('végétarien', 'steak-vegetal 4p', 'Faites dorer les galettes végétales 4 min de chaque côté.'),
      o('agneau', 'agneau-hache 720g, cumin 1cc', 'Mélangez l’agneau avec le cumin, façonnez 4 steaks et faites-les cuire 4 min par face.'),
      o('dinde', 'dinde-hachee 720g', 'Façonnez 4 steaks et faites-les cuire 5 min de chaque côté.'),
    ],
    c: [
      o('au cheddar', 'cheddar 4t'), o('à la raclette', 'raclette 4t'), o('au chèvre', 'buche-de-chevre 8t'),
      o('au bleu', 'bleu-d-auvergne 100g'), o('au reblochon', 'reblochon 1p'),
    ],
    t: [
      o('bacon et oignons', 'bacon 8t', 'Faites griller le bacon.'),
      o('avocat', 'avocat 2p', 'Écrasez l’avocat avec un filet de citron.'),
      o('oignons caramélisés', 'oignon 3p, sucre 1cs, beurre 20g', 'Faites fondre les oignons émincés 15 min au beurre avec le sucre.'),
      o('champignons', 'champignons-de-paris 250g', 'Faites sauter les champignons émincés.'),
      o('œuf au plat', 'oeufs 4p', 'Faites cuire 4 œufs au plat.'),
    ],
  },
  title: (s) => `Burger ${s.m.label} ${s.c.label}, ${s.t.label}`,
  steps: (s) => [
    'Lancez les frites au four si vous en servez.', s.t.step!, s.m.step!,
    'Posez le fromage sur la viande en fin de cuisson et couvrez 1 min pour le faire fondre.',
    'Toastez les pains, garnissez de salade, tomate, oignon rouge, viande et garniture.',
  ],
  tags: ['street-food'],
};

// ---------- Tex-mex ----------
export const texmex: Template = {
  key: 'texmex', cuisine: 'mexicaine', meal: ['plat'], prep: 20, cook: 20, diff: 'facile', eq: ['poele'],
  base: `oignon 1p, epices-a-tacos 2cs, huile-de-tournesol 2cs, ${SP}`,
  slots: {
    f: [
      o('Tacos', 'tortillas-de-mais 12p'), o('Burritos', 'tortillas-de-ble 6p, riz-blanc 200g'),
      o('Wraps', 'tortillas-de-ble 6p, salade-verte 1p'), o('Quesadillas', 'tortillas-de-ble 8p, cheddar 200g'),
    ],
    p: [
      o('au bœuf épicé', 'boeuf-hache 600g'), o('au poulet', 'blanc-de-poulet 600g'), o('aux crevettes', 'crevettes 500g'),
      o('aux haricots noirs', 'haricots-noirs 500g'), o('au porc effiloché', 'echine-de-porc 800g'),
      o('au chorizo', 'chorizo 250g, pomme-de-terre 2p'), o('aux falafels', 'falafels 400g'),
    ],
    g: [
      o('guacamole', 'avocat 3p, citron-vert 1p, tomate 1p, coriandre-fraiche 1br?', 'Écrasez les avocats avec le citron vert, la tomate en dés et la coriandre.'),
      o('salsa et maïs', 'sauce-salsa 200g, mais 200g, creme-sure 150g?', 'Mélangez la salsa et le maïs égoutté.'),
      o('fromage et poivrons', 'emmental-rape 150g, poivron-rouge 1p, poivron-vert 1p', 'Faites revenir les poivrons en lanières.'),
    ],
  },
  title: (s) => `${s.f.label} ${s.p.label}, ${s.g.label}`,
  cookFor: (s) => (s.p.label.includes('effiloché') ? 120 : 20),
  steps: (s) => [
    s.f.label === 'Burritos' ? 'Faites cuire le riz.' : '',
    s.p.label.includes('effiloché')
      ? 'Faites mijoter le porc avec l’oignon, les épices et un verre d’eau 2 h à couvert, puis effilochez-le à la fourchette.'
      : 'Faites revenir l’oignon émincé dans l’huile, ajoutez la garniture et les épices, et laissez cuire 8 à 10 min.',
    s.g.step!,
    s.f.label === 'Quesadillas'
      ? 'Garnissez une tortilla de fromage et de garniture, couvrez d’une seconde et faites dorer 2 min de chaque côté.'
      : 'Réchauffez les tortillas à sec dans la poêle, garnissez et roulez ou pliez.',
  ],
  tags: ['épicé', 'street-food'],
};

// ---------- Pizzas ----------
const PIZZA_TOP = [
  o('reine', 'jambon-blanc 4t, champignons-de-paris 200g'), o('chorizo-poivrons', 'chorizo 150g, poivron-rouge 1p'),
  o('trois fromages', 'gorgonzola 80g, buche-de-chevre 100g'), o('végétarienne', 'courgette 1p, poivron-jaune 1p, oignon-rouge 1p, olives-noires 50g'),
  o('thon-oignons', 'thon-en-boite 140g, oignon-rouge 1p'), o('savoyarde', 'reblochon 1p, lardons 150g, pomme-de-terre 2p'),
  o('poulet-curry', 'blanc-de-poulet 300g, curry-en-poudre 1cc, oignon 1p'), o('pepperoni', 'pepperoni 120g'),
  o('chèvre-miel', 'buche-de-chevre 200g, miel 2cs, noix 30g?'), o('saumon-épinards', 'saumon-fume 150g, epinards 150g'),
  o('merguez', 'merguez 4p, poivron-vert 1p'), o('jambon cru-roquette', 'jambon-cru 6t, roquette 50g, parmesan 40g'),
  o('calzone', 'jambon-blanc 4t, oeufs 2p, champignons-de-paris 150g'), o('kebab', 'kebab-viande 300g, oignon-rouge 1p, sauce-blanche 4cs'),
  o('quatre saisons', 'jambon-blanc 3t, champignons-de-paris 100g, artichaut 2p, olives-noires 40g'),
  o('bolognaise', 'boeuf-hache 300g, oignon 1p'), o('aubergine-feta', 'aubergine 1p, feta 150g'),
  o('raclette', 'raclette 8t, jambon-cru 4t, pomme-de-terre 2p'),
];
export const pizza: Template = {
  key: 'pizza', cuisine: 'italienne', meal: ['plat'], prep: 20, cook: 15, diff: 'facile', eq: ['four'],
  servings: 2,
  base: 'pate-a-pizza 2p, mozzarella 250g, origan 1cc, huile-d-olive 2cs',
  slots: {
    t: PIZZA_TOP,
    b: [o('', 'sauce-tomate 200g', 'Étalez la sauce tomate', 'tomate'), o('base crème', 'creme-fraiche-epaisse 150g', 'Étalez la crème fraîche', 'crème')],
  },
  skip: (s) => s.t.label === 'bolognaise' && s.b.label !== '',
  title: (s) => `Pizza ${s.t.label}${s.b.label ? `, ${s.b.label}` : ''}`,
  steps: (s) => [
    'Préchauffez le four à 250 °C (ou au maximum) avec la plaque à l’intérieur.',
    'Étalez finement les pâtes à pizza sur du papier cuisson.',
    `${s.b.step} sur la pâte, en laissant 1 cm de bord.`,
    'Répartissez la garniture coupée en morceaux puis la mozzarella égouttée.',
    'Enfournez 10 à 12 min jusqu’à ce que les bords soient bien dorés. Ajoutez origan et un filet d’huile.',
  ],
  tags: ['familial'],
};

// ---------- Poêlées de pommes de terre ----------
export const poelee: Template = {
  key: 'poelee', cuisine: 'française', meal: ['plat'], prep: 15, cook: 30, diff: 'facile', eq: ['poele'],
  base: `pomme-de-terre 1500g, oignon 1p, beurre 30g, huile-de-tournesol 2cs, persil 1br?, ${SP}`,
  slots: {
    p: [
      o('aux lardons', 'lardons 250g'), o('au chorizo', 'chorizo 200g'), o('aux saucisses', 'saucisse-de-toulouse 4p'),
      o('au poulet', 'blanc-de-poulet 500g'), o('aux œufs', 'oeufs 6p'), o('au jambon', 'jambon-blanc 6t'),
      o('au boudin noir', 'boudin-noir 4p, pomme 2p'), o('au confit de canard', 'cuisses-de-canard-confites 4p'),
    ],
    e: [
      o('et champignons', 'champignons-de-paris 300g'), o('et poivrons', 'poivron-rouge 1p, poivron-vert 1p'),
      o('et haricots verts', 'haricots-verts 300g'), o('et fromage fondu', 'raclette 200g'), o('et ail', 'ail 4gs'),
    ],
  },
  title: (s) => `Poêlée de pommes de terre ${s.p.label} ${s.e.label}`,
  steps: (s) => [
    'Coupez les pommes de terre en cubes et faites-les précuire 8 min à l’eau salée, égouttez.',
    'Faites-les dorer 15 min dans le beurre et l’huile en remuant régulièrement.',
    `Ajoutez l’oignon émincé et la garniture (${s.p.label.replace(/^aux? |^au /, '')}), poursuivez 8 à 10 min.`,
    s.p.label === 'aux œufs' ? 'Creusez des puits, cassez-y les œufs et couvrez 4 min.' : '',
    `Ajoutez ${s.e.label.replace(/^et /, 'les ')} et terminez la cuisson 5 min. Parsemez de persil.`,
  ],
  tags: ['réconfortant'],
};

// ---------- Soupes ----------
export const soupe: Template = {
  key: 'soupe', cuisine: 'française', meal: ['entree', 'plat'], prep: 15, cook: 30, diff: 'facile', eq: ['casserole', 'mixeur'],
  base: `oignon 1p, beurre 20g, bouillon-de-legumes 1000ml, ${SP}, pain-de-campagne 4t?`,
  slots: {
    v: [
      o('carottes', 'carotte 8p'), o('potiron', 'potiron 1200g'), o('courgettes', 'courgette 4p'), o('poireaux', 'poireau 4p, pomme-de-terre 2p'),
      o('brocoli', 'brocoli 800g'), o('chou-fleur', 'chou-fleur 1000g'), o('petits pois', 'petits-pois 700g, menthe 1br?'),
      o('tomates', 'tomate 8p, ail 2gs, basilic 1br?'), o('champignons', 'champignons-de-paris 600g'),
      o('butternut', 'courge-butternut 1200g'), o('patate douce', 'patate-douce 3p'), o('lentilles corail', 'lentilles-corail 250g, carotte 2p'),
      o('panais', 'panais 6p'), o('céleri-rave', 'celeri-rave 800g'), o('épinards', 'epinards 500g, pomme-de-terre 2p'),
    ],
    st: [
      o('Velouté de', 'creme-liquide 200ml', 'Ajoutez la crème hors du feu.'),
      o('Soupe de', 'pomme-de-terre 3p', 'Les pommes de terre donnent de l’onctuosité sans crème.'),
      o('Soupe coco-curry de', 'lait-de-coco 400ml, curry-en-poudre 2cc', 'Ajoutez le curry avec l’oignon, puis le lait de coco en fin de cuisson.'),
    ],
  },
  title: (s) => `${s.st.label} ${s.v.label}`,
  steps: (s) => [
    'Faites revenir l’oignon émincé dans le beurre 3 min.',
    `Ajoutez les légumes (${s.v.label}) épluchés et coupés en morceaux, couvrez de bouillon.`,
    'Laissez cuire 25 min à frémissement.',
    `Mixez finement. ${s.st.step}`,
    'Rectifiez l’assaisonnement et servez avec des tartines grillées.',
  ],
  tags: ['réconfortant', 'économique'],
};

// ---------- Risottos ----------
export const risotto: Template = {
  key: 'risotto', cuisine: 'italienne', meal: ['plat'], prep: 10, cook: 30, diff: 'moyen', eq: ['casserole'],
  base: `riz-arborio 400g, echalote 2p, vin-blanc 150ml, bouillon-de-volaille 1200ml, beurre 40g, parmesan 80g, huile-d-olive 2cs, ${SP}`,
  slots: {
    m: [
      o('aux champignons', 'champignons-de-paris 400g'), o('aux cèpes', 'cepes 300g'), o('au poulet', 'blanc-de-poulet 500g'),
      o('aux asperges', 'asperges-vertes 400g'), o('à la courge', 'courge-butternut 600g'), o('aux crevettes', 'crevettes 500g, citron 1p'),
      o('aux petits pois et lardons', 'petits-pois 300g, lardons 200g'), o('au chorizo', 'chorizo 200g, poivron-rouge 1p'),
      o('au saumon', 'saumon 400g, aneth 1br?'), o('aux poireaux', 'poireau 3p'), o('au chèvre et épinards', 'chevre-frais 150g, epinards 200g'),
      o('à la saucisse', 'saucisse-de-toulouse 4p'), o('au gorgonzola', 'gorgonzola 150g, noix 40g?'), o('aux tomates séchées', 'tomates-sechees 100g, mozzarella 125g'),
    ],
  },
  title: (s) => `Risotto ${s.m.label}`,
  steps: (s) => [
    'Faites chauffer le bouillon et gardez-le frémissant.',
    `Faites revenir la garniture (${s.m.label.replace(/^(aux?|à la|au) /, '')}) coupée en morceaux dans l’huile, puis réservez.`,
    'Faites suer l’échalote hachée, ajoutez le riz et nacrez-le 2 min. Déglacez au vin blanc.',
    'Ajoutez le bouillon louche par louche en remuant, pendant 18 min.',
    'Incorporez la garniture, puis hors du feu le beurre et le parmesan. Couvrez 2 min et servez.',
  ],
  tags: ['réconfortant'],
};

// ---------- Plats mijotés ----------
export const mijote: Template = {
  key: 'mijote', cuisine: 'française', meal: ['plat'], prep: 20, cook: 120, diff: 'moyen', eq: ['cocotte'],
  base: `oignon 2p, ail 2gs, farine 1cs, huile-de-tournesol 2cs, bouquet-garni 1p, ${SP}`,
  slots: {
    m: [
      o('Bœuf', 'boeuf-a-braiser 1200g'), o('Agneau', 'epaule-d-agneau 1200g'), o('Porc', 'echine-de-porc 1200g'),
      o('Poulet', 'cuisses-de-poulet 1400g'), o('Lapin', 'lapin 1300g'), o('Veau', 'blanquette-de-veau-morceaux 1200g'),
    ],
    l: [
      o('au vin rouge', 'vin-rouge 750ml, lardons 150g'), o('à la bière', 'biere 500ml, pain-d-epices 2t?, moutarde 1cs'),
      o('à la tomate et aux olives', 'tomates-concassees 800g, olives-vertes 100g'),
      o('à la crème et à la moutarde', 'creme-fraiche-epaisse 200g, moutarde-a-l-ancienne 3cs, vin-blanc 250ml'),
      o('au cidre', 'cidre 750ml, pomme 2p'),
    ],
    v: [
      o('et carottes', 'carotte 6p'), o('et champignons', 'champignons-de-paris 400g'),
      o('et pommes de terre', 'pomme-de-terre 1200g'), o('et haricots blancs', 'haricots-blancs 500g'),
    ],
  },
  cookFor: (s) => (s.m.label === 'Poulet' ? 60 : s.m.label === 'Lapin' ? 75 : 150),
  title: (s) => `${s.m.label} mijoté ${s.l.label} ${s.v.label}`,
  steps: (s) => [
    'Coupez la viande en gros morceaux, salez, poivrez et faites-la dorer dans la cocotte avec l’huile. Réservez.',
    'Faites revenir les oignons émincés et l’ail, saupoudrez de farine et remuez 1 min.',
    `Remettez la viande, ajoutez le liquide (${s.l.label}) et le bouquet garni. Portez à frémissement.`,
    `Couvrez et laissez mijoter à feu doux ${s.m.label === 'Poulet' ? '45 min' : s.m.label === 'Lapin' ? '1 h' : '2 h'}.`,
    `Ajoutez les légumes (${s.v.label.replace(/^et /, '')}) 40 min avant la fin. Servez quand la viande est fondante.`,
  ],
  tags: ['mijoté', 'réconfortant', 'batch-cooking'],
};

// ---------- Viande / poisson + accompagnement ----------
const MAIN = [
  o('Steak', 'steak-de-boeuf 4p', 'Saisissez les steaks 2 à 3 min par face à feu vif, laissez reposer 3 min.', 'viande'),
  o('Côtes de porc', 'cote-de-porc 4p', 'Faites cuire les côtes de porc 5 à 6 min par face.', 'viande'),
  o('Poulet rôti à la poêle', 'blanc-de-poulet 4p', 'Faites dorer les blancs de poulet 6 à 7 min par face.', 'viande'),
  o('Pavé de saumon', 'saumon 4p', 'Faites cuire le saumon côté peau 5 min, retournez 2 min.', 'poisson'),
  o('Dos de cabillaud', 'cabillaud 4p', 'Faites cuire le cabillaud 4 min par face dans un peu de beurre.', 'poisson'),
  o('Escalopes de dinde', 'escalope-de-dinde 4p', 'Faites dorer les escalopes 4 min par face.', 'viande'),
  o('Magret de canard', 'magret-de-canard 2p', 'Quadrillez la peau du magret et faites-le cuire 8 min côté peau puis 4 min côté chair.', 'viande'),
  o('Saucisses de Toulouse', 'saucisse-de-toulouse 6p', 'Faites cuire les saucisses 15 min à feu moyen en les retournant.', 'viande'),
  o('Merguez', 'merguez 8p', 'Faites griller les merguez 10 min.', 'viande'),
  o('Côtelettes d’agneau', 'cotelettes-d-agneau 8p', 'Faites griller les côtelettes 3 min par face.', 'viande'),
  o('Escalopes de veau', 'escalope-de-veau 4p', 'Faites cuire les escalopes 3 min par face.', 'viande'),
  o('Tofu grillé', 'tofu 600g', 'Coupez le tofu en tranches épaisses et faites-les griller 4 min par face.', 'vegetal'),
];
const SIDE = [
  o('purée maison', 'pomme-de-terre 1500g, lait 250ml, beurre 60g, muscade 1pi', 'Faites cuire les pommes de terre à l’eau 20 min, écrasez-les avec le lait chaud et le beurre.'),
  o('frites au four', 'pomme-de-terre 1500g, huile-de-tournesol 3cs, paprika 1cc', 'Coupez les pommes de terre en frites, mélangez avec l’huile et le paprika, enfournez 35 min à 220 °C.'),
  o('riz pilaf', 'riz-blanc 400g, oignon 1p, bouillon-de-volaille 700ml', 'Faites revenir l’oignon et le riz, couvrez de bouillon et cuisez 17 min à couvert.'),
  o('haricots verts à l’ail', 'haricots-verts 800g, ail 2gs, pomme-de-terre 800g', 'Faites cuire les haricots verts et les pommes de terre, puis sautez-les avec l’ail.'),
  o('légumes rôtis', 'courgette 2p, poivron-rouge 2p, oignon-rouge 2p, pomme-de-terre 800g, herbes-de-provence 1cc', 'Coupez les légumes, arrosez d’huile et rôtissez 35 min à 200 °C.'),
  o('pâtes au beurre', 'tagliatelles 500g, parmesan 50g', 'Faites cuire les pâtes et mélangez-les avec un peu de beurre et de parmesan.'),
  o('pommes de terre sautées', 'pomme-de-terre 1500g, ail 2gs, persil 1br?', 'Faites sauter les pommes de terre en cubes 25 min avec l’ail.'),
  o('semoule aux légumes', 'semoule 400g, courgette 1p, carotte 2p, raisins-secs 40g?', 'Faites gonfler la semoule et mélangez-la aux légumes poêlés.'),
];
const SAUCE = [
  o('', '', ''),
  o('sauce au poivre', 'creme-liquide 200ml, poivre 1cc, echalote 1p', 'Faites suer l’échalote dans la poêle de cuisson, ajoutez le poivre concassé et la crème ; laissez réduire 3 min.'),
  o('sauce moutarde', 'creme-fraiche-epaisse 200g, moutarde 2cs', 'Déglacez la poêle avec la crème et la moutarde, laissez épaissir 2 min.'),
  o('sauce aux champignons', 'champignons-de-paris 250g, creme-liquide 200ml', 'Faites dorer les champignons émincés dans la poêle, ajoutez la crème.'),
  o('beurre citronné', 'citron 1p, beurre 50g, persil 1br', 'Faites mousser le beurre avec le jus de citron et le persil.'),
];
export const assiette: Template = {
  key: 'assiette', cuisine: 'française', meal: ['plat'], prep: 15, cook: 35, diff: 'facile', eq: ['poele', 'casserole'],
  base: `beurre 20g, huile-de-tournesol 1cs, ${SP}`,
  slots: { m: MAIN, sd: SIDE, sc: SAUCE },
  skip: (s) => (s.m.x === 'poisson' && ['sauce au poivre', 'sauce aux champignons'].includes(s.sc.label))
    || (s.m.x !== 'poisson' && s.sc.label === 'beurre citronné' && s.m.x !== 'vegetal'),
  title: (s) => `${s.m.label}${s.sc.label ? ` ${s.sc.label}` : ''}, ${s.sd.label}`,
  steps: (s) => [s.sd.step!, s.m.step!, s.sc.step ?? '', 'Dressez et servez bien chaud.'],
};

// ---------- Bowls ----------
export const bowl: Template = {
  key: 'bowl', cuisine: 'fusion', meal: ['plat'], prep: 20, cook: 20, diff: 'facile', eq: ['casserole', 'poele'],
  base: 'sauce-soja 3cs, huile-de-sesame 1cs, graines-de-sesame 1cs?, citron-vert 1p',
  slots: {
    b: [o('riz', 'riz-blanc 400g'), o('quinoa', 'quinoa 350g'), o('nouilles soba', 'nouilles-soba 400g')],
    p: [
      o('saumon', 'saumon 600g'), o('poulet teriyaki', 'blanc-de-poulet 600g, sauce-teriyaki 4cs'), o('tofu croustillant', 'tofu 500g, fecule-de-mais 2cs'),
      o('crevettes', 'crevettes 500g'), o('bœuf mariné', 'steak-de-boeuf 600g, ail 1gs'), o('falafels', 'falafels 400g, houmous 150g'),
    ],
    v: [
      o('avocat-edamame', 'avocat 2p, edamame 200g'), o('mangue-concombre', 'mangue 1p, concombre 1p'),
      o('carottes-chou rouge', 'carotte 2p, chou-rouge 200g'), o('patate douce rôtie', 'patate-douce 2p, epinards 100g'),
    ],
  },
  title: (s) => `Bowl ${s.p.label}, ${s.b.label} et ${s.v.label}`,
  steps: (s) => [
    `Faites cuire la base (${s.b.label}).`,
    `Préparez ${s.p.label} : saisissez à la poêle 4 à 8 min selon la protéine.`,
    `Taillez les légumes (${s.v.label}) en dés ou en lamelles${s.v.label.includes('rôtie') ? ' et rôtissez la patate douce 25 min à 200 °C' : ''}.`,
    'Mélangez sauce soja, huile de sésame et jus de citron vert.',
    'Composez les bols : base, protéine, légumes, sauce et sésame.',
  ],
  tags: ['équilibré'],
};

// ---------- Omelettes ----------
export const omelette: Template = {
  key: 'omelette', cuisine: 'française', meal: ['plat', 'petit-dejeuner'], prep: 10, cook: 10, diff: 'facile', eq: ['poele'],
  servings: 2,
  base: `oeufs 6p, beurre 15g, ${SP}`,
  slots: {
    a: [
      o('aux champignons', 'champignons-de-paris 200g'), o('aux lardons', 'lardons 150g'), o('aux pommes de terre', 'pomme-de-terre 2p'),
      o('au jambon', 'jambon-blanc 2t'), o('aux poivrons', 'poivron-rouge 1p'), o('aux épinards', 'epinards 150g'),
      o('au chorizo', 'chorizo 80g'), o('aux oignons', 'oignon 2p'),
    ],
    b: [
      o('et au fromage', 'emmental-rape 80g'), o('et au chèvre', 'chevre-frais 80g'), o('et à la feta', 'feta 80g'),
      o('et aux fines herbes', 'ciboulette 1br, persil 1br'), o('et au comté', 'comte 80g'), o('et à la tomate', 'tomate 1p'),
    ],
  },
  title: (s) => `Omelette ${s.a.label} ${s.b.label}`,
  steps: (s) => [
    `Faites revenir la garniture (${s.a.label.replace(/^(aux?|au) /, '')}) coupée en petits morceaux dans le beurre.`,
    'Battez les œufs avec sel et poivre.',
    `Versez-les dans la poêle, ajoutez ${s.b.label.replace(/^et /, '')} et laissez prendre à feu moyen.`,
    'Repliez l’omelette en deux et servez baveuse ou bien cuite selon vos goûts.',
  ],
  tags: ['rapide', 'économique'],
};

// ---------- Quiches ----------
export const quiche: Template = {
  key: 'quiche', cuisine: 'française', meal: ['plat', 'entree'], prep: 20, cook: 40, diff: 'facile', eq: ['four'],
  base: `pate-brisee 1p, oeufs 4p, creme-liquide 250ml, lait 150ml, muscade 1pi, ${SP}`,
  slots: {
    a: [
      o('aux poireaux', 'poireau 3p'), o('aux courgettes', 'courgette 2p'), o('aux épinards', 'epinards 300g'),
      o('aux champignons', 'champignons-de-paris 300g'), o('aux tomates', 'tomate 3p, moutarde 2cs'), o('aux oignons', 'oignon 4p'),
      o('au brocoli', 'brocoli 400g'), o('aux asperges', 'asperges-vertes 300g'), o('au potiron', 'potiron 500g'), o('aux poivrons', 'poivron-rouge 2p'),
    ],
    b: [
      o('et lardons', 'lardons 200g'), o('et saumon', 'saumon 300g'), o('et chèvre', 'buche-de-chevre 150g'),
      o('et thon', 'thon-en-boite 200g'), o('et jambon', 'jambon-blanc 4t'), o('et feta', 'feta 150g'),
    ],
  },
  title: (s) => `Quiche ${s.a.label} ${s.b.label}`,
  steps: (s) => [
    'Préchauffez le four à 190 °C. Foncez un moule avec la pâte et piquez le fond.',
    `Faites revenir les légumes (${s.a.label.replace(/^(aux?|au) /, '')}) émincés 8 à 10 min.`,
    'Battez les œufs avec la crème, le lait, la muscade, le sel et le poivre.',
    `Répartissez légumes et ${s.b.label.replace(/^et /, '')} sur la pâte, versez l’appareil.`,
    'Enfournez 35 à 40 min jusqu’à ce que la quiche soit dorée et prise.',
  ],
};

// ---------- Croques & sandwichs chauds ----------
export const croque: Template = {
  key: 'croque', cuisine: 'française', meal: ['plat'], prep: 10, cook: 10, diff: 'facile', eq: ['four'],
  servings: 2,
  base: 'beurre 20g, salade-verte 1p?',
  slots: {
    pa: [o('Croque-monsieur', 'pain-de-mie 8t'), o('Tartine gratinée', 'pain-de-campagne 4t'), o('Panini', 'baguette 1p')],
    g: [
      o('jambon-emmental', 'jambon-blanc 4t, emmental-rape 120g'), o('chèvre-miel', 'buche-de-chevre 150g, miel 1cs'),
      o('poulet-curry', 'poulet-roti-restes 200g, fromage-frais-a-tartiner 80g, curry-en-poudre 1cc'), o('saumon-épinards', 'saumon-fume 120g, epinards 80g, fromage-frais-a-tartiner 80g'),
      o('raclette-lardons', 'raclette 6t, lardons 100g'), o('tomate-mozzarella', 'tomate 2p, mozzarella 125g, pesto-vert 2cs'),
      o('thon-cheddar', 'thon-en-boite 140g, cheddar 4t, mayonnaise 1cs'), o('champignons-comté', 'champignons-de-paris 150g, comte 100g'),
    ],
  },
  title: (s) => `${s.pa.label} ${s.g.label}`,
  steps: (s) => [
    'Préchauffez le four en position gril (ou une presse à panini).',
    'Beurrez légèrement le pain.',
    `Garnissez (${s.g.label}) et ajoutez le fromage sur le dessus.`,
    'Faites gratiner 8 à 10 min jusqu’à ce que ce soit doré et fondant. Servez avec de la salade.',
  ],
  tags: ['rapide'],
};

// ---------- Tartiflettes & plats montagnards ----------
export const montagnard: Template = {
  key: 'montagnard', cuisine: 'française', meal: ['plat'], prep: 20, cook: 40, diff: 'facile', eq: ['four'],
  base: `pomme-de-terre 1600g, oignon 2p, creme-fraiche-epaisse 200g, vin-blanc 100ml?, ${SP}`,
  slots: {
    c: [
      o('Tartiflette', 'reblochon 1p'), o('Croziflette', 'reblochon 1p'), o('Raclette au four', 'raclette 400g'),
      o('Gratin savoyard au beaufort', 'beaufort 250g'), o('Morbiflette', 'morbier 400g'), o('Camembertiflette', 'camembert 1p'),
      o('Maroilles gratiné', 'maroilles 1p'), o('Montdorflette', 'mont-d-or 1p'),
    ],
    p: [
      o('aux lardons', 'lardons 250g'), o('au jambon cru', 'jambon-cru 8t'), o('au poulet', 'blanc-de-poulet 500g'),
      o('végétarienne aux champignons', 'champignons-de-paris 400g'),
    ],
  },
  title: (s) => `${s.c.label} ${s.p.label}`,
  steps: (s) => [
    'Préchauffez le four à 200 °C. Faites cuire les pommes de terre 15 min à l’eau, puis coupez-les en rondelles.',
    `Faites revenir les oignons émincés avec la garniture (${s.p.label.replace(/^(aux?|au) /, '')}).`,
    'Dans un plat, alternez pommes de terre, garniture et crème ; arrosez éventuellement de vin blanc.',
    'Posez le fromage coupé (croûte vers le haut si c’est un fromage entier) et enfournez 25 min.',
  ],
  tags: ['réconfortant', 'hiver'],
};

// ---------- Poissons au four ----------
export const papillote: Template = {
  key: 'papillote', cuisine: 'méditerranéenne', meal: ['plat'], prep: 15, cook: 25, diff: 'facile', eq: ['four'],
  base: `huile-d-olive 3cs, citron 1p, ${SP}`,
  slots: {
    f: [o('cabillaud', 'cabillaud 4p'), o('saumon', 'saumon 4p'), o('colin', 'colin 4p'), o('dorade', 'dorade 2p'), o('truite', 'truite 4p'), o('bar', 'bar 2p')],
    v: [
      o('tomates et olives', 'tomates-cerises 300g, olives-noires 60g, basilic 1br?'), o('poireaux et crème', 'poireau 2p, creme-legere 150ml'),
      o('courgettes et citron', 'courgette 2p, thym 1br'), o('fenouil et orange', 'fenouil 2p, orange 1p'),
      o('légumes thaïs', 'lait-de-coco 200ml, carotte 2p, gingembre-frais 10g, citronnelle 1p?'),
    ],
  },
  title: (s) => `Papillote de ${s.f.label}, ${s.v.label}`,
  steps: (s) => [
    'Préchauffez le four à 200 °C.',
    `Coupez les légumes (${s.v.label}) en fines lamelles et répartissez-les sur des feuilles de papier cuisson.`,
    `Posez le ${s.f.label} dessus, salez, poivrez, ajoutez une rondelle de citron et un filet d’huile.`,
    'Fermez hermétiquement les papillotes et enfournez 18 à 25 min. Servez avec du riz ou des pommes de terre vapeur.',
  ],
  tags: ['léger'],
};

// ---------- Hachis & lasagnes ----------
export const four: Template = {
  key: 'four', cuisine: 'française', meal: ['plat'], prep: 30, cook: 40, diff: 'moyen', eq: ['four', 'poele'],
  base: `oignon 1p, ail 1gs, emmental-rape 150g, ${SP}`,
  slots: {
    t: [
      o('Hachis parmentier', 'pomme-de-terre 1500g, lait 250ml, beurre 50g', 'Préparez une purée avec les pommes de terre, le lait et le beurre.', 'purée'),
      o('Lasagnes', 'feuilles-de-lasagne 300g, tomates-concassees 800g, lait 700ml, farine 50g, beurre 50g', 'Préparez une béchamel (beurre, farine, lait) et une sauce avec les tomates.', 'lasagne'),
      o('Gratin de pâtes', 'penne 500g, creme-liquide 300ml', 'Faites cuire les pâtes al dente.', 'pates'),
      o('Moussaka', 'aubergine 3p, pomme-de-terre 3p, tomates-concassees 400g, lait 500ml, farine 40g, beurre 40g, cannelle 1pi', 'Faites dorer les tranches d’aubergine et de pomme de terre ; préparez une béchamel.', 'moussaka'),
    ],
    m: [
      o('au bœuf', 'boeuf-hache 700g'), o('au canard', 'cuisses-de-canard-confites 4p'), o('au poulet', 'poulet-roti-restes 600g'),
      o('à l’agneau', 'agneau-hache 700g'), o('au saumon et épinards', 'saumon 500g, epinards 300g'),
      o('végétarien aux lentilles', 'lentilles-vertes 300g, carotte 2p'), o('au chèvre et courgettes', 'buche-de-chevre 200g, courgette 3p'),
      o('à la saucisse', 'chair-a-saucisse 600g'),
    ],
  },
  skip: (s) => s.t.x === 'moussaka' && !['au bœuf', 'à l’agneau', 'végétarien aux lentilles'].includes(s.m.label),
  title: (s) => `${s.t.label} ${s.m.label}`,
  steps: (s) => [
    'Préchauffez le four à 200 °C.',
    `Faites revenir l’oignon et l’ail, ajoutez la garniture (${s.m.label.replace(/^(aux?|au|à la|à l’) ?/, '')}) et laissez cuire 10 min.`,
    s.t.step!,
    s.t.x === 'purée' ? 'Étalez la garniture dans un plat, recouvrez de purée.'
      : s.t.x === 'lasagne' ? 'Alternez dans un plat feuilles de lasagne, garniture, sauce tomate et béchamel.'
        : s.t.x === 'moussaka' ? 'Alternez légumes et garniture à la tomate, terminez par la béchamel.'
          : 'Mélangez pâtes, garniture et crème dans un plat.',
    'Parsemez de fromage et enfournez 30 à 40 min jusqu’à ce que ce soit bien gratiné.',
  ],
  tags: ['familial', 'batch-cooking', 'réconfortant'],
};

// ---------- Couscous, tajines ----------
export const tajine: Template = {
  key: 'tajine', cuisine: 'orientale', meal: ['plat'], prep: 25, cook: 90, diff: 'moyen', eq: ['cocotte'],
  base: `oignon 2p, ail 2gs, ras-el-hanout 2cs, huile-d-olive 3cs, coriandre-fraiche 1br?, ${SP}`,
  slots: {
    f: [o('Tajine', 'semoule 400g'), o('Couscous', 'semoule 500g, pois-chiches 400g, carotte 3p, navet 2p, courgette 2p')],
    m: [
      o('de poulet', 'cuisses-de-poulet 1400g'), o('d’agneau', 'epaule-d-agneau 1200g'), o('de bœuf', 'boeuf-a-braiser 1200g'),
      o('aux merguez', 'merguez 8p'), o('de légumes', 'pois-chiches 400g, patate-douce 2p'), o('royal', 'cuisses-de-poulet 800g, merguez 6p, epaule-d-agneau 600g'),
    ],
    a: [
      o('aux citrons confits et olives', 'citron-confit 2p, olives-vertes 120g'), o('aux pruneaux et amandes', 'pruneaux 150g, amandes 60g, miel 1cs'),
      o('aux abricots secs', 'abricots-secs 150g, cannelle 1cc'), o('aux légumes du marché', 'carotte 3p, courgette 2p, tomate 2p'),
    ],
  },
  skip: (s) => s.f.label === 'Couscous' && s.a.label !== 'aux légumes du marché' && s.a.label !== 'aux abricots secs',
  cookFor: (s) => (s.m.label === 'de poulet' || s.m.label.includes('merguez') || s.m.label.includes('légumes') ? 50 : 120),
  title: (s) => `${s.f.label} ${s.m.label} ${s.a.label}`,
  steps: (s) => [
    'Faites dorer la viande (ou les légumes) dans l’huile avec les oignons émincés et l’ail.',
    'Ajoutez le ras el hanout, couvrez d’eau à hauteur et portez à frémissement.',
    `Ajoutez la garniture (${s.a.label.replace(/^(aux?|au) /, '')}) et laissez mijoter à couvert jusqu’à ce que la viande soit fondante.`,
    'Faites gonfler la semoule avec son volume d’eau bouillante salée et un filet d’huile, égrainez-la.',
    'Servez la semoule avec le bouillon et la garniture, parsemez de coriandre.',
  ],
  tags: ['mijoté', 'épicé', 'convivial'],
};

// ---------- Chili, dahl & plats de légumineuses ----------
export const legumineuse: Template = {
  key: 'legumineuse', cuisine: 'monde', meal: ['plat'], prep: 15, cook: 40, diff: 'facile', eq: ['cocotte'],
  base: `oignon 1p, ail 2gs, huile-d-olive 2cs, ${SP}`,
  slots: {
    t: [
      o('Chili', 'haricots-rouges 800g, tomates-concassees 800g, cumin 1cc, piment-en-poudre 1cc, riz-blanc 400g', 'Ajoutez les haricots, les tomates et les épices ; laissez mijoter 30 min. Servez avec le riz.'),
      o('Dahl', 'lentilles-corail 400g, lait-de-coco 400ml, curry-en-poudre 2cs, riz-basmati 300g', 'Ajoutez les lentilles, le curry, le lait de coco et 60 cl d’eau ; laissez cuire 25 min. Servez avec le riz.'),
      o('Ragoût de lentilles', 'lentilles-vertes 400g, carotte 3p, bouquet-garni 1p', 'Ajoutez les lentilles, les carottes en rondelles et 1 L d’eau ; laissez cuire 30 min.'),
      o('Cassoulet express', 'haricots-blancs 800g, tomates-concassees 400g, saucisse-de-toulouse 4p', 'Ajoutez les haricots et les tomates, laissez mijoter 30 min.'),
      o('Pois chiches mijotés', 'pois-chiches 800g, tomates-concassees 400g, epinards 200g, cumin 1cc', 'Ajoutez pois chiches, tomates et cumin 20 min, puis les épinards.'),
    ],
    m: [
      o('au bœuf', 'boeuf-hache 500g'), o('végétarien', ''), o('au chorizo', 'chorizo 200g'), o('au poulet', 'blanc-de-poulet 500g'),
      o('à la saucisse fumée', 'saucisse-fumee 2p'), o('aux patates douces', 'patate-douce 2p'),
    ],
  },
  title: (s) => `${s.t.label} ${s.m.label}`,
  steps: (s) => [
    `Faites revenir l’oignon et l’ail dans l’huile${s.m.ing ? ', puis faites dorer la garniture coupée en morceaux' : ''}.`,
    s.t.step!,
    'Rectifiez l’assaisonnement et servez bien chaud.',
  ],
  tags: ['économique', 'batch-cooking', 'réconfortant'],
};
