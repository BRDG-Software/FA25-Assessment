import { questionsTypes, shoeEnum } from "./types";

export const questions: questionsTypes[] = [
  {
    id: "q1",
    text: "WHAT’S YOUR IDEAL RUNNING COMPANION?",
    options: [
      {
        label: "A / A coach for focus",
        shoe: shoeEnum.structure,
      },
      {
        label: "B / A hype friend to push limits",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "C / Music and the sound of your breath",
        shoe: shoeEnum.vomero,
      },
    ],
  },
  {
    id: "q2",
    text: "WHAT MOTIVATES YOU TO LACE UP?",
    options: [
      {
        label: "A / Hitting goals and staying consistent",
        shoe: shoeEnum.structure,
      },
      {
        label: "B / Chasingy that runner’s high",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "C / Escaping into your own rhythm",
        shoe: shoeEnum.vomero,
      },
    ],
  },
  {
    id: "q3",
    text: "How do you want your stride to feel?",
    options: [
      {
        label: "A / Gears kicking into place",
        shoe: shoeEnum.structure,
      },
      {
        label: "B / Electric and energized",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "C / Plush and effortless",
        shoe: shoeEnum.vomero,
      },
    ],
  },
  {
    id: "q4",
    text: "WHAT MUSIC DESCRIBES YOUR RUN?",
    options: [
      {
        label: "A / Rhythmic for pace keeping",
        shoe: shoeEnum.structure,
      },
      {
        label: "B / Fast paced for energy",
        shoe: shoeEnum.pegasus,
      },
      {
        label: "C / Chill, ambient for vibes",
        shoe: shoeEnum.vomero,
      },
    ],
  },
  {
    id: "q5",
    text: "YOUR RUNNING MANTRA IS...?",
    options: [
      {
        label: "A / Strong. Steady. Secure.",
        shoe: shoeEnum.structure,
      },
      {
        label: "B / Fast feet, free mind",
        shoe: shoeEnum.pegasus,
      },
      { label: "C / Float through the miles", shoe: shoeEnum.vomero },
    ],
  },
];

export const calibrationSteps: string[] = [
  "CALIBRATION IN PROGRESS",
  "ANALYZING RUN STYLE",
  "ACCESSING PACE PREFERENCE",
  "DETERMINING",
  "CALCULATING STRIDE LENGTH",
  "SYNCHRONIZING BREATHING PATTERN",
  "EVALUATING FOOT IMPACT",
  "MAPPING TERRAIN RESPONSE",
  "OPTIMIZING ENERGY OUTPUT",
  "SCANNING MUSCLE ENGAGEMENT",
  "RETREIVING ENDURACE DATA",
  "ASSESSING CADENCE EFFICIENCY",
];

export const runSteps = {
  [shoeEnum.pegasus]: "RUN IN PEGASUS",
  [shoeEnum.vomero]: "RUN IN VOMERO",
  [shoeEnum.structure]: "RUN IN STRUCTURE",
};

export const structureVideos: string[] = [
  "/assets/StructureMotionCopy/8be24e91b2ee18679c8aea7d69ef52a81a20c46c.mp4",

  "/assets/StructureMotionCopy/888b0e6dba352f45b60a0ed97504983b1e2c2593.mp4",

  "/assets/StructureMotionCopy/c666d8bd10cf3aae74b5aed73ace44b76f2f1676.mp4",

  "/assets/StructureMotionCopy/FOOTSTRIKE_STRUCTURE_02.mp4",

  "/assets/StructureMotionCopy/STRUCTURE_TOY_010001-0300.mp4",
];

export const pegasusVideos: string[] = [
  "/assets/PegMotionCopy/663a1b07dad7a711ba8de9df9b200ee92c81e25a.mp4",
  "/assets/PegMotionCopy/7782ddd3bcaa3cbcaeba9bbe237c5a4ccd5798de.mp4",
  "/assets/PegMotionCopy/a372d0c5251240227ee29c3c473464c94513107e.mp4",
  "/assets/PegMotionCopy/af821a464be4c62e9838554d7e3bd2e0d4fcc8fd.mp4",
  "/assets/PegMotionCopy/FOOTSTRIKE_PEGASUS_02.mp4",
];

export const vomeroVideos: string[] = [
  "/assets/VomeroMotionCopy/3d8d4c5d1ae1597f662c73d6eca4eccb3f41c993.mp4",
  "/assets/VomeroMotionCopy/0360592e96a92fdeeee343ce48b5c36ab90858a9.mp4",
  "/assets/VomeroMotionCopy/c55552b8d16e5cdf249559f2ca37ef2f162cbe3e.mp4",
  "/assets/VomeroMotionCopy/DATA_TEST_030001-0110.mp4",
  "/assets/VomeroMotionCopy/FOOTSTRIKE_VOMERO_01.mp4",
];
