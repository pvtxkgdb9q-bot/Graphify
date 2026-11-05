import { o, type Template } from './recipe-dsl';

const aux = (l: string) => (l.includes('-') && l !== 'pommes-poires' ? l : `aux ${l}`);

const FRUITS = [
  o('pommes', 'pomme 6p'), o('poires', 'poire 6p'), o('fruits rouges', 'fruits-rouges-surgeles 500g'),
  o('pommes-poires', 'pomme 3p, poire 3p'), o('abricots', 'abricots 12p'), o('prunes', 'prunes 12p'),
  o('pêches', 'peches 5p'), o('rhubarbe-fraises', 'rhubarbe 400g, fraises 250g'), o('bananes-chocolat', 'banane 4p, pepites-de-chocolat 80g'),
  o('mangue-ananas', 'mangue 1p, ananas 300g'), o('cerises', 'cerises 500g'), o('myrtilles', 'myrtilles 400g'),
];

export const crumble: Template = {
  key: 'crumble', cuisine: 'anglaise', meal: ['dessert'], prep: 15, cook: 35, diff: 'facile', eq: ['four'],
  base: 'farine 150g, beurre 100g, sucre-roux 100g',
  slots: { f: FRUITS, t: [o('', ''), o('aux amandes', 'poudre-d-amande 50g'), o('aux flocons d’avoine', 'flocons-d-avoine 60g'), o('au spéculoos', 'speculoos 100g')] },
  title: (s) => `Crumble ${aux(s.f.label)} ${s.t.label}`,
  steps: (s) => [
    'Préchauffez le four à 180 °C.',
    `Coupez les fruits (${s.f.label}) en morceaux et répartissez-les dans un plat.`,
    `Sablez du bout des doigts la farine, le sucre et le beurre froid${s.t.label ? ` avec ${s.t.label.replace(/^aux?|au /, '').trim()}` : ''}.`,
    'Émiettez la pâte sur les fruits et enfournez 30 à 35 min jusqu’à ce que le dessus soit doré.',
    'Servez tiède, éventuellement avec une boule de glace vanille.',
  ],
  tags: ['réconfortant'],
};

export const tarte: Template = {
  key: 'tarte', cuisine: 'française', meal: ['dessert'], prep: 20, cook: 35, diff: 'moyen', eq: ['four'],
  base: 'pate-sablee 1p, sucre 60g',
  slots: {
    f: FRUITS.slice(0, 10),
    c: [
      o('', ''), o('amandine', 'poudre-d-amande 100g, beurre 80g, oeufs 2p'),
      o('à la crème', 'creme-liquide 200ml, oeufs 2p, sucre-vanille 1p'),
    ],
  },
  title: (s) => `Tarte ${s.c.label} ${aux(s.f.label)}`,
  steps: (s) => [
    'Préchauffez le four à 180 °C et foncez un moule avec la pâte.',
    s.c.label === 'amandine' ? 'Mélangez beurre mou, sucre, poudre d’amande et œufs ; étalez sur le fond de tarte.'
      : s.c.label ? 'Fouettez la crème, les œufs, le sucre et le sucre vanillé.' : 'Saupoudrez le fond de tarte d’un peu de sucre.',
    `Disposez les fruits (${s.f.label}) coupés en lamelles.`,
    s.c.label === 'à la crème' ? 'Versez l’appareil à la crème sur les fruits.' : 'Saupoudrez le reste du sucre.',
    'Enfournez 35 min. Laissez tiédir avant de démouler.',
  ],
};

export const clafoutis: Template = {
  key: 'clafoutis', cuisine: 'française', meal: ['dessert', 'gouter'], prep: 15, cook: 40, diff: 'facile', eq: ['four'],
  base: 'oeufs 4p, farine 100g, sucre 100g, lait 400ml, beurre 20g, sucre-vanille 1p',
  slots: { f: FRUITS },
  title: (s) => `Clafoutis ${aux(s.f.label)}`,
  steps: (s) => [
    'Préchauffez le four à 180 °C et beurrez un plat.',
    'Fouettez les œufs et le sucre, ajoutez la farine puis le lait petit à petit.',
    `Disposez les fruits (${s.f.label}) dans le plat et versez la pâte.`,
    'Enfournez 35 à 40 min. Servez tiède ou froid.',
  ],
};

