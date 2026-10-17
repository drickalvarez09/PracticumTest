# Wanderly Travel Agency (React + Tailwind)

Assignment 1 rebuilt with Vite, React and Tailwind CSS.

## Run it

```
npm install
npm run dev
```

## Structure

```
src/
├── main.jsx            # starts React
├── App.jsx             # Header + Hero + MainContent + Footer
├── index.css           # Tailwind import + our colors/fonts (@theme)
├── data/siteData.js    # ALL content: tours, slides, steps, reviews, nav links
└── components/
    ├── Header.jsx          # sticky nav, mobile menu (useState)
    ├── Hero.jsx            # headline, buttons, stats
    ├── Slideshow.jsx      # destination photos (useState for current slide)
    ├── MainContent.jsx     # <main>; holds the shared "destination" state
    ├── Packages.jsx        # tour grid + category filter (useState)
    ├── TourCard.jsx        # one tour; has its own travelers state
    ├── TravelerStepper.jsx # reusable controlled component (value + onChange)
    ├── HowItWorks.jsx
    ├── Stories.jsx
    ├── PlanForm.jsx        # controlled form with simple validation
    ├── Footer.jsx
    ├── Icon.jsx            # inline SVG icons
    └── buttonStyles.js     # shared Tailwind classes for buttons
```

## Notes

- Mobile-first: unprefixed classes are for phones, then `sm:` `md:` `lg:` add changes for bigger screens.
- Data is hardcoded. Photos come from Unsplash.
- The sign in / sign up popup from the old version was removed to keep the app simple.
