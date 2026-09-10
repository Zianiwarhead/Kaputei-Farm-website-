export interface Recipe {
  id: string
  title: string
  excerpt: string
  category: 'Beef' | 'Chicken' | 'Pork' | 'Sauces' | 'Sides'
  time: string
  serves: string
  sauce: string
  productHandle: string
  ingredients: string[]
  steps: string[]
  image?: string
  gradient: { from: string; to: string }
}

export const RECIPES: Recipe[] = [
  {
    id: 'nyama-choma-glaze',
    title: 'Nyama Choma with Sticky BBQ-Honey Glaze',
    excerpt:
      'Brined, slow-roasted and lacquered with a Kaputei BBQ-honey glaze. The golden rule: sauce goes on late, never early.',
    category: 'Beef',
    time: '1 hr 30 min',
    serves: '6',
    sauce: 'Barbecue Sauce',
    productHandle: 'barbecue-sauce',
    image: '/recipes/nyama-choma.jpg',
    ingredients: [
      '1–2 kg beef short ribs, T-bone cuts, or goat (mbuzi) ribs',
      '4 tbsp cooking oil',
      '4–5 cloves garlic, finely minced',
      '1 sprig fresh rosemary, chopped',
      '3 tbsp soy sauce',
      '1 cup Kaputei Barbecue Sauce (Original or Smoke)',
      '2 tbsp honey',
      'Salt and black pepper to taste',
      'Ugali or roasted potatoes + kachumbari, to serve',
    ],
    steps: [
      'Optional but worth it: pierce the meat all over with a fork and rest it in a salt-water brine for 2 hours or overnight — this keeps the choma juicy, never chewy.',
      'Pat the meat completely dry. Rub thoroughly with oil, soy sauce, garlic, rosemary and black pepper. Rest 30 minutes at room temperature.',
      'Roast at 250°C on a wire rack for 40 minutes, flipping halfway — or grill over medium-high coals for 30–40 minutes. Do not sauce yet: the sugars would burn and turn bitter.',
      'Whisk the BBQ sauce with the honey. Paint a thick layer all over the meat and return to the heat for 20–30 more minutes, basting every 10 minutes until bubbling, sticky and charred at the edges.',
      'Wrap tightly in foil and rest 15–20 minutes to lock the juices in. Chop into bite-size chunks and serve piping hot with ugali and cold kachumbari.',
    ],
    gradient: { from: '#D94B2B', to: '#7B3A18' },
  },
  {
    id: 'chipotle-bowl',
    title: 'Chipotle Bowl',
    excerpt:
      'Cilantro-lime rice, smoky beans and all the toppings, finished with a zig-zag of Kaputei Chipotle dressing.',
    category: 'Chicken',
    time: '35 min',
    serves: '4',
    sauce: 'Chipotle Dressing',
    productHandle: 'salad-dressings',
    image: '/recipes/chipotle-bowl.jpg',
    ingredients: [
      '1 cup long-grain or basmati rice',
      '1 tbsp butter + 1 lime, juiced + ½ cup chopped coriander',
      '1 cup black or pinto beans, cooked',
      '4–5 tbsp Kaputei Chipotle dressing, divided',
      'Pinch each of garlic powder, cumin and salt',
      'Optional: grilled chicken cubes or steak strips',
      'Toppings: sweetcorn, lettuce, shredded cheese, sour cream',
    ],
    steps: [
      'Cook the rice until fluffy. While steaming hot, stir through the butter, lime juice, salt and coriander. Set aside.',
      'Warm the beans over low heat with 1 tablespoon of Chipotle dressing, the garlic powder, cumin and a splash of water.',
      'Build assembly-line style: two scoops of cilantro-lime rice across the bottom, beans (and protein, if using) alongside.',
      'Sprinkle cheese over the hot beans so it melts slightly, then add corn and lettuce.',
      'Grand finale: drizzle a generous zig-zag of Chipotle dressing over the whole bowl.',
    ],
    gradient: { from: '#E07A1F', to: '#7B3A18' },
  },
  {
    id: 'pilau-tomato-base',
    title: 'Beef Pilau with a Tomato Base',
    excerpt:
      'Tender beef, dark caramel onions and rice steamed in real beef broth — with Kaputei Tomato Sauce in the base.',
    category: 'Sides',
    time: '1 hr',
    serves: '6',
    sauce: 'Tomato Sauce',
    productHandle: 'tomato-sauce',
    image: '/recipes/pilau.jpg',
    ingredients: [
      '½ kg beef cubes (bone-in for extra flavor)',
      '4½ cups water + 1 tsp salt (yields 4 cups broth)',
      '6 cloves garlic + 2-inch ginger, divided',
      '2 cups basmati rice, washed and drained',
      '2 large red onions, thinly sliced',
      '1 tbsp pilau masala + 3 tbsp cooking oil',
      '2 large ripe tomatoes, blended — or 3 tbsp Kaputei Tomato Sauce',
      'Optional: 1–2 stalks lemongrass, crushed',
    ],
    steps: [
      'Boil the beef with the water, half the garlic and ginger, and salt for 20–30 minutes until tender. Reserve exactly 4 cups of the broth — this is the flavor secret.',
      'Fry the onions in oil until dark caramel golden-brown (watch closely, do not burn).',
      'Add the beef; fry 2–3 minutes. Stir in remaining garlic, ginger, pilau masala (and lemongrass) for 60 seconds until fragrant.',
      'Add the tomatoes or Tomato Sauce; cover and cook 3–5 minutes into a thick, shimmering paste.',
      'Stir in the rice for 2 minutes until glossy. Pour in the 4 cups of hot broth, boil uncovered until steam holes appear, then cover tight on the lowest heat for 18–20 minutes. Rest 5 minutes, fluff and serve with kachumbari.',
    ],
    gradient: { from: '#C8252C', to: '#9E1B22' },
  },
  {
    id: 'hot-sweet-wings',
    title: 'Hot & Sweet Wings',
    excerpt:
      'Crispy oven-baked wings tossed in our Hot & Sweet Sauce. Perfect with cold drinks on a hot afternoon.',
    category: 'Chicken',
    time: '45 min',
    serves: '4',
    sauce: 'Hot & Sweet Sauce',
    productHandle: 'hot-sweet-sauce',
    ingredients: [
      '1 kg chicken wings, split',
      '1 tbsp baking powder + 1 tsp salt',
      '½ tsp garlic powder',
      '¾ cup Kaputei Hot & Sweet Sauce',
      '1 tbsp honey (optional, for extra gloss)',
      'Sesame seeds + spring onion, to finish',
    ],
    steps: [
      'Heat oven to 220°C. Toss wings with baking powder, salt and garlic powder.',
      'Bake on a rack 35–40 minutes, flipping once, until deep golden and crisp.',
      'Warm the Hot & Sweet Sauce (plus honey if using) and toss the hot wings through it.',
      'Finish with sesame and spring onion. Serve immediately.',
    ],
    gradient: { from: '#E07A1F', to: '#C8252C' },
  },
  {
    id: 'chips-kachumbari',
    title: 'Chips with Salsa Kachumbari',
    excerpt:
      'Hot chips piled with fresh Salsa Kachumbari and a drizzle of Chilli Sauce — Nairobi street food at home.',
    category: 'Sides',
    time: '25 min',
    serves: '2–3',
    sauce: 'Salsa Kachumbari',
    productHandle: 'salsa-kachumbari',
    ingredients: [
      '4 large potatoes, cut into chips',
      'Oil, for frying + salt',
      '1 jar Kaputei Salsa Kachumbari',
      'Kaputei Chilli Sauce, to drizzle',
      'Fresh coriander + lemon wedges',
    ],
    steps: [
      'Fry the chips in hot oil until golden and crisp. Drain and salt immediately.',
      'Pile onto a platter and spoon over generous Salsa Kachumbari.',
      'Drizzle with Chilli Sauce, scatter coriander and serve with lemon. Eat hot.',
    ],
    gradient: { from: '#D94B2B', to: '#C8252C' },
  },
]