export const crepes: Template = {
  key: 'crepes', cuisine: 'française', meal: ['dessert', 'gouter', 'petit-dejeuner'], prep: 10, cook: 30, diff: 'facile', eq: ['poele'],
  base: 'farine 250g, oeufs 4p, lait 500ml, beurre 50g, sucre 1cs, sel 1pi',
  slots: {
    g: [
      o('au sucre', 'sucre 50g'), o('au Nutella', 'pate-a-tartiner-chocolat 200g'), o('à la confiture', 'confiture 200g'),
      o('banane-chocolat', 'banane 3p, chocolat-noir 100g'), o('au caramel beurre salé', 'caramel 150g'), o('au citron', 'citron 2p, sucre 50g'),
      o('aux pommes caramélisées', 'pomme 3p, sucre-roux 60g'), o('au miel et noix', 'miel 100g, noix 60g'), o('aux fraises chantilly', 'fraises 300g, creme-liquide 200ml'),
      o('à la crème de marrons', 'creme-de-marrons 200g'),
    ],
  },
  title: (s) => `Crêpes ${s.g.label}`,
  steps: (s) => [
    'Mélangez la farine, le sucre et le sel ; creusez un puits et ajoutez les œufs.',
    'Incorporez le lait petit à petit en fouettant, puis le beurre fondu. Laissez reposer 30 min si possible.',
    'Faites cuire les crêpes dans une poêle chaude légèrement beurrée, 1 min de chaque côté.',
    `Garnissez ${s.g.label.replace(/^(au|à la|aux) /, 'de ')} et pliez-les en quatre.`,
  ],
};

export const gateau: Template = {
  key: 'gateau', cuisine: 'française', meal: ['dessert', 'gouter'], prep: 15, cook: 35, diff: 'facile', eq: ['four'],
  base: 'yaourt-nature 125g, farine 250g, sucre 150g, oeufs 3p, huile-de-tournesol 80ml, levure-chimique 1p',
  slots: {
    p: [
      o('nature', ''), o('au citron', 'citron 2p'), o('aux pommes', 'pomme 2p'), o('au chocolat', 'cacao-en-poudre 30g, pepites-de-chocolat 100g'),
      o('à la banane', 'banane 2p'), o('aux fruits rouges', 'fruits-rouges-surgeles 200g'), o('marbré', 'cacao-en-poudre 30g'),
      o('à la noix de coco', 'noix-de-coco 80g'), o('à l’orange', 'orange 1p'), o('aux poires et chocolat', 'poire 2p, pepites-de-chocolat 80g'),
    ],
  },
  title: (s) => `Gâteau au yaourt ${s.p.label}`,
  steps: (s) => [
    'Préchauffez le four à 180 °C et beurrez un moule.',
    'Mélangez le yaourt, le sucre et les œufs, puis la farine, la levure et l’huile.',
    s.p.label === 'nature' ? '' : `Incorporez ${s.p.label.replace(/^(au|à la|aux|à l’) ?/, '')} (zestes, morceaux ou poudre selon le cas).`,
    'Versez dans le moule et enfournez 30 à 35 min (la lame d’un couteau doit ressortir sèche).',
  ],
  tags: ['économique'],
};

export const muffins: Template = {
  key: 'muffins', cuisine: 'américaine', meal: ['gouter', 'petit-dejeuner'], prep: 15, cook: 22, diff: 'facile', eq: ['four'],
  servings: 12,
  base: 'farine 280g, sucre 120g, oeufs 2p, lait 200ml, beurre 100g, levure-chimique 1p',
  slots: {
    p: [
      o('aux pépites de chocolat', 'pepites-de-chocolat 150g'), o('aux myrtilles', 'myrtilles 200g'), o('banane-noix', 'banane 2p, noix 60g'),
      o('pomme-cannelle', 'pomme 2p, cannelle 1cc'), o('framboise-chocolat blanc', 'framboises 150g, chocolat-blanc 100g'),
      o('citron-pavot', 'citron 2p'), o('au Nutella', 'pate-a-tartiner-chocolat 150g'), o('aux fruits rouges', 'fruits-rouges-surgeles 200g'),
    ],
  },
  title: (s) => `Muffins ${s.p.label}`,
  steps: (s) => [
    'Préchauffez le four à 190 °C.',
    'Mélangez les ingrédients secs d’un côté, les œufs, le lait et le beurre fondu de l’autre.',
    `Réunissez sans trop mélanger et incorporez la garniture (${s.p.label.replace(/^(aux?|au) /, '')}).`,
    'Remplissez les moules aux trois quarts et enfournez 20 à 22 min.',
  ],
};

