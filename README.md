# Canvas_Playground.ts
**Simple Canvas API playground written in Typescript.**
--
This project is simply me learning the ins and outs of the **`Canvas API`** but I will be updating this repository as I learn more. Anyone is welcome to use this and contribute :).

# How to use
In this project, I used Yarn for all the package dependencies. The first step is to install all the required packages (I am not going into how to use `yarn` or `powershell`).


Install Packages using `Yarn`
``` powershell
# Make sure current working directory is corrent
# Run the Yarn Package Manager to install packages
yarn
```

Code away in the **`app.ts`** file making sure to import any modules from other directories in the Library.

Once finished coding, build the Library using **`npm`**.
``` powershell
# To Fully build the Program simply run this
npm run build

# To Watch the Program for changes and auto-build it run this
npm run watch
```

To lauch the Built application, simply launch a local server. I use python to do so.
``` powershell
# Run a local server in the 'dist' directory
python -m http.server
```

---
# Understanding the Library

To use the Library it's simple, just go through the Methods under each Directory in `src` depending on what you want to do. Here is a list of what each Typescript File is about:

- **`Canvas.ts`** - Starting the Canvas, the Draw loop, Clearing Background, and Setting a Background Color.
- **`Constants.ts`** - Contains all the Canvas Constants used such as the Width and Height of the Canvas.
- **`Preload.ts`** - Constains a botched "Preload" method (Will update it to actually work). The file is for everything that should Preload before starting the Canvas.
- **`Math.ts`** - Contains Trigonometry and Formula functions used for simple calculations.
- **`Random.ts`** - Contains Methods that Generate Random Numbers
- **`Vectors.ts`** - Contains a Vector Class for X,Y locations.
- **`Shapes.ts`** - Contains methods for drawing shapes, filling them, and adding a stroke to them.

---

# Contribution

Contributing is very simple, don't move directories around, but feel free to add new Directories but **KEEP IT NEAT**. Add or fix functionallity to the library and submit a Pull Request :)

---
# License
Licensed under the [MIT License](LICENSE.md).