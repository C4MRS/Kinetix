const productsDataset = [
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/pro-tennis-racket.jpg",
    name: "Pro Tennis Racket",
    description:
      "Lightweight racket for intermediate and professional players, featuring a reinforced graphite frame and a non-slip grip.",
    price: 40,
    tags: [
      "tennis",
      "sport",
      "racket",
      "outdoor",
      "fitness",
      "racquet",
      "backhand",
      "match",
      "court",
      "equipment",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/match-football.jpg",
    name: "Match Football",
    description:
      "Regulation football made of synthetic leather, ideal for training sessions and matches on natural or artificial grass.",
    price: 25,
    tags: [
      "football",
      "soccer",
      "sport",
      "ball",
      "outdoor",
      "match",
      "pitch",
      "training",
      "team sport",
      "goal",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/SpeedRun_Running_Shoes.png",
    name: "SpeedRun Running Shoes",
    description:
      "Lightweight shoes with cushioned soles, designed for road running and daily workouts.",
    price: 65,
    tags: [
      "running",
      "shoes",
      "fitness",
      "cardio",
      "sport",
      "jogging",
      "sneakers",
      "footwear",
      "workout",
      "marathon",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/fighter_boxing_gloves.jpg",
    name: "Fighter Boxing Gloves",
    description:
      "Padded gloves with hook-and-loop closure, suitable for heavy bag work, sparring, and gym training.",
    price: 35,
    tags: [
      "boxing",
      "combat",
      "fitness",
      "gloves",
      "martial arts",
      "sparring",
      "punch",
      "fighter",
      "punching",
      "protection",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/comfort-yoga-mat.jpg",
    name: "Comfort Yoga Mat",
    description:
      "Non-slip mat made of soft material, perfect for yoga, pilates, and stretching.",
    price: 18,
    tags: [
      "yoga",
      "fitness",
      "wellness",
      "mat",
      "indoor",
      "pilates",
      "stretching",
      "meditation",
      "home workout",
      "floor mat",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/adjustable-dumbbell-set.jpg",
    name: "Adjustable Dumbbell Set",
    description:
      "Pair of dumbbells with adjustable weights, ideal for muscle training at home or at the gym.",
    price: 55,
    tags: [
      "fitness",
      "gym",
      "weights",
      "strength",
      "training",
      "dumbbells",
      "muscle",
      "home gym",
      "bodybuilding",
      "iron",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/aero-cycling-helmet.jpg",
    name: "Aero Cycling Helmet",
    description:
      "Lightweight and ventilated helmet, designed to provide protection and comfort during bike rides.",
    price: 45,
    tags: [
      "cycling",
      "bike",
      "sport",
      "helmet",
      "outdoor",
      "bicycle",
      "protection",
      "safety",
      "gear",
      "ride",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/clearvision-swimming-goggles.jpg",
    name: "ClearVision Swimming Goggles",
    description:
      "Waterproof swim goggles featuring anti-fog lenses and an adjustable strap.",
    price: 15,
    tags: [
      "swimming",
      "water",
      "sport",
      "goggles",
      "pool",
      "swim",
      "eyewear",
      "waterproof",
      "diving",
      "aquatic",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/steelbat-baseball-bat.jpg",
    name: "SteelBat Baseball Bat",
    description:
      "Durable aluminum bat, suitable for training and recreational matches.",
    price: 39,
    tags: [
      "baseball",
      "bat",
      "sport",
      "outdoor",
      "team sport",
      "homerun",
      "match",
      "slugger",
      "aluminum bat",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/adjustable-basketball-hoop.jpg",
    name: "Adjustable Basketball Hoop",
    description:
      "Basketball hoop with adjustable height, ideal for backyards, gyms, and individual practice.",
    price: 120,
    tags: [
      "basketball",
      "hoop",
      "sport",
      "outdoor",
      "training",
      "backyard",
      "court",
      "rim",
      "hoops",
      "backboard",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/street-basketball.jpg",
    name: "Street Basketball",
    description: "Durable basketball designed for both indoor and outdoor use.",
    price: 28,
    tags: [
      "basketball",
      "ball",
      "sport",
      "street",
      "outdoor",
      "hoops",
      "court",
      "match",
      "playground",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/training-sports-backpack.jpg",
    name: "Training Sports Backpack",
    description:
      "Spacious backpack with dedicated compartments for shoes, water bottles, and gym accessories.",
    price: 32,
    tags: [
      "bag",
      "fitness",
      "travel",
      "gym",
      "accessories",
      "backpack",
      "sports bag",
      "gear bag",
      "storage",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/thermal-sports-flask.jpg",
    name: "Thermal Sports Flask",
    description:
      "Stainless steel water bottle that keeps drinks cold or hot throughout your workout.",
    price: 16,
    tags: [
      "hydration",
      "water",
      "bottle",
      "fitness",
      "sport",
      "flask",
      "thermal",
      "drink",
      "gym flask",
      "workout",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/speedjump-jump-rope.jpg",
    name: "SpeedJump Jump Rope",
    description:
      "Lightweight skipping rope with ergonomic handles, ideal for cardio, boxing, and warm-ups.",
    price: 12,
    tags: [
      "jump rope",
      "cardio",
      "fitness",
      "boxing",
      "training",
      "skipping",
      "skipping rope",
      "warm-up",
      "speed rope",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/volley-shield-knee-pads.jpg",
    name: "Volley Shield Knee Pads",
    description:
      "Padded volleyball knee pads, helpful for protecting joints during dives and falls.",
    price: 22,
    tags: [
      "volleyball",
      "protection",
      "sport",
      "pads",
      "indoor",
      "knee pads",
      "joint safety",
      "court sport",
      "guard",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/dryfit-technical-shirt.jpg",
    name: "DryFit Technical Shirt",
    description:
      "Breathable sports t-shirt, engineered to keep your body dry during physical activity.",
    price: 24,
    tags: [
      "clothing",
      "fitness",
      "shirt",
      "sport",
      "running",
      "apparel",
      "t-shirt",
      "breathable",
      "dryfit",
      "gymwear",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/flex-sports-shorts.jpg",
    name: "Flex Sports Shorts",
    description:
      "Lightweight and stretchy athletic shorts, suitable for running, gym sessions, and team sports.",
    price: 20,
    tags: [
      "clothing",
      "shorts",
      "fitness",
      "sport",
      "running",
      "apparel",
      "sportswear",
      "gymwear",
      "stretchy",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/fitness-resistance-bands-set.jpg",
    name: "Fitness Resistance Bands Set",
    description:
      "Set of resistance bands with different tension levels, perfect for toning and rehabilitation exercises.",
    price: 19,
    tags: [
      "fitness",
      "rehabilitation",
      "strength",
      "bands",
      "training",
      "resistance bands",
      "stretching",
      "home workout",
      "rubber bands",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/heavybag-boxing-punching-bag.jpg",
    name: "HeavyBag Boxing Punching Bag",
    description:
      "Heavy-duty punching bag for boxing, kickboxing, and martial arts workouts.",
    price: 90,
    tags: [
      "boxing",
      "combat",
      "training",
      "bag",
      "martial arts",
      "punching bag",
      "heavy bag",
      "kickboxing",
      "mma",
      "punch",
    ],
  },
  {
    imageURL:
      "https://kinetixstorage1.blob.core.windows.net/product-images/urban-ride-skateboard.jpg",
    name: "Urban Ride Skateboard",
    description:
      "Skateboard featuring a reinforced deck and durable wheels, suitable for beginners and urban commuting.",
    price: 50,
    tags: [
      "skateboard",
      "urban",
      "sport",
      "street",
      "outdoor",
      "skate",
      "board",
      "cruising",
      "skater",
    ],
  },
];

export default productsDataset;