export const smoothie: Template = {
  key: 'smoothie', cuisine: 'monde', meal: ['petit-dejeuner', 'gouter'], prep: 5, cook: 0, diff: 'facile', eq: ['mixeur'],
  servings: 2,
  base: '',
  slots: {
    f: [
      o('banane-fraise', 'banane 1p, fraises 200g'), o('mangue-passion', 'mangue 1p, fruit-de-la-passion 2p'), o('fruits rouges', 'fruits-rouges-surgeles 250g, banane 1p'),
      o('vert épinards-pomme', 'epinards 60g, pomme 1p, banane 1p'), o('ananas-coco', 'ananas 250g, lait-de-coco 150ml'), o('banane-cacahuète', 'banane 2p, beurre-de-cacahuete 2cs'),
      o('pêche-abricot', 'peches 2p, abricots 3p'), o('kiwi-pomme', 'kiwi 3p, pomme 1p'),
    ],
    l: [o('au lait', 'lait 300ml'), o('au yaourt', 'yaourt-nature 250g'), o('protéiné', 'skyr 250g, flocons-d-avoine 40g')],
  },
  title: (s) => `Smoothie ${s.f.label} ${s.l.label}`,
  steps: (s) => [`Coupez les fruits (${s.f.label}) en morceaux.`, 'Mixez avec le reste des ingrédients jusqu’à obtenir une texture lisse.', 'Servez bien frais.'],
  tags: ['rapide'],
};

export const petitdej: Template = {
  key: 'petitdej', cuisine: 'monde', meal: ['petit-dejeuner'], prep: 10, cook: 15, diff: 'facile', eq: ['poele'],
  servings: 2,
  base: '',
  slots: {
    t: [
      o('Pancakes', 'farine 200g, oeufs 2p, lait 250ml, sucre 30g, levure-chimique 1cc, beurre 30g', 'Mélangez farine, sucre, levure, œufs, lait et beurre fondu ; faites cuire des petites crêpes épaisses 2 min par face.'),
      o('Porridge', 'flocons-d-avoine 160g, lait 500ml', 'Faites cuire les flocons dans le lait 5 min en remuant jusqu’à ce que ce soit crémeux.'),
      o('Pain perdu', 'brioche 6t, oeufs 3p, lait 200ml, sucre 40g, beurre 30g', 'Trempez la brioche dans les œufs battus avec le lait et le sucre, puis faites-la dorer au beurre.'),
      o('Gaufres', 'farine 250g, oeufs 3p, lait 400ml, beurre 80g, sucre 40g, levure-chimique 1cc', 'Préparez la pâte et faites cuire dans le gaufrier 4 min.'),
    ],
    g: [
      o('banane et sirop d’érable', 'banane 2p, sirop-d-erable 4cs'), o('aux myrtilles', 'myrtilles 150g'), o('pomme-cannelle', 'pomme 2p, cannelle 1cc'),
      o('au chocolat', 'chocolat-noir 60g'), o('beurre de cacahuète et banane', 'beurre-de-cacahuete 3cs, banane 1p'),
      o('aux fruits rouges et yaourt grec', 'fruits-rouges-surgeles 200g, yaourt-grec 150g'), o('miel et noix', 'miel 3cs, noix 40g'),
    ],
  },
  title: (s) => `${s.t.label} ${s.g.label}`,
  steps: (s) => [s.t.step!, `Servez avec la garniture (${s.g.label.replace(/^(aux?|au) /, '')}).`],
};

export const oeufsMatin: Template = {
  key: 'oeufs-matin', cuisine: 'monde', meal: ['petit-dejeuner', 'plat'], prep: 5, cook: 10, diff: 'facile', eq: ['poele'],
  servings: 2,
  base: 'oeufs 5p, beurre 15g, sel, poivre, pain-de-campagne 4t',
  slots: {
    t: [
      o('Œufs brouillés', '', 'Faites cuire les œufs battus à feu doux dans le beurre en remuant sans arrêt.'),
      o('Œufs au plat', '', 'Faites cuire les œufs au plat dans le beurre jusqu’à ce que le blanc soit pris.'),
      o('Shakshuka', 'tomates-concassees 400g, poivron-rouge 1p, oignon 1p, cumin 1cc, paprika 1cc', 'Faites mijoter poivron, oignon, tomates et épices 15 min, creusez des puits et faites-y cuire les œufs.'),
      o('Œufs cocotte', 'creme-liquide 100ml', 'Répartissez la garniture dans des ramequins, cassez les œufs, ajoutez la crème et faites cuire 12 min au bain-marie au four.'),
    ],
    g: [
      o('au bacon', 'bacon 6t'), o('à l’avocat', 'avocat 1p'), o('au saumon fumé', 'saumon-fume 100g'), o('aux champignons', 'champignons-de-paris 200g'),
      o('au fromage', 'emmental-rape 60g'), o('à la feta et épinards', 'feta 80g, epinards 100g'), o('aux saucisses', 'chipolatas 4p'),
    ],
  },
  title: (s) => `${s.t.label} ${s.g.label}`,
  steps: (s) => [`Préparez la garniture (${s.g.label.replace(/^(aux?|au|à l’|à la) ?/, '')}) : faites-la revenir à la poêle si nécessaire.`, s.t.step!, 'Servez avec des tartines grillées.'],
  tags: ['rapide'],
};

export const apero: Template = {
  key: 'apero', cuisine: 'monde', meal: ['apero', 'entree'], prep: 15, cook: 15, diff: 'facile', eq: ['four'],
  base: '',
  slots: {
    t: [
      o('Bruschettas', 'baguette 1p, huile-d-olive 3cs, ail 1gs', 'Coupez la baguette en tranches, frottez-les d’ail, arrosez d’huile et faites-les griller.'),
      o('Feuilletés', 'pate-feuilletee 1p, oeufs 1p', 'Découpez la pâte feuilletée, garnissez, refermez, dorez à l’œuf et enfournez 15 min à 200 °C.'),
      o('Tortilla roulée', 'tortillas-de-ble 4p, fromage-frais-a-tartiner 150g', 'Tartinez les tortillas de fromage frais, garnissez, roulez serré et coupez en tronçons.'),
    ],
    g: [
      o('tomate-basilic', 'tomate 3p, basilic 1br'), o('chèvre-miel', 'buche-de-chevre 150g, miel 2cs'), o('jambon cru-mozzarella', 'jambon-cru 4t, mozzarella 125g'),
      o('saumon fumé-aneth', 'saumon-fume 150g, aneth 1br'), o('chorizo-poivron', 'chorizo 100g, poivrons-grilles 150g'), o('champignons-ail', 'champignons-de-paris 200g, persil 1br'),
      o('saucisse', 'chipolatas 6p'), o('épinards-feta', 'epinards 150g, feta 100g'),
    ],
  },
  title: (s) => `${s.t.label} ${s.g.label}`,
  steps: (s) => [s.t.step!, `Garniture : ${s.g.label}.`, 'Servez chaud ou tiède à l’apéritif.'],
  tags: ['apéro', 'convivial'],
};

export const rizaulait: Template = {
  key: 'rizaulait', cuisine: 'française', meal: ['dessert', 'gouter'], prep: 5, cook: 40, diff: 'facile', eq: ['casserole'],
  base: 'riz-rond 150g, lait-entier 1000ml, sucre 100g',
  slots: {
    p: [o('à la vanille', 'vanille 1p'), o('à la cannelle', 'cannelle 1cc'), o('au caramel', 'caramel 100g'), o('à la noix de coco', 'lait-de-coco 200ml, noix-de-coco 30g'), o('au chocolat', 'chocolat-noir 100g'), o('à la fleur d’oranger et pistaches', 'pistaches 40g')],
  },
  title: (s) => `Riz au lait ${s.p.label}`,
  steps: (s) => ['Rincez le riz et faites-le blanchir 2 min à l’eau bouillante.', `Faites-le cuire dans le lait frémissant ${s.p.label} 35 min à feu doux en remuant souvent.`, 'Ajoutez le sucre en fin de cuisson. Servez tiède ou froid.'],
};
